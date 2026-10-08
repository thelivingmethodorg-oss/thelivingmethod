import type { BlockComponentProps } from "cms-renderer";
import type { LivingTestimonialContent, TestimonialDoc } from "@/lib/types";
import TestimonialCarousel from "./TestimonialCarousel";

/** Client quotes from Testimonial documents, filled by the page read. */
export default function LivingTestimonial({
  content,
}: BlockComponentProps<LivingTestimonialContent>) {
  const testimonials = (content.testimonials ?? []).filter((t): t is TestimonialDoc =>
    Boolean(t?.quote)
  );
  if (testimonials.length === 0) return null;

  return (
    <section className="border-t border-stone/40 bg-beige">
      <div className="max-w-screen-2xl mx-auto px-8 md:px-12 py-16">
        <TestimonialCarousel testimonials={testimonials} />
      </div>
    </section>
  );
}
