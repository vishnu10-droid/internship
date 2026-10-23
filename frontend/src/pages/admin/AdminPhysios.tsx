"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function AdminPhysios() {
  const { user } = useAuth();
  const [physios, setPhysios] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPhysios();
  }, [user]);

  const fetchPhysios = async () => {
    setIsLoading(true);
    try {
      const storedPhysios: any[] = JSON.parse(
        localStorage.getItem("admin-physios") || "[]"
      );
      setPhysios(storedPhysios);
    } catch (error) {
      console.error("Failed to fetch physiotherapists:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPhysios = physios.filter(
    (p) =>
      filterStatus === "all" ||
      (p.status && p.status === filterStatus)
  );

  const searchPhysios = filteredPhysios.filter(
    (p) =>
      (p.full_name && p.full_name.toLowerCase().includes(search.toLower())) ||
      (p.email && p.email.toLowerCase().includes(search.toLower()))
  );

  const togglePhysioStatus = useCallback((physioId: string) => {
    setPhysios((prev) =>
      prev.map((p) =>
        p.id === physioId ? { ...p, active: !p.active } : p
      )
    );
    localStorage.setItem(
      "admin-physios",
      JSON.stringify(
        setPhysios((prev) =>
          prev.map((p) => (p.id === physioId ? { ...p, active: !p.active } : p))
        )
      )
    );
  }, []);

  const removePhysio = useCallback((physioId: string) => {
    setPhysios((prev) => prev.filter((p) => p.id !== physioId));
    localStorage.setItem("admin-physios", JSON.stringify(setPhysios));
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading physiotherapists...
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Physiotherapist Management
      </h1>

      {/* Search and filters */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search physiotherapists..."
            className="input"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="select"
          >
            <option value="all">All statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <button className="btn-primary py-2 rounded-lg text-sm">Apply</button>
        </div>
      </div>

      {/* Physiotherapists table */}
      <div className="card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Physiotherapists ({filteredPhysios.length})</h2>
        </div>

        {filteredPhysios.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <i className="user-plus" size={48} className="mb-4" />
            <p>No physiotherapists found.</p>
            <p className="text-sm">Add physiotherapists to the platform.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr className="border-b border-secondary/5">
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Assigned patients</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchPhysios.map((physio: any) => (
                  <tr key={physio.id} className="border-b border-secondary/5">
                    <td className="p-3 font-medium">
                      {physio.full_name || "Unknown"}
                    </td>
                    <td className="p-3 text-muted truncate">
                      {physio.email}
                    </td>
                    <td className="p-3">
                      <span
                        className={physio.active
                          ? "bg-green-100 text-green-800 px-2 py-1 rounded text-xs"
                          : "bg-red-100 text-red-800 px-2 py-1 rounded text-xs"}
                      >
                        {physio.active ? "Active" : "Suspended"}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted">
                      {physio.assigned_patients || 0} patients
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2">
                        <button
                          onClick={() => togglePhysioStatus(physio.id)}
                          className="text-primary hover:text-primary/90 text-sm"
                        >
                          {physio.active ? "Suspend" : "Reactivate"}
                        </button>
                        <button
                          className="text-danger hover:text-danger/90 text-sm"
                        >
                          Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {searchPhysios.length === 0 && (
                  <tr>
                    <td className="p-3 text-muted" colspan="5">
                      No physiotherapists matching criteria
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
            Loading physiotherapists...
          </div>
        )}
      </div>
    </div>
  );
}