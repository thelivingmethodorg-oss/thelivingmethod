import type { BlockComponentProps } from "cms-renderer/lib/types";
import type { LivingFooterContent } from "@/lib/types";
import Icon from "@/components/Icon";

export default function LivingFooter({ content }: BlockComponentProps<LivingFooterContent>) {
  return (
    <footer className="bg-charcoal text-stone">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12 py-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-y-8">
          <div>
            <div className="flex items-center gap-x-3 mb-3">
              <div className="w-7 h-7 rounded-full bg-sage/80 flex items-center justify-center">
                <Icon name="leaf" className="w-4 h-4 text-charcoal" />
              </div>
              <span className="heading-serif text-xl tracking-tight text-white">
                {content.brand}
              </span>
            </div>
            <p className="text-xs tracking-wider">{content.tagline}</p>
          </div>

          <div className="flex flex-col md:flex-row md:items-center gap-x-8 gap-y-3 text-xs tracking-widest">
            <div>{content.address}</div>
            <div className="hidden md:block w-px h-3 bg-stone/30" />
            <div>{content.email}</div>
            <div className="hidden md:block w-px h-3 bg-stone/30" />
            <div>{content.copyright}</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
