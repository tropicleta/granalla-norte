"use client";

import Image from "next/image";
import { useState } from "react";
import { Container } from "./ui";
import styles from "./ClientCarousel.module.css";

const brands = [
  { name: "Minera Candelaria", logo: "candelaria", white: true },
  { name: "Fenix Gold", logo: "fenix-gold" },
  { name: "Kinross", logo: "kinross" },
  { name: "Branda", logo: "branda" },
  { name: "Minera Altair", logo: "altair" },
];

export function ClientCarousel() {
  const [paused, setPaused] = useState(false);
  return (
    <section aria-labelledby="clientes" className="border-b border-sand bg-sand-300 py-10 sm:py-14">
      <Container>
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-khaki-700">Experiencia compartida</p>
            <h2 id="clientes" className="mt-2 font-display text-2xl font-semibold text-olive-900 sm:text-3xl">Han confiado en nosotros</h2>
          </div>
          <button type="button" aria-pressed={paused} onClick={() => setPaused(!paused)} className={`${styles.pause} rounded-full border border-olive-700/25 px-4 py-2 text-sm font-medium text-olive-900 hover:bg-white/60 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper`}>
            {paused ? "Reanudar" : "Pausar"}<span className="sr-only"> el carrusel de clientes</span>
          </button>
        </div>
        <div className={styles.viewport}>
          <div className={styles.track} data-paused={paused}>
            {[0, 1].map(copy => (
              <ul key={copy} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
                {brands.map(brand => (
                  <li key={brand.logo} className={styles.item}>
                    <div className={styles.card}>
                      <Image src={`/img/clients/${brand.logo}.png`} alt={copy === 0 ? brand.name : ""} width={220} height={100} sizes="220px" className={`${styles.logo} ${brand.white ? styles.white : ""}`} />
                    </div>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
