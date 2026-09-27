import type { Metadata } from "next";
import AdminPanel from "./panel";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { configuredPassword, SESSION_COOKIE, verifySession } from "@/lib/admin-session";

export const metadata: Metadata = {
  title: "Administración · Modelo",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!await verifySession((await cookies()).get(SESSION_COOKIE)?.value, configuredPassword())) redirect("/admin/login");
  return <><form action="/api/admin/logout" method="post" className="flex justify-end bg-olive-900 px-6 py-3 text-white"><button className="text-sm underline underline-offset-4">Cerrar sesión</button></form><AdminPanel /></>;
}
