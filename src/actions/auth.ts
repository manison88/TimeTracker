"use server";

import { hash } from "bcryptjs";
import { redirect } from "next/navigation";
import { getDb } from "@/lib/prisma";
import { signIn, signOut } from "@/lib/auth";
import { signUpSchema, signInSchema } from "@/lib/validations/schemas";
import type { ActionResult } from "@/types";

export async function signUp(formData: FormData): Promise<ActionResult> {
  try {
    const name = formData.get("name") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validated = signUpSchema.parse({ name, email, password });
    const db = getDb();

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email: validated.email },
    });

    if (existingUser) {
      return { success: false, error: "An account with this email already exists" };
    }

    // Hash password and create user
    const hashedPassword = await hash(validated.password, 12);

    await db.user.create({
      data: {
        name: validated.name,
        email: validated.email,
        password: hashedPassword,
      },
    });

    // Sign in the user after registration
    await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    return { success: true };
  } catch (error) {
    console.error("Sign up error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create account",
    };
  }
}

export async function login(formData: FormData): Promise<ActionResult> {
  try {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const validated = signInSchema.parse({ email, password });

    const result = await signIn("credentials", {
      email: validated.email,
      password: validated.password,
      redirect: false,
    });

    if (result?.error) {
      return { success: false, error: "Invalid email or password" };
    }

    return { success: true };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Invalid email or password",
    };
  }
}

export async function logout() {
  await signOut({ redirect: false });
  redirect("/login");
}
