"use client";

import { supabase } from "../supabase";
import { useState, useEffect } from "react";

export interface PatientData {
  exercises: any[];
  sessions: any[];
  painEntries: any[];
  kpis: {
    completionPercent: number;
    completed: number;
    total: number;
    weeklyAdherence: number;
    streak: number;
  };
}

export interface PatientService {
  data: PatientData;
  isLoading: boolean;
  refresh: () => void;
}

export function usePatientService(patientId?: string): PatientService {
  const [data, setData] = useState<PatientData>({
    exercises: [],
    sessions: [],
    painEntries: [],
    kpis: {
      completionPercent: 0,
      completed: 0,
      total: 0,
      weeklyAdherence: 0,
      streak: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (patientId) fetchData();
  }, [patientId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [exResult, sessionResult, painResult] = await Promise.all([
        supabase.from("exercises").select("*").eq("patient_id", patientId).order("created_at", { ascending: true }),
        supabase.from("exercise_sessions").select("*").eq("patient_id", patientId).order("started_at", { ascending: false }),
        supabase.from("pain_logs").select("*").eq("patient_id", patientId).order("created_at", { ascending: false }),
      ]);

      const exData = exResult.data || [];
      const sessionData = sessionResult.data || [];
      const painData = painResult.data || [];

      const total = exData.length;
      const completed = exData.filter((e: any) => e.completed).length;
      const completionPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

      const now = new Date();
      const sevenDaysAgo = new Date(now);
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
      const weeklySessions = sessionData.filter((s: any) => new Date(s.started_at) >= sevenDaysAgo);
      const weeklyCompleted = weeklySessions.filter((s: any) => s.status === "completed").length;
      const weeklyAdherence = weeklySessions.length > 0 ? Math.round((weeklyCompleted / weeklySessions.length) * 100) : 0;

      let streak = 0;
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      let checkDate = new Date(today);
      let currentStreak = 0;

      for (let i = 0; i < 30; i++) {
        const check = new Date(checkDate);
        const hasSession = sessionData.some(
          (s: any) => {
            const sessionDate = new Date(s.started_at);
            sessionDate.setHours(0, 0, 0, 0);
            return sessionDate.getTime() === check.getTime();
          }
        );
        if (hasSession) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
      streak = currentStreak;

      setData({
        exercises: exData,
        sessions: sessionData,
        painEntries: painData,
        kpis: { completionPercent, completed, total, weeklyAdherence, streak },
      });
    } catch (error) {
      console.error("Failed to fetch patient data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    data,
    isLoading,
    refresh: fetchData,
  };
}