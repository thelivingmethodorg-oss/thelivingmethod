/**
 * Content types for The Living Method CMS blocks.
 * Field shapes mirror the custom components defined in Profound
 * (see cms-seed/components.json).
 */

export interface LivingNavbarContent {
  brand: string;
  nav_links: string[];
  nav_href: string;
  cta_label: string;
  cta_href: string;
}

export interface LivingHeroContent {
  badge: string;
  heading: string;
  subheading: string;
  primary_cta_label: string;
  primary_cta_href: string;
  secondary_cta_label: string;
  secondary_cta_href: string;
  image_url: string;
  scroll_hint: string;
}

export interface LivingPhilosophyContent {
  kicker: string;
  heading: string;
  body: string;
}

/** Raw document reference as stored in block content. */
export interface DocumentRef {
  _ref: string;
  _schema?: string;
  _type?: string;
}

export interface LivingPillarsContent {
  kicker: string;
  heading: string;
  subheading: string;
  pillars: Array<DocumentRef | PillarDoc>;
}

/** A pillar_item document (resolved). */
export interface PillarDoc {
  _id?: string;
  name: string;
  kicker: string;
  icon: string;
  description: string;
  session_note: string;
  cta_label: string;
  image_url: string;
  image_alt: string;
}

export interface LivingSanctuaryContent {
  kicker: string;
  heading: string;
  body: string;
  gallery: string[];
}

export interface LivingBookingContent {
  kicker: string;
  heading: string;
  subheading: string;
  time_slots: string[];
  pillar_options: string[];
  confirm_label: string;
  disclaimer: string;
}

export interface LivingTestimonialContent {
  quote: string;
  attribution: string;
}

export interface LivingFooterContent {
  brand: string;
  tagline: string;
  address: string;
  email: string;
  copyright: string;
}
