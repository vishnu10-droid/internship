"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabase";
import { Inter } from "next/font/google";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
} from "recharts";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function RecoveryReportsPhysio() {
  const { user } = useAuth();
  const [painLogs, setPainLogs] = useState<any[]>([]);
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date(Date.now() - 30 * 86400000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user, dateRange]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // Fetch pain logs for the date range
      const { data: painData, error: painError } = await supabase
        .from("pain_logs")
        .select("*")
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      if (painError) throw painError;
      setPainLogs(painData || []);

      // Fetch exercise sessions
      const { data: sessionDataResult, error: sessionError } = await supabase
        .from("exercise_sessions")
        .select("*")
        .gte("started_at", dateRange.start)
        .lte("started_at", dateRange.end)
        .eq("therapist_id", user?.id);

      if (sessionError) throw sessionError;
      setSessionData(sessionDataResult || []);
    } catch (error) {
      console.error("Failed to fetch physiotherapy reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("pain_logs")
        .select("*")
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end);

      if (error) throw error;

      if (data && data.length > 0) {
        const csvLines = [
          "Date,Patient,Area,Pain,Notes",
          ...data.map(
            (entry) =>
              `"${new Date(entry.created_at).toLocaleDateString()}","${
                entry.patient_id
              }","${entry.area}","${entry.pain}","${entry.note || ""}"`
          ),
        ];

        const csvContent = csvLines.join("\n");
        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.setAttribute("href", url);
        link.setAttribute("download", `physio-report-${Date.now()}.csv`);
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
        Loading physiotherapy reports...
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Patient Reports
      </h1>

      {/* Date range selector */}
      <div className="card p-4 mb-6">
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
        <button
          onClick={downloadCSV}
          className="btn-primary py-2 rounded-lg text-sm ml-2"
        >
          <i className="download" size={14} me-2 /> Export CSV
        </button>
      </div>

      {/* Pain timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="card p-4">
          <h3 className="font-medium mb-3">Pain Timeline</h3>
          <div className="h-80 rounded-lg bg-secondary/5">
            <div className="h-full w-full rounded-lg flex items-center justify-center text-center text-muted">
              Pain trend chart
            </div>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="font-medium mb-3">Exercise Adherence</h3>
          <div className="h-80 rounded-lg bg-secondary/5">
            <div className="h-full w-full rounded-lg flex items-center justify-center text-center text-muted">
              Adherence chart
            </div>
          </div>
        </div>
        <div className="card p-4">
          <h3 className="font-medium mb-3">Patient Progress</h3>
          <div className="h-80 rounded-lg bg-secondary/5">
            <div className="h-full w-full rounded-lg flex items-center justify-center text-center text-muted">
              Progress data
            </div>
          </div>
        </div>
      </div>

      {/* Summary statistics */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
        <div className="card p-4">
          <p className="text-sm text-muted">Total pain entries</p>
          <p className="font-bold text-2xl">{painLogs.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Average pain</p>
          <p className="font-bold text-2xl">
            {painLogs.length > 0
              ? (painLogs.reduce((a: any, x: any) => a + x.pain, 0) /
                  painLogs.length).toFixed(1)
              : "—"}
            /10
          </p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Total sessions</p>
          <p className="font-bold text-2xl">{sessionData.length}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Completion rate</p>
          <p className="font-bold text-2xl">
            {sessionData.length > 0
              ? Math.round(
                  (sessionData.filter((s: any) => s.status === "completed")
                    .length / sessionData.length) * 100
                )
              : "—"}%
          </p>
        </div>
      </div>
    </div>
  );
}