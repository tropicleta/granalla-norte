import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { SESSION_COOKIE } from "@/lib/admin-session";
import { verifyAdminSession } from "@/lib/admin-account";

export default async function AdminShell({ children, active }: { children: React.ReactNode; active: string }) {
  if (!await verifyAdminSession((await cookies()).get(SESSION_COOKIE)?.value)) redirect("/admin/login");
  return <><div className="flex flex-wrap items-center justify-between gap-4 bg-olive-900 px-6 py-4 text-white">
    <nav aria-label="Administración" className="flex flex-wrap gap-5 text-sm">
      {[["/admin", "Inicio"], ["/admin/mandantes", "Mandantes"], ["/admin/mensajes", "Mensajes"], ["/admin/sitio", "Página web"], ["/admin/respaldos", "Respaldos"], ["/admin/cuenta", "Mi cuenta"]].map(([href, label]) => <Link key={href} href={href} aria-current={(active === href || href === "/admin/sitio" && ["/admin/noticias", "/admin/maquinaria", "/admin/equipos-monitoreo"].includes(active)) ? "page" : undefined} className={(active === href || href === "/admin/sitio" && ["/admin/noticias", "/admin/maquinaria", "/admin/equipos-monitoreo"].includes(active)) ? "font-bold text-khaki underline underline-offset-8" : "hover:underline"}>{label}</Link>)}
    </nav><form action="/api/admin/logout" method="post"><button className="text-sm underline underline-offset-4">Cerrar sesión</button></form>
  </div>{children}</>;
}
