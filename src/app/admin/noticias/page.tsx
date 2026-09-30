import type { Metadata } from "next";
import AdminShell from "../shell";
import NewsManager from "./editor";
export const metadata: Metadata = { title: "Administrar noticias", robots: { index: false, follow: false } };
export default function Page() { return <AdminShell active="/admin/noticias"><NewsManager /></AdminShell>; }
