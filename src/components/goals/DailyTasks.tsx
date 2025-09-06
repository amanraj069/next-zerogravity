"use client";

import React, { useState, useEffect } from "react";
import {
  CheckCircle,
  Plus,
  Edit2,
  Trash2,
  Clock,
  Calendar,
  AlertCircle,
  Target,
  TrendingUp,
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import {
  dailyTasksService,
  DailyTask,
  CreateDailyTaskData,
  UpdateDailyTaskData,
  DailyTasksAnalytics,
} from "@/services/dailyTasksService";
import AddDailyTaskModal from "./AddDailyTaskModal";

const DailyTasks: React.FC = () => {
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [tasks, setTasks] = useState<DailyTask[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<DailyTask | null>(null);
  const [analytics, setAnalytics] = useState<DailyTasksAnalytics>({
    currentStreak: 0,
    longestStreak: 0,
    totalActiveTasks: 0,
    completedToday: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load tasks and analytics
  useEffect(() => {
    const loadTasks = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const fetchedTasks = await dailyTasksService.getDailyTasks(
          selectedDate
        );
        setTasks(fetchedTasks);
      } catch (error) {
        console.error("Error loading daily tasks:", error);
        setError(
          error instanceof Error ? error.message : "Failed to load daily tasks"
        );
      } finally {
        setIsLoading(false);
      }
    };

    const loadAnalytics = async () => {
      try {
        const analyticsData = await dailyTasksService.getStreakInfo();
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Error loading analytics:", error);
      }
    };

    if (!authLoading && isLoggedIn) {
      loadTasks();
      loadAnalytics();
    } else if (!authLoading && !isLoggedIn) {
      setIsLoading(false);
      setError("Please log in to view your daily tasks");
    }
  }, [authLoading, isLoggedIn, selectedDate]);

  const addTask = async (taskData: CreateDailyTaskData) => {
    try {
      await dailyTasksService.createDailyTask(taskData);
      // Reload tasks and analytics
      const fetchedTasks = await dailyTasksService.getDailyTasks(selectedDate);
      setTasks(fetchedTasks);
      const analyticsData = await dailyTasksService.getStreakInfo();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error creating daily task:", error);
      setError(
        error instanceof Error ? error.message : "Failed to create task"
      );
    }
  };

  const updateTask = async (
    taskId: string,
    updateData: UpdateDailyTaskData
  ) => {
    try {
      await dailyTasksService.updateDailyTask(taskId, updateData);
      // Reload tasks and analytics
      const fetchedTasks = await dailyTasksService.getDailyTasks(selectedDate);
      setTasks(fetchedTasks);
      const analyticsData = await dailyTasksService.getStreakInfo();
      setAnalytics(analyticsData);
      setEditingTask(null);
    } catch (error) {
      console.error("Error updating daily task:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update task"
      );
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      await dailyTasksService.deleteDailyTask(taskId);
      // Reload tasks and analytics
      const fetchedTasks = await dailyTasksService.getDailyTasks(selectedDate);
      setTasks(fetchedTasks);
      const analyticsData = await dailyTasksService.getStreakInfo();
      setAnalytics(analyticsData);
    } catch (error) {
      console.error("Error deleting daily task:", error);
      setError(
        error instanceof Error ? error.message : "Failed to delete task"
      );
    }
  };

  const toggleTaskCompletion = async (taskId: string) => {
    try {
      const result = await dailyTasksService.toggleTaskCompletion(
        taskId,
        selectedDate
      );
      // Reload tasks and analytics
      const fetchedTasks = await dailyTasksService.getDailyTasks(selectedDate);
      setTasks(fetchedTasks);
      const analyticsData = await dailyTasksService.getStreakInfo();
      setAnalytics(analyticsData);

      // Show success message if all tasks are completed
      if (result.allTasksCompleted && result.isCompleted) {
        // You could show a toast notification here
        console.log("🎉 All daily tasks completed for today!");
      }
    } catch (error) {
      console.error("Error toggling task completion:", error);
      setError(
        error instanceof Error ? error.message : "Failed to update task"
      );
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(":");
    const hour = parseInt(hours, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isToday = (dateString: string): boolean => {
    return dateString === new Date().toISOString().split("T")[0];
  };

  // Show loading state
  if (authLoading || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
            <span className="ml-3 text-gray-600">
              {authLoading
                ? "Checking authentication..."
                : "Loading daily tasks..."}
            </span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 px-4 py-6">
        <div className="max-w-4xl mx-auto">
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
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      setError(null);
                      const fetchedTasks =
                        await dailyTasksService.getDailyTasks(selectedDate);
                      setTasks(fetchedTasks);
                    } catch (error) {
                      console.error("Error loading daily tasks:", error);
                      setError(
                        error instanceof Error
                          ? error.message
                          : "Failed to load daily tasks"
                      );
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header with Analytics */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex-1">
            <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">
              Daily Tasks
            </h1>
            <div className="flex flex-wrap gap-2 text-xs sm:text-sm text-gray-500 mt-1">
              <span className="flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                {analytics.currentStreak} day streak
              </span>
              <span>•</span>
              <span>{analytics.completedToday} completed today</span>
              <span>•</span>
              <span>{analytics.totalActiveTasks} active tasks</span>
            </div>
          </div>
          <button
            onClick={() => setShowAddTask(true)}
            className="flex items-center justify-center gap-2 bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors w-full sm:w-auto"
          >
            <Plus className="w-4 h-4" />
            Add Task
          </button>
        </div>
      </div>

      {/* Date Selector */}
      <div className="bg-white rounded-lg p-4 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-gray-500" />
            <label
              htmlFor="selectedDate"
              className="text-sm font-medium text-gray-700"
            >
              Select Date
            </label>
          </div>
          <div className="flex items-center gap-3">
            <input
              type="date"
              id="selectedDate"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-black focus:ring-1 focus:ring-black transition-colors"
            />
            {isToday(selectedDate) ? (
              <div className="text-xs text-green-600 font-medium bg-green-50 px-3 py-1 rounded-full">
                Today
              </div>
            ) : (
              <button
                onClick={() =>
                  setSelectedDate(new Date().toISOString().split("T")[0])
                }
                className="text-xs text-blue-600 hover:text-blue-800 font-medium bg-blue-50 hover:bg-blue-100 px-3 py-1 rounded-full transition-colors"
              >
                Go to Today
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tasks Display */}
      <div className="space-y-4">
        {tasks.length === 0 ? (
          <div className="bg-white rounded-lg p-8 text-center shadow-sm">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No daily tasks for this date
            </h3>
            <p className="text-gray-500 mb-4">
              Create your first daily task to get started
            </p>
            <button
              onClick={() => setShowAddTask(true)}
              className="bg-black text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-colors"
            >
              Create Task
            </button>
          </div>
        ) : (
          tasks.map((task) => (
            <div
              key={task._id}
              className={`rounded-lg shadow-sm border p-4 transition-all duration-200 ${
                task.isCompletedToday
                  ? "ring-1 ring-green-200 bg-green-50/30 border-green-200"
                  : task.priority === "high"
                  ? "bg-red-50/30 border-red-100 hover:bg-red-50/40 hover:shadow-md"
                  : task.priority === "medium"
                  ? "bg-amber-50/30 border-amber-100 hover:bg-amber-50/40 hover:shadow-md"
                  : "bg-emerald-50/30 border-emerald-100 hover:bg-emerald-50/40 hover:shadow-md"
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  onClick={() => toggleTaskCompletion(task._id)}
                  className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 transition-all duration-200 ${
                    task.isCompletedToday
                      ? "bg-green-600 border-green-600 text-white shadow-sm"
                      : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                  }`}
                >
                  {task.isCompletedToday && <CheckCircle className="w-4 h-4" />}
                </button>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <h3
                        className={`font-medium text-sm sm:text-base ${
                          task.isCompletedToday
                            ? "line-through text-gray-500"
                            : "text-gray-900"
                        }`}
                      >
                        {task.title}
                      </h3>
                      {task.description && (
                        <p
                          className={`text-xs sm:text-sm mt-1 leading-relaxed ${
                            task.isCompletedToday
                              ? "text-gray-400"
                              : "text-gray-600"
                          }`}
                        >
                          {task.description}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1 ml-2">
                      <button
                        onClick={() => setEditingTask(task)}
                        className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteTask(task._id)}
                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Task Details */}
                  <div className="flex flex-wrap items-center gap-4 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>
                        {formatTime(task.dailyStartTime)} -{" "}
                        {formatTime(task.dailyEndTime)}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>
                        {new Date(task.dateStarted).toLocaleDateString()} -{" "}
                        {new Date(task.dateEnded).toLocaleDateString()}
                      </span>
                    </div>
                    <span
                      className={`px-2 py-0.5 rounded text-xs font-medium ${
                        task.priority === "high"
                          ? "bg-red-50 text-red-500 border border-red-200"
                          : task.priority === "medium"
                          ? "bg-amber-50 text-amber-600 border border-amber-200"
                          : "bg-emerald-50 text-emerald-600 border border-emerald-200"
                      }`}
                    >
                      {task.priority} priority
                    </span>
                    {task.lastCompletedDate && (
                      <div className="flex items-center gap-1 text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        <span>
                          Last completed:{" "}
                          {new Date(
                            task.lastCompletedDate
                          ).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {!task.isActive && (
                      <div className="text-orange-600 text-xs bg-orange-100 px-2 py-0.5 rounded">
                        Inactive
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Task Modal */}
      <AddDailyTaskModal
        isOpen={showAddTask || !!editingTask}
        onClose={() => {
          setShowAddTask(false);
          setEditingTask(null);
        }}
        onAddTask={addTask}
        onUpdateTask={updateTask}
        editingTask={editingTask}
      />
    </>
  );
};

export default DailyTasks;
