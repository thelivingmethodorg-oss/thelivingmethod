import { createHash } from "node:crypto";
import { contentChanges } from "@/lib/median";

/**
 * The token `/api/revalidate` accepts: derived from the API key, so the server
 * process and the route agree on it without another secret to configure.
 */
export function revalidateToken(): string {
  return createHash("sha256")
    .update(`revalidate:${process.env.MEDIAN_API_KEY ?? ""}`)
    .digest("hex");
}

// A publish arrives as a burst of events; revalidate once it settles.
const SETTLE_MS = 1000;
const MAX_BACKOFF_MS = 30_000;

/** This server's own origin, for calling its revalidate route. */
function selfOrigin(): string {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  }
  return `http://127.0.0.1:${process.env.PORT ?? 3000}`;
}

async function revalidate() {
  try {
    const response = await fetch(`${selfOrigin()}/api/revalidate`, {
      method: "POST",
      headers: { authorization: `Bearer ${revalidateToken()}` },
    });
    if (!response.ok) console.warn(`[publish-listener] revalidate failed (${response.status})`);
  } catch (error) {
    console.warn("[publish-listener] revalidate failed", error);
  }
}

/**
 * Holds the website's published-change stream for as long as this server runs
 * and re-renders the site after every publish, whether or not anyone has it
 * open. Reconnects with backoff, resuming from the last version seen so a
 * publish made while disconnected still arrives.
 */
export async function listenForPublishes() {
  let since: string | null = null;
  let backoff = 1000;
  let timer: ReturnType<typeof setTimeout> | undefined;
  for (;;) {
    try {
      const response = await contentChanges(new AbortController().signal, since);
      if (!response.ok || !response.body) throw new Error(`stream answered ${response.status}`);
      backoff = 1000;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffered = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        buffered += decoder.decode(value, { stream: true });
        const events = buffered.split("\n\n");
        buffered = events.pop() ?? "";
        for (const event of events) {
          const lines = event.split("\n");
          const id = lines.find((line) => line.startsWith("id:"))?.slice(3).trim();
          if (id) since = id;
          // `ready` reports the current version; keep-alives are `:` comments.
          if (lines.some((line) => line.startsWith("event:"))) continue;
          if (!lines.some((line) => line.startsWith("data:"))) continue;
          clearTimeout(timer);
          timer = setTimeout(() => void revalidate(), SETTLE_MS);
        }
      }
    } catch (error) {
      console.warn("[publish-listener] stream dropped, reconnecting", error);
    }
    await new Promise((resolve) => setTimeout(resolve, backoff));
    backoff = Math.min(backoff * 2, MAX_BACKOFF_MS);
  }
}
