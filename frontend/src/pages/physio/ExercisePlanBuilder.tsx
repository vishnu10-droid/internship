"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabase";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function ExercisePlanBuilder() {
  const { user } = useAuth();
  const [exercisesLibrary, setExercisesLibrary] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [plan, setPlan] = useState({
    name: "",
    description: "",
    sets: 3,
    reps: "10",
    duration: 10,
    frequency: "daily",
    instructions: "",
    start_date: new Date().toISOString().split("T")[0],
    end_date: new Date(Date.now() + 60 * 86400000).toISOString().split("T")[0],
    patient_id: null,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [showLibrary, setShowLibrary] = useState(false);

  useEffect(() => {
    fetchExercisesLibrary();
  }, [user]);

  const fetchExercisesLibrary = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;
      setExercisesLibrary(data || []);
    } catch (error) {
      console.error("Failed to fetch exercises library:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const savePlan = useCallback(async () => {
    try {
      const { error } = await supabase
        .from("treatment_plans")
        .insert({
          ...plan,
          therapist_id: user?.id,
          created_at: new Date().toISOString(),
        });

      if (error) throw error;
      setIsLoading(false);
      alert("Treatment plan created successfully!");
    } catch (error: any) {
      console.error("Failed to create treatment plan:", error);
      alert(error.message || "Failed to create treatment plan");
    }
  }, [plan, user]);

  const addExerciseToPlan = useCallback((ex: any) => {
    setSelectedExercises((prev) => {
      // Check if exercise already in plan
      if (prev.some((e) => e.id === ex.id)) {
        return prev;
      }
      return [...prev, { ...ex, sets: ex.default_sets || 3, reps: ex.default_reps || "10" }];
    });
  }, []);

  const removeExerciseFromPlan = useCallback((exId: string) => {
    setSelectedExercises((prev) => prev.filter((e) => e.id !== exId));
  }, []);

  const handlePatientChange = useCallback((patientId: string | null) => {
    setPlan({ ...plan, patient_id: patientId });
  }, [plan]);

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Exercise Plan Builder
      </h1>

      {/* Plan Form */}
      <div className="card p-6 mb-6">
        <form>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Plan name</label>
              <input
                value={plan.name}
                onChange={(e) =>
                  setPlan({ ...plan, name: e.target.value })
                }
                placeholder="e.g. Knee Rehabilitation Plan"
              />
            </div>
            <div>
              <label className="label">Frequency</label>
              <select
                value={plan.frequency}
                onChange={(e) =>
                  setPlan({ ...plan, frequency: e.target.value })
                }
              >
                <option>Daily</option>
                <option>3x/week</option>
                <option>5x/week</option>
                <option>Weekly</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Sets</label>
              <input
                type="number"
                value={plan.sets}
                onChange={(e) =>
                  setPlan({ ...plan, sets: +e.target.value })
                }
                min="1"
                max="10"
              />
            </div>
            <div>
              <label className="label">Repetitions</label>
              <input
                type="number"
                value={plan.reps}
                onChange={(e) =>
                  setPlan({ ...plan, reps: e.target.value })
                }
                min="1"
                max="50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="label">Duration (minutes)</label>
              <input
                type="number"
                value={plan.duration}
                onChange={(e) =>
                  setPlan({ ...plan, duration: +e.target.value })
                }
                min="1"
                max="60"
              />
            </div>
            <div>
              <label className="label">Plan duration</label>
              <input
                type="date"
                value={plan.start_date}
                onChange={(e) =>
                  setPlan({ ...plan, start_date: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="label">End date</label>
            <input
              type="date"
              value={plan.end_date}
              onChange={(e) =>
                setPlan({ ...plan, end_date: e.target.value })
              }
            />
          </div>

          <div>
            <label className="label">Instructions</label>
            <textarea
              value={plan.instructions}
              onChange={(e) =>
                setPlan({ ...plan, instructions: e.target.value })
              }
              rows={3}
              placeholder="Exercise instructions for the patient"
              className="textarea textarea-sm w-full"
            ></textarea>
          </div>

          <div>
            <label className="label">Assigned patient</label>
            <select
              value={plan.patient_id || "new"}
              onChange={(e) => handlePatientChange(e.target.value)}
            >
              <option value="new">Create new patient assignment</option>
              {/* Patient options would be populated dynamically */}
            </select>
          </div>
        </form>
      </div>

      {/* Exercise Library */}
      <div className="card p-6">
        <div className="flex between items-center mb-4">
          <h2 className="font-semibold">Exercise Library</h2>
          <button
            onClick={() => setShowLibrary((v) => !v)}
            className="btn-secondary py-2 rounded-lg text-sm"
          >
            {showLibrary ? "Hide library" : "View library"}
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {exercisesLibrary.map((ex) => (
            <article
              key={ex.id}
              className={`card p-3 cursor-pointer transition-colors ${
                selectedExercises.some((e) => e.id === ex.id)
                  ? "border-primary"
                  : "border-secondary"
              }`}
              onClick={() => addExerciseToPlan(ex)}
            >
              <div className="flex items-center gap-3">
                <i className="dumbbell" size={20} className="text-primary" />
                <div>
                  <h3 className="font-medium line-clamp-1">{ex.name}</h3>
                  <p className="text-xs text-muted line-clamp-1">
                    {ex.instructions || "No description"}
                  </p>
                </div>
              </div>
              {selectedExercises.some((e) => e.id === ex.id) && (
                <span className="ml-auto text-xs text-primary">
                  ✓ Added
                </span>
              )}
            </article>
          ))}
          {exercisesLibrary.length === 0 && (
            <div className="col-span-4 text-center py-8 text-muted">
              No exercises in library.
            </div>
          )}
        </div>
      </div>

      {/* Selected Exercises Summary */}
      {selectedExercises.length > 0 && (
        <div className="card p-6 mb-6">
          <h3 className="font-medium mb-3">Selected Exercises ({selectedExercises.length})</h3>
          <div className="grid grid-cols-2 gap-3">
            {selectedExercises.map((ex) => (
              <article key={ex.id} className="p-3 rounded-lg bg-primary/5">
                <div className="flex items-center gap-2">
                  <i className="dumbbell" size={16} className="text-primary" />
                  <span className="font-medium">{ex.name}</span>
                </div>
                <div className="mt-1 text-xs text-primary">
                  {ex.sets} sets × {ex.reps}
                </div>
              </article>
            ))}
          </div>
          <button
            onClick={() => savePlan()}
            className="btn-primary w-full py-3 rounded-lg mt-4"
          >
            Create Treatment Plan
          </button>
        </div>
      )}

      {showLibrary && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur z-50 overflow-y-auto">
          <div className="relative top-20 left-1/2 -translate-x-1/2 card p-8 max-w-2xl">
            <button
              onClick={() => setShowLibrary(false)}
              className="absolute top-2 right-2 text-muted"
            >
              <i className="x" size={18} />
            </button>
            <h2 className="font-bold text-2xl mb-4">Full Exercise Library</h2>
            {/* Would show filtered library with checkboxes */}
            <p className="text-muted mb-6">Library browsing coming soon.</p>
            <button className="btn-primary w-full py-3 rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}