"use client";

import { useState, useEffect } from "react";

export interface AdminStats {
  totalPatients: number;
  totalTherapists: number;
  activePlans: number;
  platformActivity: number;
}

export interface AdminService {
  stats: AdminStats;
  isLoading: boolean;
  refresh: () => void;
}

export function useAdminService() {
  const [stats, setStats] = useState<AdminStats>({
    totalPatients: 0,
    totalTherapists: 0,
    activePlans: 0,
    platformActivity: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const totalPatients = parseInt(localStorage.getItem("admin-total-patients") || "0");
      const totalTherapists = parseInt(localStorage.getItem("admin-total-therapists") || "0");
      const activePlans = parseInt(localStorage.getItem("admin-active-plans") || "0");
      const platformActivity = parseInt(localStorage.getItem("admin-platform-activity") || "0");

      setStats({
        totalPatients,
        totalTherapists,
        activePlans,
        platformActivity,
      });
    } catch (error) {
      console.error("Failed to fetch admin stats:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    stats,
    isLoading,
    refresh: fetchStats,
  };
}