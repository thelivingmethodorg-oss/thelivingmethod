/**
 * Local preview of the full homepage, rendered directly from cms-seed/content.json.
 *
 * This exists so the site can be seen and exercised before the CMS content is
 * seeded (CMS writes currently require an editor/admin role in the org). Once
 * the seed has been pushed and the "/" page is Live, this route is redundant —
 * it renders the same components the CMS registry uses.
 */
import { readFileSync } from "node:fs";
import { join } from "node:path";
import LivingNavbar from "@/components/blocks/LivingNavbar";
import LivingHero from "@/components/blocks/LivingHero";
import LivingPhilosophy from "@/components/blocks/LivingPhilosophy";
import LivingPillars from "@/components/blocks/LivingPillars";
import LivingSanctuary from "@/components/blocks/LivingSanctuary";
import LivingBooking from "@/components/blocks/LivingBooking";
import LivingTestimonial from "@/components/blocks/LivingTestimonial";
import LivingFooter from "@/components/blocks/LivingFooter";
import type { PillarDoc } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function LocalPreviewPage() {
  const seed = JSON.parse(
    readFileSync(join(process.cwd(), "cms-seed", "content.json"), "utf8")
  );

  const contentFor = (schema: string) =>
    seed.blocks.find((b: { schema_name: string }) => b.schema_name === schema)?.content;

  const pillarDocs: PillarDoc[] = seed.documents.living_pillar.map(
    (doc: { content: PillarDoc }) => doc.content
  );

  const pillarsContent = {
    ...contentFor("living_pillars"),
    // Inline the pillar documents in place of the __PILLAR_REFS__ placeholder.
    pillars: pillarDocs,
  };

  return (
    <>
      <LivingNavbar content={contentFor("living_navbar")} />
      <LivingHero content={contentFor("living_hero")} />
      <LivingPhilosophy content={contentFor("living_philosophy")} />
      <LivingPillars content={pillarsContent} />
      <LivingSanctuary content={contentFor("living_sanctuary")} />
      <LivingBooking content={contentFor("living_booking")} />
      <LivingTestimonial content={contentFor("living_testimonial")} />
      <LivingFooter content={contentFor("living_footer")} />
    </>
  );
}
