import type { Metadata } from "next";
import Portal from "@/components/Portal";

export const metadata: Metadata = { title: "Acceso mandantes", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default function Page() { return <Portal />; }
