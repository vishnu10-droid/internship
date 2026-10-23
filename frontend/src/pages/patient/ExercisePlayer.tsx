"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../supabase";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function TodayExercisePlayer() {
  const { user } = useAuth();
  const [exercises, setExercises] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionRunning, setSessionRunning] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [repsCompleted, setRepsCompleted] = useState(0);
  const [painScore, setPainScore] = useState(null);
  const [showPainModal, setShowPainModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchExercises();
  }, [user]);

  const fetchExercises = async () => {
    try {
      const { data, error } = await supabase
        .from("exercises")
        .select("*")
        .eq("patient_id", user?.id)
        .order("created_at", { ascending: true });

      if (error) throw error;
      setExercises(data || []);
      setCurrentIndex(0);
      setSessionRunning(false);
      setTimerSeconds(0);
      setRepsCompleted(0);
    } catch (error) {
      console.error("Failed to fetch exercises:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const exercise = exercises[currentIndex];

  const startTimer = useCallback(() => {
    const timer = setInterval(() => {
      setTimerSeconds((s) => s + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleCompleteExercise = useCallback(async () => {
    try {
      await supabase
        .from("exercise_sessions")
        .insert({
          patient_id: user?.id,
          exercise_id: exercise?.id,
          status: "completed",
          reps_completed: repsCompleted,
          duration_seconds: timerSeconds,
          pain_score: painScore,
          completed_at: new Date().toISOString(),
        });

      // Mark exercise as completed
      await supabase
        .from("exercises")
        .update({ completed: true })
        .eq("id", exercise?.id);

      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setSessionRunning(false);
        setTimerSeconds(0);
        setRepsCompleted(0);
        setPainScore(null);
        fetchExercises();
      }, 500);
    } catch (error) {
      console.error("Failed to complete exercise:", error);
    }
  }, [exercise, repsCompleted, timerSeconds, painScore, user]);

  const handleFinishSession = useCallback(() => {
    setSessionRunning(false);
    setTimerSeconds(0);
    setRepsCompleted(0);
    setShowPainModal(true);
  }, []);

  const handlePauseResume = useCallback(() => {
    setSessionRunning((running) => !running);
  }, []);

  if (isLoading) {
    return (
      <div className="p-8">
        <div className="animate-spinner flex h-6 w-6 mr-3 text-muted"></div>
        Loading exercise plan...
      </div>
    );
  }

  if (!exercise) {
    return (
      <div className="p-8 text-center text-muted">
        No exercises assigned yet. Your therapist will prescribe exercises for you.
      </div>
    );
  }

  return (
    <section className="card p-6">
      <header className="mb-6">
        <h2 className="font-semibold mb-2">
          {exercise.name}
        </h2>
        <p className="text-sm text-muted">
          {exercise.duration} min · {exercise.reps} · {exercise.level}
        </p>
      </header>

      <div className="session p-6 rounded-2xl bg-background/50 mb-6">
        <div className="flex items-center gap-4 mb-4">
          <span className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0">
            <i className="dumbbell" size={32} className="text-primary" />
          </span>
          <div>
            <p className="font-medium">Exercise {currentIndex + 1} of {exercises.length}</p>
            <p className="text-xs text-muted">{exercise.mins} minutes suggested</p>
          </div>
        </div>

        <div className="timer">
          {sessionRunning ? (
            <button
              className="timer-btn pause-btn"
              onClick={handlePauseResume}
            >
              <i className="pause" size={20} />
            </button>
          ) : (
            <button
              className="timer-btn start-btn"
              onClick={handlePauseResume}
            >
              <i className="play" size={20} />
            </button>
          )}
          <span className="timer-value">{formatTime(timerSeconds)}</span>
        </div>

        <div className="reps-control mt-4">
          <div className="flex items-center gap-3 text-sm text-muted">
            <button onClick={() => setRepsCompleted((r) => Math.max(0, r - 1))}>−</button>
            <span>{repsCompleted} / {exercise.reps}</span>
            <button onClick={() => setRepsCompleted(r => Math.min(repsCompleted + 1, exercise.reps))}>+</button>
          </div>
          <small>Suggested: {exercise.reps} repetitions</small>
        </div>
      </div>

      {sessionRunning && (
        <div className="safety-instructions mt-6 p-4 rounded-lg bg-warning/5 border border-warning/20">
          <div className="flex items-start gap-3">
            <i className="alert" size={20} className="text-warning flex-shrink-0" />
            <div>
              <p className="font-medium">Exercise safety</p>
              <p className="text-sm">
                Move slowly with controlled range of motion. Stop if you feel
                pain beyond your usual level. Follow your therapist-prescribed
                instructions.
              </p>
            </div>
          </div>
        </div>
      )}

      {!sessionRunning && currentIndex < exercises.length && (
        <div className="actions mt-6">
          <button
            onClick={() => {
              setSessionRunning(true);
              const unsubscribe = startTimer();
              // Auto-cleanup on unmount
              return () => unsubscribe();
            }}
            className="btn-primary w-full py-3 rounded-lg text-lg font-medium"
          >
            <i className="play" size={16} me-2 /> Start Session
          </button>
        </div>
      )}

      {currentIndex >= exercises.length && (
        <div className="summary mt-6 p-4 rounded-lg bg-primary/10 border border-primary">
          <h3 className="font-medium mb-3">Session Complete!</h3>
          <p className="text-muted mb-4">
            You've completed all {exercises.length} exercises. Great job!
          </p>
          <button
            onClick={handleFinishSession}
            className="btn-primary w-full py-2 rounded-lg"
          >
            Finish Session
          </button>
        </div>
      )}

      {showPainModal && (
        <div className="modal p-6 rounded-2xl">
          <h3 className="font-medium mb-4">How are you feeling?</h3>
          <div className="mb-4">
            <input
              type="range"
              min="0"
              max="10"
              value={painScore || 0}
              onChange={(e) => setPainScore(+e.target.value)}
              className="w-full mb-3"
            />
            <div className="flex gap-2 text-xs">
              <span>0 - No pain</span>
              <span>5 - Moderate pain</span>
              <span>10 - Severe pain</span>
            </div>
          </div>
          <div className="flex gap-3">
            <button
              onClick={() => {
                setShowPainModal(false);
                handleCompleteExercise();
              }}
              className="flex-1 btn-primary py-2 rounded-lg"
            >
              Complete and Save
            </button>
            <button
              onClick={() => setShowPainModal(false)}
              className="flex-1 btn-secondary py-2 rounded-lg ml-2"
            >
              Skip
            </button>
          </div>
        </div>
      )}
    </section>
  );
}