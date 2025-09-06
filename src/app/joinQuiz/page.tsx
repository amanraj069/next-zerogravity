"use client";

import React, { useEffect, useRef, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import {
  joinQuiz,
  submitAnswer,
  getCurrentQuestion,
  obfuscate,
  deobfuscate,
  leaveQuiz,
} from "@/services/quizzesService";
import { getSocket, joinQuizRoom } from "@/services/socketClient";
import { useAuth } from "@/contexts/AuthContext";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import ZeroGravityLoading from "@/components/ZeroGravityLoading";
import { QuizQuestion } from "@/services/quizzesService";

function JoinQuizContent() {
  const { userId } = useAuth();
  const search = useSearchParams();
  const prefill = search.get("code") || "";
  const [joinCode, setJoinCode] = useState(prefill);
  const [name, setName] = useState<string>("");
  const [mounted, setMounted] = useState(false);
  const STORAGE_KEY = "zg_current_quiz";
  const [joined, setJoined] = useState<{
    quizId: string;
    quizUserId: string;
  } | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(
    null
  );
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [hasAnswered, setHasAnswered] = useState<boolean>(false);
  const [isTimeUp, setIsTimeUp] = useState<boolean>(false);
  const [showQuizEnded, setShowQuizEnded] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Handle hydration-safe initialization
  useEffect(() => {
    setMounted(true);

    // Initialize name from localStorage
    try {
      const o = localStorage.getItem("zg_name_obf");
      if (o) {
        setName(deobfuscate(o));
      }
    } catch {
      // Ignore errors
    }

    // Initialize joined state from localStorage
    try {
      const saved = localStorage.getItem("zg_current_quiz");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed?.quizId && parsed?.quizUserId) {
          setJoined(parsed);
        }
      }
    } catch {
      // Ignore errors
    }
  }, []);

  useEffect(() => {
    // If restored, immediately join the room
    if (joined?.quizId && mounted) {
      joinQuizRoom(joined.quizId);
    }
  }, [joined?.quizId, mounted]);

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
      setHasAnswered(false);
      setIsTimeUp(false);
    };
    const onEnded = () => {
      setCurrentQuestion(null);
      setShowQuizEnded(true);
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
        setHasAnswered(false);
        setIsTimeUp(false);
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
      setTimeLeft((t) => {
        const newTime = Math.max(0, t - 1);
        if (newTime === 0) {
          setIsTimeUp(true);
        }
        return newTime;
      });
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
    if (
      !joined ||
      !currentQuestion ||
      !currentQuestion.questionId ||
      hasAnswered ||
      isTimeUp
    )
      return;

    setHasAnswered(true);

    const result = await submitAnswer(joined.quizId, {
      quizUserId: joined.quizUserId,
      questionId: currentQuestion.questionId,
      selectedOptionKey: key,
      timeLeftSeconds: timeLeft,
    });
    if (!result?.success) {
      alert("Failed to submit answer");
      setHasAnswered(false);
    }
  };

  const handleExit = async () => {
    const confirmExit = window.confirm(
      "Are you sure you want to leave the quiz?"
    );
    if (confirmExit) {
      // If we're currently in a quiz, attempt to remove from backend
      if (joined?.quizId && joined?.quizUserId) {
        try {
          await leaveQuiz(joined.quizId, joined.quizUserId);
        } catch (error) {
          console.error("Failed to leave quiz on backend:", error);
          // Continue with local cleanup even if backend call fails
        }
      }

      try {
        // Clear all quiz-related data from localStorage
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem("zg_join_code");
        localStorage.removeItem("zg_name_obf");
      } catch {}

      // Reset all state to take user back to entry screen
      setJoined(null);
      setCurrentQuestion(null);
      setShowQuizEnded(false);
      setHasAnswered(false);
      setIsTimeUp(false);
      setTimeLeft(0);

      // Clear timer if running
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };

  // Prevent hydration mismatch - show loading until mounted
  if (!mounted) {
    return (
      <ZeroGravityLoading
        title="Initializing ZeroGravity"
        subtitle="Preparing your cosmic experience..."
      />
    );
  }

  if (!joined) {
    return (
      <div className="min-h-screen flex flex-col bg-white">
        <LandingNavbar />

        {/* Hero-style header */}
        <div className="text-center py-12 sm:py-16 bg-white">
          <div className="max-w-4xl mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-light text-black mb-6 tracking-tight">
              Join Quiz
            </h1>
            <p className="text-lg sm:text-xl text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              Enter the cosmic quiz realm and test your knowledge among the
              stars
            </p>
          </div>
        </div>

        <main className="flex-1 flex items-center justify-center px-6 pt-4 pb-20 min-h-0">
          <div className="max-w-md mx-auto w-full">
            <div className="bg-white/80 backdrop-blur-sm p-8 shadow-lg">
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3">
                    Quiz Access Code
                  </label>
                  <input
                    className="w-full border border-gray-200 px-6 py-4 text-lg font-light focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/20 transition-all placeholder-gray-400 bg-white/90"
                    placeholder="Enter 6-letter code"
                    value={joinCode}
                    onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                    maxLength={6}
                  />
                </div>

                <div>
                  <label className="block text-sm font-light text-gray-700 mb-3">
                    Your Cosmic Identity
                  </label>
                  <input
                    className="w-full border border-gray-200 px-6 py-4 text-lg font-light focus:outline-none focus:border-black/30 focus:ring-1 focus:ring-black/20 transition-all placeholder-gray-400 bg-white/90"
                    placeholder="Enter your name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

                <button
                  className="w-full bg-black text-white py-4 px-8 text-lg font-light hover:bg-gray-800 transition-colors focus:outline-none focus:ring-2 focus:ring-black/20 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-black"
                  onClick={handleJoin}
                  disabled={!joinCode.trim() || !name.trim()}
                >
                  Launch Into Quiz
                </button>
              </div>
            </div>
          </div>
        </main>
        <LandingFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <LandingNavbar />

      {/* Hero-style header section */}
      <div className="bg-white">
        <div className="max-w-4xl mx-auto px-4 pt-8 sm:pt-12">
          {/* Title and Exit Button Row */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-light text-black tracking-tight">
              Quiz Room
            </h1>
            <button
              onClick={handleExit}
              className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 text-sm font-light transition-colors focus:outline-none focus:ring-2 focus:ring-red-300"
              title="Leave Quiz"
            >
              Exit Quiz
            </button>
          </div>

          <div className="text-center">
            <p className="text-base sm:text-lg text-gray-600 font-light leading-relaxed max-w-2xl mx-auto">
              {currentQuestion && !showQuizEnded
                ? "Answer the current question before time runs out"
                : showQuizEnded
                ? "Quiz completed - great job participating!"
                : ""}
            </p>

            {currentQuestion && !showQuizEnded && (
              <div className="flex items-center justify-center space-x-4 mt-6">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-black animate-pulse"></div>
                  <span className="text-sm text-gray-500 font-light">
                    Time remaining
                  </span>
                </div>
                <div className="bg-gray-100 px-6 py-3 border border-gray-200">
                  <span className="text-2xl sm:text-3xl font-light text-black font-mono tracking-wider">
                    {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <main className="flex-1 flex flex-col items-center px-4 pb-10">
        <div className="w-full max-w-3xl">
          {showQuizEnded ? (
            <div className="text-center pt-8 pb-16">
              <div className="max-w-2xl mx-auto">
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] mx-auto mb-8">
                  <Image
                    src="/quiz/waitingQuizzes.png"
                    alt="Quiz ended"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-3xl font-light text-gray-900 mb-4">
                  Quiz Complete!
                </h2>
                <p className="text-gray-600 text-lg leading-relaxed mb-6">
                  Thanks for participating! Contact the host to learn about the
                  results.
                </p>
                <div className="bg-gray-50 p-4 mb-6">
                  <p className="text-sm text-gray-500">
                    🎉 Great job completing the quiz!
                  </p>
                </div>
                <button
                  onClick={handleExit}
                  className="bg-black text-white px-6 py-3 font-light hover:bg-gray-800 transition-colors"
                >
                  Return to Quiz Entry
                </button>
              </div>
            </div>
          ) : currentQuestion ? (
            <div className="space-y-4">
              {hasAnswered ? (
                <div className="text-center pt-8 pb-16">
                  <div className="max-w-2xl mx-auto">
                    <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto mb-8">
                      <Image
                        src="/quiz/waitingQuizzes.png"
                        alt="Answer submitted"
                        fill
                        className="object-contain opacity-75"
                      />
                    </div>
                    <div className="inline-block animate-spin h-6 w-6 border-b-2 border-black mb-6"></div>
                    <h2 className="text-2xl font-light text-gray-900 mb-4">
                      Answer Submitted
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Great job! Waiting for the next question...
                    </p>
                  </div>
                </div>
              ) : isTimeUp ? (
                <div className="text-center pt-8 pb-16">
                  <div className="max-w-2xl mx-auto">
                    <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96 mx-auto mb-8">
                      <Image
                        src="/quiz/waitingQuizzes.png"
                        alt="Time up"
                        fill
                        className="object-contain opacity-50"
                      />
                    </div>
                    <h2 className="text-2xl font-light text-red-600 mb-4">
                      Time&apos;s Up!
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                      Don&apos;t worry, there&apos;s always the next question.
                    </p>
                    <div className="mt-6 flex items-center justify-center space-x-2">
                      <div className="w-2 h-2 bg-gray-400 animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 animate-pulse"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 animate-pulse"
                        style={{ animationDelay: "0.4s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-white shadow-sm p-8 border border-gray-100">
                  <div className="mb-6">
                    <h2 className="text-xl font-medium text-gray-900 leading-relaxed">
                      {currentQuestion.text}
                    </h2>
                  </div>
                  <div className="grid grid-cols-1 gap-4">
                    {currentQuestion.options.map((o, idx: number) => (
                      <button
                        key={o.key}
                        className={`p-4 text-left transition-all duration-200 border-2 font-medium
                          ${
                            idx % 4 === 0
                              ? "bg-rose-50 border-rose-200 hover:bg-rose-100 hover:border-rose-300"
                              : idx % 4 === 1
                              ? "bg-emerald-50 border-emerald-200 hover:bg-emerald-100 hover:border-emerald-300"
                              : idx % 4 === 2
                              ? "bg-blue-50 border-blue-200 hover:bg-blue-100 hover:border-blue-300"
                              : "bg-amber-50 border-amber-200 hover:bg-amber-100 hover:border-amber-300"
                          }
                          hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100`}
                        onClick={(e) => {
                          const target = e.currentTarget as HTMLButtonElement;
                          target.classList.remove(
                            "bg-rose-50",
                            "border-rose-200",
                            "hover:bg-rose-100",
                            "hover:border-rose-300",
                            "bg-emerald-50",
                            "border-emerald-200",
                            "hover:bg-emerald-100",
                            "hover:border-emerald-300",
                            "bg-blue-50",
                            "border-blue-200",
                            "hover:bg-blue-100",
                            "hover:border-blue-300",
                            "bg-amber-50",
                            "border-amber-200",
                            "hover:bg-amber-100",
                            "hover:border-amber-300"
                          );
                          target.classList.add(
                            "bg-black",
                            "text-white",
                            "border-black"
                          );
                          sendAnswer(o.key);
                        }}
                        disabled={hasAnswered || isTimeUp}
                      >
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-white bg-opacity-80 text-gray-900 font-bold text-sm mr-3">
                          {o.key}
                        </span>
                        <span className="text-gray-900">{o.text}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center pt-8 pb-16">
              <div className="max-w-2xl mx-auto">
                <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[28rem] lg:h-[28rem] mx-auto mb-8">
                  <Image
                    src="/quiz/waitingQuizzes.png"
                    alt="Waiting for quiz"
                    fill
                    className="object-contain"
                  />
                </div>
                <h2 className="text-2xl font-light text-gray-900 mb-4">
                  Waiting for quiz to start
                </h2>
                <p className="text-gray-600 leading-relaxed mb-6">
                  You&apos;re all set! The host will start pushing questions
                  shortly.
                </p>
                <div className="mt-6 flex items-center justify-center space-x-2">
                  <div className="w-2 h-2 bg-gray-400 animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-gray-400 animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-gray-400 animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
              </div>
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
    <Suspense
      fallback={
        <ZeroGravityLoading
          title="Loading Quiz"
          subtitle="Preparing your quiz experience..."
        />
      }
    >
      <JoinQuizContent />
    </Suspense>
  );
}

// Force dynamic rendering
export const dynamic = "force-dynamic";
