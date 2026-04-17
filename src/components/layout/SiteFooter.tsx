import { cookies } from "next/headers";
import { Container } from "./Container";
import { LogoutButton } from "./LogoutButton";
import { ACCESS_COOKIE } from "@/proxy";

export async function SiteFooter() {
  const store = await cookies();
  const isAuthenticated = store.get(ACCESS_COOKIE)?.value === "1";

  return (
    <footer className="relative mt-32 border-t border-ink-200 bg-cream-100/60">
      <Container size="wide">
        <div className="py-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <span
              aria-hidden
              className="flex h-7 w-7 items-center justify-center rounded-md bg-gradient-to-br from-terracotta via-ochre to-violet"
            >
              <span className="block h-2.5 w-2.5 rounded-sm bg-cream-50" />
            </span>
            <span className="display text-xl text-ink-950">Hirefy</span>
          </div>

          <div className="flex items-center gap-6">
            <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-500">
              Gebouwd op ESCO · Bloom&apos;s Taxonomy · © {new Date().getFullYear()}
            </div>
            {isAuthenticated && (
              <>
                <span aria-hidden className="h-3 w-px bg-ink-300" />
                <LogoutButton />
              </>
            )}
          </div>
        </div>
      </Container>
    </footer>
  );
}
