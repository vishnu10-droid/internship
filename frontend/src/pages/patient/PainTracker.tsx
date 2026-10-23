"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabase";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function PainTracker() {
  const { user } = useAuth();
  const [painEntry, setPainEntry] = useState({
    date: new Date().toISOString().split("T")[0],
    area: "Select area",
    pain: 0,
    note: "",
  });
  const [painHistory, setPainHistory] = useState<any[]>([]);
  const [showWarning, setShowWarning] = useState(false);

  useEffect(() => {
    fetchPainHistory();
  }, [user]);

  const fetchPainHistory = async () => {
    try {
      const { data, error } = await supabase
        .from("pain_logs")
        .select("*")
        .eq("patient_id", user?.id)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;
      setPainHistory(data || []);
    } catch (error) {
      console.error("Failed to fetch pain history:", error);
    }
  };

  const saveEntry = useCallback(async () => {
    if (!painEntry.area || painEntry.area === "Select area") {
      setShowWarning(true);
      return;
    }

    try {
      const { error } = await supabase
        .from("pain_logs")
        .insert({
          patient_id: user?.id,
          area: painEntry.area,
          pain: painEntry.pain,
          note: painEntry.note,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;

      // Check for severe pain warning
      if (painEntry.pain >= 7) {
        setShowWarning(true);
      } else {
        setPainEntry({
          date: new Date().toISOString().split("T")[0],
          area: "Select area",
          pain: 0,
          note: "",
        });
        fetchPainHistory();
      }
    } catch (error) {
      console.error("Failed to save pain entry:", error);
    }
  }, [painEntry, user]);

  const handleAreaChange = useCallback((area: string) => {
    setPainEntry({ ...painEntry, area });
  }, []);

  // Warning computed effect
  useEffect(() => {
    if (painEntry.pain >= 7) {
      setShowWarning(true);
    }
  }, [painEntry.pain]);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString();
  };

  return (
    <div className="pt-6">
      <h1 className="font-bold text-2xl mb-6">
        Pain Journal
      </h1>

      {/* Pain History Section */}
      <div className="card mb-6">
        <div className="p-4">
          <h3 className="font-medium mb-3">Pain History</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr>
                  <th className="p-3 border-b">Date</th>
                  <th className="p-3 border-b">Area</th>
                  <th className="p-3 border-b text-right">Pain</th>
                </tr>
              </thead>
              <tbody>
                {painHistory.map((entry) => (
                  <tr key={entry.id}>
                    <td className="p-3">{formatDate(entry.created_at)}</td>
                    <td className="p-3">{entry.area}</td>
                    <td className="p-3 text-right">
                      <span className="bg-secondary/10 px-2 py-1 rounded">
                        {entry.pain}/10
                      </span>
                    </td>
                  </tr>
                ))}
                {painHistory.length === 0 && (
                  <tr>
                    <td className="p-3 text-muted" colspan="3">
                      No pain entries yet
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Current Entry Form */}
      <div className="card p-6">
        <h2 className="font-medium mb-4">Log Pain Level</h2>

        <label className="mb-3">
          Date
          <input
            type="date"
            value={painEntry.date}
            onChange={(e) =>
              setPainEntry({ ...painEntry, date: e.target.value })
            }
          />
        </label>

        <label className="mb-3">
          Body Area
          <select
            value={painEntry.area}
            onChange={(e) => handleAreaChange(e.target.value)}
            className="input w-full"
          >
            <option>Select area</option>
            <option>Right knee</option>
            <option>Left knee</option>
            <option>Lower back</option>
            <option>Hip</option>
            <option>Ankle</option>
            <option>Shoulder</option>
            <option>Neck</option>
          </select>
        </label>

        <label className="mb-3">
          Pain Intensity
          <input
            type="range"
            min="0"
            max="10"
            value={painEntry.pain}
            onChange={(e) =>
              setPainEntry({ ...painEntry, pain: +e.target.value })
            }
          />
          <span className="text-sm font-medium ml-2">
            {painEntry.pain}/10
          </span>
        </label>

        <label className="mb-3">
          Notes
          <textarea
            value={painEntry.note}
            onChange={(e) =>
              setPainEntry({ ...painEntry, note: e.target.value })
            }
            placeholder="What did you notice today?"
            className="textarea textarea-sm w-full"
          ></textarea>
        </label>

        <button
          onClick={saveEntry}
          className="btn-primary w-full py-3 rounded-lg mt-6"
        >
          {painEntry.pain > 0 ? "Save Entry" : "Log Pain Level"}
        </button>

        {showWarning && (
          <div className="mt-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <p className="text-sm text-warning">
              ⚠️ Pain level reported as 7 or above. Please contact your
              physiotherapist if this persists or worsens.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}