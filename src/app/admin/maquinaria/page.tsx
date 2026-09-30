import type { Metadata } from "next";
import AdminShell from "../shell";
import MachineryManager from "./editor";
export const metadata: Metadata = { title: "Administrar maquinaria", robots: { index: false, follow: false } };
export default function Page() { return <AdminShell active="/admin/maquinaria"><MachineryManager /></AdminShell>; }
