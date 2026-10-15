import React, { useState } from 'react';
import { User, Building, Bell, Shield, LogOut, Camera, Smartphone, Monitor } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { useWorkspace } from '../contexts/WorkspaceContext';
import Avatar from '../components/common/Avatar';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('Profile');
  const { addToast } = useToast();
  const { user } = useAuth();
  const { currentWorkspace } = useWorkspace();

  const activeUserName = typeof user?.name === 'string' ? user.name : (user?.name?.name || '');
  const activeUserEmail = typeof user?.email === 'string' ? user.email : (user?.email?.email || '');

  const handleProfileSave = (e) => {
    e.preventDefault();
    addToast('success', 'Profile updated successfully');
  };

  const tabs = [
    { id: 'Profile', icon: User },
    { id: 'Workspace', icon: Building },
    { id: 'Notifications', icon: Bell },
    { id: 'Security', icon: Shield },
  ];

  return (
    <div className="p-6 max-w-5xl mx-auto h-full">
      <h1 className="text-2xl font-bold text-surface-900 dark:text-white mb-8">Settings</h1>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Nav */}
        <div className="w-full md:w-64 shrink-0 flex flex-row md:flex-col gap-2 overflow-x-auto hide-scrollbar">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/30 dark:text-primary-400' 
                    : 'text-surface-600 hover:bg-surface-50 dark:text-surface-400 dark:hover:bg-surface-800'
                }`}
              >
                <Icon size={18} className={isActive ? 'text-primary-600 dark:text-primary-400' : 'text-surface-400'} />
                {tab.id}
              </button>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1">
          {activeTab === 'Profile' && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Profile Settings</h2>
              
              <form onSubmit={handleProfileSave} className="space-y-6">
                <div className="flex items-center gap-6 pb-6 border-b border-surface-200 dark:border-surface-800">
                  <div className="relative">
                    <Avatar name={activeUserName} size="lg" className="w-20 h-20 text-xl" />
                    <button type="button" className="absolute bottom-0 right-0 w-8 h-8 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-full flex items-center justify-center text-surface-600 hover:text-primary-600 transition-colors shadow-sm">
                      <Camera size={14} />
                    </button>
                  </div>
                  <div>
                    <h3 className="font-medium text-surface-900 dark:text-white mb-1">Profile Photo</h3>
                    <p className="text-sm text-surface-500 mb-3">JPG, GIF or PNG. Max size of 800K</p>
                    <button type="button" className="btn btn-secondary text-sm py-1.5">Change Photo</button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Full Name</label>
                    <input type="text" className="input w-full" defaultValue={activeUserName} key={`name-${activeUserName}`} />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Email</label>
                    <input type="email" className="input w-full" defaultValue={activeUserEmail} key={`email-${activeUserEmail}`} />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Bio</label>
                  <textarea className="input w-full min-h-[100px] resize-none" placeholder="A brief description of yourself"></textarea>
                </div>

                <div className="pt-4 flex justify-end">
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          )}

          {activeTab === 'Workspace' && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Workspace Details</h2>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Workspace Name</label>
                  <input type="text" className="input w-full" defaultValue={currentWorkspace?.name || ''} key={`ws-name-${currentWorkspace?.id}`} placeholder="Workspace Name" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Description</label>
                  <textarea className="input w-full min-h-[100px]" defaultValue={currentWorkspace?.description || ''} key={`ws-desc-${currentWorkspace?.id}`} placeholder="Workspace description"></textarea>
                </div>
                <div className="pt-4">
                  <button className="btn btn-primary">Save Changes</button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="card p-6">
              <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-6">
                {[
                  { id: 'email', title: 'Email notifications', desc: 'Receive daily digests via email' },
                  { id: 'tasks', title: 'Task assignments', desc: 'When a new task is assigned to you' },
                  { id: 'deadlines', title: 'Deadline reminders', desc: '24 hours before a task is due' },
                  { id: 'updates', title: 'Project updates', desc: 'When projects change status' },
                  { id: 'mentions', title: 'Team mentions', desc: 'When someone @mentions you in a comment' }
                ].map((item, idx) => (
                  <div key={item.id} className={`flex items-start justify-between gap-4 ${idx !== 0 ? 'pt-6 border-t border-surface-100 dark:border-surface-800' : ''}`}>
                    <div>
                      <h3 className="font-medium text-surface-900 dark:text-white">{item.title}</h3>
                      <p className="text-sm text-surface-500">{item.desc}</p>
                    </div>
                    {/* Styled Toggle Switch */}
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 mt-1">
                      <input type="checkbox" className="sr-only peer" defaultChecked={idx !== 0} />
                      <div className="w-11 h-6 bg-surface-200 peer-focus:outline-none rounded-full peer dark:bg-surface-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-surface-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-surface-600 peer-checked:bg-primary-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-6">
              <div className="card p-6">
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Change Password</h2>
                <div className="space-y-4 max-w-md">
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Current Password</label>
                    <input type="password" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">New Password</label>
                    <input type="password" className="input w-full" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-surface-700 dark:text-surface-300 mb-1">Confirm New Password</label>
                    <input type="password" className="input w-full" />
                  </div>
                  <div className="pt-2">
                    <button className="btn btn-primary">Update Password</button>
                  </div>
                </div>
              </div>

              <div className="card p-6">
                <h2 className="text-lg font-bold text-surface-900 dark:text-white mb-6">Active Sessions</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-green-50 dark:bg-green-900/20 text-green-600 flex items-center justify-center">
                        <Monitor size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">Chrome on Windows</p>
                        <p className="text-xs text-green-600 font-medium mt-0.5">Current session</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-surface-200 dark:border-surface-800 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-surface-100 dark:bg-surface-800 text-surface-500 flex items-center justify-center">
                        <Smartphone size={20} />
                      </div>
                      <div>
                        <p className="font-medium text-surface-900 dark:text-white">Safari on iPhone</p>
                        <p className="text-xs text-surface-500 mt-0.5">Last active 2 days ago</p>
                      </div>
                    </div>
                    <button className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors">Revoke</button>
                  </div>
                </div>
                
                <button className="btn btn-secondary text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 w-full justify-center gap-2">
                  <LogOut size={16} />
                  Log out all devices
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
