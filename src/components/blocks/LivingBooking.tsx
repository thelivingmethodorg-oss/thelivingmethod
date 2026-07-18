"use client";

import { useEffect, useMemo, useState } from "react";
import type { BlockComponentProps } from "cms-renderer/lib/types";
import type { LivingBookingContent } from "@/lib/types";
import Icon from "@/components/Icon";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const WEEKDAYS = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

interface BookingDetails {
  date: string;
  time: string;
  pillar: string;
  name: string;
}

export default function LivingBooking({ content }: BlockComponentProps<LivingBookingContent>) {
  const [monthDate, setMonthDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [confirmation, setConfirmation] = useState<BookingDetails | null>(null);

  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Demo availability: weekdays only.
  const availableDays = useMemo(() => {
    const set = new Set<number>();
    for (let d = 1; d <= daysInMonth; d++) {
      const dow = new Date(year, month, d).getDay();
      if (dow !== 0 && dow !== 6) set.add(d);
    }
    return set;
  }, [year, month, daysInMonth]);

  const timeSlots = content.time_slots ?? [];
  const pillarOptions = content.pillar_options ?? [];

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setConfirmation(null);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const changeMonth = (delta: number) => {
    setMonthDate(new Date(year, month + delta, 1));
    setSelectedDay(null);
    setSelectedTime(null);
  };

  const selectedDate =
    selectedDay !== null ? new Date(year, month, selectedDay) : null;
  const formattedDate = selectedDate?.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedDate || !selectedTime) {
      alert("Please select both a date and a time slot.");
      return;
    }
    const form = new FormData(e.currentTarget);
    const name = String(form.get("full-name") ?? "").trim();
    const pillar = String(form.get("pillar") ?? "");
    if (!name) return;

    setConfirmation({
      date: selectedDate.toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      }),
      time: selectedTime,
      pillar,
      name,
    });
  };

  return (
    <section id="book" className="max-w-screen-2xl mx-auto px-8 md:px-12 pt-16 pb-20">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <span className="uppercase tracking-[3px] text-xs text-sage">{content.kicker}</span>
          <h3 className="heading-serif text-5xl tracking-tighter mt-2">{content.heading}</h3>
          <p className="text-warmgray mt-3 max-w-sm mx-auto">{content.subheading}</p>
        </div>

        <div className="grid lg:grid-cols-5 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-3 bg-white rounded-3xl p-8 border border-stone/40 serene-shadow">
            <div className="flex items-center justify-between mb-6 px-1">
              <span className="heading-serif text-3xl tracking-tight">
                {MONTH_NAMES[month]} {year}
              </span>
              <div className="flex gap-x-2">
                <button
                  type="button"
                  aria-label="Previous month"
                  onClick={() => changeMonth(-1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-stone text-warmgray hover:bg-beige hover:text-charcoal"
                >
                  <Icon name="chevron-left" className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  aria-label="Next month"
                  onClick={() => changeMonth(1)}
                  className="w-9 h-9 flex items-center justify-center rounded-full border border-stone text-warmgray hover:bg-beige hover:text-charcoal"
                >
                  <Icon name="chevron-right" className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-center text-xs mb-2 px-1">
              {WEEKDAYS.map((d) => (
                <div key={d} className="text-stone py-1">
                  {d}
                </div>
              ))}
            </div>
            <div className="grid grid-cols-7 gap-1 text-sm">
              {Array.from({ length: firstDay }, (_, i) => (
                <div key={`empty-${i}`} className="h-9" />
              ))}
              {Array.from({ length: daysInMonth }, (_, i) => {
                const day = i + 1;
                const available = availableDays.has(day);
                const selected = selectedDay === day;
                return (
                  <button
                    key={day}
                    type="button"
                    disabled={!available}
                    onClick={() => {
                      setSelectedDay(day);
                      setSelectedTime(null);
                    }}
                    className={`calendar-day h-9 flex items-center justify-center rounded-xl text-sm font-medium ${
                      selected
                        ? "selected"
                        : available
                          ? "available cursor-pointer text-charcoal"
                          : "unavailable"
                    }`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 px-1 flex items-center gap-x-4 text-xs">
              <div className="flex items-center gap-x-2">
                <div className="w-3 h-3 rounded-full bg-sage" />
                <span className="text-warmgray">Available</span>
              </div>
              <div className="flex items-center gap-x-2">
                <div className="w-3 h-3 rounded-full bg-sand" />
                <span className="text-warmgray">Limited</span>
              </div>
            </div>
          </div>

          {/* Booking form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-stone/40 serene-shadow flex flex-col">
            <div className="mb-6">
              <div className="text-xs tracking-widest text-sage mb-1">YOUR APPOINTMENT</div>
              <div className="text-xl font-medium text-charcoal min-h-[28px]">
                {formattedDate ? (
                  <>
                    <span className="font-medium">{formattedDate}</span>
                    {selectedTime && <span className="text-sage"> at {selectedTime}</span>}
                  </>
                ) : (
                  "Select a date above"
                )}
              </div>
            </div>

            <div className="mb-6">
              <div className="text-xs tracking-widest text-warmgray mb-3 px-1">AVAILABLE TIMES</div>
              <div className="grid grid-cols-2 gap-2">
                {selectedDay === null ? (
                  <div className="col-span-2 text-xs text-center py-4 text-stone">
                    Please select a date first
                  </div>
                ) : (
                  timeSlots.map((time) => (
                    <button
                      key={time}
                      type="button"
                      onClick={() => setSelectedTime(time)}
                      className={`time-slot px-4 py-2.5 text-sm border border-stone/60 rounded-2xl hover:border-sage hover:text-sage text-center ${
                        selectedTime === time ? "selected" : ""
                      }`}
                    >
                      {time}
                    </button>
                  ))
                )}
              </div>
            </div>

            <form onSubmit={onSubmit} className="flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                <div>
                  <label className="text-xs tracking-wider text-warmgray block mb-1.5 px-1">
                    FULL NAME
                    <input
                      type="text"
                      name="full-name"
                      required
                      className="mt-1.5 w-full bg-beige border border-stone/60 focus:border-sage rounded-2xl px-5 py-3 text-sm placeholder:text-stone outline-none"
                    />
                  </label>
                </div>
                <div>
                  <label className="text-xs tracking-wider text-warmgray block mb-1.5 px-1">
                    EMAIL ADDRESS
                    <input
                      type="email"
                      name="email"
                      required
                      className="mt-1.5 w-full bg-beige border border-stone/60 focus:border-sage rounded-2xl px-5 py-3 text-sm placeholder:text-stone outline-none"
                    />
                  </label>
                </div>
                <div>
                  <label className="text-xs tracking-wider text-warmgray block mb-1.5 px-1">
                    WHICH PILLAR CALLS TO YOU?
                    <select
                      name="pillar"
                      className="mt-1.5 w-full bg-beige border border-stone/60 focus:border-sage rounded-2xl px-5 py-3 text-sm outline-none"
                    >
                      {pillarOptions.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div>
                  <label className="text-xs tracking-wider text-warmgray block mb-1.5 px-1">
                    ANYTHING YOU&rsquo;D LIKE US TO KNOW?
                    <textarea
                      name="notes"
                      rows={2}
                      placeholder="Optional notes for your guide..."
                      className="mt-1.5 w-full bg-beige border border-stone/60 focus:border-sage rounded-3xl px-5 py-3 text-sm placeholder:text-stone outline-none resize-y"
                    />
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="mt-6 w-full minimal-button bg-charcoal hover:bg-sage text-white py-4 rounded-2xl text-sm tracking-[1.75px] font-medium flex items-center justify-center gap-x-2"
              >
                <span>{content.confirm_label}</span>
              </button>

              <p className="text-center text-[10px] text-stone mt-3 tracking-wide">
                {content.disclaimer}
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmation && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full mx-4 p-9 text-center serene-shadow border border-stone/30">
            <div className="mx-auto w-16 h-16 rounded-full bg-sage/10 flex items-center justify-center mb-6">
              <Icon name="check" className="w-8 h-8 text-sage" />
            </div>
            <h4 className="heading-serif text-3xl tracking-tight mb-3">You&rsquo;re all set.</h4>
            <p className="text-warmgray mb-6">
              Your session has been reserved. We look forward to walking alongside you.
            </p>

            <div className="bg-beige rounded-2xl p-5 text-left text-sm mb-7 space-y-2">
              <div className="flex justify-between">
                <span className="text-warmgray">Date</span>
                <span className="font-medium">{confirmation.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warmgray">Time</span>
                <span className="font-medium">{confirmation.time}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-warmgray">Practice</span>
                <span className="font-medium">{confirmation.pillar}</span>
              </div>
              <div className="flex justify-between pt-2 border-t border-stone/40">
                <span className="text-warmgray">Guest</span>
                <span className="font-medium">{confirmation.name}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setConfirmation(null)}
              className="minimal-button w-full py-3.5 rounded-2xl bg-charcoal text-white text-sm tracking-[1.5px]"
            >
              RETURN TO HOMEPAGE
            </button>
            <button
              type="button"
              onClick={() => setConfirmation(null)}
              className="mt-3 text-xs tracking-wider text-warmgray hover:text-charcoal"
            >
              Close window
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
