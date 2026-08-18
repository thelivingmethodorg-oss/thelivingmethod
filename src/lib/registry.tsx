/**
 * Component registry shared by the production and CMS-preview routes.
 * Keys are CMS component schema names.
 */
import LivingNavbar from "@/components/blocks/LivingNavbar";
import LivingHero from "@/components/blocks/LivingHero";
import LivingPhilosophy from "@/components/blocks/LivingPhilosophy";
import LivingPillars from "@/components/blocks/LivingPillars";
import LivingBeing from "@/components/blocks/LivingBeing";
import LivingSanctuary from "@/components/blocks/LivingSanctuary";
import LivingBooking from "@/components/blocks/LivingBooking";
import LivingTestimonial from "@/components/blocks/LivingTestimonial";
import LivingFooter from "@/components/blocks/LivingFooter";

export const registry = {
  living_navbar: LivingNavbar,
  living_hero: LivingHero,
  living_philosophy: LivingPhilosophy,
  living_pillars: LivingPillars,
  living_being_section: LivingBeing,
  living_sanctuary: LivingSanctuary,
  living_booking: LivingBooking,
  living_testimonial: LivingTestimonial,
  living_footer: LivingFooter,
};
