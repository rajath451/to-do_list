import React, { useState } from 'react';
import { TaskCategory } from '../types';
import { breakDownTaskWithAI } from '../services/geminiService';

interface AddTaskProps {
  onAdd: (title: string, category: TaskCategory, dueDate: string, subTasks: string[]) => void;
}

export const AddTask: React.FC<AddTaskProps> = ({ onAdd }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<TaskCategory>(TaskCategory.STUDY);
  const [dueDate, setDueDate] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, category, dueDate, []);
    setTitle('');
    setDueDate('');
    setIsExpanded(false);
  };

  const handleAiBreakdown = async () => {
    if (!title.trim()) return;
    setIsAiLoading(true);
    try {
      const subTasks = await breakDownTaskWithAI(title);
      onAdd(title, category, dueDate, subTasks);
      setTitle('');
      setDueDate('');
      setIsExpanded(false);
    } catch (err) {
      console.error("AI Breakdown failed", err);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden mb-6">
      {!isExpanded ? (
        <div 
            onClick={() => setIsExpanded(true)}
            className="p-4 flex items-center gap-3 cursor-text hover:bg-slate-50 transition-colors"
        >
            <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
            </div>
            <span className="text-slate-400 font-medium">Add a new study task...</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="p-4 space-y-4">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full text-lg font-medium text-slate-800 placeholder-slate-400 outline-none bg-transparent"
            autoFocus
          />

          <div className="flex flex-wrap items-center gap-3">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as TaskCategory)}
              className="text-sm bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-100"
            >
              {Object.values(TaskCategory).map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>

            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="text-sm bg-slate-50 border border-slate-200 text-slate-600 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-primary-100"
            />
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-slate-100">
             <button
                type="button"
                onClick={() => setIsExpanded(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-medium px-2 py-1"
             >
                 Cancel
             </button>
             <div className="flex gap-2">
                <button
                    type="button"
                    onClick={handleAiBreakdown}
                    disabled={!title.trim() || isAiLoading}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        !title.trim() || isAiLoading
                        ? 'bg-slate-100 text-slate-300 cursor-not-allowed'
                        : 'bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow hover:shadow-md hover:from-violet-600 hover:to-fuchsia-600'
                    }`}
                >
                    {isAiLoading ? (
                        <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z"/></svg>
                    )}
                    AI Breakdown
                </button>
                <button
                    type="submit"
                    disabled={!title.trim()}
                    className={`px-6 py-2 rounded-lg text-sm font-semibold transition-colors ${
                        title.trim() 
                        ? 'bg-slate-800 text-white hover:bg-slate-900' 
                        : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                    }`}
                >
                    Add Task
                </button>
             </div>
          </div>
        </form>
      )}
    </div>
  );
};