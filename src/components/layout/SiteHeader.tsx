import Link from "next/link";
import { Container } from "./Container";
import { ThemeToggle } from "./ThemeToggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-cream-50/80 border-b border-ink-200">
      <Container size="wide">
        <div className="flex items-center justify-between py-4">
          <Link href="/" className="group flex items-center gap-3">
            <span
              aria-hidden
              className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-terracotta via-ochre to-violet shadow-[0_4px_12px_-2px_rgba(217,106,71,0.4)] transition-transform group-hover:scale-105"
            >
              <span className="block h-3 w-3 rounded-sm bg-cream-50" />
            </span>
            <span className="display text-2xl tracking-tight text-ink-950 leading-none">
              Hirefy
            </span>
            <span className="mono text-[10px] uppercase tracking-[0.2em] text-ink-500 hidden sm:inline pt-0.5">
              /&nbsp;catalogus
            </span>
          </Link>
          <nav className="flex items-center gap-1 text-sm">
            <Link
              className="px-4 py-2 rounded-full text-ink-800 hover:bg-cream-200 transition"
              href="/"
            >
              Beroepen
            </Link>
            <Link
              className="px-4 py-2 rounded-full text-ink-800 hover:bg-cream-200 transition"
              href="/dashboard"
            >
              Dashboard
            </Link>
            <Link
              className="px-4 py-2 rounded-full text-ink-800 hover:bg-cream-200 transition"
              href="/about"
            >
              Methodiek
            </Link>
            <div className="ml-2">
              <ThemeToggle />
            </div>
          </nav>
        </div>
      </Container>
    </header>
  );
}
