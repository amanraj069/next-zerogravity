"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import {
  getQuiz,
  listParticipants,
  pushQuestion,
  startQuiz,
  leaderboard,
  endQuiz,
  hostQuiz,
} from "@/services/quizzesService";
import { getSocket, joinQuizRoom } from "@/services/socketClient";
import LandingNavbar from "@/components/landing/LandingNavbar";
import LandingFooter from "@/components/landing/LandingFooter";
import { Quiz, QuizParticipant, QuizLeaderboardEntry } from "@/types/quiz";

export default function HostQuizPage() {
  const params = useParams();
  const search = useSearchParams();
  const quizId = String(params?.quizId || "");
  const joinCode = search.get("code") || "";

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [participants, setParticipants] = useState<QuizParticipant[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(-1);
  const [voteCounts, setVoteCounts] = useState<Record<string, number>>({});
  const [board, setBoard] = useState<QuizLeaderboardEntry[]>([]);
  const [isActive, setIsActive] = useState<boolean>(false);
  const [isHosted, setIsHosted] = useState<boolean>(false);
  const [generatedJoinCode, setGeneratedJoinCode] = useState<string>("");
  const [copySuccess, setCopySuccess] = useState<boolean>(false);

  useEffect(() => {
    if (!quizId) return;
    (async () => {
      const q = await getQuiz(quizId);
      if (q?.success) {
        setQuiz(q.quiz);
        setIsActive(q.quiz?.status === "active");
        setIsHosted(
          q.quiz?.status === "published" || q.quiz?.status === "active"
        );
        if (q.quiz?.joinCode) {
          setGeneratedJoinCode(q.quiz.joinCode);
        }
      }
      const p = await listParticipants(quizId);
      if (p?.success) setParticipants(p.participants);
    })();
  }, [quizId]);

  useEffect(() => {
    if (!quizId) return;
    joinQuizRoom(quizId);
    const s = getSocket();
    const onJoined = (payload: {
      quizId: string;
      participant: QuizParticipant;
    }) => {
      if (payload?.quizId !== quizId) return;
      setParticipants((prev) => [...prev, payload.participant]);
    };
    const onQuestion = (payload: { quizId: string; index: number }) => {
      if (payload?.quizId !== quizId) return;
      setCurrentIndex(payload.index);
      setVoteCounts({});
    };
    const onVotes = (payload: {
      quizId: string;
      counts: Record<string, number>;
    }) => {
      if (payload?.quizId !== quizId) return;
      setVoteCounts(payload.counts || {});
    };
    const onStarted = () => {
      setIsActive(true);
    };
    const onEnded = () => {
      setCurrentIndex(-1);
      setIsActive(false);
      (async () => {
        const b = await leaderboard(quizId);
        if (b?.success) setBoard(b.leaderboard);
      })();
    };
    s.on("quiz:started", onStarted);
    s.on("participant:joined", onJoined);
    s.on("question:pushed", onQuestion);
    s.on("votes:update", onVotes);
    s.on("quiz:ended", onEnded);
    return () => {
      s.off("quiz:started", onStarted);
      s.off("participant:joined", onJoined);
      s.off("question:pushed", onQuestion);
      s.off("votes:update", onVotes);
      s.off("quiz:ended", onEnded);
    };
  }, [quizId]);

  const host = async () => {
    const r = await hostQuiz(quizId);
    if (!r?.success) {
      alert("Failed to host quiz");
    } else {
      setIsHosted(true);
      setGeneratedJoinCode(r.joinCode);
    }
  };

  const start = async () => {
    const r = await startQuiz(quizId);
    if (!r?.success) alert("Failed to start quiz");
    else setIsActive(true);
  };

  const copyJoinCode = async () => {
    if (generatedJoinCode) {
      try {
        await navigator.clipboard.writeText(generatedJoinCode);
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      } catch (err) {
        console.error("Failed to copy join code:", err);
      }
    }
  };

  const push = async (idx: number) => {
    const r = await pushQuestion(quizId, idx);
    if (!r?.success) alert("Failed to push question");
  };

  const stop = async () => {
    const r = await endQuiz(quizId);
    if (!r?.success) alert("Failed to stop quiz");
    else setIsActive(false);
  };

  const questions = useMemo(() => quiz?.questions || [], [quiz]);

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-gray-50 to-gray-100">
      <LandingNavbar />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto p-6 space-y-6">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-light text-gray-900 mb-2">
                  {quiz?.title || "Host Quiz"}
                </h1>
                <p className="text-gray-600">
                  {quiz?.description || "Ready to host your quiz?"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {!isHosted ? (
                  <button
                    className="px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition-colors font-medium"
                    onClick={host}
                  >
                    Host Quiz
                  </button>
                ) : (
                  <div className="flex items-center gap-3">
                    {!isActive ? (
                      <button
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        onClick={start}
                      >
                        Start Quiz
                      </button>
                    ) : (
                      <button
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        onClick={stop}
                        title="Stop current quiz"
                      >
                        Stop Quiz
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Join Code Section */}
            {(joinCode || generatedJoinCode) && (
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">
                      Quiz Join Code
                    </p>
                    <p className="text-2xl font-mono font-bold text-black tracking-wider">
                      {generatedJoinCode || joinCode}
                    </p>
                  </div>
                  <button
                    onClick={copyJoinCode}
                    className={`px-4 py-2 rounded-lg border transition-colors ${
                      copySuccess
                        ? "bg-green-50 border-green-200 text-green-700"
                        : "bg-white border-gray-300 text-gray-700 hover:border-black"
                    }`}
                  >
                    {copySuccess ? "✓ Copied!" : "Copy Code"}
                  </button>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Share this code with participants to join your quiz
                </p>
              </div>
            )}

            {/* Quiz Status */}
            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-200">
              <div className="flex items-center gap-2">
                <div
                  className={`w-3 h-3 rounded-full ${
                    isActive
                      ? "bg-green-500"
                      : isHosted
                      ? "bg-yellow-500"
                      : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-sm font-medium text-gray-700">
                  {isActive
                    ? "Quiz Active"
                    : isHosted
                    ? "Quiz Hosted"
                    : "Quiz Not Hosted"}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                {participants.length} participant
                {participants.length !== 1 ? "s" : ""} joined
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Questions Panel */}
            <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium text-gray-900">
                  Quiz Questions
                </h2>
                <span className="text-sm text-gray-600">
                  {questions.length} question{questions.length !== 1 ? "s" : ""}
                </span>
              </div>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {questions.map((q, i: number) => (
                  <div
                    key={q.questionId || i}
                    className={`border rounded-lg p-4 transition-all ${
                      i === currentIndex
                        ? "border-green-500 bg-green-50 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span
                            className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium ${
                              i === currentIndex
                                ? "bg-green-500 text-white"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {i + 1}
                          </span>
                          {i === currentIndex && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="font-medium text-gray-900 mb-2 line-clamp-2">
                          {q.text}
                        </p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>⏱️ {q.timeLimitSeconds}s</span>
                          <span>🏆 {q.maxMarks} points</span>
                          <span>📝 {q.options?.length || 0} options</span>
                        </div>
                      </div>
                      <button
                        className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                          isActive
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        onClick={() => push(i)}
                        disabled={!isActive}
                        title={
                          isActive
                            ? "Push this question to participants"
                            : "Start the quiz first"
                        }
                      >
                        Push
                      </button>
                    </div>
                  </div>
                ))}
                {questions.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <p>No questions available</p>
                  </div>
                )}
              </div>
              {/* Live Voting Results */}
              {currentIndex >= 0 && (
                <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="font-medium text-blue-900 mb-3 flex items-center gap-2">
                    📊 Live Results - Question {currentIndex + 1}
                  </h3>
                  <div className="space-y-3">
                    {Object.entries(voteCounts).length > 0 ? (
                      Object.entries(voteCounts).map(([k, v]) => {
                        const total = Object.values(voteCounts).reduce(
                          (sum, count) => sum + (count as number),
                          0
                        );
                        const percentage =
                          total > 0
                            ? Math.round(((v as number) / total) * 100)
                            : 0;
                        return (
                          <div key={k} className="space-y-1">
                            <div className="flex items-center justify-between text-sm">
                              <span className="font-medium text-gray-900">
                                Option {k}
                              </span>
                              <span className="text-gray-600">
                                {v} vote{(v as number) !== 1 ? "s" : ""} (
                                {percentage}%)
                              </span>
                            </div>
                            <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                              <div
                                className="h-3 bg-blue-600 rounded-full transition-all duration-500 ease-out"
                                style={{
                                  width: `${percentage}%`,
                                }}
                              />
                            </div>
                          </div>
                        );
                      })
                    ) : (
                      <p className="text-sm text-blue-700">
                        Waiting for responses...
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Participants & Leaderboard Panel */}
            <div className="space-y-6">
              {/* Participants */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-medium text-gray-900">
                    Participants
                  </h2>
                  <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                    {participants.length}
                  </span>
                </div>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {participants.map((p, index) => (
                    <div
                      key={p.quizUserId}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-medium">
                          {p.participantName?.charAt(0)?.toUpperCase() ||
                            index + 1}
                        </div>
                        <span className="font-medium text-gray-900">
                          {p.participantName}
                        </span>
                      </div>
                      <span className="text-sm font-medium text-gray-600">
                        {Math.round(p.totalScore || 0)} pts
                      </span>
                    </div>
                  ))}
                  {participants.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <div className="w-16 h-16 mx-auto mb-3 bg-gray-100 rounded-full flex items-center justify-center">
                        👥
                      </div>
                      <p className="text-sm">Waiting for participants...</p>
                      {(joinCode || generatedJoinCode) && (
                        <p className="text-xs text-gray-400 mt-1">
                          Share code:{" "}
                          <span className="font-mono">
                            {generatedJoinCode || joinCode}
                          </span>
                        </p>
                      )}
                    </div>
                  )}
                </div>
                {participants.length > 0 && (
                  <button
                    className="w-full mt-4 px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-700 hover:border-red-300 hover:text-red-700 transition-colors"
                    onClick={async () => {
                      const ok = confirm(
                        "Clear all participants? This cannot be undone."
                      );
                      if (!ok) return;
                      const { clearParticipants } = await import(
                        "@/services/quizzesService"
                      );
                      const res = await clearParticipants(quizId);
                      if (!res?.success) alert("Failed to clear participants");
                      else setParticipants([]);
                    }}
                  >
                    Clear All Participants
                  </button>
                )}
              </div>

              {/* Final Leaderboard */}
              {board.length > 0 && (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-medium text-gray-900 mb-4 flex items-center gap-2">
                    🏆 Final Results
                  </h2>
                  <div className="space-y-3">
                    {board.map((b, idx) => {
                      const isWinner = idx === 0;
                      const isTopThree = idx < 3;
                      return (
                        <div
                          key={b.quizUserId}
                          className={`flex items-center justify-between p-3 rounded-lg border ${
                            isWinner
                              ? "bg-yellow-50 border-yellow-200"
                              : isTopThree
                              ? "bg-gray-50 border-gray-200"
                              : "bg-white border-gray-100"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                                isWinner
                                  ? "bg-yellow-500 text-white"
                                  : isTopThree
                                  ? "bg-gray-400 text-white"
                                  : "bg-gray-100 text-gray-600"
                              }`}
                            >
                              {idx + 1}
                            </div>
                            <span
                              className={`font-medium ${
                                isWinner ? "text-yellow-800" : "text-gray-900"
                              }`}
                            >
                              {b.participantName}
                            </span>
                            {isWinner && (
                              <span className="text-yellow-500">👑</span>
                            )}
                          </div>
                          <span
                            className={`font-bold ${
                              isWinner ? "text-yellow-800" : "text-gray-600"
                            }`}
                          >
                            {Math.round(b.totalScore || 0)} pts
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <LandingFooter />
    </div>
  );
}
