import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, FolderKanban, ClipboardList, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { getAnalytics, getProjects, getTasks, getActivities } from '../services/api';

import StatCard from '../components/dashboard/StatCard';
import ProjectCard from '../components/dashboard/ProjectCard';
import TaskList from '../components/dashboard/TaskList';
import ActivityFeed from '../components/dashboard/ActivityFeed';
import CreateProjectModal from '../components/projects/CreateProjectModal';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

const Dashboard = () => {
  const { user } = useAuth();
  const activeUser = user || { name: 'Tanushri' };
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [activeProjects, setActiveProjects] = useState([]);
  const [myTasks, setMyTasks] = useState([]);
  const [activityLogs, setActivityLogs] = useState([]);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [analyticsRes, projRes, taskRes, actRes] = await Promise.all([
        getAnalytics(),
        getProjects(),
        getTasks(),
        getActivities(undefined, 5)
      ]);
      
      setStats(analyticsRes.data);
      setActiveProjects(projRes.data.slice(0, 4));
      setMyTasks(taskRes.data.slice(0, 5));
      setActivityLogs(actRes.data);
    } catch (err) {
      console.error('Failed to load dashboard data from API:', err);
      setError('Unable to load dashboard data. Please verify backend service.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <SkeletonLoader className="h-8 w-48" />
          <SkeletonLoader className="h-10 w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} className="h-28 w-full" />)}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <div className="card p-8 inline-block max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">API Connection Error</h2>
          <p className="text-sm text-surface-500 mb-6">{error}</p>
          <button 
            onClick={fetchDashboardData}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry Connection
          </button>
        </div>
      </div>
    );
  }

  const statCards = [
    {
      title: 'Total Projects',
      value: stats?.totalProjects ?? 0,
      icon: FolderKanban,
      color: 'indigo',
    },
    {
      title: 'Total Tasks',
      value: stats?.totalTasks ?? 0,
      icon: ClipboardList,
      color: 'amber',
    },
    {
      title: 'Completed Tasks',
      value: stats?.completedTasks ?? 0,
      icon: CheckCircle2,
      color: 'emerald',
    },
    {
      title: 'Overdue Tasks',
      value: stats?.overdueTasks ?? 0,
      icon: AlertCircle,
      color: 'rose',
    },
  ];

  return (
    <div className="p-6 space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">
            Welcome back, {typeof activeUser.name === 'string' ? activeUser.name : (activeUser.name?.name || 'Tanushri')} 👋
          </h1>
          <p className="text-surface-500 dark:text-surface-400 text-sm mt-1">
            Here's what's happening with your workspace today.
          </p>
        </div>
        <button
          onClick={() => setIsProjectModalOpen(true)}
          className="btn btn-primary inline-flex items-center gap-2 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Project</span>
        </button>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {statCards.map((stat, idx) => (
          <StatCard key={idx} {...stat} />
        ))}
      </div>

      {/* Projects Section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Active Projects</h2>
          <Link to="/app/projects" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
            View all projects →
          </Link>
        </div>
        {activeProjects.length === 0 ? (
          <EmptyState 
            type="projects"
            title="No Active Projects"
            description="You don't have any active projects in the database yet. Create your first project to get started!"
            action={{
              label: "Create Project",
              onClick: () => setIsProjectModalOpen(true)
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Bottom Grid: Recent Tasks & Activity Feed */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Tasks</h2>
            <Link to="/app/tasks" className="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400">
              View all tasks →
            </Link>
          </div>
          {myTasks.length === 0 ? (
            <EmptyState 
              type="tasks"
              title="No Recent Tasks"
              description="No tasks available in PostgreSQL database."
            />
          ) : (
            <TaskList tasks={myTasks} />
          )}
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white">Recent Activity</h2>
          <ActivityFeed activities={activityLogs} />
        </div>
      </div>

      {/* Modal */}
      <CreateProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
        onProjectCreated={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;
