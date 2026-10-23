"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function RegisterPage() {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", full_name: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await register(form.email, form.password, form.role || "patient", form.full_name);
      navigate("/onboarding");
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
      </nav>

      <section className="max-w-md mx-auto">
        <span className="eyebrow">WELCOME TO PHYSIOTRACK</span>
        <h1>Create your account</h1>
        <p>
          Sign up to start your recovery journey with PhysioTrack.
        </p>

        {error && <p className="autherror mb-6">{error}</p>}

        <form onSubmit={handleSubmit}>
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

          <div className="mb-4">
            <label className="label">
              Full name
              <input
                value={form.full_name}
                onChange={(e) => setForm({ ...form, full_name: e.target.value })}
                placeholder="Alex Morgan"
              />
            </label>
          </div>

          <div className="mb-6">
            <label className="label">
              Role
              <select
                value={form.role || "patient"}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value as "patient" | "physiotherapist" | "admin" })
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
            Create account
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-muted">
          Already have an account?{" "}
          <NavLink className="underline" to="/login">
            Log in
          </NavLink>
        </p>
      </section>
    </div>
  );
}