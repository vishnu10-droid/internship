"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Inter } from "next/font";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    time: "",
    type: "follow-up",
    patient: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    setIsLoading(true);
    try {
      // In demo mode, use localStorage
      const storedAppointments: any[] = JSON.parse(
        localStorage.getItem("patient-appointments") || "[]"
      );
      setAppointments(storedAppointments);
    } catch (error) {
      console.error("Failed to fetch appointments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    const newAppointment = {
      id: Date.now(),
      ...form,
      created_at: new Date().toISOString(),
    };
    setAppointments((prev) => [...prev, newAppointment]);
    setForm({
      date: new Date().toISOString().split("T")[0],
      time: "",
      type: "follow-up",
      patient: "",
      notes: "",
    });
    localStorage.setItem(
      "patient-appointments",
      JSON.stringify(setAppointments((prev) => [...prev, newAppointment]))
    );
  }, [form]);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading appointments...
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Appointments
      </h1>

      {/* Form to add appointment */}
      <div className="card p-6 mb-6">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) =>
                  setForm({ ...form, date: e.target.value })
                }
              />
            </div>
            <div>
              <label className="label">Time</label>
              <input
                type="time"
                value={form.time}
                onChange={(e) => setForm({ ...form, time: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Type</label>
              <select
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option>Follow-up</option>
                <option>Progress check</option>
                <option>Initial assessment</option>
                <option>Review</option>
              </select>
            </div>
            <div>
              <label className="label">Patient</label>
              <select
                value={form.patient}
                onChange={(e) => setForm({ ...form, patient: e.target.value })}
              >
                <option>Select patient</option>
                <option>Alex Morgan</option>
                <option>Sam Wilson</option>
                <option>Jordan Lee</option>
              </select>
            </div>
          </div>

          <div>
            <label className="label">Notes</label>
            <textarea
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              rows={3}
              placeholder="Appointment notes"
              className="textarea textarea-sm w-full"
            ></textarea>
          </div>

          <button
            type="submit"
            className="btn-primary w-full py-3 rounded-lg mt-4"
          >
            Schedule Appointment
          </button>
        </form>
      </div>

      {/* Appointments list */}
      <div className="card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Upcoming Appointments ({appointments.length})</h2>
        </div>

        {isLoading ? (
          <div className="h-96 rounded-lg bg-secondary/5 flex items-center justify-center text-muted">
            Loading appointments...
          </div>
        ) : appointments.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <i className="calendar" size={48} className="mb-4" />
            <p>No upcoming appointments.</p>
            <p className="text-sm">Schedule your first appointment.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr className="border-b border-secondary/5">
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Time</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-left">Patient</th>
                  <th className="p-3 text-right">Notes</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((apt: any) => (
                  <tr key={apt.id} className="border-b border-secondary/5">
                    <td className="p-3">
                      {new Date(apt.date).toLocaleDateString()}
                    </td>
                    <td className="p-3">
                      {apt.time || "—"}
                    </td>
                    <td className="p-3">
                      <span className="bg-primary/10 px-2 py-1 rounded text-xs">
                        {apt.type}
                      </span>
                    </td>
                    <td className="p-3 font-medium">
                      {apt.patient || "—"}
                    </td>
                    <td className="p-3 text-muted text-sm">
                      {apt.notes || "—"}
                    </td>
                    <td className="p-3 text-right">
                      <button
                        className="text-danger hover:text-danger/90 text-sm"
                        onClick={() => {
                          if (window.confirm("Cancel appointment?")) {
                            setAppointments(
                              apt.appointments.filter((a: any) => a.id !== apt.id)
                            );
                            localStorage.setItem(
                              "patient-appointments",
                              JSON.stringify(setAppointments)
                            );
                          }
                        }}
                      >
                        Cancel
                      </button>
                    </td>
                  </tr>
                ))}
                {appointments.length === 0 && (
                  <tr>
                    <td className="p-3 text-muted" colspan="6">
                      No appointments
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
            Loading appointments...
          </div>
        )}
      </div>
    </div>
  );
}