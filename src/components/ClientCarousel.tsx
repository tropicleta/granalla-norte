"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import { Container } from "./ui";
import styles from "./ClientCarousel.module.css";

const brands = [
  { name: "Lundin Mining Candelaria", logo: "lundin-candelaria", light: true },
  { name: "Fenix Gold", logo: "fenix-gold" },
  { name: "Kinross", logo: "kinross" },
  { name: "Branda", logo: "branda" },
  { name: "Minera Altair", logo: "altair" },
];

export function ClientCarousel() {
  const viewport = useRef<HTMLDivElement>(null);
  const group = useRef<HTMLUListElement>(null);
  const resumeAt = useRef(0);
  const pointerDown = useRef(false);

  useEffect(() => {
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let frame = 0;
    let previous = 0;
    let position = viewport.current?.scrollLeft ?? 0;
    const tick = (now: number) => {
      // Low-power mobile browsers may deliver fewer frames. Use elapsed time
      // rather than a frame count so the logos keep moving at the same speed.
      const elapsed = previous ? Math.min(now - previous, 1000) : 0;
      previous = now;
      const element = viewport.current;
      const width = group.current?.offsetWidth ?? 0;
      if (element && width && !motion.matches && !document.hidden && !pointerDown.current && now >= resumeAt.current) {
        // Keep fractional movement even on browsers that round scrollLeft.
        if (Math.abs(element.scrollLeft - position) > 2) position = element.scrollLeft;
        position = (position + elapsed * 0.035) % width;
        element.scrollLeft = position;
      } else if (element) {
        position = element.scrollLeft;
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  const rest = () => { resumeAt.current = performance.now() + 1200; };
  function move(direction: number) {
    const element = viewport.current;
    const width = group.current?.offsetWidth ?? 0;
    if (!element || !width) return;
    rest();
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduced && direction < 0 && element.scrollLeft < 1) element.scrollLeft = width;
    if (!reduced && direction > 0 && element.scrollLeft >= width) element.scrollLeft -= width;
    element.scrollBy({ left: direction * (group.current?.firstElementChild?.getBoundingClientRect().width ?? 220), behavior: reduced ? "instant" : "smooth" });
  }
  return (
    <section aria-labelledby="clientes" className="border-b border-sand bg-sand-300 py-10 sm:py-14">
      <Container>
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-khaki-700">Experiencia compartida</p>
            <h2 id="clientes" className="mt-2 font-display text-2xl font-semibold text-olive-900 sm:text-3xl">Han confiado en nosotros</h2>
          </div>
        </div>
        <div id="logos-clientes" ref={viewport} className={styles.viewport} role="region" aria-label="Carrusel de clientes" aria-describedby="ayuda-logos" tabIndex={0}
          onPointerDown={() => { pointerDown.current = true; rest(); }}
          onPointerUp={() => { pointerDown.current = false; rest(); }}
          onPointerCancel={() => { pointerDown.current = false; rest(); }}
          onPointerLeave={() => { pointerDown.current = false; }}
          onWheel={rest}
          onKeyDown={event => { if (event.key === "ArrowRight" || event.key === "ArrowLeft") { event.preventDefault(); move(event.key === "ArrowRight" ? 1 : -1); } }}>
          <div className={styles.track}>
            {[0, 1].map(copy => (
              <ul key={copy} ref={copy === 0 ? group : undefined} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
                {brands.map(brand => (
                  <li key={brand.logo} className={styles.item}>
                    <div className={`${styles.card} ${brand.light ? styles.light : ""}`}>
                      <Image src={`/img/clients/${brand.logo}.png`} alt={copy === 0 ? brand.name : ""} width={220} height={100} sizes="220px" className={styles.logo} />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
        <p id="ayuda-logos" className="sr-only">Desliza o usa las flechas del teclado para recorrer los clientes.</p>
      </Container>
    </section>
  );
}
