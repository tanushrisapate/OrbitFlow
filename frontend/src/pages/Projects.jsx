import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Search, FolderKanban, AlertCircle, RefreshCw } from 'lucide-react';
import { getProjects, createProject } from '../services/api';
import { useWorkspace } from '../contexts/WorkspaceContext';
import ProjectCard from '../components/dashboard/ProjectCard';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';
import Modal from '../components/common/Modal';
import EditProjectModal from '../components/projects/EditProjectModal';
import DeleteProjectModal from '../components/projects/DeleteProjectModal';
import { useToast } from '../contexts/ToastContext';

export default function Projects() {
  const { workspaces, currentWorkspace } = useWorkspace();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectList, setProjectList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [deletingProject, setDeletingProject] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    workspace_id: '',
    icon: '📋',
    color: '#4f46e5',
  });
  const { addToast } = useToast();

  const fetchProjectsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const projRes = await getProjects(currentWorkspace?.id);
      setProjectList(projRes.data || []);
      if (workspaces.length > 0) {
        setNewProject(prev => ({ 
          ...prev, 
          workspace_id: currentWorkspace?.id || workspaces[0].id 
        }));
      }
    } catch (err) {
      console.error('Failed to load projects from API:', err);
      setError('Unable to load projects from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectsData();
  }, [currentWorkspace?.id, workspaces.length]);

  const handleCreateProject = async (e) => {
    e.preventDefault();
    const wsId = newProject.workspace_id || currentWorkspace?.id || (workspaces[0]?.id);
    if (!newProject.name.trim() || !wsId) return;

    try {
      const res = await createProject({
        name: newProject.name.trim(),
        description: newProject.description ? newProject.description.trim() : null,
        workspace_id: parseInt(wsId, 10),
        icon: newProject.icon,
        color: newProject.color,
        status: 'active',
        progress: 0
      });
      setProjectList(prev => [res.data, ...prev]);
      setIsModalOpen(false);
      setNewProject(prev => ({ ...prev, name: '', description: '' }));
      addToast('Project created successfully!', 'success');
    } catch (err) {
      console.error('Create project error:', err);
      addToast('Failed to create project', 'error');
    }
  };

  const handleOpenCreateModal = () => {
    if (workspaces.length === 0) {
      navigate('/app/workspaces');
    } else {
      setNewProject(prev => ({
        ...prev,
        workspace_id: currentWorkspace?.id || workspaces[0]?.id || ''
      }));
      setIsModalOpen(true);
    }
  };

  const filteredProjects = projectList.filter((project) => {
    const matchesFilter = filter === 'All' || project.status?.toLowerCase() === filter.toLowerCase();
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Projects</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">
            {currentWorkspace 
              ? `Workspace: ${currentWorkspace.name}` 
              : "Manage and organize team deliverables"}
          </p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className="btn btn-primary inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          <span>{workspaces.length === 0 ? "Create Workspace" : "New Project"}</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 card p-4">
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-surface-400" />
          <input
            type="text"
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="input pl-9 text-sm w-full"
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {['All', 'Active', 'Completed', 'Planning'].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors whitespace-nowrap ${
                filter === status
                  ? 'bg-primary-600 text-white dark:bg-primary-500'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Content state */}
      {error ? (
        <div className="card p-8 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Failed to load projects</h3>
          <p className="text-sm text-surface-500 mb-6">{error}</p>
          <button onClick={fetchProjectsData} className="btn btn-primary inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <SkeletonLoader key={i} className="h-48 w-full" />
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <EmptyState
          type="projects"
          title="No Workspaces Available"
          description="Create a workspace first to organize your projects and team deliverables."
          action={{
            label: 'Create Workspace',
            onClick: () => navigate('/app/workspaces')
          }}
        />
      ) : filteredProjects.length === 0 ? (
        <EmptyState
          type="projects"
          title="No Projects Found"
          description={searchQuery ? 'No projects match your search query.' : 'There are no projects in this workspace yet.'}
          action={{
            label: 'Create Project',
            onClick: () => setIsModalOpen(true)
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onEdit={(proj) => {
                setEditingProject(proj);
                setIsEditModalOpen(true);
              }}
              onDelete={(proj) => {
                setDeletingProject(proj);
                setIsDeleteModalOpen(true);
              }}
            />
          ))}
        </div>
      )}

      {/* Create Project Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Create New Project">
        <form onSubmit={handleCreateProject} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Project Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Orbit Flow App"
              value={newProject.name}
              onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
              className="input w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Target Workspace *</label>
            <select
              value={newProject.workspace_id}
              onChange={(e) => setNewProject({ ...newProject, workspace_id: e.target.value })}
              className="input w-full text-sm"
              required
            >
              {workspaces.map((ws) => (
                <option key={ws.id} value={ws.id}>{ws.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Description</label>
            <textarea
              placeholder="Project goals and overview..."
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="input w-full text-sm h-24"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
            <button type="button" onClick={() => setIsModalOpen(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">Create Project</button>
          </div>
        </form>
      </Modal>

      {/* Edit Project Modal */}
      <EditProjectModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingProject(null);
        }}
        project={editingProject}
        onProjectUpdated={(updatedProject) => {
          setProjectList(prev => prev.map(p => p.id === updatedProject.id ? updatedProject : p));
        }}
      />

      {/* Delete Project Confirmation Modal */}
      <DeleteProjectModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingProject(null);
        }}
        project={deletingProject}
        onProjectDeleted={(deletedId) => {
          setProjectList(prev => prev.filter(p => p.id !== deletedId));
        }}
      />
    </div>
  );
}
