import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthState } from '../types';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
  });

  const login = (email: string, password: string): boolean => {
    // Hardcoded credentials
    if (email === 'office@resusbih.org' && password === 'AmelWeb1.1') {
      setAuthState({
        isAuthenticated: true,
        user: { email },
      });
      return true;
    }
    return false;
  };

  const logout = () => {
    setAuthState({
      isAuthenticated: false,
    });
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};