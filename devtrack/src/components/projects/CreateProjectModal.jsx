import React, { useState } from 'react';
import Modal from '../common/Modal';
import { useToast } from '../../contexts/ToastContext';

const CreateProjectModal = ({ isOpen, onClose }) => {
  const { addToast } = useToast();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    startDate: '',
    deadline: '',
    status: 'Planning',
    color: 'indigo'
  });

  const colors = [
    { id: 'indigo', class: 'bg-indigo-500' },
    { id: 'purple', class: 'bg-purple-500' },
    { id: 'blue', class: 'bg-blue-500' },
    { id: 'cyan', class: 'bg-cyan-500' },
    { id: 'emerald', class: 'bg-emerald-500' },
    { id: 'amber', class: 'bg-amber-500' }
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleColorSelect = (colorId) => {
    setFormData(prev => ({ ...prev, color: colorId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      addToast('Project name is required', 'error');
      return;
    }
    
    // Mock API call to create project
    addToast('Project created successfully', 'success');
    
    // Reset form
    setFormData({
      name: '',
      description: '',
      startDate: '',
      deadline: '',
      status: 'Planning',
      color: 'indigo'
    });
    
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New Project">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="input-field"
            placeholder="e.g. Website Redesign"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="3"
            className="input-field resize-none"
            placeholder="Brief description of the project..."
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="startDate" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Start Date
            </label>
            <input
              type="date"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="input-field"
            />
          </div>
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
              Deadline
            </label>
            <input
              type="date"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className="input-field"
            />
          </div>
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="input-field"
          >
            <option value="Planning">Planning</option>
            <option value="Active">Active</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-2">
            Project Color
          </label>
          <div className="flex items-center gap-3">
            {colors.map(c => (
              <button
                key={c.id}
                type="button"
                onClick={() => handleColorSelect(c.id)}
                className={`w-8 h-8 rounded-full ${c.class} transition-all duration-200 ${
                  formData.color === c.id 
                    ? 'ring-2 ring-offset-2 ring-primary-500 dark:ring-offset-surface-900 scale-110' 
                    : 'hover:scale-110 opacity-80 hover:opacity-100'
                }`}
                aria-label={`Select ${c.id} color`}
              />
            ))}
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-100 dark:border-surface-800 mt-6">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn-primary"
          >
            Create Project
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default CreateProjectModal;
