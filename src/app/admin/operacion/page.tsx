import type { Metadata } from "next";
import AdminPanel from "../panel";
import AdminShell from "../shell";
export const metadata: Metadata = { title: "Demostración de operación", robots: { index: false, follow: false } };
export default function Page() { return <AdminShell active="/admin/operacion"><AdminPanel /></AdminShell>; }
