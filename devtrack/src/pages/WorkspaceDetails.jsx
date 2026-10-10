import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeft, LayoutGrid, Users, Activity, Plus, AlertCircle, RefreshCw } from 'lucide-react';
import { getWorkspace, getProjects, createProject } from '../services/api';
import ErrorState from '../components/common/ErrorState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Avatar from '../components/common/Avatar';
import Badge from '../components/common/Badge';
import ProjectCard from '../components/dashboard/ProjectCard';
import Modal from '../components/common/Modal';
import { useToast } from '../contexts/ToastContext';

export default function WorkspaceDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [workspace, setWorkspace] = useState(null);
  const [projectsList, setProjectsList] = useState([]);
  const [isNewProjectModalOpen, setIsNewProjectModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({ name: '', description: '', icon: '📋' });
  const { addToast } = useToast();

  const fetchWorkspaceData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [wsRes, projRes] = await Promise.all([
        getWorkspace(id),
        getProjects(id)
      ]);
      setWorkspace(wsRes.data);
      setProjectsList(projRes.data);
    } catch (err) {
      console.error('Failed to load workspace details from API:', err);
      setError('Workspace not found or server error.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkspaceData();
  }, [id]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    try {
      const res = await createProject({
        name: newProject.name,
        description: newProject.description,
        workspace_id: parseInt(id, 10),
        icon: newProject.icon,
        color: '#6366f1',
        status: 'active',
        progress: 0
      });
      setProjectsList(prev => [res.data, ...prev]);
      setIsNewProjectModalOpen(false);
      setNewProject({ name: '', description: '', icon: '📋' });
      addToast('success', 'Project created successfully!');
    } catch (err) {
      console.error('Failed to create project:', err);
      addToast('error', 'Failed to create project');
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <SkeletonLoader className="h-8 w-48" />
        <SkeletonLoader className="h-32 w-full" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => <SkeletonLoader key={i} className="h-44 w-full" />)}
        </div>
      </div>
    );
  }

  if (error || !workspace) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <div className="card p-8 inline-block max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Workspace Not Found</h2>
          <p className="text-sm text-surface-500 mb-6">{error || 'The requested workspace does not exist.'}</p>
          <Link to="/app/workspaces" className="btn btn-primary">Back to Workspaces</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div>
        <Link to="/app/workspaces" className="inline-flex items-center text-xs font-medium text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 mb-3">
          <ChevronLeft className="w-3.5 h-3.5 mr-1" /> Back to Workspaces
        </Link>
        <div className="card p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="text-4xl p-3 rounded-2xl bg-primary-50 dark:bg-primary-950/40 text-primary-600">
              {workspace.icon || '🚀'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{workspace.name}</h1>
                <Badge variant="primary">ws-{workspace.id}</Badge>
              </div>
              <p className="text-sm text-surface-500 mt-1">{workspace.description || 'No description provided.'}</p>
            </div>
          </div>
          <button
            onClick={() => setIsNewProjectModalOpen(true)}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>New Project</span>
          </button>
        </div>
      </div>

      {/* Projects List */}
      <div>
        <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-4">Workspace Projects</h2>
        {projectsList.length === 0 ? (
          <div className="card p-8 text-center">
            <p className="text-surface-500 text-sm mb-4">No projects in this workspace yet.</p>
            <button onClick={() => setIsNewProjectModalOpen(true)} className="btn btn-primary">Create First Project</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projectsList.map((proj) => (
              <ProjectCard key={proj.id} project={proj} />
            ))}
          </div>
        )}
      </div>

      {/* Create Project Modal */}
      <Modal isOpen={isNewProjectModalOpen} onClose={() => setIsNewProjectModalOpen(false)} title="Create Project in Workspace">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Design System"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="input w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Description</label>
            <textarea
              placeholder="Project overview..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="input w-full text-sm h-24"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
            <button type="button" onClick={() => setIsNewProjectModalOpen(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">Create Project</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
