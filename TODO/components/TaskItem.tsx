import React from 'react';
import { Task, SubTask, TaskCategory } from '../types';

interface TaskItemProps {
  task: Task;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
  onToggleSubTask: (taskId: string, subTaskId: string) => void;
  onExpand: (taskId: string) => void;
}

const CategoryColors: Record<TaskCategory, string> = {
  [TaskCategory.STUDY]: 'bg-blue-100 text-blue-700 border-blue-200',
  [TaskCategory.ASSIGNMENT]: 'bg-orange-100 text-orange-700 border-orange-200',
  [TaskCategory.EXAM]: 'bg-red-100 text-red-700 border-red-200',
  [TaskCategory.PERSONAL]: 'bg-green-100 text-green-700 border-green-200',
  [TaskCategory.OTHER]: 'bg-slate-100 text-slate-700 border-slate-200',
};

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onToggleSubTask, onExpand }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && !task.completed;
  
  // Calculate progress if there are subtasks
  const subTaskProgress = task.subTasks && task.subTasks.length > 0
    ? Math.round((task.subTasks.filter(st => st.completed).length / task.subTasks.length) * 100)
    : null;

  return (
    <div className={`group bg-white rounded-xl border transition-all duration-200 ${task.completed ? 'border-slate-100 bg-slate-50' : 'border-slate-200 hover:border-primary-200 hover:shadow-sm'}`}>
      <div className="p-4 flex items-start gap-3">
        {/* Main Checkbox */}
        <button
          onClick={() => onToggle(task.id)}
          className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
            task.completed
              ? 'bg-emerald-500 border-emerald-500 text-white'
              : 'border-slate-300 hover:border-primary-500 bg-white'
          }`}
        >
          {task.completed && (
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full border ${CategoryColors[task.category]}`}>
              {task.category}
            </span>
            {task.dueDate && (
              <span className={`text-xs flex items-center gap-1 ${isOverdue ? 'text-red-500 font-medium' : 'text-slate-400'}`}>
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
                {new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
              </span>
            )}
          </div>
          
          <h3 className={`text-sm font-medium leading-tight mb-1 truncate ${task.completed ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
            {task.title}
          </h3>

          {/* Subtask Progress Bar */}
          {subTaskProgress !== null && !task.completed && (
             <div className="flex items-center gap-2 mt-2">
                <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-400 rounded-full transition-all duration-300" style={{ width: `${subTaskProgress}%` }}></div>
                </div>
                <span className="text-[10px] text-slate-400 font-medium">{subTaskProgress}%</span>
             </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-1">
          {task.subTasks && task.subTasks.length > 0 && (
             <button
             onClick={() => onExpand(task.id)}
             className={`p-1.5 rounded-md transition-colors ${task.isExpanded ? 'bg-primary-50 text-primary-600' : 'text-slate-400 hover:bg-slate-100 hover:text-slate-600'}`}
           >
             <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transform transition-transform ${task.isExpanded ? 'rotate-180' : ''}`}>
               <polyline points="6 9 12 15 18 9"></polyline>
             </svg>
           </button>
          )}
          <button
            onClick={() => onDelete(task.id)}
            className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover:opacity-100"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
        </div>
      </div>

      {/* Subtasks List */}
      {task.isExpanded && task.subTasks && (
        <div className="border-t border-slate-100 bg-slate-50/50 p-3 pl-12 space-y-2 rounded-b-xl">
          {task.subTasks.map(st => (
            <div key={st.id} className="flex items-center gap-3">
              <button
                onClick={() => onToggleSubTask(task.id, st.id)}
                className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                  st.completed ? 'bg-primary-400 border-primary-400 text-white' : 'border-slate-300 bg-white hover:border-primary-400'
                }`}
              >
                {st.completed && <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
              </button>
              <span className={`text-sm ${st.completed ? 'text-slate-400 line-through' : 'text-slate-600'}`}>{st.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};