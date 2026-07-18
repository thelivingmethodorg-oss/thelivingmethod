import type { BlockComponentProps } from "cms-renderer/lib/types";
import type { LivingSanctuaryContent } from "@/lib/types";

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
  const gallery = content.gallery ?? [];

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
            {gallery.map((url, i) => (
              <div
                key={`${url}-${i}`}
                className="aspect-video rounded-2xl overflow-hidden border border-stone/30"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  className="w-full h-full object-cover"
                  alt="The Living Method studio — natural textures and soft light"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
