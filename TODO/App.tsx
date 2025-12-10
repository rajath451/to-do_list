import React, { useState, useEffect } from 'react';
import { Task, TaskCategory, SubTask } from './types';
import { PomodoroTimer } from './components/PomodoroTimer';
import { TaskItem } from './components/TaskItem';
import { AddTask } from './components/AddTask';

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('focusflow-tasks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });
  
  const [filter, setFilter] = useState<TaskCategory | 'All'>('All');

  useEffect(() => {
    localStorage.setItem('focusflow-tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (title: string, category: TaskCategory, dueDate: string, subTaskTitles: string[]) => {
    const newTask: Task = {
      id: crypto.randomUUID(),
      title,
      category,
      dueDate: dueDate || undefined,
      completed: false,
      isExpanded: subTaskTitles.length > 0,
      subTasks: subTaskTitles.map(t => ({
        id: crypto.randomUUID(),
        title: t,
        completed: false
      }))
    };
    setTasks(prev => [newTask, ...prev]);
  };

  const toggleTask = (id: string) => {
    setTasks(prev => prev.map(t => 
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const toggleSubTask = (taskId: string, subTaskId: string) => {
    setTasks(prev => prev.map(t => {
      if (t.id === taskId && t.subTasks) {
        return {
          ...t,
          subTasks: t.subTasks.map(st => 
            st.id === subTaskId ? { ...st, completed: !st.completed } : st
          )
        };
      }
      return t;
    }));
  };

  const deleteTask = (id: string) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleExpand = (id: string) => {
    setTasks(prev => prev.map(t => 
        t.id === id ? { ...t, isExpanded: !t.isExpanded } : t
    ));
  };

  const filteredTasks = tasks.filter(t => 
    filter === 'All' ? true : t.category === filter
  );

  const activeTasksCount = tasks.filter(t => !t.completed).length;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-primary-100 selection:text-primary-900">
      
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center text-white">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2v20M2 12h20M12 2a10 10 0 0 1 10 10 10 10 0 0 1-10 10 10 10 0 0 1-10-10 10 10 0 0 1 10-10z"/></svg>
            </div>
            <h1 className="font-bold text-xl tracking-tight text-slate-800">FocusFlow</h1>
          </div>
          <div className="text-sm text-slate-500 font-medium">
            {activeTasksCount} active {activeTasksCount === 1 ? 'task' : 'tasks'}
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Main Content Area (Tasks) */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Greeting */}
            <div className="mb-8">
               <h2 className="text-2xl font-bold text-slate-800">Hello, Student! 👋</h2>
               <p className="text-slate-500">Ready to conquer your study goals today?</p>
            </div>

            <AddTask onAdd={addTask} />

            {/* Filters */}
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              <button
                onClick={() => setFilter('All')}
                className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                  filter === 'All' 
                    ? 'bg-slate-800 text-white' 
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                All Tasks
              </button>
              {Object.values(TaskCategory).map(cat => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className={`px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors ${
                    filter === cat 
                      ? 'bg-slate-800 text-white' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Task List */}
            <div className="space-y-3">
              {filteredTasks.length === 0 ? (
                <div className="text-center py-12 bg-white rounded-2xl border border-dashed border-slate-200">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
                    <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                  </div>
                  <p className="text-slate-500 font-medium">No tasks found</p>
                  <p className="text-sm text-slate-400 mt-1">Add a new task to get started!</p>
                </div>
              ) : (
                filteredTasks.map(task => (
                  <TaskItem 
                    key={task.id} 
                    task={task} 
                    onToggle={toggleTask} 
                    onDelete={deleteTask}
                    onToggleSubTask={toggleSubTask}
                    onExpand={toggleExpand}
                  />
                ))
              )}
            </div>
          </div>

          {/* Sidebar (Timer & Info) */}
          <div className="lg:col-span-4 space-y-6">
            <PomodoroTimer />
            
            {/* Mini Stat Card */}
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl p-6 text-white shadow-lg">
                <h3 className="font-semibold text-lg mb-1">Weekly Progress</h3>
                <div className="flex items-end gap-2 mb-2">
                    <span className="text-4xl font-bold">{tasks.filter(t => t.completed).length}</span>
                    <span className="text-indigo-100 mb-1.5">tasks completed</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                   <div 
                     className="bg-white h-full rounded-full" 
                     style={{ width: `${tasks.length > 0 ? (tasks.filter(t => t.completed).length / tasks.length) * 100 : 0}%` }}
                   />
                </div>
            </div>

            {/* Tip Card */}
            <div className="bg-amber-50 rounded-2xl p-5 border border-amber-100 text-amber-900">
                <div className="flex items-start gap-3">
                    <div className="mt-0.5 text-amber-500">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-2.312-3-1-3 1.5 0 2.5 1 2.5 1s1 .43 2.5 1c1 0 2.5-1 2.5-1 1.07-2.143-.27-3.143-1.25-3C14 4 14 5 14 6c0 1.325.334 2 1.25 3 .916 1 2.25 1 2.25 3s-1.334 3-2.25 3c-.916 0-1.25-.675-1.25-2 0-.8-.334-1.2-1.25-1.2-1 0-1.25 1.2-1.25 2 0 1.325.334 2 1.25 3S16 16 16 18c0 1.38-.5 2-1 3-1.072 2.143-2.312 3-1 3-1.5 0-2.5-1-2.5-1s-1-.43-2.5-1c-1 0-2.5 1-2.5 1-1.07 2.143.27 3.143 1.25 3 1.072-.143 1.25-1.143 1.25-3 0-1.325-.334-2-1.25-3S4 21 4 19c0-1.38.5-2 1-3 1.072-2.143 2.312-3 1-3 1.5 0 2.5 1 2.5 1Z"/></svg>
                    </div>
                    <div>
                        <h4 className="font-semibold text-sm mb-1">Study Tip</h4>
                        <p className="text-sm opacity-90 leading-relaxed">
                            Use the <span className="font-semibold text-violet-600">AI Breakdown</span> button to split complex subjects into manageable chunks. Smaller tasks are easier to start!
                        </p>
                    </div>
                </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default App;