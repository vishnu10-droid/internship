"use client";

import { supabase } from "../supabase";
import { useState, useEffect } from "react";

export interface PainLogEntry {
  patient_id: string;
  pain: number;
  created_at: string;
}

export interface PatientAssignment {
  patient_id: string;
  patients: {
    full_name: string;
    role: string;
    created_at: string;
    is_active?: boolean;
    needs_followup?: boolean;
    pain_trend?: number;
    last_session?: string;
    adherence?: number;
  };
  status: string;
  is_active?: boolean;
  needs_followup?: boolean;
  pain_trend?: number;
  last_session?: string;
  adherence?: number;
}

export interface PhysioKPIs {
  totalPatients: number;
  activePlans: number;
  averageAdherence: number;
  patientsNeedingFollowup: number;
}

export interface PhysioService {
  data: {
    patients: any[];
    kpis: PhysioKPIs;
  };
  isLoading: boolean;
  refresh: () => void;
}

export function usePhysioService(userId?: string): PhysioService {
  const [data, setData] = useState({
    patients: [],
    kpis: {
      totalPatients: 0,
      activePlans: 0,
      averageAdherence: 0,
      patientsNeedingFollowup: 0,
    },
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userId) fetchData();
  }, [userId]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: patientData, error: patientError } = await supabase
        .from("therapist_patient_assignments")
        .select(`
          patient_id,
          patients!inner (full_name, role, created_at)
        `)
        .eq("therapist_id", userId);

      if (patientError) throw patientError;

      const totalPatients = (patientData || []).length;
      const activePlans = (patientData || []).filter(
        (a: any) => a.status === "active"
      ).length;

      const painPromises = (patientData || []).map(
        async (assignment: any) => {
          const { data: painData, error: painError } = await supabase
            .from("pain_logs")
            .select("pain, created_at")
            .eq("patient_id", assignment.patient_id);

          if (painError) return { patient_id: assignment.patient_id, painEntries: 0 };
          return { patient_id: assignment.patient_id, painEntries: (painData || []).length };
        }
      );

      const painResults = await Promise.all(painPromises);
      const totalPainEntries = painResults.reduce(
        (sum: any, r) => sum + r.painEntries,
        0
      );

      const averageAdherence = totalPatients > 0
        ? Math.round((totalPainEntries / (totalPatients * 14)) * 100)
        : 0;

      const patientsNeedingFollowup = (patientData || []).filter(
        (a: any) => a.is_active === false || a.needs_followup
      ).length;

      setData({
        patients: patientData || [],
        kpis: {
          totalPatients,
          activePlans,
          averageAdherence,
          patientsNeedingFollowup,
        },
      });
    } catch (error) {
      console.error("Failed to fetch physiotherapist data:", error);
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