export type TaskPriority = 'high' | 'medium' | 'low';
export type TaskCategory = 'work' | 'personal' | 'shopping' | 'health' | 'other';
export type TaskRecurrence = 'none' | 'daily' | 'weekly' | 'monthly';

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: TaskCategory;
  priority: TaskPriority;
  deadline?: Date;
  reminder?: boolean;
  recurrence: TaskRecurrence;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskFilter {
  search?: string;
  category?: TaskCategory;
  priority?: TaskPriority;
  completed?: boolean;
  date?: Date;
}