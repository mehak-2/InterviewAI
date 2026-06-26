"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import type { ChangeEvent, DragEvent } from "react";
import {
  Avatar,
  Badge,
  ButtonLink,
  Card,
  Field,
  FooterLinks,
  Icon,
} from "@/components/interview-ai";
import { useAuth } from "@/components/auth-provider";
import { cn } from "@/lib/cn";
import { AuthenticatedShell } from "@/components/authenticated-shell";
import { api, getApiErrorMessage } from "@/lib/api";
import { useToast } from "@/components/toast";

type ResumeDocument = {
  _id: string;
  fileName: string;
  fileUrl: string;
  isActive: boolean;
  createdAt: string;
};

function Switch({ on }: { on: boolean }) {
  return (
    <div
      className={cn(
        "relative h-7 w-12 cursor-pointer rounded-full p-0.5 transition-all duration-200",
        on ? "bg-[var(--brand)]" : "bg-[var(--line)]",
      )}
    >
      <div
        className={cn(
          "h-6 w-6 rounded-full bg-white shadow-sm transition-transform duration-200",
          on ? "translate-x-5" : "translate-x-0",
        )}
      />
    </div>
  );
}

const skills = [
  { name: "React.js", level: 92 },
  { name: "System Design", level: 84 },
  { name: "Leadership", level: 71 },
  { name: "Communication", level: 88 },
  { name: "Problem Solving", level: 95 },
];

const notifications = [
  { title: "Interview Reminders", desc: "Alerts 30 min before scheduled sessions", on: true },
  { title: "AI Performance Reports", desc: "Weekly summaries of your interview progress", on: true },
  { title: "Marketing Emails", desc: "Feature announcements and career tips", on: false },
];

export default function ProfilePage() {
  const { showToast } = useToast();
  const { user, refreshSession } = useAuth();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailState, setEmailState] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [summary, setSummary] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmailState(user.email || "");
      setSummary(`${user.firstName || "Alex"} is a Senior Frontend Engineer with 8 years of experience in React and design systems. Highly analytical and communicative, ideal for leadership roles.`);
    }
  }, [user]);

  const displayName = `${firstName} ${lastName}`.trim() || `${user?.firstName || "Alex"} ${user?.lastName || "Smith"}`.trim();
  const email = emailState || user?.email || "alex@example.com";
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleSaveChanges = async () => {
    if (!firstName.trim() || !lastName.trim() || !emailState.trim()) {
      showToast("First name, last name, and email are required.", "error");
      return;
    }

    setSaving(true);
    try {
      const payload: any = {
        firstName,
        lastName,
        email: emailState,
      };

      if (newPassword) {
        if (!currentPassword) {
          showToast("Please enter your current password to change password.", "error");
          setSaving(false);
          return;
        }
        payload.currentPassword = currentPassword;
        payload.newPassword = newPassword;
      }

      await api.put("/auth/update", payload);
      await refreshSession();
      setCurrentPassword("");
      setNewPassword("");
      showToast("Profile details updated successfully!", "success");
    } catch (err) {
      const errMsg = getApiErrorMessage(err, "Failed to update profile details");
      showToast(errMsg, "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscardChanges = (e: React.MouseEvent) => {
    e.preventDefault();
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      setEmailState(user.email || "");
    }
    setCurrentPassword("");
    setNewPassword("");
    showToast("Changes discarded", "info");
  };

  const [resumes, setResumes] = useState<ResumeDocument[]>([]);
  const [loadingResumes, setLoadingResumes] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchResumes = async () => {
    try {
      const { data } = await api.get("/resumes");
      setResumes(data.resumes || []);
    } catch (err) {
      console.error(getApiErrorMessage(err, "Failed to load resumes"));
    } finally {
      setLoadingResumes(false);
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleUploadFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      setUploadStatus("Error: Only PDF resumes are supported.");
      showToast("Only PDF resumes are supported.", "error");
      return;
    }

    setUploading(true);
    setUploadStatus("Uploading resume to Cloudinary...");

    const formData = new FormData();
    formData.append("resume", file);

    try {
      await api.post("/resumes/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setUploadStatus("Upload successful!");
      showToast("Resume uploaded successfully!", "success");
      await fetchResumes();
    } catch (err) {
      const errMsg = getApiErrorMessage(err, "Could not upload resume");
      setUploadStatus(`Error: ${errMsg}`);
      showToast(errMsg, "error");
    } finally {
      setUploading(false);
      setTimeout(() => setUploadStatus(null), 5000);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleUploadFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleUploadFile(e.dataTransfer.files[0]);
    }
  };

  const handleToggleActive = async (id: string) => {
    try {
      await api.put(`/resumes/${id}/active`);
      setResumes((prev) =>
        prev.map((res) => ({
          ...res,
          isActive: res._id === id,
        }))
      );
      showToast("Active resume set successfully!", "success");
    } catch (err) {
      showToast(getApiErrorMessage(err, "Could not switch active resume"), "error");
    }
  };

  const handleDeleteResume = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this resume?")) {
      return;
    }

    try {
      await api.delete(`/resumes/${id}`);
      showToast("Resume deleted successfully!", "success");
      await fetchResumes();
    } catch (err) {
      showToast(getApiErrorMessage(err, "Could not delete resume"), "error");
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const activeResume = resumes.find((r) => r.isActive);

  return (
    <AuthenticatedShell active="profile">
      {/* Top bar */}
      <div className="sticky top-0 z-20 border-b border-[var(--line)] bg-[var(--surface)]/80 px-6 py-4 backdrop-blur-xl md:px-8">
        <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-4">
          <div>
            <h1 className="text-[1.4rem] font-bold tracking-tight text-[var(--foreground)]">Profile</h1>
            <p className="text-[0.82rem] text-[var(--muted-soft)]">Manage your identity and preferences</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={handleDiscardChanges}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.9rem] font-semibold transition-all duration-200",
                "bg-[var(--surface)] text-[var(--foreground)] ring-1 ring-[var(--line)] shadow-sm hover:bg-[var(--surface-soft)]",
                "px-4 py-2 text-[0.85rem]"
              )}
            >
              Discard
            </button>
            <button
              onClick={() => handleSaveChanges()}
              disabled={saving}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-[0.9rem] font-semibold transition-all duration-200",
                "bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-[0_8px_20px_rgba(79,70,229,0.15)] hover:shadow-[0_12px_28px_rgba(79,70,229,0.25)] hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-55 disabled:pointer-events-none",
                "px-4 py-2 text-[0.85rem]"
              )}
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1200px] px-6 py-8 md:px-8">
        {/* Profile header */}
        <Card className="mb-6 overflow-hidden p-0">
          {/* Cover */}
          <div className="h-28 bg-[linear-gradient(135deg,#4f46e5,#7c3aed,#6366f1)]">
            <div className="h-full bg-[radial-gradient(circle_at_30%_50%,rgba(255,255,255,0.1),transparent_60%)]" />
          </div>
          {/* Content */}
          <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <div className="-mt-10">
                <div className="relative">
                  <div className="flex h-20 w-20 items-center justify-center rounded-[20px] bg-[linear-gradient(135deg,#ede9fe,#c4b5fd)] dark:bg-[linear-gradient(135deg,#312e81,#4338ca)] text-[1.4rem] font-bold text-[#4f46e5] dark:text-indigo-300 ring-4 ring-[var(--surface)] shadow-[0_8px_24px_rgba(79,70,229,0.2)]">
                    {initials}
                  </div>
                  <button className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full bg-[#4f46e5] text-white shadow-md">
                    <svg className="h-3.5 w-3.5" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <path d="M12.65 2.65a2.3 2.3 0 0 1 3.25 3.25L4.5 17.25 1 18l.75-3.5L12.65 2.65Z" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="pb-1">
                <div className="flex items-center gap-2">
                  <p className="text-[1.1rem] font-bold text-[var(--foreground)]">{displayName}</p>
                  <Badge tone="dark">Pro Plan</Badge>
                </div>
                <p className="mt-0.5 text-[0.85rem] text-[var(--muted-soft)]">{email} · Pro member</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:pb-1">
              <div className="text-center">
                <p className="text-[1.3rem] font-bold text-[var(--foreground)]">24</p>
                <p className="text-[0.72rem] text-[var(--muted-soft)]">Interviews</p>
              </div>
              <div className="h-8 w-px bg-[var(--line)]" />
              <div className="text-center">
                <p className="text-[1.3rem] font-bold text-[var(--foreground)]">82%</p>
                <p className="text-[0.72rem] text-[var(--muted-soft)]">Avg Score</p>
              </div>
              <div className="h-8 w-px bg-[var(--line)]" />
              <div className="text-center">
                <p className="text-[1.3rem] font-bold text-emerald-500">92</p>
                <p className="text-[0.72rem] text-[var(--muted-soft)]">Best Score</p>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <div className="space-y-6">
            {/* Personal info */}
            <Card className="p-6 md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--brand-soft)]">
                  <Icon name="user" className="h-5 w-5 text-[var(--brand)]" />
                </div>
                <h2 className="text-[1rem] font-bold text-[var(--foreground)]">Personal Information</h2>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Field
                  label="First Name"
                  placeholder="First Name"
                  icon="user"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Field
                  label="Last Name"
                  placeholder="Last Name"
                  icon="user"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
                <Field
                  label="Email Address"
                  placeholder="Email Address"
                  icon="mail"
                  value={emailState}
                  onChange={(e) => setEmailState(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <label className="block text-[0.85rem] font-semibold text-[var(--foreground)]">
                  Professional Summary
                  <span className="ml-2 text-[0.72rem] font-normal text-[var(--muted-soft)]">AI-generated · editable</span>
                </label>
                <textarea
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  className="mt-2 min-h-[130px] w-full rounded-[14px] bg-[var(--surface-soft)] px-4 py-3 text-[0.92rem] leading-7 text-[var(--foreground)] ring-1 ring-[var(--line)] outline-none transition-all focus:bg-[var(--surface)] focus:ring-2 focus:ring-[var(--brand)]/50"
                />
              </div>

              <div className="mt-3 inline-flex items-center gap-2 text-[0.82rem] text-[var(--brand)]">
                <Icon name="sparkles" className="h-4 w-4" />
                Summary auto-updates based on your recent sessions
              </div>
            </Card>

            {/* Skill scores */}
            <Card className="p-6 md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--success-soft)]">
                  <Icon name="trend-up" className="h-5 w-5 text-[var(--success)]" />
                </div>
                <h2 className="text-[1rem] font-bold text-[var(--foreground)]">Skill Assessment</h2>
              </div>

              <div className="space-y-4">
                {skills.map((skill) => {
                  const color = skill.level >= 90 ? "var(--success)" : skill.level >= 75 ? "var(--brand)" : "#d97706";
                  return (
                    <div key={skill.name}>
                      <div className="mb-1.5 flex items-center justify-between text-[0.85rem]">
                        <span className="font-medium text-[var(--foreground)]">{skill.name}</span>
                        <span className="font-bold" style={{ color }}>{skill.level}%</span>
                      </div>
                      <div className="h-2 overflow-hidden rounded-full bg-[var(--line)]">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{ width: `${skill.level}%`, backgroundColor: color }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Security */}
            <Card className="p-6 md:p-7">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--warning-soft)]">
                  <Icon name="lock" className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                </div>
                <h2 className="text-[1rem] font-bold text-[var(--foreground)]">Security Settings</h2>
              </div>
              <div className="space-y-4">
                <Field
                  label="Current Password"
                  placeholder="••••••••"
                  icon="lock"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
                <Field
                  label="New Password"
                  placeholder="••••••••"
                  icon="lock"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <div className="flex items-center justify-between rounded-[14px] bg-[var(--success-soft)] px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-emerald-100/80 dark:bg-emerald-900/40">
                      <Icon name="check" className="h-4 w-4 text-[var(--success)]" />
                    </div>
                    <div>
                      <p className="text-[0.88rem] font-semibold text-[var(--foreground)]">Two-Factor Authentication</p>
                      <p className="text-[0.75rem] text-[var(--muted-soft)]">Recommended for account security</p>
                    </div>
                  </div>
                  <Link href="#2fa" className="text-[0.82rem] font-semibold text-[var(--success)] hover:underline">
                    Enable →
                  </Link>
                </div>
              </div>
            </Card>
          </div>

          <div className="space-y-5">
            {/* Plan card */}
            <div className="relative overflow-hidden rounded-[20px] bg-[linear-gradient(135deg,#4f46e5,#3730a3)] p-6 text-white shadow-[0_12px_32px_rgba(79,70,229,0.32)]">
              <div className="pointer-events-none absolute -top-8 -right-8 h-40 w-40 rounded-full bg-white/[0.06]" />
              <Badge tone="dark" className="bg-white/20 text-white ring-white/20">Pro Plan</Badge>
              <div className="mt-4 flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[1.4rem] font-bold">Active Membership</h2>
                  <p className="mt-1 text-[0.82rem] text-white/70">Renews Oct 12, 2024</p>
                </div>
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
                  <Icon name="medal" className="h-5 w-5 text-white" />
                </div>
              </div>
              {/* Usage bar */}
              <div className="mt-5">
                <div className="flex justify-between text-[0.78rem] text-white/75 mb-1.5">
                  <span>Interviews used</span>
                  <span className="font-bold text-white">15 / 20</span>
                </div>
                <div className="h-2 rounded-full bg-white/20">
                  <div className="h-2 w-[75%] rounded-full bg-white" />
                </div>
              </div>
              <ButtonLink href="#billing" variant="dark" className="mt-5 w-full justify-center py-2.5 text-[0.88rem]">
                Manage Billing
              </ButtonLink>
            </div>

            {/* Resume Card */}
            <Card className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[#ede9fe]">
                    <Icon name="file" className="h-5 w-5 text-[#4f46e5]" />
                  </div>
                  <h3 className="text-[1rem] font-bold text-[#0d0f1a]">Resumes</h3>
                </div>
                {loadingResumes && <span className="text-[0.75rem] text-slate-400">Loading...</span>}
              </div>

              {/* Hidden file input */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".pdf"
                className="hidden"
              />

              {/* Drop zone */}
              <div
                onClick={triggerFileSelect}
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="grid place-items-center rounded-[16px] border-2 border-dashed border-[var(--brand-mid)] bg-[var(--surface-soft)] px-4 py-8 text-center cursor-pointer transition-colors hover:border-[var(--brand)] hover:bg-[var(--brand-soft)]"
              >
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[var(--brand-soft)]">
                  <Icon name="upload" className="h-6 w-6 text-[var(--brand)]" />
                </div>
                <p className="mt-3 text-[0.88rem] font-semibold text-[var(--foreground)]">
                  {uploading ? "Uploading..." : "Drop PDF resume here"}
                </p>
                <p className="mt-1 text-[0.78rem] text-[var(--muted-soft)]">or click to browse</p>
              </div>

              {uploadStatus && (
                <div className={cn(
                  "mt-3 rounded-[10px] px-3.5 py-2 text-[0.8rem] font-medium leading-5",
                  uploadStatus.startsWith("Error") ? "bg-red-50 text-red-800 border border-red-200" : "bg-indigo-50 text-indigo-800 border border-indigo-150"
                )}>
                  {uploadStatus}
                </div>
              )}

              {/* Uploaded files list */}
              <div className="mt-4 space-y-3">
                {loadingResumes ? (
                  [1, 2].map((i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between rounded-[14px] p-3.5 ring-1 ring-slate-100 bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3 w-[70%]">
                        <div className="h-10 w-10 shrink-0 rounded-[10px] skeleton" />
                        <div className="w-full space-y-1.5">
                          <div className="h-3.5 w-[80%] skeleton" />
                          <div className="h-3 w-[40%] skeleton" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <div className="h-7 w-16 rounded-full skeleton" />
                        <div className="h-8 w-8 rounded-lg skeleton" />
                      </div>
                    </div>
                  ))
                ) : (
                  resumes.map((res) => {
                    const uploadedDate = new Date(res.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    });

                    return (
                      <div
                        key={res._id}
                        className={cn(
                          "flex items-center justify-between rounded-[14px] p-3.5 ring-1 transition-all",
                          res.isActive
                            ? "bg-[var(--brand-soft)] ring-[var(--brand)]/30 border-l-4 border-l-[var(--brand)]"
                            : "bg-[var(--surface-soft)] ring-[var(--line)]"
                        )}
                      >
                        <div className="flex items-center gap-3 overflow-hidden">
                          <div
                            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] cursor-pointer"
                            style={{ backgroundColor: res.isActive ? "var(--brand-soft)" : "var(--line)" }}
                            onClick={() => !res.isActive && handleToggleActive(res._id)}
                            title={res.isActive ? "Active resume" : "Click to set active"}
                          >
                            <Icon name="file" className={cn("h-5 w-5", res.isActive ? "text-[var(--brand)]" : "text-[var(--muted-soft)]")} />
                          </div>
                          <div className="overflow-hidden">
                            <p className="text-[0.85rem] font-semibold text-[var(--foreground)] truncate" title={res.fileName}>
                              {res.fileName}
                            </p>
                            <p className="text-[0.75rem] text-[var(--muted-soft)]">{uploadedDate}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {res.isActive ? (
                            <span className="mr-1 inline-flex rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-[0.7rem] font-bold text-[var(--brand)]">
                              Active
                            </span>
                          ) : (
                            <button
                              onClick={() => handleToggleActive(res._id)}
                              className="mr-1 inline-flex rounded-full bg-[var(--line)] hover:bg-[var(--brand)] hover:text-white px-2 py-0.5 text-[0.7rem] font-bold text-[var(--muted)] transition-colors"
                            >
                              Set Active
                            </button>
                          )}
                          <a
                            href={res.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--muted)] hover:bg-[var(--surface-soft)]"
                          >
                            <Icon name="eye" className="h-4 w-4" />
                          </a>
                          <button
                            onClick={() => handleDeleteResume(res._id)}
                            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-[var(--muted-soft)] hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20"
                          >
                            <Icon name="x" className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
                {resumes.length === 0 && !loadingResumes && (
                  <p className="text-[0.8rem] text-center text-[var(--muted-soft)] py-3 italic">
                    No resumes uploaded yet.
                  </p>
                )}
              </div>

              {/* Active resume AI details */}
              {activeResume && (
                <div className="mt-4 flex items-start gap-3 rounded-[14px] bg-[var(--success-soft)] p-3.5 border border-emerald-200/50 dark:border-emerald-800/30">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-100/80 dark:bg-emerald-900/40">
                    <Icon name="sparkles" className="h-4 w-4 text-[var(--success)]" />
                  </div>
                  <div>
                    <p className="text-[0.82rem] font-semibold text-[var(--foreground)]">Active Resume AI-Linked</p>
                    <p className="mt-0.5 text-[0.75rem] leading-5 text-[var(--muted)]">
                      Your future mock interview questions will automatically integrate experiences from <span className="font-semibold text-[var(--foreground)]">{activeResume.fileName}</span>.
                    </p>
                  </div>
                </div>
              )}
            </Card>

            {/* Notifications */}
            <Card className="p-6">
              <div className="mb-4 flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-[12px] bg-[var(--brand-soft)]">
                  <Icon name="bell" className="h-5 w-5 text-[var(--brand)]" />
                </div>
                <h3 className="text-[1rem] font-bold text-[var(--foreground)]">Notifications</h3>
              </div>
              <div className="space-y-4">
                {notifications.map((item) => (
                  <div key={item.title} className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-[0.88rem] font-semibold text-[var(--foreground)]">{item.title}</p>
                      <p className="mt-0.5 text-[0.75rem] text-[var(--muted-soft)]">{item.desc}</p>
                    </div>
                    <Switch on={item.on} />
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>

      <FooterLinks
        left={<span>© 2026 InterviewAI · Professional AI Recruitment</span>}
        right={
          <>
            <Link href="#privacy" className="transition-colors hover:text-[var(--brand)]">Privacy</Link>
            <Link href="#terms" className="transition-colors hover:text-[var(--brand)]">Terms</Link>
            <Link href="#support" className="transition-colors hover:text-[var(--brand)]">Support</Link>
          </>
        }
      />
    </AuthenticatedShell>
  );
}
