import type { MetadataRoute } from "next";
import { median } from "@/lib/median";

const SITE_URL = "https://thelivingmethod.info";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const paths = await median.listPages();
  const uniquePaths = [...new Set(paths.map((path) => `/${path.split("/").filter(Boolean).join("/")}`))];

  return uniquePaths.map((path) => ({
    url: new URL(path, SITE_URL).toString(),
    changeFrequency: "monthly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
