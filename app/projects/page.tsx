"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthContext";
import {
  filterTasksByProjectId,
  PROJECT_DEFINITIONS,
  Task,
} from "@/lib/project-groups";

export default function ProjectsPage() {
  const router = useRouter();
  const { user, authReady } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const loadTasks = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/tasks", {
        method: "GET",
        credentials: "include",
      });

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        setError("Unable to load projects.");
        return;
      }

      const data = (await response.json()) as { tasks: Task[] };
      setTasks(data.tasks);
    } catch {
      setError("Unable to load projects.");
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      router.push("/login");
      return;
    }

    loadTasks();
  }, [authReady, user, router, loadTasks]);

  const projectCards = useMemo(
    () =>
      PROJECT_DEFINITIONS.map((project) => {
        const projectTasks = filterTasksByProjectId(tasks, project.id);
        const completed = projectTasks.filter((task) => task.completed).length;
        const total = projectTasks.length;
        const progress = total ? Math.round((completed / total) * 100) : 0;

        return {
          ...project,
          total,
          completed,
          pending: total - completed,
          progress,
        };
      }),
    [tasks]
  );

  if (!authReady || !user) {
    return <p className="text-sm text-gray-600">Loading projects...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Projects</h1>
        <p className="text-sm text-slate-600">Organize your tasks into clean, focused lists.</p>
      </header>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {isLoading ? (
        <p className="text-sm text-gray-600">Loading projects...</p>
      ) : (
        <section className="grid gap-3 sm:grid-cols-2">
          {projectCards.map((project) => (
            <Link
              key={project.id}
              href={`/projects/${project.id}`}
              className="rounded-xl border border-white/70 bg-white/70 p-4 backdrop-blur transition hover:bg-white/80"
            >
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <h2 className="text-base font-semibold text-slate-900">{project.name}</h2>
                  <p className="text-sm text-slate-600">{project.description}</p>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700">
                  {project.progress}%
                </span>
              </div>

              <div className="mb-3 h-2 w-full rounded-full bg-slate-200">
                <div
                  className="h-full rounded-full bg-blue-600"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <div className="rounded-md bg-white/80 p-2 text-slate-700">
                  <p className="text-slate-500">Total</p>
                  <p className="font-semibold text-slate-900">{project.total}</p>
                </div>
                <div className="rounded-md bg-white/80 p-2 text-slate-700">
                  <p className="text-slate-500">Pending</p>
                  <p className="font-semibold text-slate-900">{project.pending}</p>
                </div>
                <div className="rounded-md bg-white/80 p-2 text-slate-700">
                  <p className="text-slate-500">Done</p>
                  <p className="font-semibold text-slate-900">{project.completed}</p>
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}
    </div>
  );
}
