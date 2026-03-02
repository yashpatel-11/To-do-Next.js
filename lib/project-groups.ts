export type Task = {
  id: number;
  title: string;
  dueDate: string | null;
  completed: boolean;
  completedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProjectDefinition = {
  id: string;
  name: string;
  description: string;
};

export const PROJECT_DEFINITIONS: ProjectDefinition[] = [
  {
    id: "all",
    name: "All Tasks",
    description: "Everything in one place.",
  },
  {
    id: "pending",
    name: "In Progress",
    description: "Tasks you still need to finish.",
  },
  {
    id: "completed",
    name: "Completed",
    description: "Finished tasks and wins.",
  },
  {
    id: "recent",
    name: "Recent",
    description: "Created in the last 7 days.",
  },
];

export function getProjectById(projectId: string) {
  return PROJECT_DEFINITIONS.find((project) => project.id === projectId) ?? null;
}

export function filterTasksByProjectId(tasks: Task[], projectId: string) {
  if (projectId === "all") {
    return tasks;
  }

  if (projectId === "pending") {
    return tasks.filter((task) => !task.completed);
  }

  if (projectId === "completed") {
    return tasks.filter((task) => task.completed);
  }

  if (projectId === "recent") {
    const last7Days = Date.now() - 7 * 24 * 60 * 60 * 1000;
    return tasks.filter((task) => new Date(task.createdAt).getTime() >= last7Days);
  }

  return [];
}