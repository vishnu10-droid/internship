"use client";

import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Inter } from "next/font";

const interFont = Inter({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export function SettingsPagePhysio() {
  const { user } = useAuth();
  const [settings, setSettings] = useState(() => ({
    reminders: true,
    weekly: true,
    large: false,
    theme: "system",
    autoBackup: true,
  }));
  const [notifications, setNotifications] = useState(true);

  const toggleSetting = useCallback((key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const toggleNotification = useCallback(() => {
    setNotifications((prev) => !prev);
  }, []);

  const saveSettings = useCallback(() => {
    localStorage.setItem("physio-settings", JSON.stringify(settings));
  }, [settings]);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="pt-6">
      <h1 className="font-bold text-3xl mb-6">
        Settings
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* General settings */}
        <div className="card p-6">
          <h2 className="font-medium mb-4">General</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.reminders}
                onChange={() => toggleSetting("reminders")}
                className="checkbox-checkbox"
              />
              <span>Exercise reminders</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.weekly}
                onChange={() => toggleSetting("weekly")}
                className="checkbox-checkbox"
              />
              <span>Weekly summary emails</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.large}
                onChange={() => toggleSetting("large")}
                className="checkbox-checkbox"
              />
              <span>Larger interface text</span>
            </label>
            <label className="flex items-center gap-3">
              <select
                value={settings.theme}
                onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
                className="select"
              >
                <option>System</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
              <span>Theme</span>
            </label>
          </div>
          <button
            onClick={saveSettings}
            className="btn-primary w-full py-3 rounded-lg mt-4"
          >
            Save changes
          </button>
        </div>

        {/* Notifications */}
        <div className="card p-6">
          <h2 className="font-medium mb-4">Notifications</h2>
          <p className="text-muted mb-4">
            Manage your notification preferences.
          </p>
          <div className="space-y-3">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifications}
                onChange={toggleNotification}
                className="checkbox-checkbox"
              />
              <span>New patient messages</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={notifications}
                onChange={() => {}}
                className="checkbox-checkbox disabled:opacity-50 disabled:cursor-not-allowed"
              />
              <option>Session completion alerts</span>
            </label>
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={settings.autoBackup}
                onChange={() => toggleSetting("autoBackup")}
                className="checkbox-checkbox"
              />
              <option>Auto-backup session data</span>
            </label>
          </div>
        </div>
      </div>

      {/* Clinical preferences */}
      <div className="card p-6 lg:col-span-2">
        <h2 className="font-medium mb-4">Clinical Preferences</h2>
        <p className="text-muted mb-4">
          Configure how alerts and notifications appear.
        </p>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-primary/60" />
            <span>Visual alert style</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-secondary/60" />
            <span>Sound notifications</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="w-4 h-4 rounded-full bg-info/60" />
            <option>Email digests</span>
          </div>
        </div>
      </div>
    </div>
  );
}