"use client";

import { useEffect, useState } from "react";
import Icon from "@/components/Icon";
import type { TestimonialDoc } from "@/lib/types";

const ROTATE_MS = 8000;

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

/** One quote at a time; several rotate, and the dots pick one (which stops the rotation). */
export default function TestimonialCarousel({ testimonials }: { testimonials: TestimonialDoc[] }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const count = testimonials.length;

  useEffect(() => {
    if (count < 2 || paused) return;
    const timer = setInterval(() => setIndex((i) => (i + 1) % count), ROTATE_MS);
    return () => clearInterval(timer);
  }, [count, paused]);

  const current = testimonials[index % count];

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="flex justify-center mb-6">
        <Icon name="quote" className="w-10 h-10 text-stone" />
      </div>
      <blockquote
        key={current._id ?? index}
        className="heading-serif text-3xl tracking-tight leading-tight text-charcoal"
        aria-live="polite"
      >
        <MultiLine text={current.quote} />
      </blockquote>
      <div className="mt-6 text-sm text-warmgray">{current.attribution}</div>

      {count > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {testimonials.map((t, i) => (
            <button
              key={t._id ?? i}
              type="button"
              aria-label={`Show testimonial ${i + 1} of ${count}`}
              aria-current={i === index % count}
              onClick={() => {
                setIndex(i);
                setPaused(true);
              }}
              className={`h-1.5 rounded-full transition-all ${
                i === index % count ? "w-6 bg-sage" : "w-1.5 bg-stone/60 hover:bg-stone"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
