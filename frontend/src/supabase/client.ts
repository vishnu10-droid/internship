"use client";

import { createSupabaseClient } from "@supabase/ssr";

// In production, use environment variables
// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export function configureSupabase() {
  // Demo mode - return a mock client structure
  // In production, uncomment the line below and set env variables
  // return createSupabaseClient(supabaseUrl, supabaseAnonKey);

  // For now, return an object with the methods we need
  return {
    auth: {
      getSession: async () => {
        // Check localStorage for demo mode
        const stored = localStorage.getItem("supabase-session");
        if (stored) {
          return { data: { session: JSON.parse(stored) }, error: null };
        }
        return { data: { session: null }, error: null };
      },
      signInWithPassword: async (credentials: { email: string; password: string }) => {
        // Demo authentication
        const users: any = {
          "patient@physiotrack.com": {
            email: "patient@physiotrack.com",
            user_metadata: { role: "patient", full_name: "Alex Morgan" },
          },
          "physio@physiotrack.com": {
            email: "physio@physiotrack.com",
            user_metadata: { role: "physiotherapist", full_name: "Jordan Reed, PT" },
          },
          "admin@physiotrack.com": {
            email: "admin@physiotrack.com",
            user_metadata: { role: "admin", full_name: "System Admin" },
          },
        };

        const user = users[credentials.email];
        if (!user) {
          return { data: { user: null }, error: { message: "Invalid credentials" } };
        }

        // Store in localStorage for demo
        localStorage.setItem("supabase-session", JSON.stringify(data.user));

        return {
          data: {
            user: {
              ...user,
              id: credentials.email.split("@")[0],
            },
          },
          error: null,
        };
      },
      signUp: async (credentials: {
        email: string;
        password: string;
        options: { data: { role: string; full_name: string } };
      }) => {
        // Demo registration
        const existingUsers: string[] = [
          ...(localStorage.getItem("registered-emails") || "").split(",").filter(Boolean),
        ];

        if (existingUsers.includes(credentials.email)) {
          return {
            data: { user: null },
            error: { message: "Email already registered" },
          };
        }

        const user = {
          email: credentials.email,
          user_metadata: {
            role: credentials.options.data.role,
            full_name: credentials.options.data.full_name,
          },
        };

        const registeredEmails = [
          ...(localStorage.getItem("registered-emails") || "").split(",").filter(Boolean),
          credentials.email,
        ];
        localStorage.setItem("registered-emails", registeredEmails.join(","));

        localStorage.setItem("supabase-session", JSON.stringify(user));

        return {
          data: { user },
          error: null,
        };
      },
      updateUser: async () => {
        // Demo update
        return { data: { user: null }, error: null };
      },
      signOut: async () => {
        localStorage.removeItem("supabase-session");
        localStorage.removeItem("pt-ex");
        localStorage.removeItem("pt-journal");
        localStorage.removeItem("pt-settings");
        localStorage.removeItem("pt-user");
        return { data: { user: null }, error: null };
      },
      resetPasswordForEmail: async (email: string) => {
        // Demo password reset
        console.log(`Password reset requested for: ${email}`);
        return { data: {}, error: null };
      },
    },
    from: (table: string) => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: null }),
          maybeSingle: async () => ({ data: null, error: null }),
          maybe: async () => ({ data: [], error: null }),
          execute: async () => ({ data: [], error: null }),
        }),
        order: () => ({
          gte: async () => ({ data: [], error: null }),
          lte: async () => ({ data: [], error: null }),
        }),
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: null }),
          execute: async () => ({ data: [], error: null }),
        }),
      }),
      update: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
      delete: () => ({
        eq: async () => ({ data: null, error: null }),
      }),
    }),
    storage: {
      from: () => ({
        upload: async () => ({ data: { path: "temp" }, error: null }),
        getPublicUrl: () => ({ data: { publicUrl: "" } }),
        remove: async () => ({ error: null }),
      }),
    },
  };
}