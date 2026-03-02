"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthContext";

export default function ProfilePage() {
  const router = useRouter();
  const { user, authReady, refreshUser, logout } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      router.push("/login");
      return;
    }

    setName(user.name);
    setEmail(user.email);
  }, [authReady, user, router]);

  const handleUpdateProfile = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!name.trim() || !email.trim()) {
      setProfileMessage("Name and email are required.");
      return;
    }

    setIsSavingProfile(true);
    setProfileMessage("");

    try {
      const response = await fetch("/api/auth/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name,
          email,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setProfileMessage(data.message ?? "Unable to update profile.");
        return;
      }

      await refreshUser();
      setProfileMessage("Profile updated successfully.");
    } catch {
      setProfileMessage("Unable to update profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleChangePassword = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!currentPassword || !newPassword) {
      setPasswordMessage("Current and new password are required.");
      return;
    }

    setIsSavingPassword(true);
    setPasswordMessage("");

    try {
      const response = await fetch("/api/auth/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = (await response.json()) as { message?: string };

      if (!response.ok) {
        setPasswordMessage(data.message ?? "Unable to change password.");
        return;
      }

      setCurrentPassword("");
      setNewPassword("");
      setPasswordMessage("Password changed successfully.");
    } catch {
      setPasswordMessage("Unable to change password.");
    } finally {
      setIsSavingPassword(false);
    }
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
      router.push("/login");
    } finally {
      setIsLoggingOut(false);
    }
  };

  if (!authReady || !user) {
    return <p className="text-sm text-gray-600">Loading profile...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Profile & Settings</h1>
        <p className="text-sm text-slate-600">Manage your account details and security settings.</p>
      </header>

      <section className="rounded-xl border border-white/70 bg-white/70 p-4 backdrop-blur">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Account</h2>

        <form onSubmit={handleUpdateProfile} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Name</label>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Email</label>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSavingProfile}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {isSavingProfile ? "Saving..." : "Save Profile"}
          </button>

          {profileMessage && <p className="text-sm text-slate-700">{profileMessage}</p>}
        </form>
      </section>

      <section className="rounded-xl border border-white/70 bg-white/70 p-4 backdrop-blur">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Security</h2>

        <form onSubmit={handleChangePassword} className="space-y-3">
          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">Current Password</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-slate-700">New Password</label>
            <input
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
              minLength={6}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSavingPassword}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {isSavingPassword ? "Updating..." : "Change Password"}
          </button>

          {passwordMessage && <p className="text-sm text-slate-700">{passwordMessage}</p>}
        </form>
      </section>

      <section className="rounded-xl border border-white/70 bg-white/70 p-4 backdrop-blur">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Session</h2>
        <button
          type="button"
          onClick={handleLogout}
          disabled={isLoggingOut}
          className="rounded-md border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 disabled:opacity-70"
        >
          {isLoggingOut ? "Signing out..." : "Sign Out"}
        </button>
      </section>
    </div>
  );
}
