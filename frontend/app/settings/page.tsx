"use client";

import { useState, useEffect } from "react";
import { Card, Icon, ButtonLink } from "@/components/interview-ai";
import { AuthenticatedShell } from "@/components/authenticated-shell";
import { useToast } from "@/components/toast";

export default function SettingsPage() {
  const { showToast } = useToast();

  const [microphones, setMicrophones] = useState<MediaDeviceInfo[]>([]);
  const [selectedMic, setSelectedMic] = useState("");
  const [micVolume, setMicVolume] = useState(80);
  const [noiseCancellation, setNoiseCancellation] = useState(true);

  const [darkMode, setDarkMode] = useState(false);
  const [highContrast, setHighContrast] = useState(false);
  const [shareData, setShareData] = useState(true);

  useEffect(() => {
    setDarkMode(document.documentElement.classList.contains("dark"));
  }, []);

  const handleToggleDarkMode = () => {
    const nextVal = !darkMode;
    setDarkMode(nextVal);
    if (nextVal) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  useEffect(() => {
    async function getDevices() {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const mics = devices.filter((d) => d.kind === "audioinput");
        setMicrophones(mics);
        if (mics.length > 0) {
          setSelectedMic(mics[0].deviceId);
        }
      } catch (err) {
        console.warn("Could not enumerate audio devices:", err);
      }
    }
    getDevices();
  }, []);

  const handleSaveSettings = () => {
    showToast("Settings saved successfully!", "success");
  };

  return (
    <AuthenticatedShell active="settings">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--surface)]/80 px-6 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div>
            <h1 className="text-[1.4rem] font-bold tracking-tight text-[var(--foreground)]">Settings</h1>
            <p className="text-[0.82rem] text-[var(--muted-soft)]">Configure your interview and account options</p>
          </div>
          <button
            onClick={handleSaveSettings}
            className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.9rem] font-semibold transition-all duration-200 bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.15)] hover:shadow-[0_12px_28px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 active:translate-y-0"
          >
            Save Settings
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-8">
        <div className="grid gap-6 md:grid-cols-[1fr_380px]">
          <div className="space-y-6">
            {/* Audio Settings */}
            <Card className="p-6 md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--brand-soft)]">
                  <Icon name="microphone" className="h-5 w-5 text-[var(--brand)]" />
                </div>
                <h2 className="text-[1rem] font-bold text-[var(--foreground)]">Audio &amp; Device Settings</h2>
              </div>

              <div className="space-y-5">
                <div>
                  <label className="block text-[0.85rem] font-semibold text-[var(--foreground)] mb-2">
                    Microphone Input
                  </label>
                  <select
                    value={selectedMic}
                    onChange={(e) => setSelectedMic(e.target.value)}
                    className="w-full rounded-xl bg-[var(--surface-soft)] border border-[var(--line)] px-3.5 py-2.5 text-[0.85rem] text-[var(--foreground)] outline-none focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)] transition-all"
                  >
                    {microphones.length > 0 ? (
                      microphones.map((mic) => (
                        <option key={mic.deviceId} value={mic.deviceId}>
                          {mic.label || `Microphone (${mic.deviceId.slice(0, 5)}...)`}
                        </option>
                      ))
                    ) : (
                      <option value="default">Default System Microphone</option>
                    )}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between text-[0.85rem] font-semibold text-[var(--foreground)] mb-2">
                    <span>Input Volume</span>
                    <span>{micVolume}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={micVolume}
                    onChange={(e) => setMicVolume(Number(e.target.value))}
                    className="w-full accent-indigo-600 bg-[var(--line)] rounded-lg appearance-none h-2 cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <div>
                    <h3 className="text-[0.88rem] font-semibold text-[var(--foreground)]">AI Noise Cancellation</h3>
                    <p className="text-[0.75rem] text-[var(--muted-soft)]">Filter background noise during speech recordings</p>
                  </div>
                  <div
                    onClick={() => setNoiseCancellation(!noiseCancellation)}
                    className={`relative h-7 w-12 cursor-pointer rounded-full p-0.5 transition-all duration-200 ${noiseCancellation ? "bg-[var(--brand)]" : "bg-[var(--line)]"}`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${noiseCancellation ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Interface Preferences */}
            <Card className="p-6 md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--brand-soft)]">
                  <Icon name="sparkles" className="h-5 w-5 text-[var(--brand)]" />
                </div>
                <h2 className="text-[1rem] font-bold text-[var(--foreground)]">Interface Preferences</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[0.88rem] font-semibold text-[var(--foreground)]">Dark Mode</h3>
                    <p className="text-[0.75rem] text-[var(--muted-soft)]">Use a darker visual theme for settings and dashboard</p>
                  </div>
                  <div
                    onClick={handleToggleDarkMode}
                    className={`relative h-7 w-12 cursor-pointer rounded-full p-0.5 transition-all duration-200 ${darkMode ? "bg-[var(--brand)]" : "bg-[var(--line)]"}`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${darkMode ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-[var(--line)] pt-4">
                  <div>
                    <h3 className="text-[0.88rem] font-semibold text-[var(--foreground)]">High Contrast Mode</h3>
                    <p className="text-[0.75rem] text-[var(--muted-soft)]">Increase readability and accessibility of colors</p>
                  </div>
                  <div
                    onClick={() => setHighContrast(!highContrast)}
                    className={`relative h-7 w-12 cursor-pointer rounded-full p-0.5 transition-all duration-200 ${highContrast ? "bg-[var(--brand)]" : "bg-[var(--line)]"}`}
                  >
                    <div
                      className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${highContrast ? "translate-x-5" : "translate-x-0"}`}
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Privacy settings */}
            <Card className="p-6 md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-emerald-100/80 dark:bg-emerald-900/30">
                  <Icon name="lock" className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h2 className="text-[1rem] font-bold text-[var(--foreground)]">Privacy &amp; Data Sharing</h2>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-[0.88rem] font-semibold text-[var(--foreground)]">Share Performance Insights</h3>
                  <p className="text-[0.75rem] leading-5 text-[var(--muted-soft)] max-w-[420px]">
                    Allow system to securely analyze mock interview data to generate better dashboard reports and role recommendations.
                  </p>
                </div>
                <div
                  onClick={() => setShareData(!shareData)}
                  className={`relative h-7 w-12 cursor-pointer rounded-full p-0.5 transition-all duration-200 ${shareData ? "bg-[var(--brand)]" : "bg-[var(--line)]"}`}
                >
                  <div
                    className={`h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200 ${shareData ? "translate-x-5" : "translate-x-0"}`}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Right sidebar */}
          <div className="space-y-6">
            <Card className="p-6 border border-[var(--line)]">
              <h3 className="text-[0.95rem] font-bold text-[var(--foreground)]">Account &amp; Profile</h3>
              <p className="mt-2 text-[0.8rem] leading-6 text-[var(--muted)]">
                To update your email address, change password, or manage uploaded resumes, please visit the Profile settings.
              </p>
              <ButtonLink href="/profile" className="mt-4 w-full py-2.5 justify-center text-[0.85rem]">
                Go to Profile Settings
              </ButtonLink>
            </Card>
          </div>
        </div>
      </div>
    </AuthenticatedShell>
  );
}
