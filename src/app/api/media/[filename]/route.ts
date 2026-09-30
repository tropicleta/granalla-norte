import { cookies } from "next/headers";
import { configuredPassword, SESSION_COOKIE, verifySession } from "@/lib/admin-session";
import { publishedArticles } from "@/lib/content";
import { readBytes } from "@/lib/content-storage";

export const runtime = "nodejs";
export async function GET(_request: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params;
  if (!/^[a-f0-9-]{36}\.webp$/.test(filename)) return new Response(null, { status: 404 });
  try {
    const admin = await verifySession((await cookies()).get(SESSION_COOKIE)?.value, configuredPassword());
    if (!admin && !(await publishedArticles()).some(p => p.images.includes(`/api/media/${filename}`))) return new Response(null, { status: 404 });
    const file = await readBytes(`images/${filename}`);
    if (!file) return new Response(null, { status: 404 });
    return new Response(Buffer.from(file.bytes), { headers: { "Content-Type": "image/webp", "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return new Response(null, { status: 503 }); }
}
