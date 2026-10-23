import type { Metadata } from "next";
import AdminShell from "../shell";
import Backups from "./manager";
export const metadata: Metadata = { title: "Respaldos y recuperación", robots: { index: false, follow: false } };
export default function Page() { return <AdminShell active="/admin/respaldos"><Backups /></AdminShell>; }
