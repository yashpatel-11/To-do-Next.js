"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import { useAuth } from "@/components/auth/AuthContext";
import { filterTasksByProjectId, getProjectById, Task } from "@/lib/project-groups";

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams<{ projectId: string }>();
  const projectId = params.projectId;

  const { user, authReady } = useAuth();

  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  const project = getProjectById(projectId);

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
        setError("Unable to load project tasks.");
        return;
      }

      const data = (await response.json()) as { tasks: Task[] };
      setTasks(data.tasks);
    } catch {
      setError("Unable to load project tasks.");
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

    if (!project) {
      router.push("/projects");
      return;
    }

    loadTasks();
  }, [authReady, user, project, router, loadTasks]);

  const filteredTasks = useMemo(() => {
    if (!project) return [];
    return filterTasksByProjectId(tasks, project.id);
  }, [tasks, project]);

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

  if (!authReady || !user || !project) {
    return <p className="text-sm text-gray-600">Loading project...</p>;
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header className="space-y-2">
        <Link href="/projects" className="inline-block text-sm text-blue-600 hover:text-blue-700">
          ← Back to projects
        </Link>
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold text-slate-900">{project.name}</h1>
          <p className="text-sm text-slate-600">{project.description}</p>
        </div>
      </header>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <section className="rounded-xl border border-white/70 bg-white/70 p-4 backdrop-blur">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-slate-600">Tasks</h2>

        {isLoading ? (
          <p className="text-sm text-gray-600">Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-sm text-slate-500">No tasks in this project yet.</p>
        ) : (
          <ul className="space-y-2">
            {filteredTasks.map((task) => (
              <li
                key={task.id}
                className="flex items-center justify-between rounded-md border border-slate-200 bg-white/80 px-3 py-2"
              >
                <div className="flex items-center gap-3">
                  <select
                    value={task.completed ? "completed" : "in-progress"}
                    onChange={(event) =>
                      handleUpdateTaskStatus(task, event.target.value === "completed")
                    }
                    className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs text-slate-700 outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                  <p className={`text-sm ${task.completed ? "text-slate-500 line-through" : "text-slate-800"}`}>
                    {task.title}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-xs text-slate-500 hover:text-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
