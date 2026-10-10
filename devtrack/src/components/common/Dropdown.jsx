import { useState, useRef, useEffect } from 'react';

const Dropdown = ({ trigger, children, align = 'right', className = '' }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const alignClass = align === 'left' ? 'left-0' : 'right-0';

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
        {trigger}
      </div>
      {isOpen && (
        <div
          className={`absolute ${alignClass} mt-2 min-w-[200px] bg-white dark:bg-dark-card border border-surface-200 dark:border-dark-border rounded-xl shadow-lg z-50 py-1 overflow-hidden`}
          style={{ animation: 'dropdownFade 0.15s ease-out' }}
        >
          <div onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>
      )}
      <style>{`
        @keyframes dropdownFade {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

// icon can be a component OR a JSX element
export const DropdownItem = ({ children, onClick, icon, danger = false, className = '' }) => {
  const renderIcon = () => {
    if (!icon) return null;
    // If icon is a React element already (JSX), render directly
    if (typeof icon === 'object' && icon.$$typeof) {
      return icon;
    }
    // If icon is a component reference, instantiate it
    const Icon = icon;
    return <Icon size={16} />;
  };

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm text-left transition-colors
        ${danger
          ? 'text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20'
          : 'text-surface-700 hover:bg-surface-50 dark:text-surface-300 dark:hover:bg-surface-700/50'}
        ${className}`}
    >
      {renderIcon()}
      {children}
    </button>
  );
};

export const DropdownDivider = () => (
  <div className="my-1 border-t border-surface-100 dark:border-dark-border" />
);

export default Dropdown;
