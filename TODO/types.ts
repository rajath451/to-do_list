export interface SubTask {
  id: string;
  title: string;
  completed: boolean;
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: TaskCategory;
  dueDate?: string;
  subTasks?: SubTask[];
  isExpanded?: boolean; // For UI toggle of subtasks
}

export enum TaskCategory {
  STUDY = 'Study',
  ASSIGNMENT = 'Assignment',
  EXAM = 'Exam',
  PERSONAL = 'Personal',
  OTHER = 'Other'
}

export enum TimerMode {
  FOCUS = 'focus',
  SHORT_BREAK = 'short_break',
  LONG_BREAK = 'long_break'
}