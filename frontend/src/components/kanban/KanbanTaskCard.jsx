import React from 'react';
import { CalendarDays } from 'lucide-react';
import PriorityBadge from '../tasks/PriorityBadge';
import Avatar from '../common/Avatar';

export default function KanbanTaskCard({ task, onClick, onDragStart, onDragEnd }) {
  const assigneeName = typeof task.assignee === 'string' 
    ? task.assignee 
    : (task.assignee?.name || task.assignee_id || 'Unassigned');
  
  const handleDragStart = (e) => {
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', String(task.id));
      e.dataTransfer.effectAllowed = 'move';
    }
    if (onDragStart) onDragStart(e, task);
  };
  
  const handleDragEnd = (e) => {
    if (onDragEnd) onDragEnd(e, task);
  };

  return (
    <div
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onClick={() => onClick && onClick(task)}
      className="card p-3.5 hover:shadow-md transition-all duration-200 cursor-grab active:cursor-grabbing border border-surface-200/80 dark:border-surface-800 bg-white dark:bg-surface-900 group select-none w-full min-w-0"
    >
      <div className="flex items-start justify-between gap-2 mb-2">
        <h4 className="text-xs font-semibold text-surface-900 dark:text-surface-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors line-clamp-2 break-words min-w-0 flex-1">
          {task.title}
        </h4>
        <div className="shrink-0">
          <PriorityBadge priority={task.priority} />
        </div>
      </div>

      {task.description && (
        <p className="text-[11px] text-surface-500 dark:text-surface-400 line-clamp-2 break-words mb-3">
          {task.description}
        </p>
      )}

      <div className="flex items-center justify-between pt-2.5 border-t border-surface-100 dark:border-surface-800/60 text-[11px] text-surface-400 gap-2">
        <div className="flex items-center gap-1.5 min-w-0 flex-1">
          <Avatar name={assigneeName} size="xs" />
          <span className="text-[11px] font-medium text-surface-600 dark:text-surface-300 truncate">{assigneeName}</span>
        </div>

        {task.due_date && (
          <div className="flex items-center gap-1 text-[10px] font-medium text-surface-500 shrink-0">
            <CalendarDays className="w-3 h-3 text-surface-400" />
            <span>{task.due_date}</span>
          </div>
        )}
      </div>
    </div>
  );
}
