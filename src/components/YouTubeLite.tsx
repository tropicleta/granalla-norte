"use client";

import Image from "next/image";
import { useState } from "react";

/** Embed de YouTube que no carga el iframe (~1 MB de JS) hasta que el usuario hace clic. */
export function YouTubeLite({ id, title }: { id: string; title: string }) {
  const [play, setPlay] = useState(false);

  return (
    <div className="relative aspect-video overflow-hidden rounded-[var(--radius-card)] bg-black shadow-2xl ring-1 ring-white/10">
      {play ? (
        <iframe
          className="absolute inset-0 size-full"
          src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
          title={title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <button type="button" onClick={() => setPlay(true)} className="group absolute inset-0 size-full">
          <Image
            src={`https://i.ytimg.com/vi/${id}/hqdefault.jpg`}
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover opacity-80 transition group-hover:opacity-100"
          />
          <span className="absolute inset-0 grid place-items-center">
            <span className="grid size-20 place-items-center rounded-full bg-copper text-white shadow-xl transition group-hover:scale-110">
              <svg viewBox="0 0 24 24" className="ml-1 size-8" fill="currentColor" aria-hidden>
                <path d="M8 5v14l11-7z" />
              </svg>
            </span>
          </span>
          <span className="sr-only">Reproducir: {title}</span>
        </button>
      )}
    </div>
  );
}
