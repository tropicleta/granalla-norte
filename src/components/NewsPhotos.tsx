"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";

export function NewsPhotos({ images, title, caption }: { images: string[]; title: string; caption?: string }) {
  const [active, setActive] = useState<number | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  useEffect(() => {
    if (active !== null && !dialog.current?.open) dialog.current?.showModal();
    if (active === null && dialog.current?.open) dialog.current.close();
  }, [active]);
  if (!images.length) return null;
  const move = (direction: number) => setActive(current => current === null ? null : (current + direction + images.length) % images.length);
  return (
    <aside aria-label="Fotografías del proyecto" className="min-w-0 rounded-2xl border border-olive-900/10 bg-white p-4 shadow-sm sm:p-5">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="font-display text-base font-semibold text-olive-900">En imágenes</h2>
        <span className="text-xs text-ink/55">{images.length === 1 ? "1 foto" : `${images.length} fotos`}</span>
      </div>
      <button type="button" aria-label={`Ampliar foto 1: ${title}`} onClick={() => setActive(0)} className="relative block h-52 w-full overflow-hidden rounded-xl bg-olive-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper sm:h-60 lg:h-56">
        <Image src={images[0]} unoptimized={images[0].startsWith("/api/media/")} alt={title} fill priority sizes="(min-width: 1024px) 320px, (min-width: 640px) 600px, 100vw" className="object-contain" />
        <span className="absolute bottom-2 right-2 rounded-full bg-black/65 px-3 py-1 text-xs text-white">Ampliar ↗</span>
      </button>
      {caption && <p className="mt-3 text-xs leading-relaxed text-ink/65">{caption}</p>}
      {images.length > 1 && <div className="mt-3 grid grid-cols-2 gap-3">{images.slice(1).map((url, index) => <button key={url} type="button" aria-label={`Ampliar foto ${index + 2}: ${title}`} onClick={() => setActive(index + 1)} className="relative h-28 overflow-hidden rounded-lg bg-olive-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-copper sm:h-36 lg:h-28"><Image src={url} unoptimized={url.startsWith("/api/media/")} alt={`${title} — vista ${index + 2}`} fill sizes="(min-width: 1024px) 150px, (min-width: 640px) 300px, 50vw" className="object-contain" /></button>)}</div>}
      <dialog ref={dialog} aria-labelledby={headingId} onCancel={() => setActive(null)} onClick={event => { if (event.target === event.currentTarget) setActive(null); }} onKeyDown={event => { if (event.key === "ArrowRight") move(1); if (event.key === "ArrowLeft") move(-1); }} className="fixed inset-0 m-auto max-h-[95dvh] w-[calc(100%-2rem)] max-w-6xl rounded-2xl border-0 bg-olive-950 p-4 text-cream shadow-xl backdrop:bg-black/85 sm:p-6">
        {active !== null && <>
          <div className="mb-4 flex items-start justify-between gap-4"><h2 id={headingId} className="text-sm font-medium leading-relaxed">{title}</h2><button type="button" onClick={() => setActive(null)} aria-label="Cerrar fotografías" className="shrink-0 rounded-lg border border-white/25 px-3 py-1 text-sm focus-visible:outline-2 focus-visible:outline-khaki">Cerrar ×</button></div>
          <div className="relative h-[65dvh] w-full"><Image src={images[active]} unoptimized={images[active].startsWith("/api/media/")} alt={`${title} — vista ${active + 1}`} fill sizes="90vw" className="object-contain" /></div>
          <div className="mt-4 flex items-center justify-between gap-3">{images.length > 1 ? <button type="button" onClick={() => move(-1)} className="rounded-lg border border-white/25 px-3 py-2 text-sm">← Anterior</button> : <span />}<span className="text-sm text-cream/70">{active + 1} / {images.length}</span>{images.length > 1 ? <button type="button" onClick={() => move(1)} className="rounded-lg border border-white/25 px-3 py-2 text-sm">Siguiente →</button> : <span />}</div>
        </>}
      </dialog>
    </aside>
  );
}
