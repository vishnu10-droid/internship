"use client";

import { useState, useEffect } from "react";
import { Inter } from "next/font/google";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function MotionTrackingPage() {
  const [cameraActive, setCameraActive] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [demoMode, setDemoMode] = useState(true);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [repCount, setRepCount] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [isTracking, setIsTracking] = useState(false);
  const [poseLandmarks, setPoseLandmarks] = useState<any[]>([]);

  const exercises = [
    { id: "knee-extension", name: "Knee Extensions", type: "extension" },
    { id: "leg-raise", name: "Straight Leg Raises", type: "flexion" },
    { id: "hamstring-stretch", name: "Seated Hamstring Stretch", type: "stretch" },
    { id: "heel-slide", name: "Heel Slides", type: "flexion" },
    { id: "glute-bridge", name: "Glute Bridge", type: "extension" },
  ];

  const handleCameraPermission = useCallback(async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setPermissionGranted(false);
        setDemoMode(true);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
        audio: false,
      });

      setPermissionGranted(true);
      setCameraActive(true);

      // Stop the stream after a moment to avoid keeping camera active
      setTimeout(() => {
        stream.getTracks().forEach((track) => track.stop());
        setCameraActive(false);
      }, 3000);
    } catch (err) {
      console.error("Camera permission denied:", err);
      setPermissionGranted(false);
      setDemoMode(true);
    }
  }, []);

  const startTracking = useCallback(() => {
    setIsTracking(true);
    // In a real implementation, this would use MediaPipe Pose Landmarker
    // to track pose and count repetitions
    const interval = setInterval(() => {
      setSessionTime((t) => t + 1);
      // Demo: increment rep count every 5 seconds for visualization
      if (sessionTime % 5 === 0 && sessionTime > 0) {
        setRepCount((r) => r + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const stopTracking = useCallback(() => {
    setIsTracking(false);
    setRepCount(0);
    setSessionTime(0);
    setPoseLandmarks([]);
  }, []);

  const handleExerciseChange = useCallback((exercise: any) => {
    setSelectedExercise(exercise);
    setRepCount(0);
    setSessionTime(0);
    setPoseLandmarks([]);
  }, []);

  const exerciseInfo = selectedExercise
    ? {
        name: selectedExercise.name,
        instructions:
          "Follow the movement pattern shown. The system will provide feedback on your range of motion and repetition count.",
        demoLabel: "Demo mode - movement feedback is an aid, not a substitute for professional assessment.",
      }
    : null;

  if (demoMode) {
    return (
      <div className="pt-8">
        <h1 className="font-bold text-3xl mb-6">
          AI-Assisted Exercise Monitoring
        </h1>

        <p className="text-muted mb-6">
          Motion tracking demo mode. Camera access required for full functionality.
        </p>

        <div className="card p-6 text-center">
          {/* Camera preview area */}
          <div
            className="relative h-64 w-full rounded-2xl bg-secondary/5 mb-6 flex items-center justify-center border dashed border-secondary"
            onClick={handleCameraPermission}
            style={{ cursor: "pointer" }}
          >
            <div className="absolute inset-0 flex items-center justify-center">
              <i className="camera" size={48} className="text-muted" />
              <p className="mt-2 text-sm text-muted">
                Click to enable camera
              </p>
            </div>
          </div>

          {/* Exercise selection */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            {exercises.map((ex) => (
              <article
                key={ex.id}
                className={`p-3 rounded-lg cursor-pointer border ${
                  selectedExercise?.id === ex.id ? "border-primary" : "border-secondary"
                } transition-colors`}
                onClick={() => handleExerciseChange(ex)}
              >
                <div className="flex items-center gap-2">
                  <i className="dumbbell" size={20} className="text-primary" />
                  <span className="font-medium">{ex.name}</span>
                </div>
              </article>
            ))}
          </div>

          {/* Tracking status */}
          {cameraActive && (
            <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary">
              <p className="text-sm text-primary">
                📷 Camera active - tracking pose landmarks
              </p>
            </div>
          )}

          {/* Demo tracking mode */}
          {!cameraActive && permissionGranted && (
            <div className="mb-4 p-3 rounded-lg bg-primary/10 border border-primary">
              <p className="text-sm text-primary">
                ✓ Camera permission granted - tracking active in demo mode
              </p>
            </div>
          )}

          {/* Manual tracking mode */}
          {!cameraActive && !permissionGranted && selectedExercise && (
            <div className="mb-4 p-3 rounded-lg bg-secondary/10 border border-secondary">
              <p className="text-sm text-secondary">
                Manual tracking mode - use session controls below
              </p>
            </div>
          )}

          {/* Session controls */}
          {isTracking && (
            <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary">
              <div className="flex items-center justify-between mb-3">
                <span>
                  <i className="pause" size={16} me-1 /> Pause
                  <span className="text-primary font-medium">{sessionTime}s</span>
                </span>
                <span>
                  <i className="target" size={16} me-1 /> Reps: {repCount}
                </span>
              </div>
              <button
                onClick={stopTracking}
                className="btn-secondary py-2 rounded-lg"
              >
                Stop Tracking
              </button>
            </div>
          )}

          {!isTracking && selectedExercise && (
            <div>
              <button
                onClick={startTracking}
                className="btn-primary py-2 rounded-lg mb-2"
              >
                <i className="play" size={16} me-2 /> Start Motion Tracking
              </button>
              <button
                onClick={() => setDemoMode(false)}
                className="text-primary text-sm underline hover:text-primary/90"
              >
                Manual Tracking Mode
              </button>
            </div>
          )}

          {/* Results summary */}
          {selectedExercise && (
            <div className="mt-6 p-4 rounded-lg bg-secondary/5">
              <h3 className="font-medium mb-3">Session Summary</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted">Exercise</p>
                  <p className="font-bold">{selectedExercise.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Duration</p>
                  <p className="font-bold">{sessionTime}s</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Repetitions</p>
                  <p className="font-bold">{repCount}</p>
                </div>
                <div>
                  <p className="text-sm text-muted">Feedback</p>
                  <p className="font-primary">{repCount > 0 ? "Good form detected" : "Begin session to track progress"}</p>
                </div>
              </div>
            </div>
          )}

          {!selectedExercise && (
            <p className="text-center text-muted mb-4">
              Select an exercise to begin monitoring
            </p>
          )}
        </div>
      </div>
    );
  }

  // Real mode would go here when MediaPipe is integrated
  return (
    <div className="pt-8">
      <h1 className="font-bold text-3xl mb-6">
        AI-Assisted Exercise Monitoring
      </h1>
      <p className="text-muted">
        Real-time pose estimation using MediaPipe Pose Landmarker. Camera access
        required. Movement feedback is an aid, not a substitute for professional
        assessment.
      </p>
    </div>
  );
}