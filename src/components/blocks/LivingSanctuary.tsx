import type { BlockComponentProps } from "cms-renderer";
import { imageSrc, type LivingSanctuaryContent } from "@/lib/types";

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

export default function LivingSanctuary({
  content,
}: BlockComponentProps<LivingSanctuaryContent>) {
  // Sanctuary Image documents, filled by the page read; unpublished or imageless ones are skipped.
  const gallery = (content.gallery ?? []).flatMap((item) => {
    const src = imageSrc(item.image);
    return src ? [{ src, alt: item.image?.alt || item.name || "", key: item._id ?? src }] : [];
  });

  return (
    <section className="bg-white border-y border-stone/40 py-14">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12">
        <div className="grid md:grid-cols-12 gap-x-8 items-end">
          <div className="md:col-span-5 mb-8 md:mb-0">
            <span className="text-xs tracking-[2.5px] text-sage">{content.kicker}</span>
            <h3 className="heading-serif text-4xl tracking-tighter mt-2 leading-none">
              <MultiLine text={content.heading} />
            </h3>
            <p className="mt-4 text-warmgray max-w-sm">{content.body}</p>
          </div>

          <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {gallery.map((photo) => (
              <div
                key={photo.key}
                className="aspect-video rounded-2xl overflow-hidden border border-stone/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo.src} className="w-full h-full object-cover" alt={photo.alt} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
