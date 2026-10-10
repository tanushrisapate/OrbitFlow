import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

const AppLayout = () => {
  const [isCollapsed, setIsCollapsed] = useState(() => {
    const saved = localStorage.getItem('devtrack_sidebar_collapsed');
    return saved === 'true';
  });
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (mobile) {
        setIsCollapsed(false); // Mobile uses overlay, not collapsed state
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => {
    if (isMobile) {
      setIsMobileOpen(!isMobileOpen);
    } else {
      const newState = !isCollapsed;
      setIsCollapsed(newState);
      localStorage.setItem('devtrack_sidebar_collapsed', newState.toString());
    }
  };

  const closeMobile = () => {
    setIsMobileOpen(false);
  };

  return (
    <div className="flex h-screen overflow-hidden bg-surface-50 dark:bg-dark-bg transition-colors">
      <Sidebar 
        isCollapsed={isCollapsed} 
        onToggle={toggleSidebar} 
        isMobileOpen={isMobileOpen} 
        onMobileClose={closeMobile} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 transition-all duration-300 ease-in-out">
        <Navbar onToggleSidebar={toggleSidebar} />
        
        <main className="flex-1 overflow-y-auto bg-surface-50 dark:bg-dark-bg transition-colors custom-scrollbar">
          <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto w-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
