import { useState, useEffect } from "react";

// Simple state management for Auth
// Since we don't have Zustand, we'll use a simple observer pattern

type AuthUser = {
  id: string;
  mobile: string;
  identity: string;
} | null;

interface AuthState {
  user: AuthUser;
  isAuthenticated: boolean;
  isLoading: boolean;
}

let authState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
};

const listeners = new Set<(state: AuthState) => void>();

function notify() {
  listeners.forEach((listener) => listener(authState));
}

export const authStore = {
  getState() {
    return authState;
  },

  setState(newState: Partial<AuthState>) {
    authState = { ...authState, ...newState };
    notify();
  },

  subscribe(listener: (state: AuthState) => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Initialize from cookies/localStorage if needed
  initialize() {
    const role = typeof document !== 'undefined' ? 
      document.cookie.split('; ').find(row => row.startsWith('role='))?.split('=')[1] : null;
    
    if (role) {
      this.setState({
        user: { id: '', mobile: '', identity: role }, // Basic user info from role
        isAuthenticated: true,
        isLoading: false,
      });
    } else {
      this.setState({ isLoading: false });
    }
  }
};

// Hook for using the store in components
export function useAuth() {
  const [state, setState] = useState(authStore.getState());

  useEffect(() => {
    const unsubscribe = authStore.subscribe(setState);
    return () => {
      unsubscribe();
    };
  }, []);

  return state;
}

// Auto-initialize on import in client
if (typeof window !== "undefined") {
  authStore.initialize();
}
