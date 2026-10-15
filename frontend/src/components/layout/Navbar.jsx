import { useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import {
  PanelLeft,
  Settings,
  Sun,
  Moon,
  ChevronDown,
} from 'lucide-react';
import { useTheme } from '../../contexts/ThemeContext';
import { useAuth } from '../../contexts/AuthContext';
import Avatar from '../common/Avatar';

const Navbar = ({ onToggleSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isDark, toggleTheme } = useTheme();
  const { user } = useAuth();
  const activeUser = user || { name: 'Tanushri', email: 'tanushri@devtrack.io' };
  const [userOpen, setUserOpen] = useState(false);

  const userName = typeof activeUser.name === 'string' 
    ? activeUser.name 
    : (typeof activeUser.name === 'object' && activeUser.name?.name ? activeUser.name.name : 'Tanushri');

  const userEmail = typeof activeUser.email === 'string' 
    ? activeUser.email 
    : (typeof activeUser.email === 'object' && activeUser.email?.email ? activeUser.email.email : 'tanushri@devtrack.io');

  const pathnames = location.pathname
    .split('/')
    .filter((x) => x && x !== 'app');

  return (
    <header className="h-16 bg-white dark:bg-surface-900 border-b border-surface-200 dark:border-surface-800 px-4 flex items-center justify-between sticky top-0 z-30 transition-colors">
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleSidebar}
          className="p-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
          title="Toggle Sidebar"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        <nav className="hidden sm:flex items-center gap-1.5 text-xs text-surface-500">
          <Link to="/app/dashboard" className="hover:text-surface-900 dark:hover:text-white transition-colors font-medium">
            Orbit Flow
          </Link>
          {pathnames.map((name, index) => (
            <span key={name} className="flex items-center gap-1.5">
              <span>/</span>
              <span className={`capitalize ${index === pathnames.length - 1 ? 'font-semibold text-surface-900 dark:text-white' : ''}`}>
                {name}
              </span>
            </span>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 text-surface-500 hover:text-surface-700 dark:hover:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-800 rounded-lg transition-colors"
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>

        {/* User Profile */}
        <div className="relative">
          <button
            onClick={() => setUserOpen(!userOpen)}
            className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-surface-100 dark:hover:bg-surface-800 transition-colors"
          >
            <Avatar name={userName} size="sm" />
            <span className="hidden md:inline text-xs font-medium text-surface-700 dark:text-surface-200">
              {userName}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-surface-400" />
          </button>

          {userOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-surface-900 rounded-xl shadow-lg border border-surface-200 dark:border-surface-800 py-1 z-50 text-xs">
              <div className="px-4 py-2 border-b border-surface-100 dark:border-surface-800">
                <p className="font-semibold text-surface-900 dark:text-white">{userName}</p>
                <p className="text-[11px] text-surface-400">{userEmail}</p>
              </div>
              <Link to="/app/settings" className="flex items-center gap-2 px-4 py-2 text-surface-700 dark:text-surface-300 hover:bg-surface-50 dark:hover:bg-surface-800">
                <Settings className="w-4 h-4" /> Settings
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
