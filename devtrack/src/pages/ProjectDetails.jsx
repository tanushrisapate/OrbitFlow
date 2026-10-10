import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, CheckSquare, ListTodo, Clock, AlertCircle } from 'lucide-react';
import { getProject } from '../services/api';
import KanbanBoard from '../components/kanban/KanbanBoard';
import ProgressBar from '../components/common/ProgressBar';
import Badge from '../components/common/Badge';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('board');
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProjectData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getProject(id);
        setProject(response.data);
      } catch (err) {
        console.error('Failed to load project from API:', err);
        setError('Project not found or server error.');
      } finally {
        setLoading(false);
      }
    };
    fetchProjectData();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto h-full flex flex-col">
        <SkeletonLoader className="h-8 w-32" />
        <SkeletonLoader className="h-24 w-full" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} className="h-24 w-full" />)}
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <div className="card p-8 inline-block max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Project Not Found</h2>
          <p className="text-sm text-surface-500 mb-6">{error || 'The requested project does not exist.'}</p>
          <Link to="/app/projects" className="btn btn-primary">Back to Projects</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div>
        <Link to="/app/projects" className="inline-flex items-center text-xs font-medium text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 mb-3">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" /> Back to Projects
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl p-2 rounded-xl bg-surface-100 dark:bg-surface-800">{project.icon || '📋'}</span>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-bold text-surface-900 dark:text-white">{project.name}</h1>
                <Badge variant="primary">{project.status}</Badge>
              </div>
              <p className="text-xs text-surface-500 mt-1">{project.description || 'No description provided.'}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-surface-200 dark:border-surface-800 gap-6">
        <button
          onClick={() => setActiveTab('board')}
          className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
            activeTab === 'board' ? 'border-primary-500 text-primary-600 dark:text-primary-400' : 'border-transparent text-surface-500'
          }`}
        >
          Kanban Board
        </button>
      </div>

      {/* Main Board */}
      <div className="flex-1 min-h-0">
        {activeTab === 'board' && <KanbanBoard projectId={project.id} />}
      </div>
    </div>
  );
}
