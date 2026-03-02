"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthContext";
import { Task } from "@/lib/project-groups";

export default function PlannedPage() {
  const router = useRouter();
  const { user, authReady } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [plannedDate, setPlannedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
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
        setError("Unable to load planned tasks.");
        return;
      }

      const data = (await response.json()) as { tasks: Task[] };
      setTasks(data.tasks);
    } catch {
      setError("Unable to load planned tasks.");
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

  const plannedTasks = useMemo(
    () =>
      tasks
        .filter((task) => Boolean(task.dueDate))
        .sort((a, b) => new Date(a.dueDate ?? "").getTime() - new Date(b.dueDate ?? "").getTime()),
    [tasks]
  );

  const handleAddPlannedTask = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    if (!plannedDate) {
      setError("Please select a planned date.");
      return;
    }

    const dueDate = new Date(`${plannedDate}T09:00:00`).toISOString();

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          dueDate,
        }),
      });

      const data = (await response.json()) as { message?: string; task?: Task };

      if (!response.ok || !data.task) {
        setError(data.message ?? "Unable to create planned task.");
        return;
      }

      setTasks((current) => [data.task as Task, ...current]);
      setTitle("");
    } catch {
      setError("Unable to create planned task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleTask = async (task: Task) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ completed: !task.completed }),
    });

    if (!response.ok) {
      setError("Unable to update task.");
      return;
    }

    const data = (await response.json()) as { task: Task };
    setTasks((current) => current.map((item) => (item.id === task.id ? data.task : item)));
  };

  if (!authReady || !user) {
    return <p className="text-sm text-gray-600">Loading planned...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <section className="relative min-h-[75vh] rounded-2xl border border-white/70 bg-white/70 p-6 backdrop-blur">
        <header className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-md border border-blue-600 px-2 py-0.5 text-xs font-semibold text-blue-700">
              Planned
            </span>
            <h1 className="text-3xl font-semibold text-slate-900">Planned</h1>
          </div>

          <span className="text-sm text-slate-600">{plannedTasks.length}</span>
        </header>

        {error && <p className="mb-4 text-sm text-red-700">{error}</p>}

        {isLoading ? (
          <p className="text-sm text-slate-600">Loading planned tasks...</p>
        ) : plannedTasks.length === 0 ? (
          <div className="mt-20 flex flex-col items-center justify-center text-center">
            <div className="mb-3 text-5xl">🗓️</div>
            <p className="text-sm text-slate-600">Tasks with due dates or reminders show up here.</p>
          </div>
        ) : (
          <ul className="space-y-2 pb-20">
            {plannedTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between rounded-md border border-white/70 bg-white/80 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => handleToggleTask(task)}
                    className="h-4 w-4"
                  />
                  <p className={`text-sm ${task.completed ? "text-slate-500 line-through" : "text-slate-800"}`}>
                    {task.title}
                  </p>
                </div>
                <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">
                  {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No date"}
                </span>
              </li>
            ))}
          </ul>
        )}

        <form
          onSubmit={handleAddPlannedTask}
          className="absolute inset-x-6 bottom-6 flex items-center gap-2 rounded-md border border-white/70 bg-white/90 px-3 py-2"
        >
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Add a task"
            className="w-full bg-transparent text-sm text-slate-800 outline-none"
            required
          />

          <div className="flex items-center gap-1">
            <span className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-700">Tasks</span>
            <input
              type="date"
              value={plannedDate}
              onChange={(event) => setPlannedDate(event.target.value)}
              className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-70"
          >
            {isSubmitting ? "Adding..." : "Add"}
          </button>
        </form>
      </section>
    </div>
  );
}
