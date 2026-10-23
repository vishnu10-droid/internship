"use client";

import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function Navbar() {
  const { user, isLoggingOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "physiotherapist") {
      navigate("/physio-dashboard");
    } else if (user?.role === "admin") {
      navigate("/admin-dashboard");
    } else if (user?.role === "patient") {
      navigate("/patient-dashboard");
    }
  }, [user?.role, navigate]);

  if (!user) {
    return (
      <nav className="border-b border-secondary/50 bg-white/90 backdrop-blur-sm sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <i className="dumbbell text-primary text-2xl" />
            <span className="text-xl font-bold text-primary">FitTrack</span>
          </div>
          <div className="hidden sm:flex items-center gap-6">
            <a href="#features" className="text-muted hover:text-primary transition-colors">Features</a>
            <a href="#about" className="text-muted hover:text-primary transition-colors">About</a>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <a href="#login" className="btn-primary py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors">
            Get Started
          </a>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-primary/20 bg-primary/5 backdrop-blur-sm sticky top-0 z-20">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <i className="dumbbell text-primary text-2xl" />
          <span className="text-xl font-bold text-primary">FitTrack</span>
        </div>
        <div className="hidden sm:flex items-center gap-6">
          <a href="#features" className="text-primary hover:text-primary/90 transition-colors">Features</a>
          <a href="#about" className="text-primary hover:text-primary/90 transition-colors">About</a>
        </div>
        <div className="flex items-center gap-2">
          {user?.full_name && (
            <span className="text-white font-medium">{user.full_name}</span>
          )}
          {user?.role !== "patient" && (
            <button
              onClick={() => navigate("/logout")}
              className="btn-secondary py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Logout
            </button>
          )}
          {user?.role === "patient" && (
            <a
              href="#patient-dashboard"
              className="btn-primary py-2 px-4 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Dashboard
            </a>
          )}
        </div>
      </div>
    </nav>
  );
}