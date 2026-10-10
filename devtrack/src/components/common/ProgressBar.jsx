const ProgressBar = ({ value, max = 100, size = 'md', showLabel = false, color = 'primary', className = '' }) => {
  const percentage = Math.min(Math.round((value / max) * 100), 100);

  const sizes = {
    sm: 'h-1.5',
    md: 'h-2',
    lg: 'h-3',
  };

  const colors = {
    primary: 'bg-primary-500',
    success: 'bg-green-500',
    warning: 'bg-amber-500',
    danger: 'bg-red-500',
  };

  // Auto color based on percentage
  const autoColor = percentage >= 80 ? 'bg-green-500' : percentage >= 50 ? 'bg-primary-500' : percentage >= 25 ? 'bg-amber-500' : 'bg-red-500';
  const barColor = color === 'auto' ? autoColor : colors[color];

  return (
    <div className={`w-full ${className}`}>
      {showLabel && (
        <div className="flex justify-between items-center mb-1">
          <span className="text-xs text-surface-500 dark:text-surface-400">Progress</span>
          <span className="text-xs font-medium text-surface-700 dark:text-surface-300">{percentage}%</span>
        </div>
      )}
      <div className={`w-full ${sizes[size]} bg-surface-200 dark:bg-surface-700 rounded-full overflow-hidden`}>
        <div
          className={`${sizes[size]} ${barColor} rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
