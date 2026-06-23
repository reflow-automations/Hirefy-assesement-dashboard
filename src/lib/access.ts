import "server-only";
import { cookies } from "next/headers";
import { ACCESS_COOKIE } from "@/proxy";

/**
 * Soft access-gate check, server-side. Dezelfde cookie die de proxy zet na login.
 * De proxy laat /api en server actions zelf door, dus write- en export-paden
 * controleren de toegang hier expliciet (defense in depth).
 */
export async function hasAccess(): Promise<boolean> {
  const store = await cookies();
  return store.get(ACCESS_COOKIE)?.value === "1";
}
