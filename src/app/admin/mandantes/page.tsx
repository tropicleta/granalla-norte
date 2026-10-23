import type { Metadata } from "next";
import Portal from "@/components/Portal";
import AdminShell from "../shell";
export const metadata: Metadata = { title: "Mandantes y proyectos", robots: { index: false, follow: false } };
export default function Page() { return <AdminShell active="/admin/mandantes"><Portal admin /></AdminShell>; }
