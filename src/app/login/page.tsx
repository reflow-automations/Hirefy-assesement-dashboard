import { Container } from "@/components/layout/Container";
import { Lock, ArrowRight, AlertCircle } from "lucide-react";
import { login } from "./actions";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const { error, next } = await searchParams;

  return (
    <section className="relative flex items-center min-h-[80vh]">
      <div className="mesh-hero" />
      <Container size="narrow" className="relative py-12 lg:py-20">
        <div className="max-w-md mx-auto fade-up">
          {/* Seal / badge */}
          <div className="flex items-center gap-3 mb-8">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-terracotta via-ochre to-violet shadow-[0_8px_24px_-6px_rgba(109,74,195,0.4)]">
              <Lock className="h-5 w-5 text-cream-50" strokeWidth={2.5} />
            </div>
            <div>
              <div className="mono text-[10px] uppercase tracking-[0.2em] text-ink-500 mb-0.5">
                Besloten
              </div>
              <div className="display text-xl text-ink-950 leading-none">
                Catalogus
              </div>
            </div>
          </div>

          <h1 className="display text-ink-950 text-5xl lg:text-6xl">
            Welkom<span className="text-violet">.</span>
          </h1>
          <p className="text-ink-700 mt-5 leading-relaxed text-lg">
            Deze showcase is beschikbaar voor Hirefy-klanten en partners. Voer
            het toegangswachtwoord in om de catalogus te openen.
          </p>

          <form action={login} className="mt-10 space-y-4">
            <input type="hidden" name="next" value={next || "/"} />

            <div>
              <label
                htmlFor="password"
                className="mono text-[11px] uppercase tracking-[0.2em] text-ink-500 mb-2 block"
              >
                Wachtwoord
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoFocus
                required
                placeholder="••••••••"
                className="w-full h-14 px-5 rounded-2xl bg-cream-100 border border-ink-200 text-ink-950 placeholder:text-ink-400 focus:outline-none focus:border-violet focus:bg-cream-50 focus:ring-4 focus:ring-violet-tint transition-all text-base"
              />
            </div>

            {error === "invalid" && (
              <div className="flex items-start gap-3 rounded-2xl bg-error-tint border-l-4 border-error p-4">
                <AlertCircle className="h-5 w-5 text-error shrink-0 mt-0.5" />
                <div>
                  <div className="mono text-[11px] uppercase tracking-[0.15em] font-semibold text-error">
                    Onjuist wachtwoord
                  </div>
                  <p className="text-sm text-ink-800 mt-0.5">
                    Controleer het wachtwoord en probeer opnieuw.
                  </p>
                </div>
              </div>
            )}

            {error === "misconfigured" && (
              <div className="flex items-start gap-3 rounded-2xl bg-ochre-tint border-l-4 border-ochre p-4">
                <AlertCircle className="h-5 w-5 text-ochre shrink-0 mt-0.5" />
                <div>
                  <div className="mono text-[11px] uppercase tracking-[0.15em] font-semibold text-ochre">
                    Server-configuratie ontbreekt
                  </div>
                  <p className="text-sm text-ink-800 mt-0.5">
                    <code className="mono">ACCESS_PASSWORD</code> is niet
                    ingesteld in <code className="mono">.env.local</code>.
                  </p>
                </div>
              </div>
            )}

            <button
              type="submit"
              className="group mono w-full h-14 rounded-full bg-ink-950 text-cream-50 text-xs uppercase tracking-[0.18em] font-semibold hover:bg-violet transition-all shadow-md hover:shadow-lg hover:scale-[1.01] inline-flex items-center justify-center gap-2"
            >
              Geef toegang
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </button>
          </form>

          <p className="mono text-[10px] uppercase tracking-[0.18em] text-ink-400 mt-10 text-center">
            Hirefy · skill-based assessment platform
          </p>
        </div>
      </Container>
    </section>
  );
}
