import React, { useState, useEffect } from 'react';
import KanbanColumn from './KanbanColumn';
import TaskDetails from '../tasks/TaskDetails';
import Modal from '../common/Modal';
import SkeletonLoader from '../common/SkeletonLoader';
import { getTasks, createTask, updateTaskStatus } from '../../services/api';
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
      addToast('Failed to load project tasks from server', 'error');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjectTasks();
  }, [projectId]);

  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    if (e.dataTransfer) {
      e.dataTransfer.setData('text/plain', String(task.id));
      e.dataTransfer.effectAllowed = 'move';
    }
  };

  const handleDragEnd = () => {
    setDraggedTask(null);
    setDragOverColumn(null);
  };

  const handleDragOver = (e, statusId) => {
    e.preventDefault();
    if (e.dataTransfer) {
      e.dataTransfer.dropEffect = 'move';
    }
    if (dragOverColumn !== statusId) {
      setDragOverColumn(statusId);
    }
  };

  const handleDragLeave = (e, statusId) => {
    if (e.currentTarget.contains(e.relatedTarget)) return;
    if (dragOverColumn === statusId) {
      setDragOverColumn(null);
    }
  };

  const handleDrop = async (e, statusId) => {
    e.preventDefault();
    const currentDragged = draggedTask;
    setDraggedTask(null);
    setDragOverColumn(null);

    if (!currentDragged || currentDragged.status === statusId) return;

    const previousTasks = [...tasks];
    setTasks(prev => prev.map(t => t.id === currentDragged.id ? { ...t, status: statusId } : t));

    try {
      await updateTaskStatus(currentDragged.id, statusId);
      addToast(`Task moved to ${statusId.replace('-', ' ')}`, 'success');
    } catch (err) {
      console.error('Failed to update task status:', err);
      setTasks(previousTasks);
      const errMsg = err.response?.data?.detail || 'Failed to update task status in database';
      addToast(typeof errMsg === 'string' ? errMsg : 'Failed to update task status', 'error');
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
        title: newTaskData.title.trim(),
        description: newTaskData.description ? newTaskData.description.trim() : null,
        status: newTaskStatus,
        priority: newTaskData.priority,
        project_id: parseInt(projectId, 10),
      });
      setTasks(prev => [...prev, res.data]);
      setIsAddTaskModalOpen(false);
      setNewTaskData({ title: '', description: '', priority: 'medium' });
      addToast('Task created successfully!', 'success');
    } catch (err) {
      console.error('Create task error:', err);
      const errMsg = err.response?.data?.detail || 'Failed to create task';
      addToast(typeof errMsg === 'string' ? errMsg : 'Failed to create task', 'error');
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
      <div className="flex gap-4 overflow-x-auto pb-4 h-full items-start min-w-0">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="w-[280px] sm:w-[300px] xl:w-auto xl:flex-1 shrink-0 xl:shrink min-w-[270px] h-full">
            <SkeletonLoader className="h-96 w-full rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col min-w-0">
      <div className="flex gap-4 overflow-x-auto pb-4 h-full items-stretch min-w-0 kanban-board-scroll">
        {COLUMNS.map(column => {
          const columnTasks = tasks.filter(t => t.status === column.id);
          return (
            <KanbanColumn
              key={column.id}
              column={column}
              title={column.title}
              status={column.id}
              color={column.color}
              tasks={columnTasks}
              onTaskClick={handleTaskClick}
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => handleDragOver(e, column.id)}
              onDragLeave={(e) => handleDragLeave(e, column.id)}
              onDrop={(e) => handleDrop(e, column.id)}
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
            <label htmlFor="task-title" className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
              Task Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="task-title"
              required
              placeholder="e.g. Implement API endpoint"
              value={newTaskData.title}
              onChange={(e) => setNewTaskData({ ...newTaskData, title: e.target.value })}
              className="input w-full text-sm"
            />
          </div>
          <div>
            <label htmlFor="task-desc" className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
              Description
            </label>
            <textarea
              id="task-desc"
              placeholder="Task details and acceptance criteria..."
              value={newTaskData.description}
              onChange={(e) => setNewTaskData({ ...newTaskData, description: e.target.value })}
              className="input w-full text-sm h-20 resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="task-priority" className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
                Priority
              </label>
              <select
                id="task-priority"
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
              <label htmlFor="task-status" className="block text-xs font-semibold text-surface-700 dark:text-surface-300 mb-1">
                Status
              </label>
              <select
                id="task-status"
                value={newTaskStatus}
                onChange={(e) => setNewTaskStatus(e.target.value)}
                className="input w-full text-sm"
              >
                {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800">
            <button type="button" onClick={() => setIsAddTaskModalOpen(false)} className="btn btn-ghost text-sm">Cancel</button>
            <button type="submit" className="btn btn-primary text-sm">Create Task</button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
