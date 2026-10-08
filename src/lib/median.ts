import { Median } from "cms-renderer";
import { registry } from "@/lib/registry";

// The website and the Median page service it reads from (not secrets).
const MEDIAN_WEBSITE_ID = "262d99bd-dd78-4b94-8f30-44e472110aed";
const DATASET_ENDPOINT = "https://tensorzero-csv-848689284230.us-central1.run.app";

// The API key stays in the environment: it can read drafts.
const { MEDIAN_API_KEY, MEDIAN_CMS_URL } = process.env;
if (!MEDIAN_API_KEY) {
  throw new Error("MEDIAN_API_KEY is not set: published and draft reads need it.");
}
const apiKey: string = MEDIAN_API_KEY;

/** The CMS origin that frames draft previews; their edit messages go only there. */
export const cmsUrl = MEDIAN_CMS_URL || "https://app.mediancms.com";

/** The site's Median client. */
export const median = new Median({
  apiKey,
  datasetEndpoint: DATASET_ENDPOINT,
  websiteId: MEDIAN_WEBSITE_ID,
  registry,
  // Next's ISR cache holds the published snapshot; an in-memory copy here would
  // outlive `revalidatePath` on a reused instance and re-serve the old page.
  revalidate: 0,
});

/**
 * The website's content-change stream (Server-Sent Events) from the page
 * service: one event per CMS change, used only as a "revalidate now" signal.
 */
export function contentChanges(signal: AbortSignal) {
  const url = `${DATASET_ENDPOINT}/content-changes?websiteId=${MEDIAN_WEBSITE_ID}`;
  return fetch(url, {
    headers: { "x-api-key": apiKey, accept: "text/event-stream" },
    cache: "no-store",
    signal,
  });
}
