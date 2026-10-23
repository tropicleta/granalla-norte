import type { Metadata } from "next";
import { permanentRedirect } from "next/navigation";
export const metadata: Metadata = { title: "Portal de mandantes", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";
export default function Page() { permanentRedirect("/acceso"); }
