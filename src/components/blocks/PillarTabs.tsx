"use client";

import { useState } from "react";
import type { PillarDoc } from "@/lib/types";
import Icon from "@/components/Icon";

export default function PillarTabs({ pillars }: { pillars: PillarDoc[] }) {
  const [active, setActive] = useState(0);
  const pillar = pillars[active];

  return (
    <>
      <div className="flex flex-wrap justify-center gap-x-1 gap-y-1 mb-8 border-b border-stone/60 pb-1">
        {pillars.map((p, i) => (
          <button
            key={p._id ?? p.name}
            type="button"
            onClick={() => setActive(i)}
            className={`pillar-tab px-7 py-3 text-sm tracking-wider font-medium ${
              i === active ? "active text-charcoal" : "text-warmgray hover:text-charcoal"
            }`}
          >
            {p.name}
          </button>
        ))}
      </div>

      <div className="max-w-4xl mx-auto">
        <div key={pillar._id ?? active} className="pillar-content">
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <div className="md:col-span-3">
              <div className="flex items-center gap-x-3 mb-4">
                <div className="w-9 h-9 flex-shrink-0 rounded-2xl bg-sand flex items-center justify-center">
                  <Icon name={pillar.icon} className="w-5 h-5 text-sage" />
                </div>
                <div>
                  <span className="block text-xs tracking-[2px] text-sage">{pillar.kicker}</span>
                  <h4 className="heading-serif text-3xl tracking-tight">{pillar.name}</h4>
                </div>
              </div>
              <p className="text-warmgray leading-relaxed mb-6">{pillar.description}</p>
              <div className="flex items-center gap-x-4">
                <a
                  href="#book"
                  className="minimal-button text-xs tracking-[1.5px] px-6 py-3 border border-sage text-sage hover:bg-sage hover:text-white rounded-full"
                >
                  {pillar.cta_label}
                </a>
                <span className="text-xs text-stone">{pillar.session_note}</span>
              </div>
            </div>
            <div className="md:col-span-2">
              <div className="aspect-[4/3] rounded-3xl overflow-hidden border border-stone/40 serene-shadow">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={pillar.image_url}
                  alt={pillar.image_alt}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
