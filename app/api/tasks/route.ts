import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function GET() {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const tasks = await prisma.$queryRaw<Array<{
    id: number;
    title: string;
    dueDate: Date | null;
    completed: number;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }>>(Prisma.sql`
    SELECT id, title, dueDate, completed, completedAt, createdAt, updatedAt
    FROM task
    WHERE userId = ${userId}
    ORDER BY completed ASC, dueDate ASC, createdAt DESC
  `);

  return NextResponse.json({
    tasks: tasks.map((task) => ({
      ...task,
      completed: Boolean(task.completed),
    })),
  });
}

export async function POST(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { title } = (await request.json()) as {
    title?: string;
  };

  if (!title || !title.trim()) {
    return NextResponse.json({ message: "Task title is required." }, { status: 400 });
  }

  await prisma.$executeRaw(
    Prisma.sql`
      INSERT INTO task (title, completed, createdAt, updatedAt, userId)
      VALUES (${title.trim()}, ${false}, NOW(), NOW(), ${userId})
    `
  );

  const createdTasks = await prisma.$queryRaw<Array<{
    id: number;
    title: string;
    dueDate: Date | null;
    completed: number;
    completedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
  }>>(Prisma.sql`
    SELECT id, title, dueDate, completed, completedAt, createdAt, updatedAt
    FROM task
    WHERE userId = ${userId}
    ORDER BY id DESC
    LIMIT 1
  `);

  const task = createdTasks[0];

  return NextResponse.json(
    {
      task: {
        ...task,
        completed: Boolean(task.completed),
      },
    },
    { status: 201 }
  );
}
