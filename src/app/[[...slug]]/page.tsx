import { ParametricPage } from "cms-renderer";
import { notFound } from "next/navigation";
import { ContentChanges } from "@/components/ContentChanges";
import { median } from "@/lib/median";
import { registry } from "@/lib/registry";

// Every published URL is prerendered and stays cached until a publish: the
// server listener (src/lib/publish-listener.ts) or the first tab to open a stale
// page (ContentChanges) revalidates it. A URL published since renders on its
// first request, and an unknown one is a 404.
export const dynamicParams = true;

export async function generateStaticParams() {
  const paths = await median.listPages();
  return paths.map((path) => ({ slug: path.split("/").filter(Boolean) }));
}

interface PageProps {
  params: Promise<{ slug?: string[] }>;
}

export default async function Page({ params }: PageProps) {
  const { slug = [] } = await params;
  const page = await median.resolveComponent(`/${slug.join("/")}`);
  if (!page) notFound();
  return (
    <>
      <ParametricPage page={page} registry={registry} />
      <ContentChanges since={page.publishedVersion} />
    </>
  );
}
