"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
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

export function PlatformAnalyticsAdmin() {
  const { user } = useAuth();
  const [sessionData, setSessionData] = useState<any[]>([]);
  const [userGrowth, setUserGrowth] = useState<any[]>([]);
  const [platformMetrics, setPlatformMetrics] = useState({
    totalSessions: 0,
    completionRate: 0,
    activeUsers: 0,
    newThisMonth: 0,
  });
  const [dateRange, setDateRange] = useState<{
    start: string;
    end: string;
  }>({
    start: new Date(Date.now() - 90 * 86400000).toISOString().split("T")[0],
    end: new Date().toISOString().split("T")[0],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [user, dateRange]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      // In demo mode, use static/local data
      // In production, query Supabase tables: exercise_sessions, profiles, etc.

      // Mock session data for last 12 weeks
      const mockSessions = [];
      const mockUsers = [];
      const now = new Date();

      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i * 7);
        const weekSessions = Math.floor(Math.random() * 20) + 10;
        const weekCompleted = Math.floor((weekSessions / 20) * weekSessions);
        mockSessions.push({
          week: date.toLocaleDateString("en-US", { weekday: "short" }),
          sessions: weekSessions,
          completed: weekCompleted,
        });

        // User growth mock
        const newUsers = Math.floor(Math.random() * 5) + 1;
        mockUsers.push({
          week: date.toLocaleDateString("en-US", { weekday: "short" }),
          newUsers,
          total: Math.floor(Math.random() * 50) + 100,
        });
      }

      // Calculate platform metrics
      const totalCompleted = mockSessions.reduce(
        (sum, s) => sum + s.completed,
        0
      );
      const totalSessions = mockSessions.reduce((sum, s) => sum + s.sessions, 0);
      const completionRate = totalSessions > 0 ? Math.round((totalCompleted / totalSessions) * 100) : 0;
      const activeUsers = Math.floor(Math.random() * 100) + 200;
      const newThisMonth = Math.floor(Math.random() * 15) + 5;

      setSessionData(mockSessions);
      setUserGrowth(mockUsers);
      setPlatformMetrics({
        totalSessions,
        completionRate,
        activeUsers,
        newThisMonth,
      });
    } catch (error) {
      console.error("Failed to fetch platform analytics:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString();

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading platform analytics...
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Platform Analytics
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

      {/* Key metrics cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="card p-4">
          <p className="text-sm text-muted">Total sessions</p>
          <p className="font-bold text-2xl">{platformMetrics.totalSessions}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Completion rate</p>
          <p className="font-bold text-2xl">{platformMetrics.completionRate}%</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">Active users</p>
          <p className="font-bold text-2xl">{platformMetrics.activeUsers}</p>
        </div>
        <div className="card p-4">
          <p className="text-sm text-muted">New this month</p>
          <p className="font-bold text-2xl">{platformMetrics.newThisMonth}</p>
        </div>
      </div>

      {/* Session trend chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="p-4 border-b">
            <h3 className="font-medium">Sessions by Week</h3>
            <p className="text-sm text-muted">
              Exercise sessions completed per week
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={sessionData}>
              <XAxis dataKey="week" axisLine={false} tickLine={false} />
              <YAxis />
              <Tooltip />
              <Area dataKey="sessions" fill="#d1fae5" stroke="#16B8A6" />
              <Area dataKey="completed" fill="#e2e8f0" stroke="#7c3aed" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* User growth chart */}
        <div className="card">
          <div className="p-4 border-b">
            <h3 className="font-medium">User Growth</h3>
            <p className="text-sm text-muted">
              New registered users per week
            </p>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={userGrowth}>
              <XAxis dataKey="week" axisLine={false} tickLine={false} />
              <YAxis />
              <Tooltip />
              <Line dataKey="newUsers" stroke="#16B8A6" strokeWidth={3} />
              <Line dataKey="total" stroke="#7c3aed" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Distribution pie chart */}
      <div className="card mt-6">
        <div className="p-4 border-b">
          <h3 className="font-medium">Platform Distribution</h3>
          <p className="text-sm text-muted">
            Users by role
          </p>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart data={[
            { name: "Patients", value: 70 },
            { name: "Physiotherapists", value: 20 },
            { name: "Administrators", value: 10 },
          ]}>
            <Pie
              dataKey="value"
              fill="#80cbc4"
              name="name"
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}