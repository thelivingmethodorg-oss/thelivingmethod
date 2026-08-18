import { configureSchema } from "cms-renderer/lib/schema";
import type { BlockComponentProps } from "cms-renderer/lib/types";
import { cmsConfig } from "@/lib/cms-config";
import type { DocumentRef, LivingBeingDoc, LivingBeingSectionContent } from "@/lib/types";

function isRef(value: DocumentRef | LivingBeingDoc): value is DocumentRef {
  return typeof value === "object" && value !== null && "_ref" in value;
}

/** Renders the Living Being section from its referenced headless CMS record. */
export default async function LivingBeing({
  content,
}: BlockComponentProps<LivingBeingSectionContent>) {
  let being: LivingBeingDoc | undefined = isRef(content.being) ? undefined : content.being;

  if (isRef(content.being)) {
    try {
      const resolved = await configureSchema({
        cmsUrl: cmsConfig.cmsUrl,
        websiteId: cmsConfig.websiteId,
        apiKey: cmsConfig.apiKey,
      })
        .name("living_being")
        .fetchByIds<LivingBeingDoc>([content.being._ref]);
      being = resolved.get(content.being._ref);
    } catch (error) {
      console.error("[LivingBeing] Failed to resolve living_being document:", error);
      return null;
    }
  }

  if (!being) return null;

  return (
    <section className="mx-auto max-w-screen-2xl px-8 py-20 md:px-12">
      <div className="mx-auto max-w-4xl rounded-3xl border border-stone/50 bg-sand/30 p-8 md:p-12">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-medium tracking-[3px] text-sage uppercase">{being.kicker}</span>
          <h3 className="heading-serif mt-3 text-5xl tracking-tighter">{being.name}</h3>
          <p className="mt-5 text-lg leading-relaxed text-warmgray">{being.description}</p>
        </div>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          <div>
            <h4 className="mb-3 text-xs font-medium tracking-[1.5px] text-sage uppercase">
              Living Being asks
            </h4>
            <ul className="space-y-3 text-warmgray">
              {being.questions.map((question) => <li key={question}>{question}</li>)}
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-medium tracking-[1.5px] text-sage uppercase">
              The elements together
            </h4>
            <ul className="space-y-3 text-warmgray">
              {being.integration_points.map((point) => <li key={point}>{point}</li>)}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}
