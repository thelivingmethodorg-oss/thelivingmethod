import type { BlockComponentProps } from "cms-renderer/lib/types";
import type { LivingHeroContent } from "@/lib/types";
import Icon from "@/components/Icon";

/** Render a string with newlines as <br>-separated lines. */
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

export default function LivingHero({ content }: BlockComponentProps<LivingHeroContent>) {
  return (
    <header className="relative h-[92vh] min-h-[680px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url('${content.image_url}')` }}
      >
        <div className="absolute inset-0 bg-beige/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-beige/10 via-transparent to-beige/40" />
      </div>

      <div className="relative z-10 max-w-4xl px-6 text-center">
        <div className="inline-flex items-center gap-x-2 px-4 py-1 rounded-full bg-white/70 backdrop-blur-sm mb-6 border border-stone/50">
          <div className="w-1.5 h-1.5 bg-sage rounded-full animate-pulse" />
          <span className="text-xs tracking-[2px] font-medium text-warmgray">{content.badge}</span>
        </div>

        <h1 className="heading-serif text-6xl md:text-7xl leading-[1.05] tracking-tighter text-charcoal mb-6">
          <MultiLine text={content.heading} />
        </h1>

        <p className="max-w-md mx-auto text-lg text-warmgray mb-10 tracking-wide">
          <MultiLine text={content.subheading} />
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href={content.primary_cta_href}
            className="minimal-button group inline-flex items-center justify-center gap-x-3 px-10 py-4 bg-charcoal text-white rounded-full text-sm tracking-[1.75px] font-medium hover:bg-sage"
          >
            <span>{content.primary_cta_label}</span>
            <Icon
              name="arrow-right"
              className="w-4 h-4 group-hover:translate-x-0.5 transition"
            />
          </a>

          <a
            href={content.secondary_cta_href}
            className="inline-flex items-center justify-center gap-x-2 px-8 py-4 text-sm tracking-[1.5px] font-medium text-warmgray hover:text-charcoal transition-colors"
          >
            <span>{content.secondary_cta_label}</span>
          </a>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center">
        <span className="text-[10px] tracking-[2px] text-warmgray mb-1.5">
          {content.scroll_hint}
        </span>
        <Icon name="chevron-down" className="w-4 h-4 text-stone animate-bounce" />
      </div>
    </header>
  );
}
