import { FolderOpen, CheckCircle2, ClipboardList, Inbox } from 'lucide-react';

const EmptyState = ({ type = 'default', title, description, action, onAction, icon: CustomIcon }) => {
  const presets = {
    projects: {
      icon: FolderOpen,
      title: 'No projects yet',
      description: 'Create your first project and start tracking your work.',
      actionLabel: 'Create Project',
    },
    tasks: {
      icon: CheckCircle2,
      title: "You're all caught up 🎉",
      description: 'No tasks assigned to you right now.',
      actionLabel: null,
    },
    board: {
      icon: ClipboardList,
      title: 'No tasks in this column',
      description: 'Drag tasks here or create a new one.',
      actionLabel: 'Add Task',
    },
    default: {
      icon: Inbox,
      title: 'Nothing here yet',
      description: 'Get started by creating something new.',
      actionLabel: null,
    },
  };

  const preset = presets[type] || presets.default;
  const Icon = CustomIcon || preset.icon;
  const displayTitle = title || preset.title;
  const displayDesc = description || preset.description;
  const actionLabel = action || preset.actionLabel;

  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-2xl bg-surface-100 dark:bg-surface-800 flex items-center justify-center mb-4">
        <Icon size={28} className="text-surface-400 dark:text-surface-500" />
      </div>
      <h3 className="text-lg font-semibold text-surface-700 dark:text-surface-300 mb-1">{displayTitle}</h3>
      <p className="text-sm text-surface-500 dark:text-surface-400 max-w-sm mb-6">{displayDesc}</p>
      {actionLabel && onAction && (
        <button onClick={onAction} className="btn-primary">
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
