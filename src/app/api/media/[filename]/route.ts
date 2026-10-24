import { cookies } from "next/headers";
import { SESSION_COOKIE } from "@/lib/admin-session";
import { verifyAdminSession } from "@/lib/admin-account";
import { publishedArticles } from "@/lib/content";
import { publishedMonitoringEquipment } from "@/lib/monitoring";
import { publishedMachines } from "@/lib/machinery";
import { readSnapshotBytes } from "@/lib/content-storage";

export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!/^[a-f0-9-]{36}\.webp$/.test(filename)) return new Response(null, { status: 404 });
  try {
    const admin = await verifyAdminSession((await cookies()).get(SESSION_COOKIE)?.value);
    if (!admin) {
      const url = `/api/media/${filename}`;
      const [articles, machines, equipment] = await Promise.all([publishedArticles(), publishedMachines(), publishedMonitoringEquipment()]);
      if (!articles.some(p => p.images.includes(url)) && !machines.some(m => m.image === url) && !equipment.some(m => m.image === url)) return new Response(null, { status: 404 });
    }
    const file = await readSnapshotBytes(`images/${filename}`, true);
    if (!file) return new Response(null, { status: 404 });
    return new Response(Buffer.from(file.bytes), { headers: { "Content-Type": "image/webp", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response(null, { status: 503 }); }
}
