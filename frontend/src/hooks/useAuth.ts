"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "../supabase";
import { useNavigate } from "react-router-dom";

export interface User {
  id: string;
  email: string | null;
  role: "patient" | "physiotherapist" | "admin";
  user_metadata: {
    full_name?: string;
    [key: string]: any;
  };
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  register: (email: string, password: string, role: "patient" | "physiotherapist", full_name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

export function useAuth(): {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string, role?: string) => Promise<void>;
  register: (email: string, password: string, role: "patient" | "physiotherapist", full_name: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
} {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const loadUser = useCallback(async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user as User);
      }
    } catch (error) {
      console.error("Auth load error:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);
  // eslint-disable-next-line react-hooks/exhaustive-deps

  useEffect(() => {
    loadUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session) {
        setUser(session.user as User);
        const role = (session.user as User).user_metadata?.role as
          | "patient"
          | "physiotherapist"
          | "admin";
        if (role === "physiotherapist") {
          navigate("/physio-dashboard");
        } else if (role === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/patient-dashboard");
        }
      } else if (event === "SIGNED_OUT") {
        setUser(null);
        navigate("/login", { replace: true });
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const login = useCallback(async (email: string, password: string, role?: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Set the role based on what was provided or stored
        await supabase.auth.updateUser({
          data: {
            user_metadata: {
              ...(data.user.user_metadata || {}),
              ...(role ? { role } : {}),
            },
          },
        });
        setUser(data.user as User);
        const userRole = (data.user as User).user_metadata?.role;
        if (userRole === "physiotherapist") {
          navigate("/physio-dashboard");
        } else if (userRole === "admin") {
          navigate("/admin-dashboard");
        } else {
          navigate("/patient-dashboard");
        }
      }
    } catch (error: any) {
      throw new Error(error.message || "Login failed");
    }
  }, [navigate]);

  const register = useCallback(async (email: string, password: string, role: "patient" | "physiotherapist", full_name: string) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role,
            full_name,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        await supabase.auth.updateUser({
          data: {
            user_metadata: {
              role,
              full_name,
            },
          },
        });
        setUser(data.user as User);
        navigate(`/onboarding?role=${role}`);
      }
    } catch (error: any) {
      throw new Error(error.message || "Registration failed");
    }
  }, [navigate]);

  const logout = useCallback(async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate("/login", { replace: true });
    } catch (error) {
      console.error("Logout error:", error);
    }
  }, [navigate]);

  const resetPassword = useCallback(async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
    } catch (error: any) {
      throw new Error(error.message || "Password reset failed");
    }
  }, []);

  return { user, isLoading, login, register, logout, resetPassword };
}