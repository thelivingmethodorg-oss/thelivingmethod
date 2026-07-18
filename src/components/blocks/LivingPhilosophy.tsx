import type { BlockComponentProps } from "cms-renderer/lib/types";
import type { LivingPhilosophyContent } from "@/lib/types";

function MultiLine({ text }: { text: string }) {
  const lines = (text ?? "").split("\n");
  return (
    <>
      {lines.map((line, i) => (
        <span key={i}>
          {i > 0 && <br />}
          {line}
        </span>
      ))}
    </>
  );
}

export default function LivingPhilosophy({
  content,
}: BlockComponentProps<LivingPhilosophyContent>) {
  return (
    <>
      <section className="max-w-screen-2xl mx-auto px-8 md:px-12 pt-16 pb-12">
        <div className="max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <div className="px-5 py-1 rounded-full border border-stone text-xs tracking-[2.5px] text-warmgray">
              {content.kicker}
            </div>
          </div>
          <h2 className="heading-serif text-5xl tracking-tighter leading-none mb-6">
            <MultiLine text={content.heading} />
          </h2>
          <p className="text-warmgray text-[15px] leading-relaxed max-w-lg mx-auto">
            {content.body}
          </p>
        </div>
      </section>
      <div className="section-divider max-w-screen-2xl mx-auto px-8 md:px-12" />
    </>
  );
}
