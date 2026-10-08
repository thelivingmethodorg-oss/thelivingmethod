"use server";

import { revalidatePath } from "next/cache";

// Every open tab reports the same change; one purge per window is enough.
const MIN_INTERVAL_MS = 2000;
let lastRevalidated = 0;

/** Drop every prerendered page so the next request renders the published content. */
export async function revalidatePublished() {
  const now = Date.now();
  if (now - lastRevalidated < MIN_INTERVAL_MS) return;
  lastRevalidated = now;
  revalidatePath("/", "layout");
}
