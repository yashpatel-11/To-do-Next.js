"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/components/auth/AuthContext";
import { Task } from "@/lib/project-groups";

export default function TaskBoardPage() {
  const router = useRouter();
  const { user, authReady } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
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
        setError("Unable to load tasks.");
        return;
      }

      const data = (await response.json()) as { tasks: Task[] };
      setTasks(data.tasks);
    } catch {
      setError("Unable to load tasks.");
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

  const inProgressTasks = useMemo(() => tasks.filter((task) => !task.completed), [tasks]);
  const completedTasks = useMemo(() => tasks.filter((task) => task.completed), [tasks]);

  const handleAddTask = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Please enter a task title.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ title }),
      });

      const data = (await response.json()) as { message?: string; task?: Task };

      if (!response.ok || !data.task) {
        setError(data.message ?? "Unable to create task.");
        return;
      }

      setTasks((current) => [data.task as Task, ...current]);
      setTitle("");
    } catch {
      setError("Unable to create task.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdateTaskStatus = async (task: Task, completed: boolean) => {
    const response = await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ completed }),
    });

    if (!response.ok) {
      setError("Unable to update task.");
      return;
    }

    const data = (await response.json()) as { task: Task };
    setTasks((current) => current.map((item) => (item.id === task.id ? data.task : item)));
  };

  const handleDeleteTask = async (taskId: number) => {
    const response = await fetch(`/api/tasks/${taskId}`, {
      method: "DELETE",
      credentials: "include",
    });

    if (!response.ok) {
      setError("Unable to delete task.");
      return;
    }

    setTasks((current) => current.filter((task) => task.id !== taskId));
  };

  if (!authReady || !user) {
    return <p className="text-sm text-gray-600">Loading task board...</p>;
  }

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold text-slate-900">Task Board</h1>
        <p className="text-sm text-slate-600">Move work between In Progress and Completed.</p>
      </header>

      <section className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/70 bg-white/70 p-4 backdrop-blur">
          <p className="text-sm text-slate-500">Total</p>
          <p className="text-2xl font-semibold text-slate-900">{tasks.length}</p>
        </div>
        <div className="rounded-xl border border-white/70 bg-white/70 p-4 backdrop-blur">
          <p className="text-sm text-slate-500">In Progress</p>
          <p className="text-2xl font-semibold text-slate-900">{inProgressTasks.length}</p>
        </div>
        <div className="rounded-xl border border-white/70 bg-white/70 p-4 backdrop-blur">
          <p className="text-sm text-slate-500">Completed</p>
          <p className="text-2xl font-semibold text-slate-900">{completedTasks.length}</p>
        </div>
      </section>

      <form
        onSubmit={handleAddTask}
        className="space-y-3 rounded-xl border border-white/70 bg-white/70 p-4 backdrop-blur"
      >
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Add a task"
          className="w-full rounded-md border border-slate-300 bg-white/90 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-70"
        >
          {isSubmitting ? "Adding..." : "Add Task"}
        </button>
      </form>

      {error && <p className="text-sm text-red-700">{error}</p>}

      {isLoading ? (
        <p className="text-sm text-gray-600">Loading tasks...</p>
      ) : (
        <section className="grid gap-4 lg:grid-cols-2">
          <BoardColumn
            title="In Progress"
            tasks={inProgressTasks}
            emptyMessage="No tasks in progress."
            actionLabel="Move to Completed"
            onAction={(task) => handleUpdateTaskStatus(task, true)}
            onDelete={handleDeleteTask}
          />

          <BoardColumn
            title="Completed"
            tasks={completedTasks}
            emptyMessage="No completed tasks yet."
            actionLabel="Move to In Progress"
            onAction={(task) => handleUpdateTaskStatus(task, false)}
            onDelete={handleDeleteTask}
          />
        </section>
      )}
    </div>
  );
}

function BoardColumn({
  title,
  tasks,
  emptyMessage,
  actionLabel,
  onAction,
  onDelete,
}: {
  title: string;
  tasks: Task[];
  emptyMessage: string;
  actionLabel: string;
  onAction: (task: Task) => void;
  onDelete: (taskId: number) => void;
}) {
  return (
    <div className="rounded-xl border border-white/70 bg-white/70 p-4 backdrop-blur">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">{title}</h2>

      {tasks.length === 0 ? (
        <p className="text-sm text-slate-500">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {tasks.map((task) => (
            <li key={task.id} className="rounded-md border border-slate-200 bg-white/80 p-3">
              <p className={`mb-3 text-sm ${task.completed ? "text-slate-500 line-through" : "text-slate-800"}`}>
                {task.title}
              </p>

              <div className="flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => onAction(task)}
                  className="rounded-md bg-slate-100 px-2.5 py-1.5 text-xs text-slate-700 hover:bg-slate-200"
                >
                  {actionLabel}
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(task.id)}
                  className="text-xs text-slate-500 hover:text-red-600"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
