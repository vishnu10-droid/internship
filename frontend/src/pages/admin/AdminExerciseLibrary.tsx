"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function AdminExerciseLibrary() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, [user]);

  const fetchExercises = async () => {
    setIsLoading(true);
    try {
      const storedExercises: any[] = JSON.parse(
        localStorage.getItem("admin-exercises") || "[]"
      );
      setExercises(storedExercises);
    } catch (error) {
      console.error("Failed to fetch exercise library:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExercises = exercises.filter(
    (ex) =>
      category === "all" || ex.category === category
  );

  const searchExercises = filteredExercises.filter(
    (ex) =>
      ex.name.toLowerCase().includes(search.toLowerCase()) ||
      (ex.instructions &&
        ex.instructions.toLowerCase().includes(search.toLowerCase()))
  );

  const deleteExercise = useCallback((exId: string) => {
    setExercises((prev) => prev.filter((ex) => ex.id !== exId));
    localStorage.setItem("admin-exercises", JSON.stringify(setExercises));
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading exercise library...
      </div>
    );
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Exercise Library
      </h1>

      {/* Filter controls */}
      <div className="card p-4 mb-6">
        <div className="grid grid-cols-3 gap-3 mb-4">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search exercises..."
            className="input"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="select"
          >
            <option value="all">All categories</option>
            <option value="strength">Strength</option>
            <option value="mobility">Mobility</option>
            <option value="balance">Balance</option>
            <option value="stretch">Stretch</option>
          </select>
          <button className="btn-primary py-2 rounded-lg text-sm">
            Apply filters
          </button>
        </div>

        <div className="text-right">
          <button
            className="btn-secondary py-2 rounded-lg text-sm"
            onClick={() => setIsLoading(true)}
          >
            Add new exercise
          </button>
        </div>
      </div>

      {/* Exercise library table */}
      <div className="card">
        <div className="p-4 border-b">
          <h2 className="font-semibold">Exercise Catalog ({searchExercises.length})</h2>
        </div>

        {searchExercises.length === 0 ? (
          <div className="p-8 text-center text-muted">
            <i className="dumbbell" size={48} className="mb-4" />
            <p>No exercises found matching your criteria.</p>
            <p className="text-sm">Add exercises to the catalog.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-muted">
              <thead>
                <tr className="border-b border-secondary/5">
                  <th className="p-3 text-left">Exercise Name</th>
                  <th className="p-3 text-left">Category</th>
                  <th className="p-3 text-left">Default reps</th>
                  <th className="p-3 text-left">Default sets</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {searchExercises.map((ex: any) => (
                  <tr key={ex.id} className="border-b border-secondary/5">
                    <td className="p-3 font-medium">
                      {ex.name}
                    </td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-1 rounded text-xs ${
                          ex.category === "strength"
                            ? "bg-primary/10 text-primary"
                            : ex.category === "mobility"
                            ? "bg-teal/10 text-teal"
                            : ex.category === "balance"
                            ? "bg-warning/10 text-warning"
                            : "bg-secondary/10 text-main"
                        }`}
                      >
                        {ex.category}
                      </span>
                    </td>
                    <td className="p-3 text-sm text-muted">{ex.default_reps || "—"}</td>
                    <td className="p-3 text-sm text-muted">{ex.default_sets || "—"}</td>
                    <td className="p-3 text-right">
                      <div className="flex gap-2">
                        <button
                          className="text-primary hover:text-primary/90 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteExercise(ex.id)}
                          className="text-danger hover:text-danger/90 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {searchExercises.length === 0 && (
                  <tr>
                    <td className="p-3 text-muted" colspan="5">
                      No exercises matching criteria
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
            Loading exercise library...
          </div>
        )}
      </div>
    </div>
  );
}