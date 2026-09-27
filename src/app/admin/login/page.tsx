import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { configuredPassword, SESSION_COOKIE, verifySession } from "@/lib/admin-session";
import LoginForm from "./form";

export const metadata: Metadata = { title: "Acceso de administrador", robots: { index: false, follow: false } };

export default async function LoginPage() {
  const password = configuredPassword();
  if (await verifySession((await cookies()).get(SESSION_COOKIE)?.value, password)) redirect("/admin");
  return <section className="px-4 py-16 sm:py-24"><div className="mx-auto max-w-md rounded-3xl border border-sand bg-white p-8 shadow-card sm:p-10"><p className="text-xs font-semibold tracking-widest text-khaki-700">GRANALLA NORTE</p><h1 className="mt-4 font-display text-3xl font-semibold text-olive-900">Acceso de administrador</h1><p className="mt-4 text-sm text-ink/70">Ingresa para gestionar inventario, finanzas, obras y maquinaria.</p>{password ? <LoginForm/> : <p className="mt-8 rounded-xl bg-sand-300 p-4 text-sm" role="status">El acceso está cerrado mientras se configura la cuenta de administración.</p>}</div></section>;
}
