"use client";

export default function AdminError({ reset }: { reset: () => void }) {
  return <section className="mx-auto max-w-xl px-6 py-16"><h1 className="font-display text-3xl text-olive-900">No pudimos abrir la administración</h1><p className="mt-5 leading-relaxed">El servicio no está disponible en este momento. Si el problema continúa, revisa el estado y los límites del almacenamiento en Vercel.</p><p className="mt-4 leading-relaxed">No se han confirmado cambios. Espera a que el servicio vuelva antes de volver a guardar o cargar archivos.</p><button className="mt-6 rounded-lg bg-olive-900 px-5 py-3 font-semibold text-white" onClick={reset}>Volver a intentar</button></section>;
}
