/**
 * Base hook for managing API state with consistent patterns
 * Provides standardized loading, error, and data state management
 */

import { useState, useCallback } from 'react';

export interface ApiState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  retryCount: number;
}

export interface ApiStateActions {
  retry: () => void;
  clearError: () => void;
  reset: () => void;
}

export interface UseApiStateOptions<T = unknown> {
  initialData?: T | null;
  maxRetries?: number;
  retryDelay?: number;
}

/**
 * Base hook for API state management
 */
export function useApiState<T>(
  options: UseApiStateOptions<T> = {}
): [ApiState<T>, ApiStateActions, (operation: () => Promise<T>) => Promise<void>] {
  const { initialData = null, maxRetries = 3 } = options;

  const [state, setState] = useState<ApiState<T>>({
    data: initialData,
    loading: false,
    error: null,
    retryCount: 0,
  });

  const [lastOperation, setLastOperation] = useState<(() => Promise<T>) | null>(null);

  const executeOperation = useCallback(async (operation: () => Promise<T>) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      setLastOperation(() => operation);

      const result = await operation();
      
      setState(prev => ({ 
        ...prev, 
        data: result, 
        loading: false, 
        retryCount: 0 
      }));
    } catch (error) {
      console.error('API operation failed:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';

      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        retryCount: prev.retryCount + 1
      }));
    }
  }, []);

  const retry = useCallback(() => {
    if (lastOperation && state.retryCount < maxRetries) {
      executeOperation(lastOperation);
    }
  }, [lastOperation, state.retryCount, maxRetries, executeOperation]);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  const reset = useCallback(() => {
    setState({
      data: initialData,
      loading: false,
      error: null,
      retryCount: 0,
    });
    setLastOperation(null);
  }, [initialData]);

  const actions: ApiStateActions = {
    retry,
    clearError,
    reset,
  };

  return [state, actions, executeOperation];
}

/**
 * Hook for managing multiple API states (for batch operations)
 */
export function useMultiApiState<T extends Record<string, unknown>>(
  keys: (keyof T)[],
  options: UseApiStateOptions = {}
): [
  Record<keyof T, ApiState<T[keyof T]>>,
  Record<keyof T, ApiStateActions>,
  (key: keyof T, operation: () => Promise<T[keyof T]>) => Promise<void>
] {
  const [states, setStates] = useState<Record<keyof T, ApiState<T[keyof T]>>>(() => {
    const initialStates = {} as Record<keyof T, ApiState<T[keyof T]>>;
    keys.forEach(key => {
      initialStates[key] = {
        data: null,
        loading: false,
        error: null,
        retryCount: 0,
      };
    });
    return initialStates;
  });

  const [operations, setOperations] = useState<Record<keyof T, (() => Promise<T[keyof T]>) | null>>(() => {
    const initialOps = {} as Record<keyof T, (() => Promise<T[keyof T]>) | null>;
    keys.forEach(key => {
      initialOps[key] = null;
    });
    return initialOps;
  });

  const executeOperation = useCallback(async (key: keyof T, operation: () => Promise<T[keyof T]>) => {
    try {
      setStates(prev => ({
        ...prev,
        [key]: { ...prev[key], loading: true, error: null }
      }));
      
      setOperations(prev => ({ ...prev, [key]: operation }));

      const result = await operation();
      
      setStates(prev => ({
        ...prev,
        [key]: { 
          ...prev[key], 
          data: result, 
          loading: false, 
          retryCount: 0 
        }
      }));
    } catch (error) {
      console.error(`API operation failed for ${String(key)}:`, error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';

      setStates(prev => ({
        ...prev,
        [key]: { 
          ...prev[key], 
          loading: false, 
          error: errorMessage,
          retryCount: prev[key].retryCount + 1
        }
      }));
    }
  }, []);

  const actions = keys.reduce((acc, key) => {
    acc[key] = {
      retry: () => {
        const operation = operations[key];
        if (operation && states[key].retryCount < (options.maxRetries || 3)) {
          executeOperation(key, operation);
        }
      },
      clearError: () => {
        setStates(prev => ({
          ...prev,
          [key]: { ...prev[key], error: null }
        }));
      },
      reset: () => {
        setStates(prev => ({
          ...prev,
          [key]: {
            data: null,
            loading: false,
            error: null,
            retryCount: 0,
          }
        }));
        setOperations(prev => ({ ...prev, [key]: null }));
      },
    };
    return acc;
  }, {} as Record<keyof T, ApiStateActions>);

  return [states, actions, executeOperation];
}

/**
 * Hook for managing paginated API state
 */
export interface PaginatedApiState<T> extends ApiState<T[]> {
  page: number;
  totalPages: number;
  total: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginatedApiActions extends ApiStateActions {
  nextPage: () => void;
  previousPage: () => void;
  goToPage: (page: number) => void;
}

export function usePaginatedApiState<T>(
  options: UseApiStateOptions & { itemsPerPage?: number } = {}
): [
  PaginatedApiState<T>,
  PaginatedApiActions,
  (operation: (page: number, limit: number) => Promise<{ data: T[]; total: number; page: number; totalPages: number }>) => Promise<void>
] {
  const { itemsPerPage = 20 } = options;
  
  const [state, setState] = useState<PaginatedApiState<T>>({
    data: [],
    loading: false,
    error: null,
    retryCount: 0,
    page: 1,
    totalPages: 0,
    total: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  const [lastOperation, setLastOperation] = useState<((page: number, limit: number) => Promise<{ data: T[]; total: number; page: number; totalPages: number }>) | null>(null);

  const executeOperation = useCallback(async (
    operation: (page: number, limit: number) => Promise<{ data: T[]; total: number; page: number; totalPages: number }>
  ) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }));
      setLastOperation(() => operation);

      const result = await operation(state.page, itemsPerPage);
      
      setState(prev => ({ 
        ...prev, 
        data: result.data,
        loading: false, 
        retryCount: 0,
        page: result.page,
        totalPages: result.totalPages,
        total: result.total,
        hasNextPage: result.page < result.totalPages,
        hasPreviousPage: result.page > 1,
      }));
    } catch (error) {
      console.error('Paginated API operation failed:', error);
      
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'An unknown error occurred';

      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: errorMessage,
        retryCount: prev.retryCount + 1
      }));
    }
  }, [state.page, itemsPerPage]);

  const actions: PaginatedApiActions = {
    retry: useCallback(() => {
      if (lastOperation) {
        executeOperation(lastOperation);
      }
    }, [lastOperation, executeOperation]),
    
    clearError: useCallback(() => {
      setState(prev => ({ ...prev, error: null }));
    }, []),
    
    reset: useCallback(() => {
      setState({
        data: [],
        loading: false,
        error: null,
        retryCount: 0,
        page: 1,
        totalPages: 0,
        total: 0,
        hasNextPage: false,
        hasPreviousPage: false,
      });
      setLastOperation(null);
    }, []),
    
    nextPage: useCallback(() => {
      if (state.hasNextPage && lastOperation) {
        setState(prev => ({ ...prev, page: prev.page + 1 }));
      }
    }, [state.hasNextPage, lastOperation]),
    
    previousPage: useCallback(() => {
      if (state.hasPreviousPage && lastOperation) {
        setState(prev => ({ ...prev, page: prev.page - 1 }));
      }
    }, [state.hasPreviousPage, lastOperation]),
    
    goToPage: useCallback((page: number) => {
      if (page >= 1 && page <= state.totalPages && lastOperation) {
        setState(prev => ({ ...prev, page }));
      }
    }, [state.totalPages, lastOperation]),
  };

  return [state, actions, executeOperation];
}
