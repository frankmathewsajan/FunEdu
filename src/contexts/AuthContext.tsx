import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import type { User } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, userData: { name: string; class?: string; contact?: string; organization?: string }) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<{ success: boolean; error?: string }>;
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
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          setIsAuthenticated(true);
          await fetchUserProfile(session.user.id);
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event: string, session: Session | null) => {
      if (session?.user) {
        setIsAuthenticated(true);
        await fetchUserProfile(session.user.id);
      } else {
        setIsAuthenticated(false);
        setUser(null);
      }
      setIsLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setIsAuthenticated(true);
        await fetchUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Login failed' };
    } catch {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const signup = async (
    email: string,
    password: string,
    userData: { name: string; class?: string; contact?: string; organization?: string }
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.name,
            class: userData.class,
            contact: userData.contact,
            organization: userData.organization,
          },
        },
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        setIsAuthenticated(true);
        await fetchUserProfile(data.user.id);
        return { success: true };
      }

      return { success: false, error: 'Signup failed' };
    } catch {
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await supabase.auth.signOut();
      setIsAuthenticated(false);
      setUser(null);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  const updateProfile = async (data: Partial<User>): Promise<{ success: boolean; error?: string }> => {
    if (!user) {
      return { success: false, error: 'No user logged in' };
    }

    try {
      const { error } = await supabase
        .from('users')
        .update(data)
        .eq('id', user.id);

      if (error) {
        return { success: false, error: error.message };
      }

      await fetchUserProfile(user.id);
      return { success: true };
    } catch {
      return { success: false, error: 'Failed to update profile' };
    }
  };

  const value = {
    isAuthenticated,
    user,
    isLoading,
    login,
    signup,
    logout,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
