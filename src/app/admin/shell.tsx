import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { configuredPassword, SESSION_COOKIE, verifySession } from "@/lib/admin-session";

export default async function AdminShell({ children, active }: { children: React.ReactNode; active: string }) {
  if (!await verifySession((await cookies()).get(SESSION_COOKIE)?.value, configuredPassword())) redirect("/admin/login");
  return <><div className="flex flex-wrap items-center justify-between gap-4 bg-olive-900 px-6 py-4 text-white">
    <nav aria-label="Administración" className="flex flex-wrap gap-5 text-sm">
      {[["/admin", "Operación"], ["/admin/maquinaria", "Maquinaria"], ["/admin/equipos-monitoreo", "Equipos de monitoreo"], ["/admin/noticias", "Noticias"], ["/admin/mensajes", "Mensajes"]].map(([href, label]) => <Link key={href} href={href} aria-current={active === href ? "page" : undefined} className={active === href ? "font-bold text-khaki underline underline-offset-8" : "hover:underline"}>{label}</Link>)}
    </nav><form action="/api/admin/logout" method="post"><button className="text-sm underline underline-offset-4">Cerrar sesión</button></form>
  </div>{children}</>;
}
