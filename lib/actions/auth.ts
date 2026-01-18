"use server";

import { prisma } from "@/lib/prisma";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, deleteSessionCookie, getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

interface RegisterData {
  email: string;
  name: string;
  phone?: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

export async function register(data: RegisterData) {
  try {
    const { email, name, phone, password } = data;

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: "User with this email already exists" };
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        phone: phone || null,
        password: hashedPassword,
        role: "CUSTOMER",
      },
    });

    // Create session
    const token = await createSession({
      userID: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    // Set session cookie
    const { setSessionCookie } = await import("@/lib/session");
    await setSessionCookie(token);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Registration error:", error);
    return { success: false, error: "Failed to create account" };
  }
}

export async function login(data: LoginData) {
  try {
    const { email, password } = data;

    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: "Invalid email or password" };
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    if (!isValid) {
      return { success: false, error: "Invalid email or password" };
    }

    // Create session
    const token = await createSession({
      userID: user.id,
      role: user.role,
      name: user.name,
      email: user.email,
    });

    // Set session cookie
    const { setSessionCookie } = await import("@/lib/session");
    await setSessionCookie(token);

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, error: "Failed to login" };
  }
}

export async function logout() {
  await deleteSessionCookie();
  redirect("/");
}

export async function getAuthSession() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null };
  }

  return { user };
}

export async function requireAuth() {
  const session = await getAuthSession();

  if (!session.user) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await getAuthSession();

  if (!session.user || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return session;
}
