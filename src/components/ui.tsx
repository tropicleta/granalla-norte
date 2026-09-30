import Image from "next/image";
import Link from "next/link";
import type { Post } from "@/lib/site";
import { formatDate } from "@/lib/site";

export function Container({ className = "", children }: { className?: string; children: React.ReactNode }) {
  return <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 ${className}`}>{children}</div>;
}

export function Eyebrow({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <p
      className={`inline-flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.2em] ${
        dark ? "text-khaki" : "text-khaki-700"
      }`}
    >
      <span className={`h-px w-8 ${dark ? "bg-khaki" : "bg-khaki-700"}`} aria-hidden />
      {children}
    </p>
  );
}

export function SectionTitle({
  eyebrow,
  title,
  intro,
  dark = false,
  center = false,
}: {
  eyebrow: string;
  title: string;
  intro?: string;
  dark?: boolean;
  center?: boolean;
}) {
  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <Eyebrow dark={dark}>{eyebrow}</Eyebrow>
      <h2
        className={`mt-4 font-display text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl ${
          dark ? "text-cream" : "text-olive-900"
        }`}
      >
        {title}
      </h2>
      {intro && <p className={`mt-4 text-lg leading-relaxed ${dark ? "text-cream/75" : "text-ink/70"}`}>{intro}</p>}
    </div>
  );
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost" | "outline";
}) {
  const styles = {
    primary: "bg-copper text-white hover:bg-copper-600",
    ghost: "bg-white/10 text-cream ring-1 ring-white/25 hover:bg-white/20",
    outline: "text-olive-900 ring-1 ring-olive-900/25 hover:bg-olive-900 hover:text-cream",
  }[variant];
  return (
    <Link
      href={href}
      className={`inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold transition ${styles}`}
    >
      {children}
      <Arrow />
    </Link>
  );
}

export function Arrow({ className = "size-4" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M4 10h12M11 5l5 5-5 5" />
    </svg>
  );
}

export function PageHero({ eyebrow, title, intro }: { eyebrow: string; title: string; intro: string }) {
  return (
    <section className="topo relative overflow-hidden bg-olive-900">
      <Container className="py-20 sm:py-28">
        <Eyebrow dark>{eyebrow}</Eyebrow>
        <h1 className="mt-5 max-w-3xl font-display text-4xl font-semibold leading-[1.05] tracking-tight text-cream text-balance sm:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-cream/75">{intro}</p>
      </Container>
      <div className="chevron absolute inset-x-0 bottom-0 h-1.5 opacity-50" aria-hidden />
    </section>
  );
}

export function PostCard({ post }: { post: Post }) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-white shadow-[var(--shadow-card)] transition hover:-translate-y-1">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={post.image}
          unoptimized={post.image.startsWith("/api/media/")}
          alt=""
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 rounded-full bg-olive-950/85 px-3 py-1 text-xs font-medium text-khaki backdrop-blur">
          {post.category}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-6">
        <p className="text-xs font-medium text-ink/55">
          <time dateTime={post.date}>{formatDate(post.date)}</time>
          {post.client && <> · {post.client}</>}
        </p>
        <h3 className="mt-2 font-display text-lg font-semibold leading-snug text-olive-900">
          <Link href={`/noticias/${post.slug}`} className="after:absolute after:inset-0">
            {post.title}
          </Link>
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-ink/70">{post.excerpt}</p>
        <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-semibold text-copper-600">
          Ver proyecto <Arrow />
        </span>
      </div>
    </article>
  );
}

export function CtaBand() {
  return (
    <section className="bg-cream py-20">
      <Container>
        <div className="topo relative overflow-hidden rounded-[2rem] bg-olive-900 px-6 py-14 sm:px-14 sm:py-16">
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h2 className="font-display text-3xl font-semibold text-cream text-balance sm:text-4xl">
                ¿Tienes una faena, camino u obra que resolver?
              </h2>
              <p className="mt-3 max-w-xl text-cream/75">
                Cuéntanos qué necesitas y te respondemos con una propuesta técnica y comercial.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <ButtonLink href="/contacto">Solicitar cotización</ButtonLink>
              <ButtonLink href="/servicios" variant="ghost">
                Ver servicios
              </ButtonLink>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
