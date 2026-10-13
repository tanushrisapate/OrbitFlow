import { Routes, Route, Navigate } from 'react-router-dom';

// Public pages
import LandingPage from './pages/LandingPage';

// App layout
import AppLayout from './components/layout/AppLayout';

// App pages
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import MyTasks from './pages/MyTasks';
import Team from './pages/Team';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Workspaces from './pages/Workspaces';
import WorkspaceDetails from './pages/WorkspaceDetails';

// Unconditional route wrapper: 100% no-login application
function ProtectedRoute({ children }) {
  return children;
}

function App() {
  return (
    <Routes>
      {/* Public / Landing routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/signup" element={<Navigate to="/app/dashboard" replace />} />
      <Route path="/dashboard" element={<Navigate to="/app/dashboard" replace />} />

      {/* Protected app routes */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Navigate to="dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="projects" element={<Projects />} />
        <Route path="projects/:id" element={<ProjectDetails />} />
        <Route path="tasks" element={<MyTasks />} />
        <Route path="team" element={<Team />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="settings" element={<Settings />} />
        <Route path="workspaces" element={<Workspaces />} />
        <Route path="workspaces/:id" element={<WorkspaceDetails />} />
      </Route>

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
