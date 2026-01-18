"use server";

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword } from "@/lib/password";
import { createSession, deleteSessionCookie, getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";
import type { ActionResponse, AuthUser, LoginCredentials, RegisterData } from "@/lib/types";

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

const invalidCredentialsResponse = (): ActionResponse<{
  user: AuthUser;
}> => {
  const message = "Invalid email or password";
  return {
    success: false,
    message,
    errors: {
      email: [message],
      password: [message],
    },
  };
};

export async function login(_: unknown, data: FormData) {
  try {
    const rawData = {
      email: data.get('email'),
      password: data.get('password'),
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { email: rawData.email?.toString() },
    });

    if (!user) {
      return invalidCredentialsResponse();
    }

    // Verify password
    const isValid = await verifyPassword(rawData.password?.toString() || '', user.password);

    if (!isValid) {
      return invalidCredentialsResponse();
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
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        },
      },
    };
  } catch (error) {
    console.error("Login error:", error);
    return { success: false, message: "Failed to login" };
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
