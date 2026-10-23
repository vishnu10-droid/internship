"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabase";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function RecoveryReports() {
  const { user } = useAuth();
  const [reports, setReports] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({
    start: new Date(Date.now() - 28 * 86400000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, [user, dateRange]);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("pain_logs")
        .select("*")
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end)
        .eq("patient_id", user?.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setReports(data || []);
    } catch (error) {
      console.error("Failed to fetch reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadReport = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("pain_logs")
        .select("*")
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end)
        .eq("patient_id", user?.id);

      if (error) throw error;

      if (data && data.length > 0) {
        const csvLines = [
          "Date,Body area,Pain,Notes",
          ...data.map(
            (entry) =>
              `"${new Date(entry.created_at).toLocaleDateString()}",${entry.area},${entry.pain},${entry.note || ""}`
          ),
        ];

        const csvContent = csvLines.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `physiotrack-report-${Date.now()}.csv`);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error("Failed to download report:", error);
    }
  }, [dateRange]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading reports...
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-2xl mb-6">
        Recovery Reports
      </h1>

      <div className="card p-6 mb-6">
        <div className="mb-4">
          <label className="label">Date range</label>
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) =>
                setDateRange({ start: e.target.value, end: dateRange.end })
              }
            />
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) =>
                setDateRange({ start: dateRange.start, end: e.target.value })
              }
            />
          </div>
        </div>

        <button
          onClick={downloadReport}
          className="btn-primary w-full py-2 rounded-lg mb-3"
        >
          <i className="download" size={14} me-2 /> Export CSV Report
        </button>

        <p className="text-sm text-muted mb-3">
          Reports cover pain log entries within the selected date range.
        </p>
      </div>

      {/* Pain Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-4">
          <h3 className="font-medium mb-3">Pain Timeline</h3>
          <div className="h-64 rounded-lg bg-secondary/5">
            <div className="h-full w-full rounded-lg flex items-center justify-center text-center text-muted">
              Pain trend chart
            </div>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="font-medium mb-3">Exercise Adherence</h3>
          <div className="h-64 rounded-lg bg-secondary/5">
            <div className="h-full w-full rounded-lg flex items-center justify-center text-center text-muted">
              Adherence chart
            </div>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="font-medium mb-3">Milestones</h3>
          <div className="h-64 rounded-lg bg-secondary/5">
            <div className="h-full w-full rounded-lg flex items-center justify-center text-center text-muted">
              Milestone data
            </div>
          </div>
        </div>
      </div>

      {/* Summary Statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
        <div className="card p-4">
          <p className="text-sm text-muted">Entries logged</p>
          <p className="font-bold text-2xl">{reports.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Average pain</p>
          <p className="font-bold text-2xl">
            {reports.length > 0
              ? (reports.reduce((a: any, x: any) => a + x.pain, 0) /
                  reports.length).toFixed(1)
              : "—"}
            /10
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Date range</p>
          <p className="font-bold text-2xl">
            {new Date(dateRange.start).toLocaleDateString()} - {new Date(
              dateRange.end
            ).toLocaleDateString()}
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Download report</p>
          <button
            onClick={downloadReport}
            className="btn-primary w-full py-2 rounded-lg text-sm"
          >
            Export CSV
          </button>
        </div>
      </div>
    </div>
  );
}