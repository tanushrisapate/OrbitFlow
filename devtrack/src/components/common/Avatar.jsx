const Avatar = ({ name, initials, size = 'md', className = '' }) => {
  const sizeClasses = {
    xs: 'w-6 h-6 text-[10px]',
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const safeName = typeof name === 'string' ? name : (name?.name || '');

  // Generate a consistent color based on the name
  const colors = [
    'bg-primary-500', 'bg-purple-500', 'bg-blue-500', 'bg-cyan-500',
    'bg-teal-500', 'bg-emerald-500', 'bg-amber-500', 'bg-rose-500',
  ];
  const colorIndex = safeName ? safeName.charCodeAt(0) % colors.length : 0;

  const displayInitials = initials || (safeName ? safeName.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() : '?');

  return (
    <div
      className={`${sizeClasses[size]} ${colors[colorIndex]} rounded-full flex items-center justify-center text-white font-medium shrink-0 ${className}`}
      title={safeName}
    >
      {displayInitials}
    </div>
  );
};

export default Avatar;
