"use client";

import { useState, useEffect } from "react";

interface CountdownProps {
  targetDate: string; // ISO date
}

export function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  } | null>(null);

  useEffect(() => {
    const target = new Date(targetDate).getTime();

    const calculate = () => {
      const now = new Date().getTime();
      const difference = target - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor(
        (difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
      );
      const minutes = Math.floor(
        (difference % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  if (!timeLeft) {
    return (
      <div className="py-12 flex justify-center items-center">
        <span className="font-sans text-sm text-[#949BA5]">
          Chargement du décompte...
        </span>
      </div>
    );
  }

  const units = [
    { label: "Jours", value: timeLeft.days },
    { label: "Heures", value: timeLeft.hours },
    { label: "Minutes", value: timeLeft.minutes },
    { label: "Secondes", value: timeLeft.seconds },
  ];

  return (
    <section className="relative py-20 px-6 md:px-12 max-w-6xl mx-auto">
      <div className="text-center mb-10">
        <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#5C626C]">
          Le Décompte
        </span>
        <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-[#121316] mt-3 font-normal">
          Vers le Jour J
        </h2>
        <p className="font-sans text-sm md:text-base text-[#5C626C] mt-2">
          Samedi 19 Juin 2027 • Domaine des Vignes Blanches
        </p>
      </div>

      {/* Cadre neumorphisme contemporain net & blanc pur */}
      <div className="emboss-card rounded-2xl p-8 md:p-12 border border-white">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 divide-y md:divide-y-0 md:divide-x divide-black/[0.06]">
          {units.map((unit, idx) => (
            <div
              key={unit.label}
              className={`flex flex-col items-center justify-center ${
                idx > 0 && idx % 2 === 0 ? "pt-6 md:pt-0" : ""
              } ${idx === 1 ? "pt-0" : ""}`}
            >
              <div className="relative">
                <span className="font-serif text-5xl md:text-7xl lg:text-8xl font-light tracking-tighter text-[#121316]">
                  {String(unit.value).padStart(2, "0")}
                </span>
              </div>
              <span className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-[#5C626C] mt-3 font-sans font-semibold">
                {unit.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
