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
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function AdherenceAnalytics() {
  const { user } = useAuth();
  const [weeklyData, setWeeklyData] = useState<any[]>([]);
  const [painTrend, setPainTrend] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date(Date.now() - 60 * 86400000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });

  useEffect(() => {
    fetchAnalytics();
  }, [user, dateRange]);

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      // Fetch exercise sessions for the date range
      const { data: sessionData, error: sessionError } = await supabase
        .from("exercise_sessions")
        .select("*")
        .gte("completed_at", dateRange.start)
        .lte("completed_at", dateRange.end)
        .eq("therapist_id", user?.id);

      if (sessionError) throw sessionError;

      // Fetch pain logs
      const { data: painData, error: painError } = await supabase
        .from("pain_logs")
        .select("*")
        .gte("created_at", dateRange.start)
        .lte("created_at", dateRange.end)
        .eq("therapist_id", user?.id);

      if (painError) throw painError;

      // Process weekly completion data
      const weeklyCompletion = [
        ["Mon", 0],
        ["Tue", 0],
        ["Wed", 0],
        ["Thu", 0],
        ["Fri", 0],
        ["Sat", 0],
        ["Sun", 0],
      ];

      const painEntries = (painData || []).map((entry: any) => ({
        date: new Date(entry.created_at).toLocaleDateString(),
        pain: entry.pain,
      }));

      const sessions = (sessionData || []).map((session: any) => {
        const date = new Date(session.completed_at || session.started_at).toLocaleDateString();
        return { date, status: session.status || "completed" };
      });

      // Calculate weekly completion
      const calendarData: any[] = [];
      for (let i = 6; i >= 0; i--) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toLocaleDateString("en-US", {
          weekday: "short",
          month: "numeric",
          day: "numeric",
        });

        const completedSessions = sessions.filter(
          (s: any) => s.date === dateStr && s.status === "completed"
        ).length;

        weeklyCompletion[i][1] = completedSessions;
        calendarData.push({ d: dateStr, value: completedSessions });
      }

      setWeeklyData(calendarData);
      setPainTrend(painEntries);
    } catch (error) {
      console.error("Failed to fetch analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading analytics...
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Adherence Analytics
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
        <button className="btn-primary py-2 rounded-lg text-sm ml-2">
          Apply
        </button>
      </div>

      {/* Weekly completion chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-4 border-b">
            <h3 className="font-medium">Weekly Completion Rate</h3>
            <p className="text-sm text-muted">
              Exercise completion per day
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={weeklyData}>
              <CartesianGrid vertical={false} stroke="#edf1f3" />
              <XAxis dataKey="d" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip />
              <Bar dataKey="value" fill="#16B8A6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pain trend chart */}
        <div className="card">
          <div className="p-4 border-b">
            <h3 className="font-medium">Pain Trend</h3>
            <p className="text-sm text-muted">
              Patient-reported pain levels
            </p>
          </div>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={painTrend}>
              <CartesianGrid vertical={false} stroke="#edf1f3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line dataKey="pain" stroke="#F4B740" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Key insights */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mt-6">
        <div className="card p-4">
          <p className="text-sm text-muted">Total sessions</p>
          <p className="font-bold text-2xl">84</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Completion rate</p>
          <p className="font-bold text-2xl">78%</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Avg pain score</p>
          <p className="font-bold text-2xl">3.2 /10</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Improvement</p>
          <p className="font-bold text-green-600">12% ↑</p>
        </div>
      </div>
    </div>
  );
}