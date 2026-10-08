import { ParametricPreview } from "cms-renderer";
import { notFound } from "next/navigation";
import { cmsUrl, median } from "@/lib/median";
import { registry } from "@/lib/registry";

// `/cms-preview_/<path>`: the live draft, read on every request (never prerendered
// or cached), with the overlay the CMS uses to select and edit blocks.
export const dynamic = "force-dynamic";

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function PreviewPage({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = await median.resolveComponent(`/${slug.join("/")}`, { preview: true });
  if (!page) notFound();
  return <ParametricPreview page={page} registry={registry} cmsUrl={cmsUrl} />;
}
