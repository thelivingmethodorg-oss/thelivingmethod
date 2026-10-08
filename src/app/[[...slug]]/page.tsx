import { ParametricPage } from "cms-renderer";
import { notFound } from "next/navigation";
import { median } from "@/lib/median";
import { registry } from "@/lib/registry";

// Every published URL is prerendered; anything else is a 404.
export const dynamicParams = false;

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
  return <ParametricPage page={page} registry={registry} />;
}
