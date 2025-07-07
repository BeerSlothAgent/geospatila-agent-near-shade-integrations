/**
 * Integration Hook
 * React hook for managing protocol integrations
 */

import { useState, useEffect, useCallback } from 'react';
import { IntegrationManager } from '../integrations';
import { getIntegrationConfig, validateConfig } from '../config/integrations';

interface IntegrationState {
  manager: IntegrationManager | null;
  isInitialized: boolean;
  isLoading: boolean;
  error: string | null;
  availableIntegrations: string[];
}

export const useIntegrations = () => {
  const [state, setState] = useState<IntegrationState>({
    manager: null,
    isInitialized: false,
    isLoading: true,
    error: null,
    availableIntegrations: [],
  });

  const initializeIntegrations = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const config = getIntegrationConfig();
      
      if (!validateConfig(config)) {
        throw new Error('Invalid integration configuration');
      }

      const manager = new IntegrationManager();
      await manager.initializeAll(config);

      const availableIntegrations = Object.keys(manager.getAll());

      setState({
        manager,
        isInitialized: true,
        isLoading: false,
        error: null,
        availableIntegrations,
      });

      console.log('Integrations initialized:', availableIntegrations);
    } catch (error) {
      console.error('Failed to initialize integrations:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
    }
  }, []);

  useEffect(() => {
    initializeIntegrations();
  }, [initializeIntegrations]);

  const getIntegration = useCallback((name: string) => {
    if (!state.manager) {
      console.warn(`Integration manager not initialized`);
      return null;
    }
    return state.manager.get(name);
  }, [state.manager]);

  const isAvailable = useCallback((name: string) => {
    return state.manager?.isAvailable(name) || false;
  }, [state.manager]);

  const retry = useCallback(() => {
    initializeIntegrations();
  }, [initializeIntegrations]);

  return {
    manager: state.manager,
    isInitialized: state.isInitialized,
    isLoading: state.isLoading,
    error: state.error,
    availableIntegrations: state.availableIntegrations,
    getIntegration,
    isAvailable,
    retry,
  };
};

export default useIntegrations;