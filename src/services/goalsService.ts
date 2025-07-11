import { apiCallWithAuth, API_ENDPOINTS } from "@/config/api";

export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  createdAt: Date;
}

export interface Milestone {
  id: string;
  title: string;
  description?: string;
  targetDate: Date;
  completed: boolean;
  subtasks: Subtask[];
  createdAt: Date;
  progress?: number;
}

export interface Goal {
  _id: string;
  id?: string; // For compatibility with existing frontend code
  title: string;
  description?: string;
  category: "weekly" | "monthly" | "quarterly" | "yearly";
  priority: "low" | "medium" | "high";
  targetDate: Date;
  createdAt: Date;
  completed: boolean;
  milestones: Milestone[];
  completedAt?: Date;
  progress?: number;
}

export interface GoalsAnalytics {
  currentStreak: number;
  longestStreak: number;
  totalCompleted: number;
  totalGoals: number;
  completionRate: number;
}

export interface GoalsResponse {
  goals: Goal[];
  analytics: GoalsAnalytics;
}

// API Response interfaces (using string dates instead of Date objects)
interface ApiSubtask extends Omit<Subtask, "id" | "createdAt"> {
  _id: string;
  createdAt: string;
}

interface ApiMilestone
  extends Omit<Milestone, "id" | "targetDate" | "createdAt" | "subtasks"> {
  _id: string;
  targetDate: string;
  createdAt: string;
  subtasks: ApiSubtask[];
}

interface ApiGoal
  extends Omit<
    Goal,
    "_id" | "id" | "targetDate" | "createdAt" | "completedAt" | "milestones"
  > {
  _id: string;
  targetDate: string;
  createdAt: string;
  completedAt?: string;
  milestones: ApiMilestone[];
}

export interface CreateGoalData {
  title: string;
  description?: string;
  category: "weekly" | "monthly" | "quarterly" | "yearly";
  priority: "low" | "medium" | "high";
  targetDate: string | Date;
  milestones?: Array<{
    title: string;
    description?: string;
    targetDate: string | Date;
    subtasks?: Array<{
      title: string;
    }>;
  }>;
}

export interface UpdateGoalData {
  title?: string;
  description?: string;
  category?: "weekly" | "monthly" | "quarterly" | "yearly";
  priority?: "low" | "medium" | "high";
  targetDate?: string | Date;
  completed?: boolean;
  milestones?: Array<{
    title: string;
    description?: string;
    targetDate: string | Date;
  }>;
}

export const goalsService = {
  // Get all goals with analytics
  async getGoals(): Promise<GoalsResponse> {
    const response = await apiCallWithAuth(API_ENDPOINTS.GOALS.LIST);

    if (!response.ok) {
      throw new Error(`Failed to fetch goals: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch goals");
    }

    // Convert date strings to Date objects and add id field for compatibility
    const processedGoals = data.data.goals.map((goal: ApiGoal) => ({
      ...goal,
      id: goal._id, // Add id field for frontend compatibility
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      milestones: goal.milestones.map((milestone: ApiMilestone) => ({
        ...milestone,
        targetDate: new Date(milestone.targetDate),
        createdAt: new Date(milestone.createdAt),
        subtasks: milestone.subtasks.map((subtask: ApiSubtask) => ({
          ...subtask,
          createdAt: new Date(subtask.createdAt),
        })),
      })),
    }));

    return {
      goals: processedGoals,
      analytics: data.data.analytics,
    };
  },

  // Get a specific goal by ID
  async getGoal(id: string): Promise<Goal> {
    const response = await apiCallWithAuth(API_ENDPOINTS.GOALS.GET(id));

    if (!response.ok) {
      throw new Error(`Failed to fetch goal: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch goal");
    }

    const goal = data.data;
    return {
      ...goal,
      id: goal._id,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      milestones: goal.milestones.map((milestone: ApiMilestone) => ({
        ...milestone,
        targetDate: new Date(milestone.targetDate),
        createdAt: new Date(milestone.createdAt),
        subtasks: milestone.subtasks.map((subtask: ApiSubtask) => ({
          ...subtask,
          createdAt: new Date(subtask.createdAt),
        })),
      })),
    };
  },

  // Create a new goal
  async createGoal(goalData: CreateGoalData): Promise<Goal> {
    const response = await apiCallWithAuth(API_ENDPOINTS.GOALS.CREATE, {
      method: "POST",
      body: JSON.stringify(goalData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create goal: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to create goal");
    }

    const goal = data.data;
    return {
      ...goal,
      id: goal._id,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      milestones: goal.milestones.map((milestone: ApiMilestone) => ({
        ...milestone,
        targetDate: new Date(milestone.targetDate),
        createdAt: new Date(milestone.createdAt),
        subtasks: milestone.subtasks.map((subtask: ApiSubtask) => ({
          ...subtask,
          createdAt: new Date(subtask.createdAt),
        })),
      })),
    };
  },

  // Update a goal
  async updateGoal(id: string, updateData: UpdateGoalData): Promise<Goal> {
    const response = await apiCallWithAuth(API_ENDPOINTS.GOALS.UPDATE(id), {
      method: "PUT",
      body: JSON.stringify(updateData),
    });

    if (!response.ok) {
      throw new Error(`Failed to update goal: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to update goal");
    }

    const goal = data.data;
    return {
      ...goal,
      id: goal._id,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      milestones: goal.milestones.map((milestone: ApiMilestone) => ({
        ...milestone,
        targetDate: new Date(milestone.targetDate),
        createdAt: new Date(milestone.createdAt),
        subtasks: milestone.subtasks.map((subtask: ApiSubtask) => ({
          ...subtask,
          createdAt: new Date(subtask.createdAt),
        })),
      })),
    };
  },

  // Delete a goal
  async deleteGoal(id: string): Promise<void> {
    const response = await apiCallWithAuth(API_ENDPOINTS.GOALS.DELETE(id), {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error(`Failed to delete goal: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to delete goal");
    }
  },

  // Toggle goal completion
  async toggleGoalCompletion(id: string): Promise<Goal> {
    const response = await apiCallWithAuth(
      API_ENDPOINTS.GOALS.TOGGLE_COMPLETION(id),
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to toggle goal completion: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to toggle goal completion");
    }

    const goal = data.data;
    return {
      ...goal,
      id: goal._id,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      milestones: goal.milestones.map((milestone: ApiMilestone) => ({
        ...milestone,
        targetDate: new Date(milestone.targetDate),
        createdAt: new Date(milestone.createdAt),
        subtasks: milestone.subtasks.map((subtask: ApiSubtask) => ({
          ...subtask,
          createdAt: new Date(subtask.createdAt),
        })),
      })),
    };
  },

  // Toggle milestone completion
  async toggleMilestoneCompletion(
    goalId: string,
    milestoneId: string
  ): Promise<Goal> {
    const response = await apiCallWithAuth(
      API_ENDPOINTS.GOALS.TOGGLE_MILESTONE(goalId, milestoneId),
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to toggle milestone completion: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to toggle milestone completion");
    }

    const goal = data.data;
    return {
      ...goal,
      id: goal._id,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      milestones: goal.milestones.map((milestone: ApiMilestone) => ({
        ...milestone,
        targetDate: new Date(milestone.targetDate),
        createdAt: new Date(milestone.createdAt),
        subtasks: milestone.subtasks.map((subtask: ApiSubtask) => ({
          ...subtask,
          createdAt: new Date(subtask.createdAt),
        })),
      })),
    };
  },

  // Toggle subtask completion
  async toggleSubtaskCompletion(
    goalId: string,
    milestoneId: string,
    subtaskId: string
  ): Promise<Goal> {
    const response = await apiCallWithAuth(
      API_ENDPOINTS.GOALS.TOGGLE_SUBTASK(goalId, milestoneId, subtaskId),
      {
        method: "PATCH",
      }
    );

    if (!response.ok) {
      throw new Error(
        `Failed to toggle subtask completion: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to toggle subtask completion");
    }

    const goal = data.data;
    return {
      ...goal,
      id: goal._id,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      milestones: goal.milestones.map((milestone: ApiMilestone) => ({
        ...milestone,
        targetDate: new Date(milestone.targetDate),
        createdAt: new Date(milestone.createdAt),
        subtasks: milestone.subtasks.map((subtask: ApiSubtask) => ({
          ...subtask,
          createdAt: new Date(subtask.createdAt),
        })),
      })),
    };
  },

  // Get goals by category
  async getGoalsByCategory(
    category: "weekly" | "monthly" | "quarterly" | "yearly"
  ): Promise<Goal[]> {
    const response = await apiCallWithAuth(
      API_ENDPOINTS.GOALS.BY_CATEGORY(category)
    );

    if (!response.ok) {
      throw new Error(
        `Failed to fetch goals by category: ${response.statusText}`
      );
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch goals by category");
    }

    return data.data.map((goal: ApiGoal) => ({
      ...goal,
      id: goal._id,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      milestones: goal.milestones.map((milestone: ApiMilestone) => ({
        ...milestone,
        targetDate: new Date(milestone.targetDate),
        createdAt: new Date(milestone.createdAt),
        subtasks: milestone.subtasks.map((subtask: ApiSubtask) => ({
          ...subtask,
          createdAt: new Date(subtask.createdAt),
        })),
      })),
    }));
  },

  // Update subtasks for a specific milestone
  async updateSubtasks(
    goalId: string,
    milestoneId: string,
    subtasks: Array<{ title: string }>
  ): Promise<Goal> {
    const response = await apiCallWithAuth(
      API_ENDPOINTS.GOALS.UPDATE_SUBTASKS(goalId, milestoneId),
      {
        method: "PUT",
        body: JSON.stringify({ subtasks }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to update subtasks: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to update subtasks");
    }

    const goal = data.data;
    return {
      ...goal,
      id: goal._id,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      milestones: goal.milestones.map((milestone: ApiMilestone) => ({
        ...milestone,
        targetDate: new Date(milestone.targetDate),
        createdAt: new Date(milestone.createdAt),
        subtasks: milestone.subtasks.map((subtask: ApiSubtask) => ({
          ...subtask,
          createdAt: new Date(subtask.createdAt),
        })),
      })),
    };
  },

  // Add subtasks to a specific milestone
  async addSubtasks(
    goalId: string,
    milestoneId: string,
    subtasks: Array<{ title: string }>
  ): Promise<Goal> {
    const response = await apiCallWithAuth(
      API_ENDPOINTS.GOALS.ADD_SUBTASKS(goalId, milestoneId),
      {
        method: "POST",
        body: JSON.stringify({ subtasks }),
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to add subtasks: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to add subtasks");
    }

    const goal = data.data;
    return {
      ...goal,
      id: goal._id,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      milestones: goal.milestones.map((milestone: ApiMilestone) => ({
        ...milestone,
        targetDate: new Date(milestone.targetDate),
        createdAt: new Date(milestone.createdAt),
        subtasks: milestone.subtasks.map((subtask: ApiSubtask) => ({
          ...subtask,
          createdAt: new Date(subtask.createdAt),
        })),
      })),
    };
  },

  // Delete a specific subtask
  async deleteSubtask(
    goalId: string,
    milestoneId: string,
    subtaskId: string
  ): Promise<Goal> {
    const response = await apiCallWithAuth(
      API_ENDPOINTS.GOALS.DELETE_SUBTASK(goalId, milestoneId, subtaskId),
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to delete subtask: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to delete subtask");
    }

    const goal = data.data;
    return {
      ...goal,
      id: goal._id,
      targetDate: new Date(goal.targetDate),
      createdAt: new Date(goal.createdAt),
      completedAt: goal.completedAt ? new Date(goal.completedAt) : undefined,
      milestones: goal.milestones.map((milestone: ApiMilestone) => ({
        ...milestone,
        targetDate: new Date(milestone.targetDate),
        createdAt: new Date(milestone.createdAt),
        subtasks: milestone.subtasks.map((subtask: ApiSubtask) => ({
          ...subtask,
          createdAt: new Date(subtask.createdAt),
        })),
      })),
    };
  },
};
