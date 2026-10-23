import type { Metadata } from "next";
import AccountForm from "../cuenta/form";
export const metadata: Metadata = { title: "Recuperar acceso", robots: { index: false, follow: false } };
export default function Page() { return <AccountForm recovery />; }
