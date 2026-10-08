import type { BlockComponentProps } from "cms-renderer";
import type { LivingPillarsContent, PillarDoc } from "@/lib/types";
import PillarTabs from "./PillarTabs";

/**
 * The pillars are `living_pillar` documents: the page read fills each
 * reference with its document, so the block only renders them.
 */
export default function LivingPillars({ content }: BlockComponentProps<LivingPillarsContent>) {
  const pillars = (content.pillars ?? []).filter((p): p is PillarDoc => Boolean(p?.name));

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
