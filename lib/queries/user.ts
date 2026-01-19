"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/auth";
import { IUser } from "../types";

export async function getAllUsers() {
  await requireAdmin();

  try {
    return prisma.user.findMany({
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
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
}

export async function getUserByID(id: string): Promise<IUser | null> {
  return prisma.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      role: true,
      email: true,
      phone: true,
      createdAt: true,
    }
  });
}
