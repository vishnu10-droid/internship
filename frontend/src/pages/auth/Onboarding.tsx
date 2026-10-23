"use client";

import { useState, useEffect } from "react";
import { useNavigate, useRouter } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function OnboardingPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [selectedRole, setSelectedRole] = useState<"patient" | "physiotherapist" | "admin">(
    "patient"
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // If user already has a role set, redirect them
    if (user?.user_metadata?.role) {
      const role = user.user_metadata.role;
      if (role === "physiotherapist") {
        navigate("/physio-dashboard");
      } else if (role === "admin") {
        navigate("/admin-dashboard");
      } else {
        navigate("/patient-dashboard");
      }
    }
  }, [user, navigate]);

  const completeOnboarding = async () => {
    if (!fullName.trim()) return;
    setIsLoading(true);
    try {
      await supabase?.auth?.updateUser({
        data: {
          user_metadata: {
            ...user?.user_metadata,
            full_name: fullName,
          },
        },
      });
      setSelectedRole(fullName.includes(" ") && !selectedRole
        ? "physiotherapist"
        : selectedRole);
      navigate(`/${selectedRole}-dashboard`);
    } catch (error) {
      console.error("Onboarding failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.user_metadata?.role) {
    const role = user.user_metadata.role;
    if (role === "physiotherapist") {
      return <Navigate to="/physio-dashboard" replace />;
    } else if (role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    }
    return <Navigate to="/patient-dashboard" replace />;
  }

  return (
    <div className="min-vh-100 bg-background p-6 max-w-md mx-auto">
      <nav className="mb-4">
        <NavLink to="/" className="brand">
          <i className="activity" /> Physio<span>Track</span>
        </NavLink>
      </nav>

      <div className="card p-6">
        <h2 className="font-bold text-2xl mb-4">Tell us about you</h2>

        <p className="text-muted mb-6">
          Select your role to access the appropriate dashboard.
        </p>

        <div className="grid grid-cols-1 gap-4 mb-6">
          <button
            onClick={() => setSelectedRole("patient")}
            className={selectedRole === "patient"
              ? "btn-primary w-full py-3 rounded-lg border border-primary border-opacity-50"
              : "btn-primary w-full py-3 rounded-lg bg-primary text-white"}
          >
            <span>I'm a Patient</span>
          </button>
          <button
            onClick={() => setSelectedRole("physiotherapist")}
            className={selectedRole === "physiotherapist"
              ? "btn-primary w-full py-3 rounded-lg border border-primary border-opacity-50"
              : "btn-primary w-full py-3 rounded-lg bg-primary text-white"}
          >
            <span>I'm a Physiotherapist</span>
          </button>
          <button
            onClick={() => setSelectedRole("admin")}
            className={selectedRole === "admin"
              ? "btn-primary w-full py-3 rounded-lg border border-primary border-opacity-50"
              : "btn-primary w-full py-3 rounded-lg bg-primary text-white"}
          >
            <span>I'm an Administrator</span>
          </button>
        </div>

        <div>
          <label className="label">
            Full name
            <input
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Alex Morgan"
              className="input w-full"
            />
          </label>
        </div>

        <button
          onClick={completeOnboarding}
          className="btn-primary w-full py-3 rounded-lg mt-6 text-lg font-medium"
          disabled={!fullName.trim()}
        >
          {isLoading ? "Loading..." : "Continue to Dashboard"}
        </button>
      </div>
    </div>
  );
}