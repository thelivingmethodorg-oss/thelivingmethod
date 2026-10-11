"use client";

import { watchContentChanges } from "cms-renderer";
import { useEffect } from "react";
import { revalidatePublished } from "@/app/actions";

/**
 * Listens to the CMS content-change stream and, after a change, revalidates the
 * prerendered pages; the server action's response re-renders this page. `since`
 * is the version the page was rendered from, so a page cached before a publish
 * hears about it the moment it opens.
 */
export function ContentChanges({ since }: { since: number | null }) {
  useEffect(
    () =>
      watchContentChanges("/api/content-changes", {
        since,
        onChange: () => void revalidatePublished(),
      }),
    [since]
  );
  return null;
}
