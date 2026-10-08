/**
 * Content types for The Living Method CMS blocks.
 * Field shapes mirror the custom components defined in Median
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
  image?: ImageValue;
  scroll_hint: string;
}

export interface LivingPhilosophyContent {
  kicker: string;
  heading: string;
  body: string;
}

/** A CMS `url` field: stored as `{ label, href }`; older content has a plain string. */
export type UrlValue = string | { href: string; label?: string };

/** The address of a `url` field, or `undefined` when it is empty. */
export function hrefOf(value: UrlValue | undefined | null): string | undefined {
  const href = typeof value === "string" ? value : value?.href;
  return href || undefined;
}

/** A CMS `image` field: page reads fill `_asset.url` from the media library. */
export interface ImageValue {
  alt?: string;
  caption?: string;
  _asset?: { id: string; url?: string };
}

/** The image's address, or `undefined` when none is chosen. */
export function imageSrc(image: ImageValue | undefined | null): string | undefined {
  return image?._asset?.url || undefined;
}

/** Raw document reference as stored in block content. */
export interface DocumentRef {
  _ref: string;
  _schema?: string;
  _type?: string;
}

/**
 * A reference as a page read returns it: the reference keys plus the
 * referenced document's fields, which are absent when it is not published.
 */
export type Referenced<T> = Partial<DocumentRef> & Partial<T>;

export interface LivingPillarsContent {
  kicker: string;
  heading: string;
  subheading: string;
  pillars: Array<Referenced<PillarDoc>>;
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
  image?: ImageValue;
}

export interface LivingBeingSectionContent {
  being?: Referenced<LivingBeingDoc>;
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
  posts: Array<Referenced<BlogPost>>;
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
  cover_image?: ImageValue;
}

export interface LivingSanctuaryContent {
  kicker: string;
  heading: string;
  body: string;
  gallery?: Array<Referenced<SanctuaryImageDoc>>;
}

/** A sanctuary_image document: one photo of the space. */
export interface SanctuaryImageDoc {
  _id?: string;
  name: string;
  image: ImageValue;
}

export interface LivingBookingContent {
  kicker: string;
  heading: string;
  subheading: string;
  calendly_url?: UrlValue;
  pillar_options?: string[];
  confirm_label: string;
  disclaimer: string;
}

export interface LivingTestimonialContent {
  testimonials: Array<Referenced<TestimonialDoc>>;
}

/** A testimonial document: one client quote. */
export interface TestimonialDoc {
  _id?: string;
  quote: string;
  attribution: string;
}

export interface LivingFooterContent {
  brand: string;
  tagline: string;
  address: string;
  phone?: string;
  email: string;
  copyright: string;
}
