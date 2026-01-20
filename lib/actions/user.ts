"use server";

import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { revalidatePath } from "next/cache";
import { requireAdmin, getAuthSession } from "./auth";
import type { CreateUserData, UpdateUserData } from "@/lib/types";

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

export async function updateUser(data: UpdateUserData) {
  await requireAdmin();

  try {
    const { id, ...updateData } = data;

    // Check if email is being updated and if it's unique
    if (updateData.email) {
      const existingUser = await prisma.user.findFirst({
        where: {
          email: updateData.email,
          NOT: { id },
        },
      });

      if (existingUser) {
        return { success: false, error: "A user with this email already exists" };
      }
    }

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

// Update phone number - can be used by admin or user themselves
export async function updateUserPhone(userId: string, phone: string, isAdmin: boolean = false) {
  try {
    if (isAdmin) {
      await requireAdmin();
    } else {
      const session = await getAuthSession();
      if (!session.user || session.user.id !== userId) {
        return { success: false, error: "Unauthorized" };
      }
    }

    await prisma.user.update({
      where: { id: userId },
      data: { phone },
    });

    revalidatePath("/admin/users");
    revalidatePath("/account/profile");

    return { success: true };
  } catch (error) {
    console.error("Error updating phone:", error);
    return { success: false, error: "Failed to update phone number" };
  }
}

// Update password - can be used by admin or user themselves
export async function updateUserPassword(
  userId: string,
  newPassword: string,
  currentPassword?: string,
  isAdmin: boolean = false
) {
  try {
    if (isAdmin) {
      await requireAdmin();
    } else {
      const session = await getAuthSession();
      if (!session.user || session.user.id !== userId) {
        return { success: false, error: "Unauthorized" };
      }

      // For non-admin users, verify current password
      if (currentPassword) {
        const { verifyPassword } = await import("@/lib/password");
        const user = await prisma.user.findUnique({
          where: { id: userId },
        });

        if (!user || !(await verifyPassword(currentPassword, user.password))) {
          return { success: false, error: "Current password is incorrect" };
        }
      }
    }

    const hashedPassword = await hashPassword(newPassword);

    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    revalidatePath("/admin/users");
    revalidatePath("/account/profile");

    return { success: true };
  } catch (error) {
    console.error("Error updating password:", error);
    return { success: false, error: "Failed to update password" };
  }
}
