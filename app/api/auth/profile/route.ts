import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { getAuthenticatedUserId } from "@/lib/server-auth";

export const runtime = "nodejs";

export async function PATCH(request: Request) {
  const userId = await getAuthenticatedUserId();
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { name, email } = (await request.json()) as {
    name?: string;
    email?: string;
  };

  if (!name || !email) {
    return NextResponse.json({ message: "Name and email are required." }, { status: 400 });
  }

  const trimmedName = name.trim();
  const normalizedEmail = email.trim().toLowerCase();

  if (!trimmedName) {
    return NextResponse.json({ message: "Name is required." }, { status: 400 });
  }

  const existingUser = await prisma.user.findFirst({
    where: {
      email: normalizedEmail,
      id: { not: userId },
    },
    select: { id: true },
  });

  if (existingUser) {
    return NextResponse.json({ message: "Email is already in use." }, { status: 409 });
  }

  const updatedUser = await prisma.user.update({
    where: { id: userId },
    data: {
      name: trimmedName,
      email: normalizedEmail,
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
  });

  return NextResponse.json({
    user: {
      id: updatedUser.id.toString(),
      name: updatedUser.name,
      email: updatedUser.email,
    },
  });
}
