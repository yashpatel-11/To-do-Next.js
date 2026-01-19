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
    <aside
      style={{
        width: "220px",
        borderRight: "1px solid #e5e5e5",
        padding: "16px",
        background: "#fafafa",
      }}
    >
      {/* Profile / Auth Header */}
      {user ? (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            paddingBottom: "12px",
            marginBottom: "12px",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              background: "#ddd",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
            }}
          >
            {initials}
          </div>

          <div style={{ fontSize: "12px" }}>
            <div style={{ fontWeight: 600 }}>{user.name}</div>
            <div style={{ color: "#666" }}>{user.email}</div>
          </div>
        </div>
      ) : (
        <div
          style={{
            paddingBottom: "12px",
            marginBottom: "12px",
            borderBottom: "1px solid #e5e5e5",
          }}
        >
          <div style={{ fontSize: "13px", marginBottom: "8px" }}>
            <b>Welcome</b>
            <br />
            <span style={{ color: "#666" }}>
              Sign in to sync your tasks
            </span>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link
              href="/login"
              style={{
                flex: 1,
                textAlign: "center",
                padding: "6px 8px",
                borderRadius: "4px",
                background: "#2563eb",
                color: "#fff",
                fontSize: "12px",
                textDecoration: "none",
              }}
            >
              Sign in
            </Link>
            <Link
              href="/register"
              style={{
                flex: 1,
                textAlign: "center",
                padding: "6px 8px",
                borderRadius: "4px",
                border: "1px solid #d1d5db",
                fontSize: "12px",
                textDecoration: "none",
              }}
            >
              Create account
            </Link>
          </div>
        </div>
      )}

      {/* Navigation */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        <li>
          <Link href="/dashboard">Dashboard</Link>
        </li>
        <li>
          <Link href="/projects">Projects</Link>
        </li>
        <li>
          <Link href="/tasks/board">Task Board</Link>
        </li>
        <li>
          <Link href="/tasks/my">My Tasks</Link>
        </li>
        <li>
          <Link href="/profile">Profile</Link>
        </li>
      </ul>
    </aside>
  );
}
