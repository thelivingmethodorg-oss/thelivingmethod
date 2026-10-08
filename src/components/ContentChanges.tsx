"use client";

import { useEffect } from "react";
import { revalidatePublished } from "@/app/actions";

// A publish arrives as a burst of row changes; act once it settles.
const SETTLE_MS = 1000;

/**
 * Listens to the CMS content-change stream and, after a change, revalidates the
 * prerendered pages; the server action's response re-renders this page.
 */
export function ContentChanges() {
  useEffect(() => {
    const source = new EventSource("/api/content-changes");
    let timer: ReturnType<typeof setTimeout> | undefined;
    source.onmessage = () => {
      clearTimeout(timer);
      timer = setTimeout(() => void revalidatePublished(), SETTLE_MS);
    };
    return () => {
      clearTimeout(timer);
      source.close();
    };
  }, []);
  return null;
}
