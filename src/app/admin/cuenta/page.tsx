import type { Metadata } from "next";
import AdminShell from "../shell";
import AccountForm from "./form";
export const metadata: Metadata = { title: "Mi cuenta", robots: { index: false, follow: false } };
export default function Page() { return <AdminShell active="/admin/cuenta"><AccountForm /></AdminShell>; }
