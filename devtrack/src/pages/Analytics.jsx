import React, { useState, useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';
import { getAnalytics } from '../services/api';
import Avatar from '../components/common/Avatar';
import ProgressBar from '../components/common/ProgressBar';
import SkeletonLoader from '../components/common/SkeletonLoader';
import EmptyState from '../components/common/EmptyState';

export default function Analytics() {
  const [period, setPeriod] = useState('Last 7 days');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [analytics, setAnalytics] = useState(null);

  const periods = ['Last 7 days', 'Last 30 days', 'Last 3 months'];

  const fetchAnalyticsData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getAnalytics(undefined, period);
      setAnalytics(res.data);
    } catch (err) {
      console.error('Failed to load analytics from API:', err);
      setError('Unable to load analytics data from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalyticsData();
  }, [period]);

  const statusColors = {
    todo: '#6366f1',
    inProgress: '#f59e0b',
    inReview: '#a855f7',
    done: '#22c55e',
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <SkeletonLoader className="w-48 h-8" />
          <SkeletonLoader className="w-48 h-10" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <SkeletonLoader className="h-64 w-full" />
          <SkeletonLoader className="h-64 w-full" />
          <SkeletonLoader className="h-64 w-full" />
        </div>
      </div>
    );
  }

  if (error || !analytics) {
    return (
      <div className="p-6 max-w-7xl mx-auto text-center">
        <div className="card p-8 inline-block max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Analytics Error</h2>
          <p className="text-sm text-surface-500 mb-6">{error || 'No analytics data available.'}</p>
          <button 
            onClick={fetchAnalyticsData}
            className="btn btn-primary inline-flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" /> Retry Loading
          </button>
        </div>
      </div>
    );
  }

  const tasksByStatus = analytics.tasksByStatus || { todo: 0, inProgress: 0, inReview: 0, done: 0 };
  const totalTasks = (tasksByStatus.todo || 0) + (tasksByStatus.inProgress || 0) + (tasksByStatus.inReview || 0) + (tasksByStatus.done || 0);
  
  const todoPct = totalTasks > 0 ? (tasksByStatus.todo / totalTasks) * 100 : 0;
  const inProgPct = totalTasks > 0 ? (tasksByStatus.inProgress / totalTasks) * 100 : 0;
  const inRevPct = totalTasks > 0 ? (tasksByStatus.inReview / totalTasks) * 100 : 0;
  
  const stop1 = `${todoPct}%`;
  const stop2 = `${todoPct + inProgPct}%`;
  const stop3 = `${todoPct + inProgPct + inRevPct}%`;
  
  const conicGradient = totalTasks > 0 
    ? `conic-gradient(${statusColors.todo} 0% ${stop1}, ${statusColors.inProgress} ${stop1} ${stop2}, ${statusColors.inReview} ${stop2} ${stop3}, ${statusColors.done} ${stop3} 100%)`
    : `conic-gradient(#e2e8f0 0% 100%)`;

  const weeklyData = analytics.taskCompletionWeekly || [];
  const maxWeekly = Math.max(1, ...weeklyData.map(d => Math.max(d.created || 0, d.completed || 0)));

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
        <div>
          <h1 className="text-2xl font-bold text-surface-900 dark:text-white">Analytics</h1>
          <p className="text-sm text-surface-500 dark:text-surface-400">Track team performance and project velocity</p>
        </div>
        <div className="flex items-center gap-2">
          {periods.map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
                period === p
                  ? 'bg-primary-600 text-white dark:bg-primary-500'
                  : 'bg-surface-100 text-surface-600 hover:bg-surface-200 dark:bg-surface-800 dark:text-surface-300'
              }`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Row 1 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Status Distribution */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white mb-4">Task Status Distribution</h3>
          {totalTasks === 0 ? (
            <EmptyState title="No Task Status Data" description="No tasks present in database." />
          ) : (
            <div className="flex flex-col items-center">
              <div className="relative w-40 h-40 rounded-full flex items-center justify-center mb-6" style={{ background: conicGradient }}>
                <div className="w-28 h-28 bg-white dark:bg-surface-900 rounded-full flex flex-col items-center justify-center">
                  <span className="text-2xl font-bold text-surface-900 dark:text-white">{totalTasks}</span>
                  <span className="text-xs text-surface-500">Total Tasks</span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full text-xs">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-primary-500" />
                  <span className="text-surface-600 dark:text-surface-400">To Do: {tasksByStatus.todo}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-amber-500" />
                  <span className="text-surface-600 dark:text-surface-400">In Progress: {tasksByStatus.inProgress}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-purple-500" />
                  <span className="text-surface-600 dark:text-surface-400">In Review: {tasksByStatus.inReview}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  <span className="text-surface-600 dark:text-surface-400">Done: {tasksByStatus.done}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Weekly Completion Trend */}
        <div className="card p-5 md:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Task Activity (Past 7 Days)</h3>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-primary-500" /> Created</span>
              <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-green-500" /> Completed</span>
            </div>
          </div>
          <div className="h-48 flex items-end justify-between gap-2 pt-6 pb-2 border-b border-surface-100 dark:border-surface-800">
            {weeklyData.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group relative">
                <div className="w-full flex items-end justify-center gap-1 h-full">
                  <div 
                    className="w-3.5 bg-primary-500/80 hover:bg-primary-500 rounded-t transition-all" 
                    style={{ height: `${(d.created / maxWeekly) * 100}%` }}
                    title={`Created: ${d.created}`}
                  />
                  <div 
                    className="w-3.5 bg-green-500/80 hover:bg-green-500 rounded-t transition-all" 
                    style={{ height: `${(d.completed / maxWeekly) * 100}%` }}
                    title={`Completed: ${d.completed}`}
                  />
                </div>
                <span className="text-[11px] text-surface-500 font-medium">{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Grid Row 2: Project Progress & Team Workload */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Progress */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Project Progress</h3>
          {(!analytics.projectProgress || analytics.projectProgress.length === 0) ? (
            <EmptyState title="No Projects" description="No project progress data available." />
          ) : (
            <div className="space-y-4">
              {analytics.projectProgress.map((p) => (
                <div key={p.id} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-medium text-surface-800 dark:text-surface-200">{p.name}</span>
                    <span className="text-surface-500">{p.progress}% ({p.completed_tasks}/{p.total_tasks} tasks)</span>
                  </div>
                  <ProgressBar progress={p.progress} size="sm" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Team Workload */}
        <div className="card p-5 space-y-4">
          <h3 className="text-sm font-semibold text-surface-900 dark:text-white">Team Workload</h3>
          {(!analytics.teamWorkload || analytics.teamWorkload.length === 0) ? (
            <EmptyState title="No Team Members" description="No team workload records found." />
          ) : (
            <div className="space-y-3">
              {analytics.teamWorkload.map((m) => (
                <div key={m.user_id || m.userId} className="flex items-center justify-between p-2.5 rounded-lg bg-surface-50 dark:bg-surface-800/50">
                  <div className="flex items-center gap-3">
                    <Avatar name={m.name} size="sm" />
                    <div>
                      <div className="text-xs font-medium text-surface-900 dark:text-white">{m.name}</div>
                      <div className="text-[11px] text-surface-500">{m.completed} of {m.tasks} tasks completed</div>
                    </div>
                  </div>
                  <div className="text-xs font-semibold text-primary-600 dark:text-primary-400">
                    {m.tasks} tasks
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
