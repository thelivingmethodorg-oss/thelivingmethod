/**
 * Inline SVG icon set replacing the prototype's Font Awesome CDN icons,
 * keeping the site self-contained. Icon keys are stored in CMS content
 * (e.g. pillar_item.icon), so keep names stable.
 */
import type { SVGProps } from "react";

const PATHS: Record<string, React.ReactNode> = {
  leaf: (
    <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Zm0 0c0-4.5 1.5-8 4-10" />
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 3.6-6.5 8-6.5s8 2.5 8 6.5" />
    </>
  ),
  fire: (
    <path d="M12 22c4.4 0 7-2.9 7-6.6 0-2.8-1.6-5.1-3.2-6.9-.9-1-1.8-2.3-2.3-3.5-.2-.6-1-.7-1.3-.1-.6 1-.9 2.4-.7 3.8-1-1-2-1.7-3-3-.4-.5-1.1-.4-1.3.2C6.4 8 5 10.6 5 13.4 5 19.1 7.6 22 12 22Zm0 0c-2 0-3-1.5-3-3.2 0-1.4 1-2.6 2-3.8.4-.5 1.1-.5 1.5 0 1 1.3 2.5 2.5 2.5 4C15 20.5 14 22 12 22Z" />
  ),
  water: (
    <>
      <path d="M3 7c1.5 0 1.5 1.2 3 1.2S7.5 7 9 7s1.5 1.2 3 1.2S13.5 7 15 7s1.5 1.2 3 1.2S19.5 7 21 7" />
      <path d="M3 12c1.5 0 1.5 1.2 3 1.2S7.5 12 9 12s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2" />
      <path d="M3 17c1.5 0 1.5 1.2 3 1.2S7.5 17 9 17s1.5 1.2 3 1.2 1.5-1.2 3-1.2 1.5 1.2 3 1.2 1.5-1.2 3-1.2" />
    </>
  ),
  hands: (
    <>
      <path d="M12 21c-3 0-6-1.8-7.5-4.5L2.6 13c-.4-.7-.1-1.6.6-2 .7-.4 1.5-.1 1.9.5L7 14.5V6.75a1.25 1.25 0 0 1 2.5 0" />
      <path d="M9.5 11.5v-7a1.25 1.25 0 0 1 2.5 0v6.25" />
      <path d="M12 10.75V3.75a1.25 1.25 0 0 1 2.5 0v7" />
      <path d="M14.5 10.75V5.25a1.25 1.25 0 0 1 2.5 0V15c0 3.3-2.2 6-5 6" />
    </>
  ),
  "arrow-right": <path d="M5 12h14m-6-6 6 6-6 6" />,
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  quote: (
    <path d="M4 11h5v5c0 2.2-1.8 4-4 4m-1-9c0-4 1.5-6.5 5-8m6 8h5v5c0 2.2-1.8 4-4 4m-1-9c0-4 1.5-6.5 5-8" />
  ),
  check: <path d="m4 12.5 5.5 5.5L20 6.5" />,
  bars: <path d="M4 6h16M4 12h16M4 18h16" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
};

export interface IconProps extends SVGProps<SVGSVGElement> {
  name: string;
}

export default function Icon({ name, ...props }: IconProps) {
  const path = PATHS[name] ?? PATHS.leaf;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {path}
    </svg>
  );
}
