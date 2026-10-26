"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function AuditLogs() {
  const { user } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [filterType, setFilterType] = useState("all");
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchLogs();
  }, [user, dateRange, filterType]);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      // In demo mode, use localStorage data
      const storedLogs: any[] = JSON.parse(
        localStorage.getItem("admin-logs") || "[]"
      );
      setLogs(storedLogs);
    } catch (error) {
      console.error("Failed to fetch audit logs:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredLogs = logs.filter(
    (log) =>
      filterType === "all" ||
      (log.action && log.action.toLowerCase().includes(filterType.toLower()))
  );

  const rangeLogs = filteredLogs.filter(
    (log) =>
      new Date(log.timestamp) >= new Date(dateRange.start) &&
      new Date(log.timestamp) <= new Date(dateRange.end)
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading audit logs...
      </div>
    );
  }

  const actionColor = (action: string) => {
    if (action.includes("delete") || action.includes("remove"))
      return "text-danger";
    if (action.includes("approve") || action.includes("activate"))
      return "text-primary";
    if (action.includes("login") || action.includes("sign"))
      return "text-muted";
    return "text-info";
  };

  const actionIcon = (action: string) => {
    if (action.includes("delete") || action.includes("remove")) return "<X/>"; // simplified
    if (action.includes("approve") || action.includes("activate")) return "<Check/>";
    if (action.includes("login") || action.includes("sign")) return "<User/>";
    return "<Clipboard/>";
  };

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Audit Logs
      </h1>

      {/* Filter and date range */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="select"
          >
            <option value="all">All actions</option>
            <option value="user_management">User management</option>
            <option value="role_change">Role change</option>
            <option value="plan_creation">Plan creation</option>
            <option value="session_modification">Session modification</option>
          </select>
          <select
            value={dateRange ? "custom" : "24h"} // simplified
            className="select"
          >
            <option>24h</option>
            <option>7 days</option>
            <option>30 days</option>
            <option>90 days</option>
          </select>
          <button className="btn-primary py-2 rounded-lg text-sm">Apply</button>
        </div>
      </div>

      {/* Audit logs table */}
      <div className="card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Audit Logs ({rangeLogs.length})</h2>
        </div>

        {rangeLogs.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <i className="eye" size={48} className="mb-4" />
            <p>No audit logs found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr className="border-b border-secondary/5">
                  <th className="p-3 text-left">Timestamp</th>
                  <th className="p-3 text-left">Actor</th>
                  <th className="p-3 text-left">Action</th>
                  <th className="p-3 text-left">Target</th>
                  <th className="p-3 text-right">Details</th>
                </tr>
              </thead>
              <tbody>
                {rangeLogs.map((log: any) => (
                  <tr key={log.id} className="border-b border-secondary/5">
                    <td className="p-3 text-muted text-sm">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-3 font-medium">
                      {log.actor_name || "System"}
                    </td>
                    <td className="p-3">
                      <span className={actionColor(log.action)}>
                        {log.action}
                      </span>
                    </td>
                    <td className="p-3">
                      {log.target_type && log.target_id
                        ? `${log.target_type} #${log.target_id}`
                        : "—"}
                    </td>
                    <td className="p-3 text-muted text-sm">
                      {log.details || "—"}
                    </td>
                  </tr>
                ))}
                {rangeLogs.length === 0 && (
                  <tr>
                    <td className="p-3 text-muted" colspan="5">
                      No logs matching criteria
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* Loading state */}
        {isLoading && (
          <div className="p-8 text-center text-muted">
            Loading audit logs...
          </div>
        )}
      </div>
    </div>
  );
}