import { ParametricPage } from "cms-renderer";
import { notFound } from "next/navigation";
import { ContentChanges } from "@/components/ContentChanges";
import { median } from "@/lib/median";
import { registry } from "@/lib/registry";

// Every published URL is prerendered; a URL published since renders on its first
// request, and an unknown one is a 404. A CMS change re-renders them (see
// ContentChanges).
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
      <ContentChanges />
    </>
  );
}
