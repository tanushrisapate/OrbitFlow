import React from 'react';
import { Link } from 'react-router-dom';
import { Pencil, Trash2 } from 'lucide-react';
import Badge from '../common/Badge';
import ProgressBar from '../common/ProgressBar';

const ProjectCard = ({ project, onEdit, onDelete }) => {
  const { id, name, description, progress, status, icon, total_tasks, completed_tasks } = project;

  const statusVariants = {
    active: 'success',
    completed: 'primary',
    planning: 'default',
    archived: 'default'
  };

  const total = total_tasks ?? 0;
  const completed = completed_tasks ?? 0;

  return (
    <Link to={`/app/projects/${id}`} className="block h-full">
      <div className="card p-5 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 h-full flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start mb-4 gap-2">
            <div className="flex items-center gap-3 min-w-0">
              <div className="text-2xl shrink-0">{icon || '📋'}</div>
              <div className="min-w-0">
                <h3 className="font-semibold text-surface-900 dark:text-surface-50 line-clamp-1">{name}</h3>
                <Badge variant={statusVariants[status?.toLowerCase()] || 'default'} className="mt-1">{status || 'Active'}</Badge>
              </div>
            </div>

            {(onEdit || onDelete) && (
              <div 
                className="flex items-center gap-1 shrink-0"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
              >
                {onEdit && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit(project);
                    }}
                    className="p-1.5 text-surface-400 hover:text-primary-600 dark:hover:text-primary-400 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    title="Edit Project"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
                {onDelete && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(project);
                    }}
                    className="p-1.5 text-surface-400 hover:text-red-600 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    title="Delete Project"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            )}
          </div>
          
          <p className="text-xs text-surface-500 dark:text-surface-400 line-clamp-2 mb-5">
            {description || 'No description provided.'}
          </p>
        </div>

        <div className="space-y-2 pt-3 border-t border-surface-100 dark:border-surface-800">
          <div className="flex justify-between text-xs text-surface-500">
            <span>Progress</span>
            <span className="font-semibold text-surface-700 dark:text-surface-300">{progress || 0}%</span>
          </div>
          <ProgressBar progress={progress || 0} size="sm" />
          <div className="flex justify-between text-[11px] text-surface-400 pt-1">
            <span>{completed} of {total} tasks completed</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default ProjectCard;
