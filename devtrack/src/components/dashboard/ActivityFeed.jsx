import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowRight, Plus, UserPlus, MessageSquare } from 'lucide-react';
import Avatar from '../common/Avatar';
import { getActivities } from '../../services/api';

const ActivityFeed = ({ activities: propActivities }) => {
  const [activitiesList, setActivitiesList] = useState(propActivities || []);

  useEffect(() => {
    if (propActivities && propActivities.length > 0) {
      setActivitiesList(propActivities);
    } else {
      getActivities()
        .then(res => setActivitiesList(res.data))
        .catch(err => console.error('Failed to fetch activity feed:', err));
    }
  }, [propActivities]);

  if (activitiesList.length === 0) {
    return <div className="text-xs text-surface-400 p-4 text-center card">No recent activity recorded in PostgreSQL.</div>;
  }

  const getIcon = (type) => {
    switch (type) {
      case 'complete': return <CheckCircle2 className="w-3.5 h-3.5 text-green-500" />;
      case 'move':
      case 'status_change': return <ArrowRight className="w-3.5 h-3.5 text-blue-500" />;
      case 'create':
      case 'task': return <Plus className="w-3.5 h-3.5 text-primary-500" />;
      case 'join': return <UserPlus className="w-3.5 h-3.5 text-purple-500" />;
      case 'comment': return <MessageSquare className="w-3.5 h-3.5 text-cyan-500" />;
      default: return <div className="w-2 h-2 rounded-full bg-surface-400" />;
    }
  };

  return (
    <div className="card p-5">
      <div className="relative border-l-2 border-primary-200 dark:border-primary-800/30 ml-3 space-y-6">
        {activitiesList.map((activity) => {
          const userName = activity.user_name || activity.user_id || 'Tanushri';
          const projName = activity.project_name || 'DevTrack';

          return (
            <div key={activity.id} className="relative pl-6 group">
              <div className="absolute -left-[17px] top-0.5 p-1 rounded-full bg-white dark:bg-surface-900 border border-surface-200 dark:border-surface-700 shadow-xs">
                {getIcon(activity.type)}
              </div>

              <div className="text-xs space-y-1">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="font-semibold text-surface-900 dark:text-white">{userName}</span>
                  <span className="text-surface-500 dark:text-surface-400">{activity.action}</span>
                  <span className="font-medium text-surface-900 dark:text-white">"{activity.target}"</span>
                </div>

                {activity.detail && (
                  <p className="text-[11px] text-surface-400">{activity.detail}</p>
                )}

                <div className="flex items-center gap-2 text-[10px] text-surface-400 pt-0.5">
                  {projName && <span className="font-medium text-primary-600 dark:text-primary-400">{projName}</span>}
                  <span>•</span>
                  <span>{activity.created_at ? new Date(activity.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Just now'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ActivityFeed;
