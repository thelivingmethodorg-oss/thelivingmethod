import { configureSchema } from "cms-renderer/lib/schema";
import type { BlockComponentProps } from "cms-renderer/lib/types";
import { cmsConfig } from "@/lib/cms-config";
import type { DocumentRef, LivingPillarsContent, PillarDoc } from "@/lib/types";
import PillarTabs from "./PillarTabs";

function isRef(item: DocumentRef | PillarDoc): item is DocumentRef {
  return typeof item === "object" && item !== null && "_ref" in item;
}

/**
 * Server component: resolves the pillars reference array through the
 * headless `living_pillar` CMS component, then hands the data to the client
 * tabs. The UI block stays presentation-only; pillar content lives in CMS
 * documents.
 */
export default async function LivingPillars({
  content,
}: BlockComponentProps<LivingPillarsContent>) {
  const items = content.pillars ?? [];
  const refIds = items.filter(isRef).map((item) => item._ref);

  let resolved = new Map<string, PillarDoc>();
  if (refIds.length > 0) {
    try {
      resolved = await configureSchema({
        cmsUrl: cmsConfig.cmsUrl,
        websiteId: cmsConfig.websiteId,
        apiKey: cmsConfig.apiKey,
      })
        .name("living_pillar")
        .fetchByIds<PillarDoc>(refIds);
    } catch (err) {
      console.error("[LivingPillars] Failed to resolve living_pillar documents:", err);
    }
  }

  const pillars = items
    .map((item) => (isRef(item) ? resolved.get(item._ref) : item))
    .filter((p): p is PillarDoc => Boolean(p?.name));

  return (
    <section id="pillars" className="max-w-screen-2xl mx-auto px-8 md:px-12 pt-14 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col items-center text-center mb-10">
          <span className="uppercase tracking-[3px] text-xs text-sage font-medium">
            {content.kicker}
          </span>
          <h3 className="heading-serif text-5xl tracking-tighter mt-3 mb-3">{content.heading}</h3>
          <p className="max-w-md text-warmgray">{content.subheading}</p>
        </div>

        {pillars.length > 0 && <PillarTabs pillars={pillars} />}
      </div>
    </section>
  );
}
