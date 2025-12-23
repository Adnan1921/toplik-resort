import { useState, useEffect, useCallback } from 'react';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: string | null;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    if (!isSupabaseConfigured()) {
      setAuthState(prev => ({ ...prev, loading: false }));
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
      } else {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null,
        });
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setAuthState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null,
        });
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    if (!isSupabaseConfigured()) {
      return { error: { message: 'Supabase is not configured' } };
    }

    setAuthState(prev => ({ ...prev, loading: true, error: null }));
    
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setAuthState(prev => ({ ...prev, error: error.message, loading: false }));
      return { error };
    }

    setAuthState({
      user: data.user,
      session: data.session,
      loading: false,
      error: null,
    });

    return { data };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured()) return;
    
    setAuthState(prev => ({ ...prev, loading: true }));
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      session: null,
      loading: false,
      error: null,
    });
  }, []);

  return {
    ...authState,
    signIn,
    signOut,
    isAuthenticated: !!authState.user,
    isConfigured: isSupabaseConfigured(),
  };
};












