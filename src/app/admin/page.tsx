import type { Metadata } from "next";
import AdminPanel from "./panel";
import AdminShell from "./shell";

export const metadata: Metadata = {
  title: "Administración · Modelo",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  return <AdminShell active="/admin"><AdminPanel /></AdminShell>;
}
