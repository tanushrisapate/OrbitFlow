import React, { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';
import { useToast } from '../../contexts/ToastContext';
import { deleteProject } from '../../services/api';

export default function DeleteProjectModal({ isOpen, onClose, project, onProjectDeleted }) {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(false);

  if (!project) return null;

  const handleDelete = async () => {
    setLoading(true);
    try {
      await deleteProject(project.id);
      addToast('Project deleted successfully', 'success');
      if (onProjectDeleted) {
        onProjectDeleted(project.id);
      }
      onClose();
    } catch (err) {
      console.error('Failed to delete project:', err);
      const errMsg = err.response?.data?.detail || 'Failed to delete project';
      addToast(typeof errMsg === 'string' ? errMsg : 'Failed to delete project', 'error');
    } finally {
      setLoading(false);
    }
  };

  const totalTasks = project.total_tasks ?? 0;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Project">
      <div className="space-y-4">
        <div className="flex items-start gap-3 p-3.5 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/50">
          <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">
              Permanent Deletion Warning
            </h4>
            <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
              Deleting this project will permanently remove it along with all of its associated tasks, comments, and project history. This action cannot be undone.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-surface-50 dark:bg-surface-800/50 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-surface-500">Project Name:</span>
            <span className="font-semibold text-surface-900 dark:text-white">{project.name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Status:</span>
            <span className="font-medium text-surface-700 dark:text-surface-300 capitalize">{project.status || 'Active'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-surface-500">Associated Tasks:</span>
            <span className={`font-semibold ${totalTasks > 0 ? 'text-amber-600 dark:text-amber-400' : 'text-surface-700 dark:text-surface-300'}`}>
              {totalTasks} task{totalTasks === 1 ? '' : 's'} will be deleted
            </span>
          </div>
        </div>

        <p className="text-xs text-surface-600 dark:text-surface-400">
          Are you sure you want to proceed with deleting <strong className="text-surface-900 dark:text-white">"{project.name}"</strong>?
        </p>

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="btn btn-ghost text-sm"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleDelete}
            disabled={loading}
            className="btn btn-danger text-sm inline-flex items-center gap-2"
          >
            {loading ? 'Deleting...' : 'Delete Project'}
          </button>
        </div>
      </div>
    </Modal>
  );
}
