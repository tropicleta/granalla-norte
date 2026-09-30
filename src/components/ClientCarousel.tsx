import Image from "next/image";
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
  return (
    <section aria-labelledby="clientes" className="border-b border-sand bg-sand-300 py-10 sm:py-14">
      <Container>
        <div className="flex items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-khaki-700">Experiencia compartida</p>
            <h2 id="clientes" className="mt-2 font-display text-2xl font-semibold text-olive-900 sm:text-3xl">Han confiado en nosotros</h2>
          </div>
        </div>
        <div className={styles.viewport}>
          <div className={styles.track}>
            {[0, 1].map(copy => (
              <ul key={copy} className={styles.group} aria-hidden={copy === 1 ? true : undefined}>
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
      </Container>
    </section>
  );
}
