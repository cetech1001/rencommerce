"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword } from "@/lib/password";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "./auth";

interface CreateUserData {
  name: string;
  email: string;
  password: string;
  role?: "CUSTOMER" | "ADMIN";
}

export async function createUser(data: CreateUserData) {
  await requireAdmin();

  try {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: data.role || "CUSTOMER",
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    revalidatePath("/admin/users");

    return { success: true, user };
  } catch (error) {
    console.error("Error creating user:", error);
    return { success: false, error: "Failed to create user" };
  }
}

interface UpdateUserData {
  id: string;
  name?: string;
  email?: string;
  role?: "CUSTOMER" | "ADMIN";
}

export async function updateUser(data: UpdateUserData) {
  await requireAdmin();

  try {
    const { id, ...updateData } = data;

    const user = await prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    revalidatePath("/admin/users");

    return { success: true, user };
  } catch (error) {
    console.error("Error updating user:", error);
    return { success: false, error: "Failed to update user" };
  }
}

export async function deleteUser(userID: string) {
  await requireAdmin();

  try {
    await prisma.user.delete({
      where: { id: userID },
    });

    revalidatePath("/admin/users");

    return { success: true };
  } catch (error) {
    console.error("Error deleting user:", error);
    return { success: false, error: "Failed to delete user" };
  }
}
