import React from 'react';
import { Plus } from 'lucide-react';
import KanbanTaskCard from './KanbanTaskCard';

export default function KanbanColumn({ 
  column,
  title, 
  tasks = [], 
  status, 
  color, 
  onDrop, 
  onDragOver, 
  onDragLeave,
  onDragStart,
  onDragEnd,
  onAddTask, 
  onTaskClick,
  isDragOver
}) {
  const colTitle = title || column?.title || 'Column';
  const colStatus = status || column?.id || '';
  const colColor = color || column?.color || '#6366f1';

  return (
    <div 
      className={`flex flex-col rounded-xl p-3 bg-surface-100/60 dark:bg-surface-800/50 border border-surface-200/60 dark:border-surface-700/50 w-[280px] sm:w-[300px] xl:w-auto xl:flex-1 shrink-0 xl:shrink min-w-[270px] h-full max-h-full transition-all duration-150 ${
        isDragOver 
          ? 'ring-2 ring-primary-500/70 bg-primary-50/20 dark:bg-primary-950/20 border-primary-400 dark:border-primary-600' 
          : ''
      }`}
      onDragOver={(e) => {
        if (onDragOver) onDragOver(e, colStatus);
      }}
      onDragLeave={(e) => {
        if (onDragLeave) onDragLeave(e, colStatus);
      }}
      onDrop={(e) => {
        if (onDrop) onDrop(e, colStatus);
      }}
    >
      {/* Column Header */}
      <div className="flex items-center justify-between mb-3 px-1 shrink-0">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: colColor }} />
          <h3 className="font-semibold text-xs tracking-wider uppercase text-surface-700 dark:text-surface-300 truncate">
            {colTitle}
          </h3>
          <span className="text-[11px] bg-surface-200 dark:bg-surface-700 text-surface-600 dark:text-surface-300 px-1.5 py-0.5 rounded-full font-medium">
            {tasks.length}
          </span>
        </div>
      </div>
      
      {/* Cards container */}
      <div className="flex-1 overflow-y-auto min-h-[160px] flex flex-col gap-2.5 pb-2 kanban-column-scroll">
        {tasks.length === 0 ? (
          <div className="flex-1 min-h-[140px] border-2 border-dashed border-surface-200 dark:border-surface-700/60 rounded-xl flex flex-col items-center justify-center text-surface-400 dark:text-surface-500 text-xs p-4 text-center">
            <span>No tasks in this column</span>
            <span className="text-[11px] text-surface-400/80 mt-1">Drop a task here</span>
          </div>
        ) : (
          tasks.map(task => (
            <KanbanTaskCard 
              key={task.id} 
              task={task} 
              onClick={onTaskClick}
              onDragStart={onDragStart}
              onDragEnd={onDragEnd}
            />
          ))
        )}
      </div>
      
      {/* Add Task footer button */}
      <button 
        type="button"
        onClick={() => onAddTask && onAddTask(colStatus)}
        className="mt-2 shrink-0 text-xs font-medium text-surface-500 hover:text-primary-600 dark:text-surface-400 dark:hover:text-primary-400 w-full text-left py-2 px-2 rounded-lg hover:bg-surface-200/50 dark:hover:bg-surface-700/50 transition-colors flex items-center gap-1.5"
      >
        <Plus className="w-3.5 h-3.5" />
        <span>Add Task</span>
      </button>
    </div>
  );
}
