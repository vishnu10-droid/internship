"use client";

import { useEffect } from "react";
import { useAdminService } from "../../services/admin";

export function AdminDashboard() {
  const { stats, isLoading, refresh } = useAdminService();

  useEffect(() => {
    fetchStats();
  }, [refresh]);

  const fetchStats = async () => {
    await refresh();
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading admin dashboard...
      </div>
    );
  }

  return (
    <div className="pt-6 min-h-screen bg-gradient-to-br from-indigo-50 to-violet-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-bold text-3xl mb-6 text-indigo-600">
          Administrator Dashboard
        </h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 border-l-4 border-indigo-600 hover:border-indigo-600/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-indigo-600/10 flex items-center justify-center shrink-0">
                <i className="users" size={20} className="text-indigo-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted">Total registered patients</p>
                <p className="font-bold text-2xl">{stats.totalPatients}</p>
              </div>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-violet-500 hover:border-violet-500/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-violet-500/10 flex items-center justify-center shrink-0">
                <i className="user-plus" size={20} className="text-violet-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted">Total physiotherapists</p>
                <p className="font-bold text-2xl">{stats.totalTherapists}</p>
              </div>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-green-600 hover:border-green-600/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-green-600/10 flex items-center justify-center shrink-0">
                <i className="clipboard" size={20} className="text-green-600" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted">Active treatment plans</p>
                <p className="font-bold text-2xl">{stats.activePlans}</p>
              </div>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-purple-500 hover:border-purple-500/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                <i className="trending-up" size={20} className="text-purple-500" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted">Platform activity</p>
                <p className="font-bold text-2xl">{stats.platformActivity}+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent activity / platform overview */}
        <div className="card mt-6 border-indigo-600/20 hover:border-indigo-600/40 transition-colors group-hover:border-indigo-600/50 shadow-lg group-hover:shadow-xl transition-shadow">
          <div className="p-4 border-b border-indigo-600/20">
            <h2 className="font-semibold">Platform Overview</h2>
          </div>

          <div className="p-6">
            <p className="text-muted mb-4">
              Admin dashboard provides comprehensive platform metrics and user management capabilities. Connect Supabase to see live data from the PostgreSQL database.
            </p>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-lg bg-indigo-600/5">
                <h3 className="font-medium mb-2 text-indigo-600">Users</h3>
                <p className="text-sm">Manage patient and therapist accounts</p>
              </div>
              <div className="p-4 rounded-lg bg-violet-500/5">
                <h3 className="font-medium mb-2 text-violet-500">Therapists</h3>
                <p className="text-sm">Approval and account status management</p>
              </div>
              <div className="p-4 rounded-lg bg-green-600/5">
                <h3 className="font-medium mb-2 text-green-600">Exercise Library</h3>
                <p className="text-sm">Exercise catalog management</p>
              </div>
              <div className="p-4 rounded-lg bg-purple-500/5">
                <h3 className="font-medium mb-2 text-purple-500">Analytics</h3>
                <p className="text-sm">Platform usage analytics</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}