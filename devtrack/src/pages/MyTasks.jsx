import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, Calendar, AlertCircle, RefreshCw } from 'lucide-react';
import { getTasks, updateTaskStatus } from '../services/api';
import { useToast } from '../contexts/ToastContext';
import PriorityBadge from '../components/tasks/PriorityBadge';
import Badge from '../components/common/Badge';
import EmptyState from '../components/common/EmptyState';
import SkeletonLoader from '../components/common/SkeletonLoader';

export default function MyTasks() {
  const [filter, setFilter] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [taskList, setTaskList] = useState([]);
  const { addToast } = useToast();

  const fetchTasksData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTasks();
      setTaskList(res.data);
    } catch (err) {
      console.error('Failed to fetch tasks from API:', err);
      setError('Unable to load tasks from server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasksData();
  }, []);

  const handleToggleTaskStatus = async (task) => {
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    const prevTasks = [...taskList];
    setTaskList(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus } : t));

    try {
      await updateTaskStatus(task.id, newStatus);
      addToast(newStatus === 'done' ? 'Task marked as done!' : 'Task reopened', 'success');
    } catch (err) {
      console.error('Failed to update task status:', err);
      setTaskList(prevTasks);
      addToast('Failed to update task status', 'error');
    }
  };

  const filteredTasks = taskList.filter(task => {
    if (filter === 'All') return true;
    if (filter === 'To Do') return task.status === 'todo';
    if (filter === 'In Progress') return task.status === 'in-progress';
    if (filter === 'Completed') return task.status === 'done';
    return true;
  });

  const getStatusBadge = (status) => {
    switch(status) {
      case 'todo': return <Badge variant="default">To Do</Badge>;
      case 'in-progress': return <Badge variant="warning">In Progress</Badge>;
      case 'in-review': return <Badge variant="purple">In Review</Badge>;
      case 'done': return <Badge variant="success">Done</Badge>;
      default: return <Badge>{status}</Badge>;
    }
  };

  const tabs = ['All', 'To Do', 'In Progress', 'Completed'];

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900 dark:text-white">My Tasks</h1>
        <p className="text-sm text-surface-500 dark:text-surface-400">View and update all assigned action items</p>
      </div>

      <div className="flex border-b border-surface-200 dark:border-surface-800 gap-6">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setFilter(tab)}
            className={`pb-3 text-sm font-medium border-b-2 transition-colors ${
              filter === tab 
                ? 'border-primary-500 text-primary-600 dark:text-primary-400' 
                : 'border-transparent text-surface-500 hover:text-surface-700 dark:hover:text-surface-300'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {error ? (
        <div className="card p-8 text-center max-w-md mx-auto">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-surface-900 dark:text-white mb-2">Error Loading Tasks</h3>
          <p className="text-sm text-surface-500 mb-6">{error}</p>
          <button onClick={fetchTasksData} className="btn btn-primary inline-flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Retry
          </button>
        </div>
      ) : loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} className="h-16 w-full" />)}
        </div>
      ) : filteredTasks.length === 0 ? (
        <EmptyState 
          icon={CheckCircle2}
          title="No Tasks Found"
          description="No tasks match the selected filter in PostgreSQL database."
        />
      ) : (
        <div className="card divide-y divide-surface-100 dark:divide-surface-800">
          {filteredTasks.map(task => (
            <div key={task.id} className="p-4 flex items-center justify-between hover:bg-surface-50 dark:hover:bg-surface-800/50 transition-colors">
              <div className="flex items-center gap-3 min-w-0">
                <button
                  type="button"
                  onClick={() => handleToggleTaskStatus(task)}
                  className="shrink-0 p-1 -m-1 rounded-full hover:bg-surface-200 dark:hover:bg-surface-700/60 transition-colors cursor-pointer group/chk"
                  title={task.status === 'done' ? "Click to reopen task" : "Click to mark as done"}
                >
                  {task.status === 'done' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-500 transition-transform group-hover/chk:scale-110" />
                  ) : (
                    <Circle className="w-5 h-5 text-surface-400 hover:text-green-500 transition-all group-hover/chk:scale-110" />
                  )}
                </button>
                <div className="min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${task.status === 'done' ? 'line-through text-surface-400 dark:text-surface-500' : 'text-surface-900 dark:text-white'}`}>
                    {task.title}
                  </h4>
                  {task.description && <p className="text-xs text-surface-500 line-clamp-1">{task.description}</p>}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <PriorityBadge priority={task.priority} />
                {getStatusBadge(task.status)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
