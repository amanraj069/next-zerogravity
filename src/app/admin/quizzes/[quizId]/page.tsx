"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { adminQuizDetails } from "@/services/quizzesService";
import { useAuth } from "@/contexts/AuthContext";
import LoadingSpinner from "@/components/LoadingSpinner";
import {
  AdminQuizDetails,
  QuizParticipant,
  QuizLeaderboardEntry,
} from "@/types/quiz";

export default function AdminQuizDetailPage() {
  const { user, isLoading } = useAuth();
  const params = useParams();
  const quizId = String(params?.quizId || "");
  const [details, setDetails] = useState<AdminQuizDetails | null>(null);

  const isAdmin = user?.role === "admin";

  useEffect(() => {
    if (!isAdmin || !quizId) return;
    (async () => {
      const res = await adminQuizDetails(quizId);
      if (res?.success) setDetails(res);
    })();
  }, [isAdmin, quizId]);

  if (isLoading)
    return (
      <LoadingSpinner size="lg" text="Loading admin panel..." fullScreen />
    );
  if (!isAdmin) return <div className="p-6">Admin access required.</div>;
  if (!details)
    return <LoadingSpinner size="lg" text="Loading quiz details..." />;

  const q = details.quiz;
  const participants = details.participants || [];
  const board = details.leaderboard || [];

  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Quiz: {q.title}</h1>
        <div className="text-sm text-gray-600">Quiz ID: {q.quizId}</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <h2 className="font-medium">Participants ({participants.length})</h2>
          <div className="border rounded divide-y">
            {participants.map((p: QuizParticipant) => (
              <div
                key={p.quizUserId}
                className="p-2 text-sm flex items-center justify-between"
              >
                <span>{p.participantName}</span>
                <span className="text-gray-600">
                  {Math.round(p.totalScore || 0)}
                </span>
              </div>
            ))}
            {participants.length === 0 ? (
              <div className="p-2 text-sm text-gray-600">No participants.</div>
            ) : null}
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="font-medium">Leaderboard</h2>
          <div className="border rounded divide-y">
            {board.map((b: QuizLeaderboardEntry, idx: number) => (
              <div
                key={b.quizUserId}
                className="p-2 text-sm flex items-center justify-between"
              >
                <span>
                  #{idx + 1} {b.participantName}
                </span>
                <span className="text-gray-600">
                  {Math.round(b.totalScore || 0)}
                </span>
              </div>
            ))}
            {board.length === 0 ? (
              <div className="p-2 text-sm text-gray-600">No scores.</div>
            ) : null}
          </div>
        </div>
      </div>

      <div>
        <h2 className="font-medium mb-2">Questions</h2>
        <div className="space-y-2">
          {(q.questions || []).map((question, i: number) => (
            <div key={question.questionId || i} className="border rounded p-3">
              <div className="font-medium">
                Q{i + 1}: {question.text}
              </div>
              <div className="mt-1 text-sm text-gray-600">
                Time: {question.timeLimitSeconds}s | Marks: {question.maxMarks}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
