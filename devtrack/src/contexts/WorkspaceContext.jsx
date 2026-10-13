import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getWorkspaces, createWorkspace as apiCreateWorkspace, deleteWorkspace as apiDeleteWorkspace } from '../services/api';

const WorkspaceContext = createContext();

export function WorkspaceProvider({ children }) {
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchWorkspaces = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getWorkspaces();
      const list = res.data || [];
      setWorkspaces(list);

      // Restore active workspace from localStorage or pick the first one
      const savedId = localStorage.getItem('orbitflow-active-workspace-id');
      if (savedId) {
        const found = list.find(w => String(w.id) === String(savedId));
        if (found) {
          setCurrentWorkspace(found);
        } else if (list.length > 0) {
          setCurrentWorkspace(list[0]);
          localStorage.setItem('orbitflow-active-workspace-id', list[0].id);
        } else {
          setCurrentWorkspace(null);
          localStorage.removeItem('orbitflow-active-workspace-id');
        }
      } else if (list.length > 0) {
        setCurrentWorkspace(list[0]);
        localStorage.setItem('orbitflow-active-workspace-id', list[0].id);
      } else {
        setCurrentWorkspace(null);
      }
    } catch (err) {
      console.error('Failed to fetch workspaces in WorkspaceContext:', err);
      setError('Unable to load workspaces.');
      setWorkspaces([]);
      setCurrentWorkspace(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWorkspaces();
  }, [fetchWorkspaces]);

  const selectWorkspace = useCallback((ws) => {
    setCurrentWorkspace(ws);
    if (ws?.id) {
      localStorage.setItem('orbitflow-active-workspace-id', ws.id);
    } else {
      localStorage.removeItem('orbitflow-active-workspace-id');
    }
  }, []);

  const createWorkspace = useCallback(async (data) => {
    const res = await apiCreateWorkspace(data);
    const newWs = res.data;
    setWorkspaces(prev => [newWs, ...prev]);
    selectWorkspace(newWs);
    return newWs;
  }, [selectWorkspace]);

  const deleteWorkspace = useCallback(async (id) => {
    await apiDeleteWorkspace(id);
    setWorkspaces(prev => {
      const remaining = prev.filter(w => w.id !== id);
      if (currentWorkspace?.id === id) {
        const next = remaining.length > 0 ? remaining[0] : null;
        selectWorkspace(next);
      }
      return remaining;
    });
  }, [currentWorkspace, selectWorkspace]);

  return (
    <WorkspaceContext.Provider
      value={{
        workspaces,
        currentWorkspace,
        loading,
        error,
        selectWorkspace,
        createWorkspace,
        deleteWorkspace,
        refreshWorkspaces: fetchWorkspaces,
      }}
    >
      {children}
    </WorkspaceContext.Provider>
  );
}

export function useWorkspace() {
  const context = useContext(WorkspaceContext);
  if (!context) {
    throw new Error('useWorkspace must be used within a WorkspaceProvider');
  }
  return context;
}
