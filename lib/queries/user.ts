"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/auth";

export async function getAllUsers() {
  await requireAdmin();

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return users.map(user => ({
      ...user,
      createdAt: user.createdAt.toLocaleDateString(),
    }));
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}
