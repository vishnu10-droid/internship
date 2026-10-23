"use client";

import { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { ExerciseLibrary } from "./pages/patient/ExerciseLibrary";
import { PatientDashboard } from "./pages/patient/Dashboard";
import { PhysioDashboard } from "./pages/physio/Dashboard";
import { AdminDashboard } from "./pages/admin/Dashboard";
import { AdminUsers } from "./pages/admin/AdminUsers";
import { AdminPhysios } from "./pages/admin/AdminPhysios";
import { AdminExerciseLibrary } from "./pages/admin/AdminExerciseLibrary";
import { LandingPage } from "./pages/landing";
import { LoginPage } from "./pages/auth/Login";
import { RegisterPage } from "./pages/auth/Register";
import { OnboardingPage } from "./pages/auth/Onboarding";
import { MotionTrackingPage } from "./pages/monitoring/MotionTracking";
import { RecoveryReports } from "./pages/patient/RecoveryReports";
import { TodayExercisePlayer } from "./patient/ExercisePlayer";
import { PainTracker } from "./pages/patient/PainTracker";
import { AdherenceAnalytics } from "./pages/physio/AdherenceAnalytics";
import { AlertsPage } from "./pages/physio/AlertsPage";
import { RecoveryReportsPhysio } from "./pages/physio/RecoveryReportsPhysio";
import { ExercisePlanBuilder } from "./pages/physio/ExercisePlanBuilder";
import { Inter } from "next/font/google";

const inter = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

function getPatientElement(userRole: string | undefined) {
  if (userRole === "patient") return <PatientDashboard />;
  if (userRole === "physiotherapist") return <Navigate to="/patient-dashboard" replace />;
  if (userRole === "admin") return <Navigate to="/patient-dashboard" replace />;
  return <PatientDashboard />;
}

function getExercisesElement(userRole: string | undefined) {
  if (userRole === "patient") return <ExerciseLibrary />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getStartSessionElement(userRole: string | undefined) {
  if (userRole === "patient") return <TodayExercisePlayer />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getMyProgressElement(userRole: string | undefined) {
  if (userRole === "patient") return <RecoveryReports />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getPainTrackerElement(userRole: string | undefined) {
  if (userRole === "patient") return <PainTracker />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getMessagesElement(userRole: string | undefined) {
  if (userRole === "patient") return <PatientMessages />;
  if (userRole === "physiotherapist") return <TherapistMessages />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getAppointmentsElement(userRole: string | undefined) {
  if (userRole === "patient") return <AppointmentsPage />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getPatientSettingsElement(userRole: string | undefined) {
  if (userRole === "patient") return <SettingsPagePatient />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getPhysioDashboardElement(userRole: string | undefined) {
  if (userRole === "physiotherapist") return <PhysioDashboard />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getPhysioPatientsElement(userRole: string | undefined) {
  if (userRole === "physiotherapist") return <PhysioPatients />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getPhysioPlansElement(userRole: string | undefined) {
  if (userRole === "physiotherapist") return <ExercisePlanBuilder />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getPhysioAdherenceElement(userRole: string | undefined) {
  if (userRole === "physiotherapist") return <AdherenceAnalytics />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getPhysioAlertsElement(userRole: string | undefined) {
  if (userRole === "physiotherapist") return <AlertsPage />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getPhysioReportsElement(userRole: string | undefined) {
  if (userRole === "physiotherapist") return <RecoveryReportsPhysio />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getPhysioSettingsElement(userRole: string | undefined) {
  if (userRole === "physiotherapist") return <SettingsPagePhysio />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getAdminDashboardElement(userRole: string | undefined) {
  if (userRole === "admin") return <AdminDashboard />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getAdminUsersElement(userRole: string | undefined) {
  if (userRole === "admin") return <AdminUsers />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getAdminPhysiosElement(userRole: string | undefined) {
  if (userRole === "admin") return <AdminPhysios />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getAdminExerciseLibraryElement(userRole: string | undefined) {
  if (userRole === "admin") return <AdminExerciseLibrary />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getAdminAnalyticsElement(userRole: string | undefined) {
  if (userRole === "admin") return <PlatformAnalyticsAdmin />;
  return <Navigate to="/patient-dashboard" replace />;
}

function getAdminLogsElement(userRole: string | undefined) {
  if (userRole === "admin") return <AuditLogs />;
  return <Navigate to="/patient-dashboard" replace />;
}

export function App() {
  const { user, isLoading, setUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading) {
      const supabase = /* @ts-ignore */ (() => {
        try {
          return require("../supabase/client").configureSupabase();
        } catch {
          return null;
        }
      })();
      if (supabase) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            setUser(session.user);
            const role = session.user.user_metadata?.role;
            if (role === "physiotherapist") {
              navigate("/physio-dashboard");
            } else if (role === "admin") {
              navigate("/admin-dashboard");
            } else {
              navigate("/patient-dashboard");
            }
          }
        });
      }
    }
  }, [isLoading, navigate, setUser]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
      </Routes>
    );
  }

  const role = user.user_metadata?.role;

  // Pre-compute all route elements to avoid JSX ternary parsing issues
  const patientDashboard = getPatientElement(role);
  const exercises = getExercisesElement(role);
  const startSession = getStartSessionElement(role);
  const myProgress = getMyProgressElement(role);
  const painTracker = getPainTrackerElement(role);
  const messages = getMessagesElement(role);
  const appointments = getAppointmentsElement(role);
  const patientSettings = getPatientSettingsElement(role);
  const physioDashboard = getPhysioDashboardElement(role);
  const physioPatients = getPhysioPatientsElement(role);
  const physioPlans = getPhysioPlansElement(role);
  const physioAdherence = getPhysioAdherenceElement(role);
  const physioAlerts = getPhysioAlertsElement(role);
  const physioReports = getPhysioReportsElement(role);
  const physioSettings = getPhysioSettingsElement(role);
  const adminDashboard = getAdminDashboardElement(role);
  const adminUsers = getAdminUsersElement(role);
  const adminPhysios = getAdminPhysiosElement(role);
  const adminExerciseLibrary = getAdminExerciseLibraryElement(role);
  const adminAnalytics = getAdminAnalyticsElement(role);
  const adminLogs = getAdminLogsElement(role);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/patient-dashboard" replace />} />

        <Route path="/patient-dashboard" element={patientDashboard} />
        <Route path="/exercises" element={exercises} />
        <Route path="/start-session" element={startSession} />
        <Route path="/my-progress" element={myProgress} />
        <Route path="/pain-tracker" element={painTracker} />
        <Route path="/messages" element={messages} />
        <Route path="/appointments" element={appointments} />
        <Route path="/patient-settings" element={patientSettings} />

        <Route path="/physio-dashboard" element={physioDashboard} />
        <Route path="/physio-patients" element={physioPatients} />
        <Route path="/physio-plans" element={physioPlans} />
        <Route path="/physio-adherence" element={physioAdherence} />
        <Route path="/physio-alerts" element={physioAlerts} />
        <Route path="/physio-reports" element={physioReports} />
        <Route path="/physio-settings" element={physioSettings} />

        <Route path="/admin-dashboard" element={adminDashboard} />
        <Route path="/admin-users" element={adminUsers} />
        <Route path="/admin-physiotherapists" element={adminPhysios} />
        <Route path="/admin-exercise-library" element={adminExerciseLibrary} />
        <Route path="/admin-analytics" element={adminAnalytics} />
        <Route path="/admin-logs" element={adminLogs} />

        <Route path="/monitoring" element={<MotionTrackingPage />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}