import React from 'react';
import KanbanTaskCard from './KanbanTaskCard';

export default function KanbanColumn({ 
  title, 
  tasks, 
  status, 
  color, 
  onDrop, 
  onDragOver, 
  onAddTask, 
  onTaskClick,
  isDragOver
}) {
  return (
    <div 
      className={`bg-surface-100/50 dark:bg-surface-800/50 rounded-xl p-3 flex flex-col min-w-[280px] w-[280px] lg:w-full lg:flex-1 h-full max-h-full transition-colors ${isDragOver ? 'ring-2 ring-primary-500/50 bg-surface-200/50 dark:bg-surface-700/50' : ''}`}
      onDragOver={(e) => {
        e.preventDefault();
        if (onDragOver) onDragOver(status);
      }}
      onDrop={(e) => {
        if (onDrop) onDrop(e, status);
      }}
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
          <h3 className="font-semibold text-sm uppercase tracking-wide text-surface-700 dark:text-surface-300">
            {title}
          </h3>
          <span className="text-xs bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-400 px-1.5 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto min-h-[150px] flex flex-col gap-2.5 pb-2 kanban-column-scroll">
        {tasks.length === 0 ? (
          <div className="flex-1 border-2 border-dashed border-surface-200 dark:border-surface-700 rounded-lg flex items-center justify-center text-surface-400 dark:text-surface-500 text-sm p-4 text-center">
            No tasks
          </div>
        ) : (
          tasks.map(task => (
            <KanbanTaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick}
            />
          ))
        )}
      </div>
      
      <button 
        onClick={() => onAddTask && onAddTask(status)}
        className="mt-2 text-sm font-medium text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 w-full text-left py-2 px-1 transition-colors flex items-center"
      >
        + Add Task
      </button>
    </div>
  );
}
