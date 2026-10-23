"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function LoginRegister() {
  const { user, isLoading, login, register } = useAuth();
  const navigate = useNavigate();
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    email: "",
    password: "",
    full_name: "",
    role: "patient",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (mode === "login") {
        await login(form.email, form.password);
        setError("");
        navigate("/patient-dashboard");
      } else {
        await register(
          form.email,
          form.password,
          form.role as "patient" | "physiotherapist" | "admin",
          form.full_name
        );
        setError("");
        navigate("/onboarding?role=" + form.role);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    }
  };

  if (user) {
    navigate("/patient-dashboard");
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Logging in...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-primary/10">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">
          {mode === "login" ? "Sign In" : "Create Account"}
        </h2>

        {error && (
          <p className="text-red-600 text-sm mb-4 text-center">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-secondary/50 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="enter your email"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-muted mb-2">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              className="w-full rounded-xl border border-secondary/50 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              placeholder="enter your password"
            />
          </div>

          {mode === "register" && (
            <div>
              <label className="block text-sm font-medium text-muted mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={form.full_name}
                onChange={handleChange}
                required
                className="w-full rounded-xl border border-secondary/50 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="enter your full name"
              />

              <label className="block text-sm font-medium text-muted mb-2">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-xl border border-secondary/50 px-4 py-3 focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
              >
                <option value="patient">Patient</option>
                <option value="physiotherapist">Physiotherapist</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full rounded-xl bg-primary px-6 py-3 text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted">
            Don't have an account?{" "}
            <a
              href="#"
              onClick={() => setMode("register")}
              className="text-primary hover underline font-medium"
            >
              Register
            </a>
          </p>
          <p className="text-sm text-muted">
            Already have an account?{" "}
            <a
              href="#"
              onClick={() => setMode("login")}
              className="text-primary hover underline font-medium"
            >
              Sign In
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}