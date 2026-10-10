import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle } from 'lucide-react';
import PriorityBadge from '../tasks/PriorityBadge';
import EmptyState from '../common/EmptyState';

const TaskList = ({ tasks = [] }) => {
  if (tasks.length === 0) {
    return <EmptyState type="tasks" message="No tasks found." />;
  }

  const displayTasks = tasks.slice(0, 5);

  return (
    <div className="card divide-y divide-surface-100 dark:divide-surface-800">
      {displayTasks.map(task => {
        const isDone = task.status === 'done';

        return (
          <Link 
            key={task.id} 
            to={`/app/projects/${task.project_id || task.projectId}`}
            className="flex items-center justify-between p-4 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors duration-150"
          >
            <div className="flex items-center gap-3">
              <div className="shrink-0">
                {isDone ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <Circle className="w-5 h-5 text-surface-300 dark:text-surface-600" />
                )}
              </div>
              <div>
                <h4 className={`text-sm font-medium ${isDone ? 'line-through text-surface-400' : 'text-surface-900 dark:text-white'}`}>
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
