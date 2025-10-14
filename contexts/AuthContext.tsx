import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { AuthState } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
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
  const [loading, setLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setAuthState({
            isAuthenticated: true,
            user: { email: session.user.email || '' },
          });
        }
      } catch (error) {
        console.error('Auth check error:', error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (session) {
          setAuthState({
            isAuthenticated: true,
            user: { email: session.user.email || '' },
          });
        } else {
          setAuthState({
            isAuthenticated: false,
          });
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      console.log('Attempting login for:', email);
      
      // Always try Supabase auth first
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('Supabase login failed:', error.message);
        
        // Fallback to hardcoded credentials only if Supabase auth fails
        if (email === 'office@resusbih.org' && password === 'AmelWeb1.1') {
          console.warn('Using fallback authentication - RLS policies may not work');
          setAuthState({
            isAuthenticated: true,
            user: { email },
          });
          return true;
        }
        
        return false;
      }

      console.log('Supabase login successful');
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setAuthState({
        isAuthenticated: false,
      });
    }
  };

  const value: AuthContextType = {
    ...authState,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};