import type { BlockComponentProps } from "cms-renderer/lib/types";
import type { LivingBookingContent } from "@/lib/types";
import Icon from "@/components/Icon";

const DEFAULT_CALENDLY_URL = "https://calendly.com/thelivingmethod-org/30min";

export default function LivingBooking({ content }: BlockComponentProps<LivingBookingContent>) {
  const calendlyUrl = content.calendly_url || DEFAULT_CALENDLY_URL;

  return (
    <section id="book" className="max-w-screen-2xl mx-auto px-8 md:px-12 pt-16 pb-20">
      <div className="max-w-2xl mx-auto text-center bg-white rounded-3xl p-8 md:p-12 border border-stone/40 serene-shadow">
        <span className="uppercase tracking-[3px] text-xs text-sage">{content.kicker}</span>
        <h3 className="heading-serif text-5xl tracking-tighter mt-2">{content.heading}</h3>
        <p className="text-warmgray mt-3 max-w-md mx-auto">{content.subheading}</p>

        <a
          href={calendlyUrl}
          target="_blank"
          rel="noreferrer"
          className="mt-8 w-full minimal-button bg-charcoal hover:bg-sage text-white py-4 rounded-2xl text-sm tracking-[1.75px] font-medium inline-flex items-center justify-center gap-x-2"
        >
          <span>{content.confirm_label}</span>
          <Icon name="arrow-right" className="w-4 h-4" />
        </a>

        <p className="text-center text-[10px] text-stone mt-3 tracking-wide">
          {content.disclaimer}
        </p>
      </div>
    </section>
  );
}
