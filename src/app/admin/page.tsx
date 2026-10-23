import type { Metadata } from "next";
import Dashboard from "./dashboard";
import AdminShell from "./shell";
export const metadata: Metadata = { title: "Administración", robots: { index: false, follow: false } };
export default function AdminPage() { return <AdminShell active="/admin"><Dashboard /></AdminShell>; }
