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

/** A living_pillar document fetched from the headless CMS. */
export interface PillarDoc {
  _id?: string;
  name: string;
  kicker: string;
  icon: string;
  description: string;
  modalities: string[];
  session_note: string;
  cta_label: string;
  image_url: string;
  image_alt: string;
}

export interface LivingBeingSectionContent {
  being: DocumentRef | LivingBeingDoc;
}

/** A living_being document fetched from the headless CMS. */
export interface LivingBeingDoc {
  _id?: string;
  name: string;
  kicker: string;
  description: string;
  questions: string[];
  integration_points: string[];
}

export interface BlogListContent {
  kicker: string;
  heading: string;
  subheading: string;
  posts: Array<DocumentRef | BlogPost>;
}

/** A blog_post document fetched from the headless CMS. */
export interface BlogPost {
  _id?: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  author: string;
  category?: string;
  published_date: string;
  cover_image_url?: string;
  cover_image_alt?: string;
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
  calendly_url?: string;
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
