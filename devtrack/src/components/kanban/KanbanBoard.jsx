import React, { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import TaskDetails from '../tasks/TaskDetails';
import Modal from '../common/Modal';
import SkeletonLoader from '../common/SkeletonLoader';
import { getTasks, createTask, updateTaskStatus, deleteTask } from '../../services/api';
import { useToast } from '../../contexts/ToastContext';

const COLUMNS = [
  { id: 'todo', title: 'TO DO', color: '#6366f1' },
  { id: 'in-progress', title: 'IN PROGRESS', color: '#f59e0b' },
  { id: 'in-review', title: 'IN REVIEW', color: '#8b5cf6' },
  { id: 'done', title: 'DONE', color: '#22c55e' }
];

export default function KanbanBoard({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverColumn, setDragOverColumn] = useState(null);
  const [selectedTask, setSelectedTask] = useState(null);
  const [isTaskDetailsOpen, setIsTaskDetailsOpen] = useState(false);

  // New task modal state
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');
  const [newTaskData, setNewTaskData] = useState({ title: '', description: '', priority: 'medium' });

  const toastContext = useToast();
  const addToast = toastContext?.addToast || (() => {});

  const fetchProjectTasks = async () => {
    if (!projectId) return;
    setLoading(true);
    try {
      const response = await getTasks(projectId);
      setTasks(response.data);
    } catch (err) {
      console.error('Failed to load tasks from API:', err);
      addToast('error', 'Failed to load project tasks from server.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectTasks();
  }, [projectId]);

  const handleDragOver = (statusId) => {
    if (dragOverColumn !== statusId) {
      setDragOverColumn(statusId);
    }
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDrop = async (statusId) => {
    if (!draggedTask || draggedTask.status === statusId) return;

    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === draggedTask.id ? { ...t, status: statusId } : t));

    try {
      await updateTaskStatus(draggedTask.id, statusId);
      addToast('success', `Task status updated to ${statusId}`);
    } catch (err) {
      console.error('Failed to update task status:', err);
      setTasks(previousTasks);
      addToast('error', 'Failed to update task status in database.');
    } finally {
      setDraggedTask(null);
      setDragOverColumn(null);
    }
  };

  const handleOpenAddTaskModal = (statusId = 'todo') => {
    setNewTaskStatus(statusId);
    setNewTaskData({ title: '', description: '', priority: 'medium' });
    setIsAddTaskModalOpen(true);
  };

  const handleCreateTask = async (e) => {
    e.preventDefault();
    if (!newTaskData.title.trim() || !projectId) return;

    try {
      const res = await createTask({
        title: newTaskData.title,
        description: newTaskData.description,
        status: newTaskStatus,
        priority: newTaskData.priority,
        project_id: parseInt(projectId, 10),
      });
      setTasks(prev => [...prev, res.data]);
      setIsAddTaskModalOpen(false);
      addToast('success', 'Task created successfully!');
    } catch (err) {
      console.error('Create task error:', err);
      addToast('error', 'Failed to create task');
    }
  };

  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setIsTaskDetailsOpen(true);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleTaskDeleted = (deletedTaskId) => {
    setTasks(prev => prev.filter(t => t.id !== deletedTaskId));
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
        {[1, 2, 3, 4].map(i => <SkeletonLoader key={i} className="h-96 w-full rounded-xl" />)}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 items-start">
        {COLUMNS.map(column => {
          const columnTasks = tasks.filter(t => t.status === column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={columnTasks}
              onTaskClick={handleTaskClick}
              onDragStart={(e, task) => setDraggedTask(task)}
              onDragOver={() => handleDragOver(column.id)}
              onDrop={() => handleDrop(column.id)}
              onAddTask={() => handleOpenAddTaskModal(column.id)}
              isDragOver={dragOverColumn === column.id}
            />
          );
        })}
      </div>

      {/* Task Details Modal */}
      {selectedTask && (
        <TaskDetails
          task={selectedTask}
          isOpen={isTaskDetailsOpen}
          onClose={() => { setIsTaskDetailsOpen(false); setSelectedTask(null); }}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      )}

      {/* Add Task Modal */}
      <Modal isOpen={isAddTaskModalOpen} onClose={() => setIsAddTaskModalOpen(false)} title="Create Task">
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Task Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Implement API endpoint"
              value={newTaskData.title}
              onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
              className="input w-full text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Description</label>
            <textarea
              placeholder="Task details and acceptance criteria..."
              value={newTaskData.description}
              onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
              className="input w-full text-sm h-20"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Priority</label>
              <select
                value={newTaskData.priority}
                onChange={(e) => setNewTaskData({ ...newTaskData, priority: e.target.value })}
                className="input w-full text-sm"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">Status</label>
              <select
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value)}
                className="input w-full text-sm"
              >
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
            <button type="button" onClick={() => setIsAddTaskModalOpen(false)} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-primary">Create Task</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
