import { Median } from "cms-renderer";
import { registry } from "@/lib/registry";

// The website and the Median page service it reads from (not secrets).
const MEDIAN_WEBSITE_ID = "262d99bd-dd78-4b94-8f30-44e472110aed";
const DATASET_ENDPOINT = "https://tensorzero-csv-848689284230.us-central1.run.app";

// The API key stays in the environment: it can read drafts.
const { MEDIAN_API_KEY, MEDIAN_CMS_URL } = process.env;

/** The CMS origin that frames draft previews; their edit messages go only there. */
export const cmsUrl = MEDIAN_CMS_URL || "https://app.mediancms.com";

/** The site's Median client. */
export const median = new Median({
  apiKey: MEDIAN_API_KEY,
  datasetEndpoint: DATASET_ENDPOINT,
  websiteId: MEDIAN_WEBSITE_ID,
  registry,
  // Published pages are prerendered once per build; drafts are never cached.
  revalidate: false,
});
