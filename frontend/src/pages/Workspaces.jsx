import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, MoreVertical, LayoutGrid, Users, Edit2, Trash2, AlertCircle, RefreshCw } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useWorkspace } from '../contexts/WorkspaceContext';
import Avatar from '../components/common/Avatar';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';
import Modal from '../components/common/Modal';
import Dropdown, { DropdownItem } from '../components/common/Dropdown';

export default function Workspaces() {
  const { workspaces: workspaceList, loading, error, createWorkspace: ctxCreateWorkspace, deleteWorkspace: ctxDeleteWorkspace, refreshWorkspaces } = useWorkspace();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newWorkspace, setNewWorkspace] = useState({ name: '', description: '', emoji: '🚀' });
  const { addToast } = useToast();
  const navigate = useNavigate();

  const emojis = ['🚀', '💼', '🎨', '💻', '📈', '🔥', '✨', '⚡'];

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newWorkspace.name.trim()) return;

    try {
      await ctxCreateWorkspace({
        name: newWorkspace.name,
        description: newWorkspace.description,
        icon: newWorkspace.emoji,
        color: '#6366f1',
      });
      setIsCreateModalOpen(false);
      setNewWorkspace({ name: '', description: '', emoji: '🚀' });
      addToast('Workspace created successfully!', 'success');
    } catch (err) {
      console.error('Create workspace error:', err);
      addToast('Failed to create workspace', 'error');
    }
  };

  const handleDeleteWorkspace = async (id, e) => {
    e.stopPropagation();
    e.preventDefault();
    if (!window.confirm('Are you sure you want to delete this workspace and all associated projects?')) return;

    try {
      await ctxDeleteWorkspace(id);
      addToast('Workspace deleted successfully!', 'success');
    } catch (err) {
      console.error('Delete workspace error:', err);
      addToast('Failed to delete workspace', 'error');
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Workspaces</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">Manage team workspaces and resource permissions</p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>New Workspace</span>
        </button>
      </div>

      {/* Main Content */}
      {error ? (
        <div className="card p-8 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Error Loading Workspaces</h3>
          <p className="text-sm text-surface-500 mb-6">{error}</p>
          <button onClick={fetchWorkspaces} className="btn btn-primary inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <SkeletonLoader key={i} className="h-56 w-full" />
          ))}
        </div>
      ) : workspaceList.length === 0 ? (
        <EmptyState
          type="workspaces"
          title="No Workspaces Found"
          description="You don't have any workspaces yet. Create your first workspace to start collaborating!"
          action={{
            label: 'Create Workspace',
            onClick: () => setIsCreateModalOpen(true)
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {workspaceList.map((workspace) => (
            <div
              key={workspace.id}
              onClick={() => navigate(`/app/workspaces/${workspace.id}`)}
              className="card p-6 hover:-translate-y-0.5 hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="text-3xl p-2 rounded-xl bg-surface-100 dark:bg-surface-800">
                      {workspace.icon || '🚀'}
                    </div>
                    <div>
                      <h3 className="font-bold text-surface-900 dark:text-white text-lg">{workspace.name}</h3>
                      <span className="text-xs text-surface-400">ID: ws-{workspace.id}</span>
                    </div>
                  </div>
                  <button
                    onClick={(e) => handleDeleteWorkspace(workspace.id, e)}
                    className="p-1.5 text-surface-400 hover:text-red-600 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                    title="Delete Workspace"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-sm text-surface-500 dark:text-surface-400 line-clamp-2 mb-6">
                  {workspace.description || 'No description provided.'}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-surface-100 dark:border-surface-800 text-xs text-surface-500">
                <span className="flex items-center gap-1.5 font-medium">
                  <LayoutGrid className="w-4 h-4 text-primary-500" /> PostgreSQL Active
                </span>
                <span className="text-primary-600 dark:text-primary-400 font-semibold group-hover:translate-x-0.5 transition-transform">
                  Open →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal isOpen={isCreateModalOpen} onClose={() => setIsCreateModalOpen(false)} title="Create Workspace">
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Workspace Icon</label>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {emojis.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setNewWorkspace({ ...newWorkspace, emoji })}
                  className={`text-xl p-2 rounded-lg border ${
                    newWorkspace.emoji === emoji ? 'border-primary-500 bg-primary-50 dark:bg-primary-950/30' : 'border-surface-200 dark:border-surface-700'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Workspace Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Engineering Team"
              value={newWorkspace.name}
              onChange={(e) => setNewWorkspace({ ...newWorkspace, name: e.target.value })}
              className="input w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Description</label>
            <textarea
              placeholder="Describe workspace scope..."
              value={newWorkspace.description}
              onChange={(e) => setNewWorkspace({ ...newWorkspace, description: e.target.value })}
              className="input w-full text-sm h-24"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
            <button type="button" onClick={() => setIsCreateModalOpen(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">Create Workspace</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
