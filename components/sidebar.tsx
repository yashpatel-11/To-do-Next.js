"use client";

import Link from "next/link";
import { useAuth } from "./auth/AuthContext";

export default function Sidebar() {
  const { user } = useAuth();

  const initials =
    user?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() ?? "";

  return (
    <aside className="w-64 border-r border-white/50 bg-white/70 p-4 backdrop-blur">
      {/* Profile / Auth Header */}
      {user ? (
        <div className="mb-3 flex items-center gap-3 border-b border-slate-200/80 pb-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-200 text-sm font-semibold text-slate-700">
            {initials}
          </div>

          <div className="text-xs">
            <div className="font-semibold text-slate-800">{user.name}</div>
            <div className="text-slate-500">{user.email}</div>
          </div>
        </div>
      ) : (
        <div className="mb-3 border-b border-slate-200/80 pb-3">
          <div className="mb-2 text-xs">
            <b>Welcome</b>
            <br />
            <span className="text-slate-500">
              Sign in to sync your tasks
            </span>
          </div>
          <div className="flex gap-2">
            <Link
              href="/login"
              className="flex-1 rounded-md bg-blue-600 px-2 py-1.5 text-center text-xs text-white"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="flex-1 rounded-md border border-slate-300 px-2 py-1.5 text-center text-xs text-slate-700"
            >
              Create account
            </Link>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ul className="space-y-1 text-sm">
        <li>
          <Link className="block rounded-md px-2 py-1.5 text-slate-700 hover:bg-white/70" href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link className="block rounded-md px-2 py-1.5 text-slate-700 hover:bg-white/70" href="/projects">Projects</Link>
        </li>
        <li>
          <Link className="block rounded-md px-2 py-1.5 text-slate-700 hover:bg-white/70" href="/tasks/board">Task Board</Link>
        </li>
        <li>
          <Link className="block rounded-md px-2 py-1.5 text-slate-700 hover:bg-white/70" href="/tasks/my">My Tasks</Link>
        </li>
        <li>
          <Link className="block rounded-md px-2 py-1.5 text-slate-700 hover:bg-white/70" href="/profile">Profile</Link>
        </li>
      </ul>
    </aside>
  );
}
