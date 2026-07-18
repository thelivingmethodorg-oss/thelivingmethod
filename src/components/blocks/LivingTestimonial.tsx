import type { BlockComponentProps } from "cms-renderer/lib/types";
import type { LivingTestimonialContent } from "@/lib/types";
import Icon from "@/components/Icon";

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

export default function LivingTestimonial({
  content,
}: BlockComponentProps<LivingTestimonialContent>) {
  return (
    <section className="border-t border-stone/40 bg-beige">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Icon name="quote" className="w-10 h-10 text-stone" />
          </div>
          <blockquote className="heading-serif text-3xl tracking-tight leading-tight text-charcoal">
            <MultiLine text={content.quote} />
          </blockquote>
          <div className="mt-6 text-sm text-warmgray">{content.attribution}</div>
        </div>
      </div>
    </section>
  );
}
