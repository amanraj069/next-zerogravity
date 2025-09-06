"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import {
  joinQuiz,
  submitAnswer,
  getCurrentQuestion,
  obfuscate,
  deobfuscate,
} from "@/services/quizzesService";
import { getSocket, joinQuizRoom } from "@/services/socketClient";
import { useAuth } from "@/contexts/AuthContext";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { QuizQuestion } from "@/services/quizzesService";

function JoinQuizContent() {
  const { userId } = useAuth();
  const search = useSearchParams();
  const prefill = search.get("code") || "";
  const [joinCode, setJoinCode] = useState(prefill);
  const [name, setName] = useState<string>(() => {
    if (typeof window === "undefined") return "";
    try {
      const o = localStorage.getItem("zg_name_obf");
      return o ? deobfuscate(o) : "";
    } catch {
      return "";
    }
  });
  const STORAGE_KEY = "zg_current_quiz";
  const initialJoined = (() => {
    if (typeof window === "undefined") return null;
    try {
      const saved = localStorage.getItem("zg_current_quiz");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.quizId && parsed?.quizUserId) return parsed;
      }
    } catch {
      return null;
    }
  })();
  const [joined, setJoined] = useState<{
    quizId: string;
    quizUserId: string;
  } | null>(initialJoined);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // If restored, immediately join the room
    if (joined?.quizId) {
      joinQuizRoom(joined.quizId);
    }
  }, [joined?.quizId]);

  useEffect(() => {
    if (!joined?.quizId) return;
    joinQuizRoom(joined.quizId);
    const s = getSocket();
    const onQuestion = (payload: {
      quizId: string;
      question: QuizQuestion;
    }) => {
      if (payload?.quizId !== joined.quizId) return;
      setCurrentQuestion(payload.question);
      setTimeLeft(payload.question.timeLimitSeconds);
    };
    const onEnded = () => {
      setCurrentQuestion(null);
      alert("Quiz has ended. Contact Admin for the Results.");
      try {
        localStorage.removeItem(STORAGE_KEY);
      } catch {}
    };
    s.on("question:pushed", onQuestion);
    s.on("quiz:ended", onEnded);
    // On mount, also fetch current state in case we refreshed mid-question
    (async () => {
      const cur = await getCurrentQuestion(joined.quizId);
      if (cur?.success && cur.index >= 0) {
        setCurrentQuestion(cur.question);
        setTimeLeft(cur.question.timeLimitSeconds);
      }
    })();
    return () => {
      s.off("question:pushed", onQuestion);
      s.off("quiz:ended", onEnded);
    };
  }, [joined]);

  useEffect(() => {
    if (!currentQuestion) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => Math.max(0, t - 1));
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [currentQuestion]);

  const handleJoin = async () => {
    if (!joinCode || !name) return;
    const res = await joinQuiz(
      joinCode.trim().toUpperCase(),
      name.trim(),
      userId || undefined
    );
    if (res?.success) {
      setJoined({ quizId: res.quizId, quizUserId: res.quizUserId });
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ quizId: res.quizId, quizUserId: res.quizUserId })
        );
        localStorage.setItem("zg_join_code", joinCode.trim().toUpperCase());
        localStorage.setItem("zg_name_obf", obfuscate(name.trim()));
      } catch {}
    } else {
      alert(res?.message || "Failed to join");
    }
  };

  const sendAnswer = async (key: string) => {
    if (!joined || !currentQuestion || !currentQuestion.questionId) return;
    const result = await submitAnswer(joined.quizId, {
      quizUserId: joined.quizUserId,
      questionId: currentQuestion.questionId,
      selectedOptionKey: key,
      timeLeftSeconds: timeLeft,
    });
    if (!result?.success) alert("Failed to submit answer");
  };

  if (!joined) {
    return (
      <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
        <LandingNavbar />
        <main className="flex-1 flex items-center justify-center">
          <div className="w-full max-w-md p-6 space-y-4">
            <h1 className="text-2xl font-semibold">Join Quiz</h1>
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Enter 6-letter Code"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <input
              className="w-full border rounded px-3 py-2"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <button
              className="block mx-auto w-full sm:w-56 py-2 bg-black text-white rounded"
              onClick={handleJoin}
            >
              Join
            </button>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <LandingNavbar />
      <main className="flex-1 flex items-start sm:items-center justify-center">
        <div className="w-full max-w-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Quiz Room</h1>
            <div className="text-sm text-gray-600">Time left: {timeLeft}s</div>
          </div>
          {currentQuestion ? (
            <div className="space-y-4">
              <div className="font-medium">{currentQuestion.text}</div>
              <div className="grid grid-cols-1 gap-3">
                {currentQuestion.options.map((o, idx: number) => (
                  <button
                    key={o.key}
                    className={`rounded p-3 text-left transition-colors border
                      ${
                        idx % 4 === 0
                          ? "bg-rose-50"
                          : idx % 4 === 1
                          ? "bg-emerald-50"
                          : idx % 4 === 2
                          ? "bg-blue-50"
                          : "bg-amber-50"
                      }
                      hover:brightness-95 active:scale-[0.99]`}
                    onClick={(e) => {
                      const target = e.currentTarget as HTMLButtonElement;
                      target.classList.remove(
                        "bg-rose-50",
                        "bg-emerald-50",
                        "bg-blue-50",
                        "bg-amber-50"
                      );
                      target.classList.add("bg-black", "text-white");
                      sendAnswer(o.key);
                    }}
                  >
                    <span className="font-medium mr-2">{o.key}.</span> {o.text}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-gray-600">
              Waiting for host to push a question...
            </div>
          )}
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}

export default function JoinQuizPage() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <JoinQuizContent />
    </Suspense>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
