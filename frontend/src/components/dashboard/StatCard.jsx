import React from 'react';

const StatCard = ({ title, value, icon: Icon, trend, trendDirection, color }) => {
  const colorStyles = {
    blue: 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
    purple: 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-400',
    green: 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400',
    red: 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400',
    indigo: 'bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400',
    amber: 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
    emerald: 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400',
    rose: 'bg-rose-100 text-rose-600 dark:bg-rose-900/30 dark:text-rose-400',
  };

  const trendStyles = {
    up: 'text-green-600 dark:text-green-400',
    down: 'text-red-600 dark:text-red-400',
  };

  return (
    <div className="card p-5 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${colorStyles[color] || colorStyles.blue}`}>
          {Icon && <Icon className="w-6 h-6" />}
        </div>
      </div>
      <div>
        <h3 className="text-3xl font-bold text-surface-900 dark:text-surface-50 mb-1">{value}</h3>
        <p className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">{title}</p>
        
        {trend && (
          <div className="flex items-center text-xs mt-3">
            <span className={`font-semibold mr-1 ${trendDirection ? trendStyles[trendDirection] : ''}`}>
              {trendDirection === 'up' && '↑ '}
              {trendDirection === 'down' && '↓ '}
              {trend}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default StatCard;
