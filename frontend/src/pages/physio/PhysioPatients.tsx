"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabase";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function PhysioPatients() {
  const { user } = useAuth();
  const [patients, setPatients] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    adherence: "all",
    pain: "all",
    search: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPatients();
  }, [user]);

  const fetchPatients = async () => {
    setIsLoading(true);
    try {
      const { data: assignments, error: assignError } = await supabase
        .from("therapist_patient_assignments")
        .select(`
          patient_id,
          patients!inner (
            full_name,
            email,
            role
          ),
          treatment_plans!inner (
            status,
            start_date,
            end_date
          )
        `)
        .eq("therapist_id", user?.id);

      if (assignError) throw assignError;

      let patients = (assignments || []).map((a: any) => ({
        id: a.patient_id,
        name: a.patients?.full_name || "Unknown",
        email: a.patients?.email || "",
        adherence: Math.floor(Math.random() * 30) + 70, // demo data
        lastSession: new Date().toLocaleDateString(),
        painTrend: Math.floor(Math.random() * 5) + 2, // 2-7
        needsFollowup: Math.random() > 0.7,
        planStatus: a.treatment_plans?.status || "active",
      }));

      setPatients(patients);
    } catch (error) {
      console.error("Failed to fetch patients:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }, []);

  const filteredPatients = patients.filter(
    (p) =>
      (filters.adherence === "all" ||
        (filters.adherence === "good"
          ? p.adherence >= 70
          : p.adherence < 70)) &&
      (filters.pain === "all" ||
        (filters.pain === "high"
          ? p.painTrend >= 7
          : filters.pain === "low"
          ? p.painTrend <= 3
          : true)) &&
      (filters.search === "" ||
        p.name.toLowerCase().includes(filters.search.toLower()))
  );

  const statusColor = (val: number) => {
    if (val >= 80) return "bg-green-100 text-green-800";
    if (val >= 60) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const followupBadge = (needsFollowup: boolean) => (
    <span
      className={needsFollowup
        ? "bg-warning/20 text-warning px-2 py-1 rounded text-xs"
        : "bg-green-100 text-green-800 px-2 py-1 rounded text-xs"}
    >
      {needsFollowup ? "Follow-up" : "Good"}
    </span>
  );

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading patients...
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Patient Monitoring
      </h1>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <form onSubmit={(e) => e.preventDefault()} className="grid grid-cols-4 gap-3">
          <select
            onChange={(e) => handleFilterChange("adherence", e.target.value)}
            className="select"
          >
            <option value="all">Adherence</option>
            <option value="good">Good (≥70%)</option>
            <option value="low">Low at 70% or less</option>
          </select>
          <select
            onChange={(e) => handleFilterChange("pain", e.target.value)}
            className="select col-span-2"
          >
            <option value="all">Pain Reports</option>
            <option value="high">High (≥7)</option>
            <option value="low">Low (≤3)</option>
            <option value="medium">Medium (4-6)</option>
          </select>
          <input
            type="text"
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            placeholder="Search patient..."
            className="input"
          />
          <button type="submit" className="btn-primary py-2 rounded-lg text-sm">
            Apply
          </button>
        </form>
      </div>

      {/* Patients table */}
      <div className="card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Assigned Patients ({filteredPatients.length})</h2>
        </div>

        {isLoading ? (
          <div className="h-96 rounded-lg bg-secondary/5 flex items-center justify-center text-muted">
            Loading patients...
          </div>
        ) : filteredPatients.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <i className="user-group" size={48} className="mb-4" />
            <p>No patients match the current filters.</p>
            <p className="text-sm">Adjust filters to find specific patients.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr className="border-b border-secondary/5">
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-left">Adherence</th>
                  <th className="p-3 text-left">Pain Trend</th>
                  <th className="p-3 text-left">Last Session</th>
                  <th className="p-3 text-left">Follow-up</th>
                  <th className="p-3 text-right">Plan</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map((p: any) => (
                  <tr key={p.id} className="border-b border-secondary/5">
                    <td className="p-3 font-medium">
                      <div className="flex items-center gap-3">
                        <i className="user" size={20} className="text-primary" />
                        <span>{p.name}</span>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className={statusColor(p.adherence)}>
                          {p.adherence}%
                        </span>
                        <small className="text-muted"> adherence</small>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                          <div
                            key={i}
                            className={`w-1 h-1 rounded-full ${
                              i <= p.painTrend ? "bg-primary" : "bg-secondary"
                            }`}
                          /></div>
                        ))}
                      </div>
                      <small className="text-muted"> avg pain</small>
                    </td>
                    <td className="p-3 text-sm text-muted">
                      {p.lastSession}
                    </td>
                    <td className="p-3">
                      {followupBadge(p.needsFollowup)}
                    </td>
                    <td className="p-3 text-right">
                      <span className={p.planStatus === "active" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs">
                        {p.planStatus}
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <button
                        className="text-primary hover:text-primary/90 text-sm mr-2"
                        onClick={() => window.alert("View patient profile")}
                      >
                        View
                      </button>
                      <button
                        className="text-warning hover-warning/90 text-sm"
                        onClick={() => window.alert("Send message to patient")}
                      >
                        Message
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredPatients.length === 0 && (
                  <tr>
                    <td className="p-3 text-muted" colspan="7">
                      No patients matching criteria
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
            Loading patients...
          </div>
        )}
      </div>
    </div>
  );
}