import type { Metadata } from "next";
import AdminShell from "../shell";
import Inbox from "./inbox";
export const metadata: Metadata = { title: "Mensajes recibidos", robots: { index: false, follow: false } };
export default function Page() { return <AdminShell active="/admin/mensajes"><Inbox /></AdminShell>; }
