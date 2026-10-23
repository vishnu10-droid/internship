"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabase";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function AlertsPage() {
  const { user } = useAuth();
  const [alerts, setAlerts] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAlerts();
  }, [user, dateRange]);

  const fetchAlerts = async () => {
    setIsLoading(true);
    try {
      // Fetch missed sessions alerts
      const { data: missedSessions, error: missedError } = await supabase
        .from("exercise_sessions")
        .select(`
          *,
          patients!inner (full_name)
        `)
        .lt("completed_at", dateRange.end)
        .gt("started_at", dateRange.start)
        .is("completed_at", null)
        .eq("therapist_id", user?.id);

      // Fetch worsening pain alerts
      const { data: worseningPain, error: worseningError } = await supabase
        .from("pain_logs")
        .select(`
          *,
          patients!inner (full_name)
        `)
        .gt("pain", 7)
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      if (missedError) throw missedError;
      if (worseningError) throw worseningError;

      // Combine and format alerts
      const formattedAlerts = [
        ...(missedSessions || []).map((session: any) => ({
          id: `missed-${session.id}`,
          type: "missed_session",
          severity: "high",
          title: "Missed session",
          patient: session.patients?.full_name || "Unknown patient",
          description: `Session from ${new Date(
            session.started_at
          ).toLocaleDateString()} was not completed`,
          timestamp: session.started_at,
          action: "Follow up",
        })),
        ...(worseningPain || []).map((pain: any) => ({
          id: `pain-${pain.id}`,
          type: "worsening_pain",
          severity: pain.pain >= 9 ? "critical" : "high",
          title: "Worsening pain reported",
          patient: pain.patients?.full_name || "Unknown patient",
          description: `Pain score of ${pain.pain}/10 reported on ${new Date(
            pain.created_at
          ).toLocaleDateString()}`,
          timestamp: pain.created_at,
          action: "Contact patient",
        })),
      ];

      setAlerts(formattedAlerts);
    } catch (error) {
      console.error("Failed to fetch alerts:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const acknowledgeAlert = useCallback((alertId: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== alertId));
  }, []);

  const resolveAlert = useCallback((alertId: string) => {
    setAlerts((prev) =>
      prev.map((a) =>
        a.id === alertId ? { ...a, resolved: true, resolved_at: new Date().toISOString() } : a
      )
    );
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading alerts...
      </div>
    );
  }

  // Color severity
  const severityColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "bg-danger/10 border-danger border";
      case "high":
        return "bg-warning/10 border-warning border";
      case "medium":
        return "bg-info/10 border-info border";
      default:
        return "bg-secondary/10 border-secondary border";
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading alerts...
      </div>
    );
  }

  if (alerts.length === 0) {
    return (
      <div className="p-8 text-center text-muted">
        <i className="check" size={48} className="mb-4" />
        <p>No alerts at this time.</p>
        <p className="text-sm">All patients are adhering to their plans.</p>
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Alerts & Follow-ups
      </h1>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm text-muted">Total alerts</p>
          <p className="font-bold text-2xl">{alerts.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Critical</p>
          <p className="font-bold text-2xl text-danger">
            {alerts.filter((a) => a.severity === "critical").length}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Resolved</p>
          <p className="font-bold text-2xl text-primary">
            {alerts.filter((a) => a.resolved).length}
          </p>
        </div>
      </div>

      {/* Alerts list */}
      <div className="card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Active Alerts</h2>
        </div>

        {isLoading ? (
          <div className="h-96 rounded-lg bg-secondary/5 flex items-center justify-center text-muted">
            Loading alerts...
          </div>
        ) : alerts.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <i className="check" size={48} className="mb-4" />
            <p>No alerts at this time.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr className="border-b border-secondary/5">
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left">Timestamp</th>
                  <th className="p-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {alerts.map((alert: any) => (
                  <tr key={alert.id} className="border-b border-secondary/5">
                    <td className="p-3 font-medium">
                      {alert.patient}
                    </td>
                    <td className="p-3">
                      <span className={severityColor(alert.severity) + " px-2 py-1 rounded text-xs">
                        {alert.type.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="p-3 line-clamp-2">
                      {alert.description}
                    </td>
                    <td className="p-3 text-sm text-muted">
                      {alert.timestamp && new Date(alert.timestamp).toLocaleDateString()}
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2">
                        <button
                          onClick={() => acknowledgeAlert(alert.id)}
                          className="text-primary hover:text-primary/90 text-sm"
                        >
                          Acknowledge
                        </button>
                        <button
                          onClick={() => resolveAlert(alert.id)}
                          className="text-primary hover:text-primary/90 text-sm"
                        >
                          Resolve
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No alerts message when loading */}
        {isLoading && (
          <div className="p-8 text-center text-muted">
            Loading alerts...
          </div>
        )}
      </div>
    </div>
  );
}