import { contentChanges } from "@/lib/median";

// A long-lived SSE stream, so never prerendered. Vercel closes it at
// `maxDuration`; EventSource then reconnects on its own.
export const dynamic = "force-dynamic";
export const maxDuration = 300;

/** Relay the page service's content-change stream; the API key stays here. */
export async function GET(request: Request) {
  const since =
    request.headers.get("last-event-id") ?? new URL(request.url).searchParams.get("since");
  const upstream = await contentChanges(request.signal, since).catch(() => null);
  if (!upstream?.ok || !upstream.body) {
    return new Response(null, { status: 502 });
  }
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      "X-Accel-Buffering": "no",
    },
  });
}
