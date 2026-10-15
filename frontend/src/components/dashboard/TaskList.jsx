import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import PriorityBadge from '../tasks/PriorityBadge';
import EmptyState from '../common/EmptyState';
import { updateTaskStatus } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const TaskList = ({ tasks = [], onTaskToggled }) => {
  const { addToast } = useToast();
  const [localStatuses, setLocalStatuses] = useState({});

  if (tasks.length === 0) {
    return <EmptyState type="tasks" message="No tasks found." />;
  }

  const handleToggle = async (e, task) => {
    e.preventDefault();
    e.stopPropagation();

    const currentStatus = localStatuses[task.id] || task.status;
    const newStatus = currentStatus === 'done' ? 'todo' : 'done';

    // Optimistic local update
    setLocalStatuses(prev => ({ ...prev, [task.id]: newStatus }));

    try {
      const res = await updateTaskStatus(task.id, newStatus);
      addToast(newStatus === 'done' ? 'Task marked as done!' : 'Task marked as incomplete', 'success');
      if (onTaskToggled) {
        onTaskToggled(res.data);
      }
    } catch (err) {
      console.error('Failed to toggle task status:', err);
      // Revert optimistic state
      setLocalStatuses(prev => ({ ...prev, [task.id]: currentStatus }));
      const errMsg = err.response?.data?.detail || 'Failed to update task status';
      addToast(typeof errMsg === 'string' ? errMsg : 'Failed to update task status', 'error');
    }
  };

  const displayTasks = tasks.slice(0, 5);

  return (
    <div className="card divide-y divide-surface-100 dark:divide-surface-800">
      {displayTasks.map(task => {
        const effectiveStatus = localStatuses[task.id] || task.status;
        const isDone = effectiveStatus === 'done';

        return (
          <Link 
            key={task.id} 
            to={`/app/projects/${task.project_id || task.projectId}`}
            className="flex items-center justify-between p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors duration-150 group"
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={(e) => handleToggle(e, task)}
                className="shrink-0 p-1 -m-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700/60 transition-colors cursor-pointer group/chk"
                title={isDone ? "Click to reopen task" : "Click to mark as done"}
              >
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500 transition-transform group-hover/chk:scale-110" />
                ) : (
                  <Circle className="w-5 h-5 text-surface-300 dark:text-surface-600 hover:text-green-500 dark:hover:text-green-400 transition-all group-hover/chk:scale-110" />
                )}
              </button>
              <div className="min-w-0">
                <h4 className={`text-sm font-medium transition-colors truncate ${isDone ? 'line-through text-surface-400 dark:text-surface-500' : 'text-surface-900 dark:text-white'}`}>
                  {task.title}
                </h4>
                {task.description && (
                  <p className="text-xs text-surface-400 line-clamp-1">{task.description}</p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <PriorityBadge priority={task.priority} />
            </div>
          </Link>
        );
      })}
    </div>
  );
};

export default TaskList;
