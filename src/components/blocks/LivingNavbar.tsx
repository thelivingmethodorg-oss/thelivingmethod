"use client";

import { useState } from "react";
import type { BlockComponentProps } from "cms-renderer/lib/types";
import type { LivingNavbarContent } from "@/lib/types";
import Icon from "@/components/Icon";

export default function LivingNavbar({ content }: BlockComponentProps<LivingNavbarContent>) {
  const [menuOpen, setMenuOpen] = useState(false);
  const links = content.nav_links ?? [];

  return (
    <nav className="bg-beige/95 backdrop-blur-lg border-b border-stone/60 sticky top-0 z-50">
      <div className="max-w-screen-2xl mx-auto">
        <div className="px-8 md:px-12 py-5 flex items-center justify-between">
          <div className="flex items-center gap-x-3">
            <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
              <Icon name="leaf" className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="heading-serif text-2xl tracking-tight text-charcoal">
              {content.brand}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-x-9 text-sm tracking-[1.25px] font-medium">
            {links.map((label) => (
              <a
                key={label}
                href={content.nav_href}
                className="nav-link text-warmgray hover:text-charcoal"
              >
                {label}
              </a>
            ))}
            <a
              href={content.cta_href}
              className="px-6 py-2.5 rounded-full border border-sage text-sage hover:bg-sage hover:text-white text-xs tracking-[1.5px] font-medium transition-all"
            >
              {content.cta_label}
            </a>
          </div>

          <div className="md:hidden">
            <button
              type="button"
              aria-label="Open menu"
              onClick={() => setMenuOpen(true)}
              className="w-10 h-10 flex items-center justify-center text-warmgray hover:text-charcoal"
            >
              <Icon name="bars" className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="fixed inset-0 z-[200] bg-beige p-8 flex flex-col">
          <div className="flex justify-between items-center mb-10">
            <div className="flex items-center gap-x-3">
              <div className="w-8 h-8 rounded-full bg-sage flex items-center justify-center">
                <Icon name="leaf" className="w-4.5 h-4.5 text-white" />
              </div>
              <span className="heading-serif text-2xl tracking-tight">{content.brand}</span>
            </div>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMenuOpen(false)}
              className="text-warmgray hover:text-charcoal"
            >
              <Icon name="x" className="w-7 h-7" />
            </button>
          </div>

          <div className="flex flex-col text-xl gap-y-6 tracking-wider">
            {links.map((label) => (
              <a
                key={label}
                href={content.nav_href}
                onClick={() => setMenuOpen(false)}
                className="py-1 text-charcoal"
              >
                {label}
              </a>
            ))}
          </div>

          <div className="mt-auto pt-8">
            <a
              href={content.cta_href}
              onClick={() => setMenuOpen(false)}
              className="block w-full text-center py-4 rounded-2xl bg-charcoal text-white tracking-[1.75px] text-sm"
            >
              {content.cta_label}
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}
