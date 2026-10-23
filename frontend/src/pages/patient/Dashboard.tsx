"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { usePatientService } from "../../services/patient";
import { TodayExercisePlayer } from "../patient/ExercisePlayer";
import { PainTracker } from "../patient/PainTracker";
import { ExerciseCard } from "../ui/ExerciseCard";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function PatientDashboard() {
  const { user } = useAuth();
  const patientId = user?.id;
  const { data, isLoading, refresh } = usePatientService(patientId);

  const [filter, setFilter] = useState("All");
  const [showChart, setShowChart] = useState(false);

  useEffect(() => {
    if (patientId) {
      fetchData();
    }
  }, [patientId, refresh]);

  const fetchData = async () => {
    if (patientId) {
      await refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading patient dashboard...
      </div>
    );
  }

  const kpis = data?.kpis || {
    completionPercent: 0,
    completed: 0,
    total: 0,
    weeklyAdherence: 0,
    streak: 0,
  };
  const exercises = data?.exercises || [];
  const sessions = data?.sessions || [];
  const painEntries = data?.painEntries || [];

  return (
    <div className="pt-8 min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-bold text-3xl mb-6 text-primary">
          {user?.user_metadata?.full_name || "Patient"} Dashboard
        </h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 border-l-4 border-primary hover:border-primary/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <i className="check" size={20} className="text-primary" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-muted">Today's completion</p>
                <p className="font-bold text-2xl">{kpis.completionPercent}%</p>
              </div>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-secondary hover:border-secondary/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <i className="trending-up" size={20} className="text-secondary" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-muted">Weekly adherence</p>
                <p className="font-bold text-2xl">{kpis.weeklyAdherence}%</p>
              </div>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-success hover:border-success/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <i className="dumbbell" size={20} className="text-success" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-muted">Exercises completed</p>
                <p className="font-bold text-2xl">{kpis.completed}/{kpis.total}</p>
              </div>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-warning hover:border-warning/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                <i className="flame" size={20} className="text-warning" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm text-muted">Streak</p>
                <p className="font-bold text-2xl">{kpis.streak} days</p>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Exercise Plan */}
        <div className="card mb-6 border-primary/20 hover:border-primary/40 transition-colors group-hover:border-primary/50 shadow-lg group-hover:shadow-xl transition-shadow">
          <div className="flex between p-4">
            <div>
              <h2 className="font-semibold">Today's Exercise Plan</h2>
              <p className="text-sm text-muted">
                {exercises.length} exercises scheduled
              </p>
            </div>
            <TodayExercisePlayer />
          </div>
          <div className="mt-4">
            {exercises.map((ex) => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onToggle={() => console.log("toggle")}
                onStart={() => console.log("start")}
              />
            ))}
          </div>
        </div>

        {/* Pain Tracker */}
        <div className="card mb-6 border-success/20 hover:border-success/40 transition-colors group-hover:border-success/50 shadow-lg group-hover:shadow-xl transition-shadow">
          <div className="p-4">
            <h2 className="font-semibold mb-4 text-success">Pain Tracker</h2>
            <PainTracker />
          </div>
        </div>

        {/* Progress Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="card border-secondary/20 hover:border-secondary/40 transition-colors group-hover:border-secondary/50 shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="p-4">
              <h3 className="font-medium mb-3 text-secondary">Weekly Compliance</h3>
              <div className="h-64 rounded-lg bg-secondary/5 relative overflow-hidden">
                <div
                  className="h-full w-full rounded-lg bg-primary/30 flex items-center justify-center text-primary"
                >
                  <span className="absolute left-2 top-2 text-xs font-medium text-primary">
                    {kpis.completionPercent}% compliance
                  </span>
                  <span className="absolute right-2 bottom-2 text-xs text-muted">
                    {kpis.total} exercises
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-warning/20 hover:border-warning/40 transition-colors group-hover:border-warning/50 shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="p-4">
              <h3 className="font-medium mb-3 text-warning">Pain Trend</h3>
              <div className="h-64 rounded-lg bg-warning/5 relative overflow-hidden">
                <div
                  className="h-full w-full rounded-lg bg-warning/40 flex items-center justify-center text-warning"
                >
                  <span className="absolute left-2 top-2 text-xs font-medium text-warning">
                    {kpis.weeklyAdherence}% adherence
                  </span>
                  <span className="absolute right-2 bottom-2 text-xs text-muted">
                    {painEntries.length} entries
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="card border-success/20 hover:border-success/40 transition-colors group-hover:border-success/50 shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="p-4">
              <h3 className="font-medium mb-3 text-success">Recent Sessions</h3>
              <div className="h-64 rounded-lg bg-success/5 relative overflow-hidden">
                <div
                  className="h-full w-full rounded-lg bg-success/30 flex items-center justify-center text-success"
                >
                  <span className="absolute left-2 top-2 text-xs font-medium text-success">
                    {kpis.streak} days streak
                  </span>
                  <span className="absolute right-2 bottom-2 text-xs text-muted">
                    {sessions.length} sessions
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}