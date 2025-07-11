"use client";

import React, { useState, useEffect } from "react";
import {
  Target,
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
} from "lucide-react";
import AddGoalModal from "./AddGoalModal";
import SubtasksModal from "./SubtasksModal";
import {
  goalsService,
  Goal,
  GoalsAnalytics,
  CreateGoalData,
  UpdateGoalData,
} from "@/services/goalsService";
import { useAuth } from "@/contexts/AuthContext";

type FilterType = "weekly" | "monthly" | "quarterly" | "yearly" | "all";

const Goals: React.FC = () => {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [goals, setGoals] = useState<Goal[]>([]);
  const [activeFilter, setActiveFilter] = useState<FilterType>("all");
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [editingSubtasks, setEditingSubtasks] = useState<{
    goalId: string;
    milestoneId: string;
  } | null>(null);
  const [streakData, setStreakData] = useState<GoalsAnalytics>({
    currentStreak: 0,
    longestStreak: 0,
    totalCompleted: 0,
    totalGoals: 0,
    completionRate: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load goals from API only when authenticated
  useEffect(() => {
    if (!authLoading && isLoggedIn) {
      loadGoals();
    } else if (!authLoading && !isLoggedIn) {
      setIsLoading(false);
      setError("Please log in to view your goals");
    }
  }, [authLoading, isLoggedIn]);

  const loadGoals = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const { goals: fetchedGoals, analytics } = await goalsService.getGoals();
      setGoals(fetchedGoals);
      setStreakData(analytics);
    } catch (error) {
      console.error("Error loading goals:", error);
      setError(error instanceof Error ? error.message : "Failed to load goals");
    } finally {
      setIsLoading(false);
    }
  };

  const calculateProgress = (goal: Goal): number => {
    if (goal.completed) return 100;
    if (goal.milestones.length === 0) return 0;

    const completedMilestones = goal.milestones.filter(
      (m) => m.completed
    ).length;
    return Math.round((completedMilestones / goal.milestones.length) * 100);
  };

  const filteredGoals = goals.filter(
    (goal) => activeFilter === "all" || goal.category === activeFilter
  );

  const addGoal = async (goalData: CreateGoalData) => {
    try {
      await goalsService.createGoal(goalData);
      await loadGoals(); // Refresh the list to get updated analytics
    } catch (error) {
      console.error("Error creating goal:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create goal"
      );
    }
  };

  const updateGoal = async (goalId: string, updateData: UpdateGoalData) => {
    try {
      await goalsService.updateGoal(goalId, updateData);
      await loadGoals(); // Refresh the list to get updated analytics
      setEditingGoal(null); // Close the edit modal
    } catch (error) {
      console.error("Error updating goal:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update goal"
      );
    }
  };

  const deleteGoal = async (goalId: string) => {
    try {
      await goalsService.deleteGoal(goalId);
      await loadGoals(); // Refresh the list
    } catch (error) {
      console.error("Error deleting goal:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete goal"
      );
    }
  };

  const toggleGoalCompletion = async (goalId: string) => {
    try {
      await goalsService.toggleGoalCompletion(goalId);
      await loadGoals(); // Refresh to get updated analytics
    } catch (error) {
      console.error("Error toggling goal completion:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update goal"
      );
    }
  };

  const toggleMilestoneCompletion = async (
    goalId: string,
    milestoneId: string
  ) => {
    try {
      await goalsService.toggleMilestoneCompletion(goalId, milestoneId);
      await loadGoals(); // Refresh the list
    } catch (error) {
      console.error("Error toggling milestone completion:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update milestone"
      );
    }
  };

  const toggleSubtaskCompletion = async (
    goalId: string,
    milestoneId: string,
    subtaskId: string
  ) => {
    try {
      await goalsService.toggleSubtaskCompletion(
        goalId,
        milestoneId,
        subtaskId
      );
      await loadGoals(); // Refresh the list
    } catch (error) {
      console.error("Error toggling subtask completion:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update subtask"
      );
    }
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
          <span className="ml-3 text-gray-600">
            {authLoading ? "Checking authentication..." : "Loading goals..."}
          </span>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-3" />
            <p className="text-red-600 mb-3">{error}</p>
            {!isLoggedIn ? (
              <a
                href="/login"
                className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors inline-block"
              >
                Go to Login
              </a>
            ) : (
              <button
                onClick={loadGoals}
                className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
      {/* Minimal Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Goals</h1>
          <p className="text-sm text-gray-500 mt-1">
            {streakData.totalCompleted} completed • {streakData.currentStreak}{" "}
            day streak • {streakData.completionRate}% completion rate
          </p>
        </div>
        <button
          onClick={() => setShowAddGoal(true)}
          className="flex items-center gap-2 bg-black text-white px-3 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Goal
        </button>
      </div>

      {/* Minimal Filter */}
      <div className="flex gap-1 border-b border-gray-200">
        {(
          ["all", "weekly", "monthly", "quarterly", "yearly"] as FilterType[]
        ).map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-3 py-2 text-sm font-medium transition-colors border-b-2 ${
              activeFilter === filter
                ? "border-black text-black"
                : "border-transparent text-gray-500 hover:text-gray-700"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      {/* Minimal Goals Display */}
      <div className="space-y-3">
        {filteredGoals.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <Target className="w-6 h-6 text-gray-400" />
            </div>
            <p className="text-gray-500">No goals yet</p>
            <button
              onClick={() => setShowAddGoal(true)}
              className="text-sm text-gray-700 hover:text-black mt-1"
            >
              Create your first goal
            </button>
          </div>
        ) : (
          filteredGoals.map((goal) => (
            <div
              key={goal._id}
              className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors"
            >
              {/* Minimal Goal Header */}
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleGoalCompletion(goal._id)}
                  className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 transition-colors ${
                    goal.completed
                      ? "bg-black border-black text-white"
                      : "border-gray-300 hover:border-gray-400"
                  }`}
                >
                  {goal.completed && <CheckCircle className="w-3 h-3" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h3
                      className={`font-medium text-sm ${
                        goal.completed
                          ? "line-through text-gray-500"
                          : "text-gray-900"
                      }`}
                    >
                      {goal.title}
                    </h3>
                    <span className="text-xs text-gray-400">•</span>
                    <span className="text-xs text-gray-500 capitalize">
                      {goal.category}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded-full ${
                        goal.priority === "high"
                          ? "bg-red-100 text-red-600"
                          : goal.priority === "medium"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      {goal.priority}
                    </span>
                  </div>

                  {goal.description && (
                    <p className="text-xs text-gray-500 mb-2">
                      {goal.description}
                    </p>
                  )}

                  {/* Minimal Progress */}
                  {goal.milestones.length > 0 && (
                    <div className="mb-2">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs text-gray-500">
                          {goal.milestones.filter((m) => m.completed).length}/
                          {goal.milestones.length} milestones
                        </span>
                        <span className="text-xs text-gray-500">
                          {calculateProgress(goal)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-100 rounded-full h-1">
                        <div
                          className="bg-black h-1 rounded-full transition-all duration-300"
                          style={{ width: `${calculateProgress(goal)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">
                      Due {goal.targetDate.toLocaleDateString()}
                    </span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setEditingGoal(goal)}
                        className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit2 className="w-3 h-3" />
                      </button>
                      <button
                        onClick={() => deleteGoal(goal._id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Milestones with Subtasks */}
              {goal.milestones.length > 0 && (
                <div className="mt-3 ml-8 space-y-3">
                  {goal.milestones.map((milestone) => (
                    <div key={milestone.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() =>
                              toggleMilestoneCompletion(goal._id, milestone.id)
                            }
                            className={`w-3 h-3 rounded border flex items-center justify-center transition-colors ${
                              milestone.completed
                                ? "bg-gray-600 border-gray-600 text-white"
                                : "border-gray-300 hover:border-gray-400"
                            }`}
                          >
                            {milestone.completed && (
                              <CheckCircle className="w-2 h-2" />
                            )}
                          </button>
                          <span
                            className={`text-xs font-medium ${
                              milestone.completed
                                ? "line-through text-gray-400"
                                : "text-gray-600"
                            }`}
                          >
                            {milestone.title}
                          </span>
                          {milestone.subtasks.length > 0 && (
                            <span className="text-xs text-gray-400">
                              (
                              {
                                milestone.subtasks.filter((s) => s.completed)
                                  .length
                              }
                              /{milestone.subtasks.length})
                            </span>
                          )}
                        </div>

                        {/* Add Subtasks button */}
                        <button
                          onClick={() =>
                            setEditingSubtasks({
                              goalId: goal._id,
                              milestoneId: milestone.id,
                            })
                          }
                          className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800 px-2 py-1 rounded transition-colors"
                          title="Add subtasks to this milestone"
                        >
                          + Subtasks
                        </button>
                      </div>

                      {/* Subtasks */}
                      {milestone.subtasks.length > 0 ? (
                        <div className="ml-5 space-y-1">
                          {milestone.subtasks.map((subtask) => (
                            <div
                              key={subtask.id}
                              className="flex items-center gap-2"
                            >
                              <button
                                onClick={() =>
                                  toggleSubtaskCompletion(
                                    goal._id,
                                    milestone.id,
                                    subtask.id
                                  )
                                }
                                className={`w-2 h-2 rounded border flex items-center justify-center transition-colors ${
                                  subtask.completed
                                    ? "bg-gray-500 border-gray-500"
                                    : "border-gray-300 hover:border-gray-400"
                                }`}
                              >
                                {subtask.completed && (
                                  <div className="w-1 h-1 bg-white rounded-full" />
                                )}
                              </button>
                              <span
                                className={`text-xs ${
                                  subtask.completed
                                    ? "line-through text-gray-400"
                                    : "text-gray-500"
                                }`}
                              >
                                {subtask.title}
                              </span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="ml-5 text-xs text-gray-400 italic">
                          No subtasks yet. Click the &quot;+ Subtasks&quot;
                          button above.
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Goal Modal */}
      <AddGoalModal
        isOpen={showAddGoal || !!editingGoal}
        onClose={() => {
          setShowAddGoal(false);
          setEditingGoal(null);
        }}
        onAddGoal={addGoal}
        onUpdateGoal={updateGoal}
        editingGoal={editingGoal}
      />

      {/* Subtasks Modal */}
      <SubtasksModal
        isOpen={!!editingSubtasks}
        onClose={() => setEditingSubtasks(null)}
        goal={
          editingSubtasks
            ? goals.find((g) => g._id === editingSubtasks.goalId) || null
            : null
        }
        milestoneId={editingSubtasks?.milestoneId || null}
        onUpdateComplete={loadGoals}
      />
    </div>
  );
};

export default Goals;
