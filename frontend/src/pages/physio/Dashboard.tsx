"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { usePhysioService } from "../../services/physio";

export function PhysioDashboard() {
  const { user } = useAuth();
  const userId = user?.id;
  const { data, isLoading, refresh } = usePhysioService(userId);

  const patients = data?.patients || [];

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId, refresh]);

  const fetchData = async () => {
    if (userId) {
      await refresh();
    }
  };

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading physiotherapist dashboard...
      </div>
    );
  }

  const kpis = data?.kpis || {
    totalPatients: 0,
    activePlans: 0,
    averageAdherence: 0,
    patientsNeedingFollowup: 0,
  };

  return (
    <div className="pt-6 min-h-screen bg-gradient-to-br from-secondary-50 to-primary-50">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="font-bold text-3xl mb-6 text-primary">
          Physiotherapist Dashboard
        </h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="card p-4 border-l-4 border-primary hover:border-primary/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <i className="users" size={20} className="text-primary" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted">Total assigned patients</p>
                <p className="font-bold text-2xl">{kpis.totalPatients}</p>
              </div>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-secondary hover:border-secondary/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-secondary/10 flex items-center justify-center shrink-0">
                <i className="clipboard" size={20} className="text-secondary" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted">Active treatment plans</p>
                <p className="font-bold text-2xl">{kpis.activePlans}</p>
              </div>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-success hover:border-success/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-success/10 flex items-center justify-center shrink-0">
                <i className="trending-up" size={20} className="text-success" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted">Average adherence</p>
                <p className="font-bold text-2xl">{kpis.averageAdherence}%</p>
              </div>
            </div>
          </div>
          <div className="card p-4 border-l-4 border-warning hover:border-warning/90 transition-colors group:hover shadow-lg group-hover:shadow-xl transition-shadow">
            <div className="flex items-start">
              <div className="w-8 h-8 rounded-lg bg-warning/10 flex items-center justify-center shrink-0">
                <i className="alert-circle" size={20} className="text-warning" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-muted">Patients needing follow-up</p>
                <p className="font-bold text-2xl">{kpis.patientsNeedingFollowup}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Patients Table */}
        <div className="card mt-6 border-primary/20 hover:border-primary/40 transition-colors group-hover:border-primary/50 shadow-lg group-hover:shadow-xl transition-shadow">
          <div className="p-4 border-b border-primary/20">
            <h2 className="font-semibold">Patient Monitoring</h2>
            <p className="text-sm text-muted">
              {patients.length} patients assigned
            </p>
          </div>

          {isLoading ? (
            <div className="h-96 rounded-lg bg-secondary/5 flex items-center justify-center text-muted">
              Loading patients...
            </div>
          ) : patients.length === 0 ? (
            <div className="p-8 text-center text-muted">
              No patients assigned yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-muted">
                <thead>
                  <tr className="border-b border-primary/20">
                    <th className="p-3 text-left">Patient</th>
                    <th className="p-3 text-left">Adherence</th>
                    <th className="p-3 text-left">Last session</th>
                    <th className="p-3 text-left">Pain trend</th>
                    <th className="p-3 text-left">Follow-up</th>
                    <th className="p-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient: any) => (
                    <tr
                      key={patient.patient_id}
                      className="border-b border-secondary/5 hover:bg-primary/5 transition-colors"
                    >
                      <td className="p-3 font-medium">
                        {patient.patients?.full_name || "Unknown patient"}
                      </td>
                      <td className="p-3">
                        <div className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-primary" />
                          <span className="text-xs">{patient.adherence || "—"}%</span>
                        </div>
                      </td>
                      <td className="p-3 text-sm text-muted">
                        {patient.last_session || "No sessions"}
                      </td>
                      <td className="p-3 text-sm">
                        <div className="flex items-center gap-1">
                          {[1, 2, 3]
                            .map(
                              (i) =>
                                `<span
                                  className="w-1.5 h-1.5 rounded-full ${i <=
                                    (patient.pain_trend || 2)
                                    ? "bg-primary"
                                    : "bg-secondary"
                                  }"
                                />`
                            )
                            .join("")}
                        </div>
                      </td>
                      <td className="p-3 text-sm">
                        {patient.needs_followup
                          ? <span className="text-warning">Follow-up needed</span>
                          : <span className="text-success">Good</span>}
                      </td>
                      <td className="p-3 text-right">
                        <button className="text-primary hover:text-primary/90 text-sm">
                          View profile
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Filters */}
          <div className="p-4 border-t border-secondary/5">
            <div className="grid grid-cols-3 gap-3">
              <select
                className="select bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => console.log("filter changed:", e.target.value)}
              >
                <option>All patients</option>
                <option>Good adherence</option>
                <option>Low adherence</option>
                <option>Missed sessions</option>
                <option>Increased pain</option>
              </select>
              <select
                className="select bg-white rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                onChange={(e) => console.log("filter changed:", e.target.value)}
              >
                <option>All patients</option>
                <option>Good adherence</option>
                <option>Low adherence</option>
                <option>Missed sessions</option>
                <option>Increased pain</option>
              </select>
              <button
                className="btn-secondary py-2 rounded-lg text-sm bg-primary text-white hover:bg-primary/90 transition-colors"
              >
                Apply filters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}