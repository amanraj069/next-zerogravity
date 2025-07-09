"use client";

import React, { useState } from "react";
import { X, Plus, Calendar, Target } from "lucide-react";
import { CreateGoalData } from "@/services/goalsService";

interface AddGoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddGoal: (goal: CreateGoalData) => void;
}

const AddGoalModal: React.FC<AddGoalModalProps> = ({
  isOpen,
  onClose,
  onAddGoal,
}) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "monthly" as "weekly" | "monthly" | "quarterly" | "yearly",
    priority: "medium" as "low" | "medium" | "high",
    targetDate: "",
  });

  const [milestones, setMilestones] = useState<
    Array<{
      title: string;
      description: string;
      targetDate: string;
    }>
  >([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newGoal: CreateGoalData = {
      title: formData.title,
      description: formData.description,
      category: formData.category,
      priority: formData.priority,
      targetDate: formData.targetDate,
      milestones: milestones.map((milestone) => ({
        title: milestone.title,
        description: milestone.description,
        targetDate: milestone.targetDate,
        subtasks: [], // For now, we'll keep this empty as the UI doesn't support adding subtasks yet
      })),
    };

    onAddGoal(newGoal);
    onClose();

    // Reset form
    setFormData({
      title: "",
      description: "",
      category: "monthly",
      priority: "medium",
      targetDate: "",
    });
    setMilestones([]);
  };

  const addMilestone = () => {
    setMilestones((prev) => [
      ...prev,
      {
        title: "",
        description: "",
        targetDate: "",
      },
    ]);
  };

  const updateMilestone = (index: number, field: string, value: string) => {
    setMilestones((prev) =>
      prev.map((milestone, i) =>
        i === index ? { ...milestone, [field]: value } : milestone
      )
    );
  };

  const removeMilestone = (index: number) => {
    setMilestones((prev) => prev.filter((_, i) => i !== index));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[80vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">New Goal</h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <div>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black text-sm"
              placeholder="Goal title"
            />
          </div>

          <div>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black text-sm"
              rows={2}
              placeholder="Description (optional)"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    category: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black text-sm"
              >
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="yearly">Yearly</option>
              </select>
            </div>

            <div>
              <select
                required
                value={formData.priority}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    priority: e.target.value as any,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>

            <div>
              <input
                type="date"
                required
                value={formData.targetDate}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    targetDate: e.target.value,
                  }))
                }
                className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-1 focus:ring-black focus:border-black text-sm"
              />
            </div>
          </div>

          {/* Minimal Milestones */}
          {milestones.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Milestones
                </span>
              </div>
              {milestones.map((milestone, index) => (
                <div
                  key={index}
                  className="p-3 border border-gray-100 rounded-md space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <input
                      type="text"
                      value={milestone.title}
                      onChange={(e) =>
                        updateMilestone(index, "title", e.target.value)
                      }
                      className="flex-1 px-2 py-1 border border-gray-200 rounded text-sm mr-2"
                      placeholder="Milestone title"
                    />
                    <button
                      type="button"
                      onClick={() => removeMilestone(index)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  <input
                    type="date"
                    value={milestone.targetDate}
                    onChange={(e) =>
                      updateMilestone(index, "targetDate", e.target.value)
                    }
                    className="w-full px-2 py-1 border border-gray-200 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          )}

          <button
            type="button"
            onClick={addMilestone}
            className="w-full py-2 text-sm text-gray-600 border border-dashed border-gray-300 rounded-md hover:border-gray-400 transition-colors"
          >
            + Add Milestone
          </button>

          <div className="flex gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-3 py-2 text-sm border border-gray-200 text-gray-600 rounded-md hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-3 py-2 text-sm bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Create Goal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddGoalModal;
