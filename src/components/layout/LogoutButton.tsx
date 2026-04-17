import { LogOut } from "lucide-react";
import { logout } from "@/app/login/actions";

export function LogoutButton() {
  return (
    <form action={logout}>
      <button
        type="submit"
        className="mono inline-flex items-center gap-1.5 text-[10px] uppercase tracking-[0.18em] text-ink-500 hover:text-violet transition"
      >
        <LogOut className="h-3 w-3" />
        Uitloggen
      </button>
    </form>
  );
}
