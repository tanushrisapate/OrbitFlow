import React, { useState, useEffect } from 'react';
import { X, MoreHorizontal, CalendarDays, Send } from 'lucide-react';
import Avatar from '../common/Avatar';
import Badge from '../common/Badge';
import PriorityBadge from './PriorityBadge';
import { useToast } from '../../contexts/ToastContext';
import { updateTaskStatus, deleteTask, getComments, createComment } from '../../services/api';

const STATUSES = [
  { id: 'todo', label: 'To Do' },
  { id: 'in-progress', label: 'In Progress' },
  { id: 'in-review', label: 'In Review' },
  { id: 'done', label: 'Done' }
];

export default function TaskDetails({ task, isOpen, onClose, onTaskUpdated, onTaskDeleted }) {
  const [commentText, setCommentText] = useState('');
  const [comments, setComments] = useState([]);
  const [isClosing, setIsClosing] = useState(false);
  const toastContext = useToast();
  const addToast = toastContext?.addToast || (() => {});

  useEffect(() => {
    if (task && isOpen) {
      getComments(task.id)
        .then(res => setComments(res.data))
        .catch(() => setComments([]));
    }
  }, [task, isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen || !task) return null;

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 200);
  };

  const handleStatusChange = async (newStatus) => {
    try {
      const res = await updateTaskStatus(task.id, newStatus);
      if (onTaskUpdated) onTaskUpdated(res.data);
      addToast('success', `Task status updated to ${newStatus}`);
    } catch (err) {
      console.error('Failed to update task status:', err);
      addToast('error', 'Failed to update task status');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this task?')) return;
    try {
      await deleteTask(task.id);
      if (onTaskDeleted) onTaskDeleted(task.id);
      addToast('success', 'Task deleted successfully');
      handleClose();
    } catch (err) {
      console.error('Failed to delete task:', err);
      addToast('error', 'Failed to delete task');
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    try {
      const res = await createComment(task.id, commentText);
      setComments(prev => [...prev, res.data]);
      setCommentText('');
      addToast('success', 'Comment added');
    } catch (err) {
      console.error('Failed to add comment:', err);
      addToast('error', 'Failed to add comment');
    }
  };

  const assigneeName = typeof task.assignee === 'string' ? task.assignee : (task.assignee?.name || task.assignee_id || 'Unassigned');

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div 
        className={`fixed inset-0 bg-surface-950/40 backdrop-blur-sm transition-opacity duration-200 ${
          isClosing ? 'opacity-0' : 'opacity-100'
        }`}
        onClick={handleClose}
      />

      <div className="flex min-h-full items-center justify-center p-4 text-center">
        <div 
          className={`w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white dark:bg-surface-900 p-6 text-left align-middle shadow-2xl transition-all duration-200 border border-surface-200 dark:border-surface-800 ${
            isClosing ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
          }`}
        >
          {/* Header */}
          <div className="flex items-start justify-between gap-4 pb-4 border-b border-surface-100 dark:border-surface-800">
            <div className="space-y-1">
              <span className="text-xs text-surface-400 font-mono">TASK-{task.id}</span>
              <h2 className="text-lg font-bold text-surface-900 dark:text-white">{task.title}</h2>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDelete}
                className="p-1.5 text-surface-400 hover:text-red-600 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
                title="Delete Task"
              >
                Delete
              </button>
              <button
                onClick={handleClose}
                className="p-1.5 text-surface-400 hover:text-surface-600 dark:hover:text-surface-200 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Grid Layout */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-6 border-b border-surface-100 dark:border-surface-800">
            {/* Left Column: Description & Comments */}
            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider mb-2">Description</h3>
                <p className="text-sm text-surface-700 dark:text-surface-300 leading-relaxed whitespace-pre-wrap">
                  {task.description || 'No description provided.'}
                </p>
              </div>

              {/* Comments Section */}
              <div className="space-y-4 pt-4 border-t border-surface-100 dark:border-surface-800">
                <h3 className="text-xs font-semibold text-surface-500 uppercase tracking-wider">Comments ({comments.length})</h3>
                
                <form onSubmit={handleAddComment} className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    className="input flex-1 text-sm"
                  />
                  <button type="submit" className="btn btn-primary p-2.5">
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {comments.length === 0 ? (
                    <p className="text-xs text-surface-400 italic">No comments yet.</p>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="p-3 rounded-lg bg-surface-50 dark:bg-surface-800/50 space-y-1">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold text-surface-900 dark:text-white">{comment.user_name || comment.userName || 'User'}</span>
                          <span className="text-surface-400">{comment.created_at || comment.createdAt ? new Date(comment.created_at || comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}</span>
                        </div>
                        <p className="text-xs text-surface-600 dark:text-surface-300">{comment.content || comment.text}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar Details */}
            <div className="space-y-4 p-4 rounded-xl bg-surface-50 dark:bg-surface-800/40 text-xs">
              <div>
                <span className="block text-surface-500 mb-1">Status</span>
                <select
                  value={task.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="input w-full text-xs font-medium"
                >
                  {STATUSES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                </select>
              </div>

              <div>
                <span className="block text-surface-500 mb-1">Priority</span>
                <PriorityBadge priority={task.priority} />
              </div>

              <div>
                <span className="block text-surface-500 mb-1">Assignee</span>
                <div className="flex items-center gap-2">
                  <Avatar name={assigneeName} size="xs" />
                  <span className="font-medium text-surface-800 dark:text-surface-200">{assigneeName}</span>
                </div>
              </div>

              {task.due_date && (
                <div>
                  <span className="block text-surface-500 mb-1">Due Date</span>
                  <div className="flex items-center gap-1.5 font-medium text-surface-700 dark:text-surface-300">
                    <CalendarDays className="w-3.5 h-3.5" />
                    <span>{task.due_date}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
