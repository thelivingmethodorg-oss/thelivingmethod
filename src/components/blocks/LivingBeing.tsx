import type { BlockComponentProps } from "cms-renderer";
import type { LivingBeingDoc, LivingBeingSectionContent } from "@/lib/types";

/** Renders the Living Being section from its `living_being` document, filled in by the page read. */
export default function LivingBeing({ content }: BlockComponentProps<LivingBeingSectionContent>) {
  const being = content.being?.name ? (content.being as LivingBeingDoc) : undefined;
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
