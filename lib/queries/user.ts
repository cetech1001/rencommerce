"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/actions/auth";
import { IUser, PaginatedResponse } from "../types";

export interface UserQueryOptions {
  page?: number;
  limit?: number;
  orderBy?: "createdAt" | "name" | "email";
  sortOrder?: "asc" | "desc";
}

export async function getUsers(
  options: UserQueryOptions = {}
): Promise<PaginatedResponse<IUser>> {
  await requireAdmin();

  const {
    page = 1,
    limit = 10,
    orderBy = "createdAt",
    sortOrder = "desc",
  } = options;

  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        phone: true,
        createdAt: true,
      },
      orderBy: {
        [orderBy]: sortOrder,
      },
      skip: limit * (page - 1),
      take: limit,
    });

    const usersCount = await prisma.user.count();

    return {
      data: users,
      meta: {
        page,
        itemsCount: users.length,
        totalPages: Math.ceil(usersCount / limit),
        totalCount: usersCount,
      },
    };
  } catch (error) {
    console.error("Error fetching users:", error);
    return {
      data: [],
      meta: {
        page,
        itemsCount: 0,
        totalPages: 0,
        totalCount: 0,
      },
    };
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
