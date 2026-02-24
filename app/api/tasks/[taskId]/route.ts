import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/server-auth";

export const runtime = "nodejs";

function parseTaskId(taskId: string) {
  const id = Number(taskId);
  return Number.isInteger(id) ? id : null;
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;
  const parsedTaskId = parseTaskId(taskId);
  if (!parsedTaskId) {
    return NextResponse.json({ message: "Invalid task id." }, { status: 400 });
  }

  const existingTasks = await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
    SELECT id
    FROM task
    WHERE id = ${parsedTaskId} AND userId = ${userId}
    LIMIT 1
  `);
  if (!existingTasks.length) {
    return NextResponse.json({ message: "Task not found." }, { status: 404 });
  }

  const { completed } = (await request.json()) as { completed?: boolean };
  if (typeof completed !== "boolean") {
    return NextResponse.json({ message: "Completed flag is required." }, { status: 400 });
  }

  if (completed) {
    await prisma.$executeRaw(
      Prisma.sql`
        UPDATE task
        SET completed = ${true},
            completedAt = NOW(),
            updatedAt = NOW()
        WHERE id = ${parsedTaskId} AND userId = ${userId}
      `
    );
  } else {
    await prisma.$executeRaw(
      Prisma.sql`
        UPDATE task
        SET completed = ${false},
            completedAt = NULL,
            updatedAt = NOW()
        WHERE id = ${parsedTaskId} AND userId = ${userId}
      `
    );
  }

  const updatedTasks = await prisma.$queryRaw<
    Array<{
      id: number;
      title: string;
      dueDate: Date | null;
      completed: number;
      completedAt: Date | null;
      createdAt: Date;
      updatedAt: Date;
    }>
  >(Prisma.sql`
    SELECT id, title, dueDate, completed, completedAt, createdAt, updatedAt
    FROM task
    WHERE id = ${parsedTaskId} AND userId = ${userId}
    LIMIT 1
  `);

  const updatedTask = updatedTasks[0];

  return NextResponse.json({
    task: {
      ...updatedTask,
      completed: Boolean(updatedTask.completed),
    },
  });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ taskId: string }> }
) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { taskId } = await params;
  const parsedTaskId = parseTaskId(taskId);
  if (!parsedTaskId) {
    return NextResponse.json({ message: "Invalid task id." }, { status: 400 });
  }

  const existingTasks = await prisma.$queryRaw<Array<{ id: number }>>(Prisma.sql`
    SELECT id
    FROM task
    WHERE id = ${parsedTaskId} AND userId = ${userId}
    LIMIT 1
  `);
  if (!existingTasks.length) {
    return NextResponse.json({ message: "Task not found." }, { status: 404 });
  }

  await prisma.$executeRaw(Prisma.sql`
    DELETE FROM task
    WHERE id = ${parsedTaskId} AND userId = ${userId}
  `);

  return NextResponse.json({ success: true });
}
