const Badge = ({ children, variant = 'default', size = 'sm', className = '' }) => {
  const variants = {
    default: 'bg-surface-100 text-surface-600 dark:bg-surface-700 dark:text-surface-300',
    primary: 'bg-primary-100 text-primary-700 dark:bg-primary-900/50 dark:text-primary-300',
    success: 'bg-green-50 text-green-700 dark:bg-green-900/40 dark:text-green-300',
    warning: 'bg-amber-50 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
    danger: 'bg-red-50 text-red-700 dark:bg-red-900/40 dark:text-red-300',
    info: 'bg-blue-50 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300',
  };

  const sizes = {
    xs: 'px-1.5 py-0.5 text-[10px]',
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
  };

  return (
    <span className={`inline-flex items-center gap-1 rounded-full font-medium ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;
