"use client";

import { useState } from "react";
import { useNavigate, useRouter } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function LoginPage() {
  const { login, user, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [mode, setMode] = useState("login"); // "login" or "register"

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(form.email, form.password);
      setError("");
    } catch (err: any) {
      setError(err.message || "Login failed");
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form.email, form.password, form.full_name);
      setError("");
    } catch (err: any) {
      setError(err.message || "Registration failed");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100 bg-background p-6">
      <nav className="mb-6">
        <NavLink to="/" className="brand">
          <i className="activity" /> Physio<span>Track</span>
        </NavLink>
<nav>
          <NavLink to="#features" className="text-muted hover:text-primary/90 text-sm">
            Features
          </NavLink>
          <NavLink to="#how" className="text-muted hover:text-primary/90 text-sm">
            How it works
          </NavLink>
          {user ? null : (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink className="primary" to="/register">
                Create account
              </NavLink>
            </>
          )}
</nav>
      </nav>

      <section className="max-w-md mx-auto">
        <span className="eyebrow">WELCOME TO PHYSIOTRACK</span>
        <h1>{mode === "login" ? "Welcome back" : "Create your account"}</h1>
        <p>
          {mode === "login"
            ? "Log in to continue with your therapy plan."
            : "Start your recovery journey in a few moments."}
        </p>

        {error && <p className="autherror mb-6">{error}</p>}

        <form onSubmit={mode === "login" ? handleSubmit : handleRegister}>
          <div className="mb-4">
            <label className="label">
              Email address
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="you@example.com"
              />
            </label>
          </div>

          {mode === "register" && (
            <div className="mb-4">
              <label className="label">
                Full name
                <input
                  value={form.full_name || ""}
                  onChange={(e) =>
                    setForm({ ...form, full_name: e.target.value })
                  }
                  placeholder="Alex Morgan"
                />
              </label>
            </div>
          )}

          <div className="mb-6">
            <label className="label">
              Role
              <select
                value={mode === "register" ? form.role : "patient"}
                onChange={(e) =>
                  setForm({
                    ...form,
                    role: e.target.value as "patient" | "physiotherapist" | "admin",
                  })
                }
                className="select select-sm"
              >
                <option value="patient">Patient</option>
                <option value="physiotherapist">Physiotherapist</option>
                <option value="admin">Administrator</option>
              </select>
            </label>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 rounded-lg text-lg font-medium"
          >
            {mode === "login" ? "Log in" : "Create account"}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          {mode === "login"
            ? "New to PhysioTrack? "
            : "Already have an account? "}
          <NavLink className="underline hover:text-primary/90" to="/register">
            Create an account
          </NavLink>{mode === "login" && " • "}<NavLink className="underline hover:text-primary/90" to="/login">
            Log in
          </NavLink>
          {mode === "login" ? "." : "."}
        </p>
      </section>
    </div>
  );
}