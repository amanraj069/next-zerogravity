"use client";

import React, { useState, useEffect } from "react";
import { X, Clock, Calendar } from "lucide-react";
import {
  DailyTask,
  CreateDailyTaskData,
  UpdateDailyTaskData,
} from "@/services/dailyTasksService";

interface AddDailyTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddTask: (taskData: CreateDailyTaskData) => Promise<void>;
  onUpdateTask?: (
    taskId: string,
    updateData: UpdateDailyTaskData
  ) => Promise<void>;
  editingTask?: DailyTask | null;
}

const AddDailyTaskModal: React.FC<AddDailyTaskModalProps> = ({
  isOpen,
  onClose,
  onAddTask,
  onUpdateTask,
  editingTask,
}) => {
  const [formData, setFormData] = useState<CreateDailyTaskData>({
    title: "",
    description: "",
    priority: "medium",
    dateStarted: new Date().toISOString().split("T")[0], // Today's date by default
    dateEnded: "",
    dailyStartTime: "09:00",
    dailyEndTime: "17:00",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreateDailyTaskData, string>>
  >({});

  // Reset form when modal opens/closes or editing task changes
  useEffect(() => {
    if (isOpen) {
      if (editingTask) {
        // Populate form with editing task data
        setFormData({
          title: editingTask.title,
          description: editingTask.description || "",
          priority: editingTask.priority || "medium",
          dateStarted: new Date(editingTask.dateStarted)
            .toISOString()
            .split("T")[0],
          dateEnded: new Date(editingTask.dateEnded)
            .toISOString()
            .split("T")[0],
          dailyStartTime: editingTask.dailyStartTime,
          dailyEndTime: editingTask.dailyEndTime,
        });
      } else {
        // Reset to default values for new task
        const today = new Date().toISOString().split("T")[0];
        const nextWeek = new Date();
        nextWeek.setDate(nextWeek.getDate() + 7);

        setFormData({
          title: "",
          description: "",
          priority: "medium",
          dateStarted: today,
          dateEnded: nextWeek.toISOString().split("T")[0],
          dailyStartTime: "09:00",
          dailyEndTime: "17:00",
        });
      }
      setErrors({});
      setIsSubmitting(false);
    }
  }, [isOpen, editingTask]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name as keyof CreateDailyTaskData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof CreateDailyTaskData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
    }

    if (!formData.dateStarted) {
      newErrors.dateStarted = "Start date is required";
    }

    if (!formData.dateEnded) {
      newErrors.dateEnded = "End date is required";
    }

    if (formData.dateStarted && formData.dateEnded) {
      const startDate = new Date(formData.dateStarted);
      const endDate = new Date(formData.dateEnded);

      if (startDate >= endDate) {
        newErrors.dateEnded = "End date must be after start date";
      }
    }

    if (!formData.dailyStartTime) {
      newErrors.dailyStartTime = "Daily start time is required";
    }

    if (!formData.dailyEndTime) {
      newErrors.dailyEndTime = "Daily end time is required";
    }

    if (formData.dailyStartTime && formData.dailyEndTime) {
      const [startHour, startMin] = formData.dailyStartTime
        .split(":")
        .map(Number);
      const [endHour, endMin] = formData.dailyEndTime.split(":").map(Number);

      const startTotalMinutes = startHour * 60 + startMin;
      const endTotalMinutes = endHour * 60 + endMin;

      if (startTotalMinutes >= endTotalMinutes) {
        newErrors.dailyEndTime = "End time must be after start time";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const taskData = {
        ...formData,
        title: formData.title.trim(),
        description: formData.description?.trim(),
      };

      if (editingTask && onUpdateTask) {
        await onUpdateTask(editingTask._id, taskData);
      } else {
        await onAddTask(taskData);
      }

      onClose();
    } catch (error) {
      console.error("Error saving daily task:", error);
      setErrors({
        title: error instanceof Error ? error.message : "Failed to save task",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingTask ? "Edit Daily Task" : "Add Daily Task"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-md transition-colors"
            disabled={isSubmitting}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          {/* Title */}
          <div>
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Title *
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${
                errors.title
                  ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                  : "border-gray-300 focus:border-black focus:ring-black"
              }`}
              placeholder="Enter task title"
              disabled={isSubmitting}
            />
            {errors.title && (
              <p className="mt-1 text-xs text-red-600">{errors.title}</p>
            )}
          </div>

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={3}
              value={formData.description}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-black focus:ring-black transition-colors"
              placeholder="Enter task description (optional)"
              disabled={isSubmitting}
            />
          </div>

          {/* Priority */}
          <div>
            <label
              htmlFor="priority"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Priority
            </label>
            <select
              id="priority"
              name="priority"
              value={formData.priority}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  priority: e.target.value as "low" | "medium" | "high",
                }))
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:border-black focus:ring-black transition-colors"
              disabled={isSubmitting}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dateStarted"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Calendar className="w-3 h-3 inline mr-1" />
                Start Date *
              </label>
              <input
                type="date"
                id="dateStarted"
                name="dateStarted"
                value={formData.dateStarted}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${
                  errors.dateStarted
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                }`}
                disabled={isSubmitting}
              />
              {errors.dateStarted && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.dateStarted}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dateEnded"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Calendar className="w-3 h-3 inline mr-1" />
                End Date *
              </label>
              <input
                type="date"
                id="dateEnded"
                name="dateEnded"
                value={formData.dateEnded}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${
                  errors.dateEnded
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                }`}
                disabled={isSubmitting}
              />
              {errors.dateEnded && (
                <p className="mt-1 text-xs text-red-600">{errors.dateEnded}</p>
              )}
            </div>
          </div>

          {/* Daily Time Range */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="dailyStartTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Clock className="w-3 h-3 inline mr-1" />
                Start Time *
              </label>
              <input
                type="time"
                id="dailyStartTime"
                name="dailyStartTime"
                value={formData.dailyStartTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${
                  errors.dailyStartTime
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                }`}
                disabled={isSubmitting}
              />
              {errors.dailyStartTime && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.dailyStartTime}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="dailyEndTime"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                <Clock className="w-3 h-3 inline mr-1" />
                End Time *
              </label>
              <input
                type="time"
                id="dailyEndTime"
                name="dailyEndTime"
                value={formData.dailyEndTime}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md text-sm transition-colors ${
                  errors.dailyEndTime
                    ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                    : "border-gray-300 focus:border-black focus:ring-black"
                }`}
                disabled={isSubmitting}
              />
              {errors.dailyEndTime && (
                <p className="mt-1 text-xs text-red-600">
                  {errors.dailyEndTime}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 text-sm text-white bg-black hover:bg-gray-800 rounded-md transition-colors disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? "Saving..."
                : editingTask
                ? "Update Task"
                : "Add Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDailyTaskModal;
