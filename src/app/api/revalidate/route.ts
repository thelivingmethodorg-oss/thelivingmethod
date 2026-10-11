import { revalidatePath } from "next/cache";
import { revalidateToken } from "@/lib/publish-listener";

export const dynamic = "force-dynamic";

/** Re-render every page; called by this server's publish listener (instrumentation.ts). */
export async function POST(request: Request) {
  if (request.headers.get("authorization") !== `Bearer ${revalidateToken()}`) {
    return new Response("Unauthorized", { status: 401 });
  }
  revalidatePath("/", "layout");
  return new Response(null, { status: 204 });
}
