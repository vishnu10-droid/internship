"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabase";
import { ExerciseCard } from "../ui/ExerciseCard";

export function ExerciseLibrary() {
  const { user } = useAuth();
  [exercises, setExercises] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetchExercises();
  }, [user]);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("patient_id", user?.id)
        .order("name", { ascending: true });

      if (error) throw error;
      setExercises(data || []);
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
    }
  };

  const filteredExercises = exercises.filter(
    (ex) =>
      (filter === "All" || (filter === "Completed") === ex.completed) &&
      ex.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="pt-6">
      <h1 className="font-bold text-2xl mb-6">
        My Exercise Library
      </h1>

      <div className="card p-6">
        <div className="mb-4">
          <label className="label">Search exercises</label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercise name..."
            className="input"
          />
        </div>

        <div className="mb-4">
          <div className="chips">
            <button
              onClick={() => setFilter("All")}
              className={filter === "All" ? "on" : ""}
            >
              All
            </button>
            <button
              onClick={() => setFilter("Completed")}
              className={filter === "Completed" ? "on" : ""}
            >
              Completed
            </button>
            <button
              onClick={() => setFilter("Pending")}
              className={filter === "Pending" ? "on" : ""}
            >
              Pending
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filteredExercises.map((ex) => (
            <ExerciseCard key={ex.id} exercise={ex} />
          ))}
          {!filteredExercises.length && (
            <div className="col-span-full text-center py-8 text-muted">
              No exercises match this search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}