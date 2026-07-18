import ParametricRoutePage from "cms-renderer/lib/renderer";
import { cmsConfig } from "@/lib/cms-config";
import { registry } from "@/lib/registry";

// Production route. Optional catch-all so the CMS page at "/" renders too.
// CMS edit mode is served by /cms-preview_/[[...slug]] (force-dynamic),
// which the proxy rewrites to whenever ?edit_mode / ?ai_preview is present.

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params;

  return (
    <ParametricRoutePage
      registry={registry}
      apiKey={cmsConfig.apiKey ?? ""}
      websiteId={cmsConfig.websiteId}
      cmsUrl={cmsConfig.cmsUrl}
      params={Promise.resolve({ slug: slug ?? [] })}
    />
  );
}
