'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Profile, UserRole } from './types';
import { INITIAL_PROFILES } from './mock-data';
import { createClient } from './supabase/client';

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  isLoading: boolean;
  signIn: (email: string, password?: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (params: {
    email: string;
    password?: string;
    fullName: string;
    profession: string;
    nationalId?: string;
    role?: UserRole;
  }) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  switchDemoRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const LOCAL_USER_KEY = 'aulavirtual_current_user';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function initAuth() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const isRealSupabase = supabaseUrl && !supabaseUrl.includes('placeholder');

        if (isRealSupabase) {
          const supabase = createClient();
          const { data: { session } } = await supabase.auth.getSession();

          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser(profile as Profile);
              setIsLoading(false);
              return;
            }
          }
        }

        // Fallback to local user or default student
        const saved = localStorage.getItem(LOCAL_USER_KEY);
        if (saved) {
          setUser(JSON.parse(saved));
        } else {
          // Default to Dr. Camila Valenzuela (student)
          setUser(INITIAL_PROFILES[0]);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(INITIAL_PROFILES[0]));
        }
      } catch (err) {
        console.warn('Auth initialization fallback:', err);
        setUser(INITIAL_PROFILES[0]);
      } finally {
        setIsLoading(false);
      }
    }

    initAuth();
  }, []);

  const signIn = async (email: string, password?: string) => {
    setIsLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isRealSupabase = supabaseUrl && !supabaseUrl.includes('placeholder');

      if (isRealSupabase && password) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          if (profile) {
            setUser(profile as Profile);
            localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
            setIsLoading(false);
            return { success: true };
          }
        }
      }

      // Local / Demo simulation
      const found = INITIAL_PROFILES.find((p) => p.email.toLowerCase() === email.toLowerCase());
      if (found) {
        setUser(found);
        localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(found));
        setIsLoading(false);
        return { success: true };
      }

      // Create on the fly if new email
      const newProfile: Profile = {
        id: 'usr-' + Date.now(),
        full_name: email.split('@')[0].toUpperCase(),
        email,
        role: email.includes('admin') ? 'admin' : 'student',
        profession: 'Profesional de la Salud',
        created_at: new Date().toISOString(),
      };
      setUser(newProfile);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(newProfile));
      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Error al iniciar sesión' };
    }
  };

  const signUp = async ({
    email,
    password,
    fullName,
    profession,
    nationalId,
    role = 'student',
  }: {
    email: string;
    password?: string;
    fullName: string;
    profession: string;
    nationalId?: string;
    role?: UserRole;
  }) => {
    setIsLoading(true);
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      const isRealSupabase = supabaseUrl && !supabaseUrl.includes('placeholder');

      if (isRealSupabase && password) {
        const supabase = createClient();
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              profession,
              national_id: nationalId,
              role,
            },
          },
        });

        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        if (data.user) {
          const profile: Profile = {
            id: data.user.id,
            full_name: fullName,
            email,
            profession,
            national_id: nationalId,
            role,
            created_at: new Date().toISOString(),
          };
          setUser(profile);
          localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
          setIsLoading(false);
          return { success: true };
        }
      }

      const profile: Profile = {
        id: 'usr-' + Date.now(),
        full_name: fullName,
        email,
        profession,
        national_id: nationalId,
        role,
        created_at: new Date().toISOString(),
      };
      setUser(profile);
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(profile));
      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Error en el registro' };
    }
  };

  const signOut = async () => {
    try {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
      if (supabaseUrl && !supabaseUrl.includes('placeholder')) {
        const supabase = createClient();
        await supabase.auth.signOut();
      }
    } catch (e) {
      console.warn('Sign out error', e);
    }
    setUser(null);
    localStorage.removeItem(LOCAL_USER_KEY);
  };

  const switchDemoRole = (newRole: UserRole) => {
    if (newRole === 'admin') {
      setUser(INITIAL_PROFILES[2]); // Dr. Rodrigo Soto (Admin)
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(INITIAL_PROFILES[2]));
    } else {
      setUser(INITIAL_PROFILES[0]); // Dra. Camila Valenzuela (Student)
      localStorage.setItem(LOCAL_USER_KEY, JSON.stringify(INITIAL_PROFILES[0]));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user?.role || 'student',
        isLoading,
        signIn,
        signUp,
        signOut,
        switchDemoRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
