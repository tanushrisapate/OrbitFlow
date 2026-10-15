import { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  Boxes,
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Users,
  BarChart3,
  Settings,
  Sun,
  Moon,
  ChevronDown,
  User,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import { useWorkspace } from '../../contexts/WorkspaceContext';
import Avatar from '../common/Avatar';

const Sidebar = ({ isCollapsed, onToggle, isMobileOpen, onMobileClose }) => {
  const { isDark, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const activeUser = user || { name: 'Tanushri', email: 'tanushri@orbitflow.io' };
  const navigate = useNavigate();
  const { workspaces, currentWorkspace, selectWorkspace } = useWorkspace();
  const [wsDropdownOpen, setWsDropdownOpen] = useState(false);

  const navLinks = [
    { name: 'Dashboard', to: '/app/dashboard', icon: LayoutDashboard },
    { name: 'Projects', to: '/app/projects', icon: FolderKanban },
    { name: 'My Tasks', to: '/app/tasks', icon: CheckSquare },
    { name: 'Team', to: '/app/team', icon: Users },
    { name: 'Analytics', to: '/app/analytics', icon: BarChart3 },
  ];

  return (
    <aside className={`${isCollapsed ? 'w-[70px]' : 'w-64'} bg-surface-900 text-white flex flex-col h-screen sticky top-0 z-40 transition-all duration-200 border-r border-surface-800 shrink-0`}>
      {/* App Branding */}
      <div className="h-16 px-6 flex items-center justify-between border-b border-surface-800">
        <NavLink to="/app/dashboard" className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-primary-600 text-white">
            <Boxes className="w-5 h-5" />
          </div>
          <span className="font-bold text-lg tracking-tight">Orbit Flow</span>
        </NavLink>
      </div>

      {/* Workspace Selector */}
      <div className="p-4 border-b border-surface-800">
        <div className="relative">
          <button
            onClick={() => setWsDropdownOpen(!wsDropdownOpen)}
            className="w-full flex items-center justify-between p-2.5 rounded-xl bg-surface-800/60 hover:bg-surface-800 transition-colors text-left"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <span className="text-xl">{currentWorkspace?.icon || '📁'}</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate text-white">
                  {currentWorkspace?.name || 'No Workspace'}
                </p>
                <p className="text-[10px] text-surface-400 truncate">
                  {currentWorkspace ? 'PostgreSQL DB' : 'Click to add'}
                </p>
              </div>
            </div>
            <ChevronDown className="w-4 h-4 text-surface-400 shrink-0" />
          </button>

          {wsDropdownOpen && (
            <div className="absolute top-full left-0 right-0 mt-1 bg-surface-800 rounded-xl shadow-xl border border-surface-700 py-1 z-50 max-h-48 overflow-y-auto">
              {workspaces.length === 0 ? (
                <div className="px-3 py-2 text-xs text-surface-400 text-center italic">
                  No workspaces yet
                </div>
              ) : (
                workspaces.map((ws) => (
                  <button
                    key={ws.id}
                    onClick={() => {
                      selectWorkspace(ws);
                      setWsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-xs transition-colors text-left ${
                      currentWorkspace?.id === ws.id
                        ? 'bg-primary-600/30 text-primary-300 font-medium'
                        : 'text-surface-200 hover:bg-surface-700/60'
                    }`}
                  >
                    <span>{ws.icon || '📁'}</span>
                    <span className="truncate">{ws.name}</span>
                  </button>
                ))
              )}
              <div className="border-t border-surface-700 mt-1 pt-1 px-2">
                <NavLink
                  to="/app/workspaces"
                  onClick={() => setWsDropdownOpen(false)}
                  className="block w-full text-center text-xs text-primary-400 hover:underline py-1"
                >
                  Manage Workspaces →
                </NavLink>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main Nav Links */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navLinks.map((link) => {
          const Icon = link.icon;
          return (
            <NavLink
              key={link.name}
              to={link.to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                  isActive
                    ? 'bg-primary-600 text-white font-semibold shadow-xs'
                    : 'text-surface-400 hover:text-white hover:bg-surface-800/60'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.name}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Bottom User Section */}
      {(() => {
        const userName = typeof activeUser.name === 'string' ? activeUser.name : (activeUser.name?.name || 'Tanushri');
        const userEmail = typeof activeUser.email === 'string' ? activeUser.email : (activeUser.email?.email || 'tanushri@orbitflow.io');
        return (
          <div className="p-4 border-t border-surface-800 flex items-center justify-between">
            <div className="flex items-center gap-2.5 min-w-0">
              <Avatar name={userName} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate text-white">{userName}</p>
                <p className="text-[10px] text-surface-400 truncate">{userEmail}</p>
              </div>
            </div>
          </div>
        );
      })()}
    </aside>
  );
};

export default Sidebar;
