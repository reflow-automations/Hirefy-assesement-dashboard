"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE } from "@/proxy";

// 30 days
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

export async function login(formData: FormData) {
  const password = String(formData.get("password") ?? "");
  const next = String(formData.get("next") ?? "/") || "/";
  const expected = process.env.ACCESS_PASSWORD;

  if (!expected) {
    // Misconfiguration — surface via error param so the form renders a message
    redirect(`/login?error=misconfigured&next=${encodeURIComponent(next)}`);
  }

  if (password !== expected) {
    redirect(`/login?error=invalid&next=${encodeURIComponent(next)}`);
  }

  const store = await cookies();
  store.set({
    name: ACCESS_COOKIE,
    value: "1",
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });

  redirect(next.startsWith("/") ? next : "/");
}

export async function logout() {
  const store = await cookies();
  store.delete(ACCESS_COOKIE);
  redirect("/login");
}
