"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Inter } from "next/font";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function SettingsPageAdmin() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(() => ({
    platformName: "PhysioTrack AI",
    supportEmail: "support@physiotrack.example.com",
    maintenanceMode: false,
    sessionRetentionDays: 90,
    allowRegistration: true,
  }));

  const updateSetting = useCallback((key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  }, []);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Platform settings */}
        <div className="card p-6">
          <h2 className="font-medium mb-4">Platform Settings</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <span>Platform name</span>
              <input
                value={settings.platformName}
                onChange={(e) => updateSetting("platformName", e.target.value)}
                className="input w-full"
              />
            </label>
            <label className="flex items-center gap-3">
              <span>Support email</span>
              <input
                type="email"
                value={settings.supportEmail}
                onChange={(e) => updateSetting("supportEmail", e.target.value)}
                className="input w-full"
              />
            </label>
            <label className="flex items-center gap-3">
              <span>Session retention (days)</span>
              <input
                type="number"
                value={settings.sessionRetentionDays}
                onChange={(e) => updateSetting("sessionRetentionDays", +e.target.value)}
                className="input w-full"
              />
            </label>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.allowRegistration}
                onChange={() => updateSetting("allowRegistration", !settings.allowRegistration)}
                className="checkbox-checkbox"
              />
              <span>Allow new registrations</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.maintenanceMode}
                onChange={() => updateSetting("maintenanceMode", !settings.maintenanceMode)}
                className="checkbox-checkbox"
              />
              <span>Maintenance mode</span>
            </div>
          </div>
          <button
            onClick={() => window.alert("Settings saved")}
            className="btn-primary w-full py-3 rounded-lg mt-4"
          >
            Save changes
          </button>
        </div>

        {/* User confirmation */}
        <div className="card p-6">
          <h2 className="font-medium mb-4">Important</h2>
          <p className="text-muted mb-4">
            Administrative changes affect all users. Be careful when modifying
            platform settings.
          </p>
          <ul className="space-y-3 text-sm">
            <li>
              <strong>Role elevation not allowed:</strong> Users cannot self-assign
              administrator privileges. Role changes require authorized operations.
            </li>
            <li>
              <strong>Clinical notes protection:</strong> Clinical notes and messages
              are protected by Row Level Security policies.
            </li>
            <li>
              <strong>Audit logging:</strong> All sensitive actions are logged for
              compliance and security monitoring.
            </li>
          </ul>
        </div>
      </div>

      {/* System info */}
      <div className="card p-6 lg:col-span-2">
        <h2 className="font-medium mb-4">System Information</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="font-medium">Platform</p>
            <p className="text-muted">PhysioTrack AI</p>
          </div>
          <div>
            <p className="font-version">Version</p>
            <p className="text-muted">1.0.0</p>
          </div>
          <div>
            <p className="font-medium">Database</p>
            <p className="text-muted">PostgreSQL via Supabase</p>
          </div>
          <div>
            <p className="font-medium">Authentication</p>
            <p className="text-muted">Supabase Auth</p>
          </div>
        </div>
      </div>
    </div>
  );
}