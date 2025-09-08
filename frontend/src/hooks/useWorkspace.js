// hooks/useWorkspace.js
import { useState, useEffect, useCallback } from 'react';
import WorkspaceService from '../services/workspaceService';

export const useWorkspace = () => {
  const [workspaces, setWorkspaces] = useState([]);
  const [currentWorkspace, setCurrentWorkspace] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);

  // Charger tous les workspaces
  const fetchWorkspaces = useCallback(async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const response = await WorkspaceService.getUserWorkspaces(params);
      setWorkspaces(response.data.workspaces);
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement des workspaces');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Créer un nouveau workspace
  const createWorkspace = useCallback(async (workspaceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await WorkspaceService.createWorkspace(workspaceData);
      setWorkspaces(prev => [response.data, ...prev]);
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors de la création du workspace');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Mettre à jour un workspace
  const updateWorkspace = useCallback(async (id, workspaceData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await WorkspaceService.updateWorkspace(id, workspaceData);
      setWorkspaces(prev => 
        prev.map(ws => ws.id === id ? response.data : ws)
      );
      if (currentWorkspace?.id === id) {
        setCurrentWorkspace(response.data);
      }
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentWorkspace]);

  // Supprimer un workspace
  const deleteWorkspace = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      await WorkspaceService.deleteWorkspace(id);
      setWorkspaces(prev => prev.filter(ws => ws.id !== id));
      if (currentWorkspace?.id === id) {
        setCurrentWorkspace(null);
      }
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression');
      throw err;
    } finally {
      setLoading(false);
    }
  }, [currentWorkspace]);

  // Charger un workspace spécifique
  const fetchWorkspaceById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await WorkspaceService.getWorkspaceById(id);
      setCurrentWorkspace(response.data);
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement du workspace');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Dupliquer un workspace
  const duplicateWorkspace = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await WorkspaceService.duplicateWorkspace(id);
      setWorkspaces(prev => [response.data, ...prev]);
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors de la duplication');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Charger les statistiques
  const fetchStats = useCallback(async () => {
    try {
      const response = await WorkspaceService.getWorkspaceStats();
      setStats(response.data);
      return response;
    } catch (err) {
      console.error('Erreur lors du chargement des statistiques:', err);
    }
  }, []);

  // Rechercher des workspaces
  const searchWorkspaces = useCallback(async (query) => {
    setLoading(true);
    setError(null);
    try {
      const response = await WorkspaceService.searchWorkspaces(query);
      return response;
    } catch (err) {
      setError(err.message || 'Erreur lors de la recherche');
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    workspaces,
    currentWorkspace,
    loading,
    error,
    stats,
    fetchWorkspaces,
    createWorkspace,
    updateWorkspace,
    deleteWorkspace,
    fetchWorkspaceById,
    duplicateWorkspace,
    fetchStats,
    searchWorkspaces,
    setCurrentWorkspace,
    clearError: () => setError(null)
  };
};