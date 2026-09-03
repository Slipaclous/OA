"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { Calendar, MapPin, Gift, ExternalLink, ChevronDown, Check, Loader2, Heart } from "lucide-react";
import { DressCodeSection } from "@/components/DressCodeSection";

interface LookbookChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
}

interface Props {
  chapters: LookbookChapter[];
  config?: any;
  timeLeft: {
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  };
  timelineSteps: Array<{
    time: string;
    title: string;
    location?: string;
    desc: string;
  }>;
  rsvpState: any;
  formAction: (payload: FormData) => void;
  isPending: boolean;
  attendance: "YES" | "NO";
  setAttendance: (val: "YES" | "NO") => void;
  guestsCount: number;
  setGuestsCount: (val: number) => void;
}

export function MobileAppleScrollytelling({
  chapters,
  config,
  timeLeft,
  timelineSteps,
  rsvpState,
  formAction,
  isPending,
  attendance,
  setAttendance,
  guestsCount,
  setGuestsCount,
}: Props) {
  const [currentIdx, setCurrentIdx] = useState(0);

  const sec0 = useRef<HTMLElement>(null);
  const sec1 = useRef<HTMLElement>(null);
  const sec2 = useRef<HTMLElement>(null);
  const sec3 = useRef<HTMLElement>(null);
  const sec4 = useRef<HTMLElement>(null);

  useEffect(() => {
    const refs = [sec0, sec1, sec2, sec3, sec4];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const indexStr = entry.target.getAttribute("data-index");
            if (indexStr !== null) {
              setCurrentIdx(parseInt(indexStr, 10));
            }
          }
        });
      },
      {
        root: null,
        rootMargin: "-40% 0px -40% 0px", // actif quand la section occupe le milieu de l'écran
        threshold: 0,
      }
    );

    refs.forEach((r) => {
      if (r.current) observer.observe(r.current);
    });

    return () => observer.disconnect();
  }, []);

  let dynamicSteps = timelineSteps;
  if (config?.programmeSchedule) {
    try {
      const parsed = JSON.parse(config.programmeSchedule);
      if (Array.isArray(parsed) && parsed.length > 0) {
        dynamicSteps = parsed;
      }
    } catch {}
  }

  return (
    <div className="lg:hidden relative w-full bg-[#121316]">
      {/* ========================================================
          FOND FIXE GLOBAL : Photos qui changent en fondu au scroll
         ======================================================== */}
      <div className="fixed inset-0 w-full h-full pointer-events-none z-0 overflow-hidden">
        {chapters.map((ch, idx) => (
          <div
            key={ch.id}
            className={`absolute inset-0 w-full h-full transition-opacity duration-700 ease-in-out ${
              currentIdx === idx ? "opacity-100 scale-100" : "opacity-0 scale-105"
            }`}
          >
            <Image
              src={ch.image}
              alt={ch.imageAlt}
              fill
              priority={idx === 0}
              sizes="100vw"
              className="object-cover object-center"
            />
            {/* Dégradé sombre cinématique haut de gamme */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/55 to-black/35" />
          </div>
        ))}
      </div>

      {/* ====================================================
          CHAPITRE 01 : L'INVITATION
         ==================================================== */}
      <section ref={sec0} data-index="0" className="relative z-10 w-full">
        {/* Vue 1 : Photo seule avec légende */}
        <div className="h-[100dvh] w-full flex flex-col justify-end p-6 pb-16 text-white pointer-events-none">
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-white/75 block mb-1">
            Chapitre 01 • Lookbook
          </span>
          <p className="font-serif italic text-xl text-white/95 max-w-xs">
            {chapters[0].imageCaption}
          </p>
          <div className="flex items-center gap-2 text-white/70 text-xs tracking-widest uppercase font-sans mt-4 animate-bounce">
            <span>Défiler vers le bas</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Vue 2 : Contenu qui monte par-dessus la photo */}
        <div className="px-4 pt-10 pb-32">
          <div className="space-y-6 text-white max-w-md mx-auto w-full">
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-white/75 font-semibold font-sans">
                  Chapitre 01
                </span>
                <div className="h-[1px] w-8 bg-white/30" />
                <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">
                  {config?.invitationSubtitle || "Invitation"}
                </span>
              </div>

              <h1 className="font-serif text-5xl tracking-tight leading-[0.98] font-light">
                {config?.groomName || "Anthony"} <br />
                <span className="font-serif italic text-white/75">&</span> {config?.brideName || "Ophélie"}
              </h1>

              <p className="font-sans text-sm sm:text-base text-white/85 leading-relaxed pt-1">
                {config?.invitationText ||
                  "Deux regards complices, des projets partagés et l'envie de sceller notre histoire entourés de ceux qui comptent le plus. Nous serions infiniment touchés de vous compter parmi nous."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/20">
              <span className="text-[10px] uppercase tracking-[0.25em] text-white/70 font-semibold block">
                Date & Lieu
              </span>
              <p className="font-serif text-2xl mt-0.5">
                {config?.weddingDate
                  ? new Date(config.weddingDate).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "19 Juin 2027"}
              </p>
              <p className="text-xs text-white/75 font-sans">
                {config?.venueName || "Domaine des Vignes Blanches"}, {config?.venueCity || "Provence"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          CHAPITRE 02 : LE DÉCOMPTE
         ==================================================== */}
      <section ref={sec1} data-index="1" className="relative z-10 w-full">
        {/* Vue 1 : Photo seule avec légende */}
        <div className="h-[100dvh] w-full flex flex-col justify-end p-6 pb-16 text-white pointer-events-none">
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-white/75 block mb-1">
            Chapitre 02 • Lookbook
          </span>
          <p className="font-serif italic text-xl text-white/95 max-w-xs">
            {chapters[1].imageCaption}
          </p>
          <div className="flex items-center gap-2 text-white/70 text-xs tracking-widest uppercase font-sans mt-4 animate-bounce">
            <span>Décompte</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Vue 2 : Décompte */}
        <div className="px-4 pt-10 pb-32">
          <div className="space-y-6 text-white max-w-md mx-auto w-full">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-white/75 font-semibold font-sans">
                  Chapitre 02
                </span>
                <div className="h-[1px] w-8 bg-white/30" />
                <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">
                  L&apos;Horizon
                </span>
              </div>

              <h2 className="font-serif text-4xl font-normal tracking-tight">
                {config?.countdownTitle || "Le Décompte"}
              </h2>
              <p className="font-sans text-xs sm:text-sm text-white/85">
                {config?.countdownText ||
                  "Les mois, les jours et les secondes qui nous séparent du moment où nous nous dirons « oui »."}
              </p>
            </div>

            <div className="grid grid-cols-4 gap-2.5 p-4 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/20">
              {[
                { label: "Jours", value: timeLeft.days },
                { label: "Heures", value: timeLeft.hours },
                { label: "Min", value: timeLeft.minutes },
                { label: "Sec", value: timeLeft.seconds },
              ].map((unit) => (
                <div
                  key={unit.label}
                  className="flex flex-col items-center justify-center p-2 rounded-xl bg-white/10"
                >
                  <span className="font-serif text-2xl font-light">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="text-[9px] tracking-[0.2em] uppercase text-white/70 font-sans mt-0.5">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          CHAPITRE 03 : LE PROGRAMME DE LA JOURNÉE
         ==================================================== */}
      <section ref={sec2} data-index="2" className="relative z-10 w-full">
        {/* Vue 1 : Photo seule avec légende */}
        <div className="h-[100dvh] w-full flex flex-col justify-end p-6 pb-16 text-white pointer-events-none">
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-white/75 block mb-1">
            Chapitre 03 • Lookbook
          </span>
          <p className="font-serif italic text-xl text-white/95 max-w-xs">
            {chapters[2].imageCaption}
          </p>
          <div className="flex items-center gap-2 text-white/70 text-xs tracking-widest uppercase font-sans mt-4 animate-bounce">
            <span>Programme & Déroulé</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Vue 2 : Programme complet scrollable sans limite */}
        <div className="px-4 pt-10 pb-36">
          <div className="space-y-5 text-white max-w-md mx-auto w-full">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-white/75 font-semibold font-sans">
                  Chapitre 03
                </span>
                <div className="h-[1px] w-8 bg-white/30" />
                <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">
                  Déroulé
                </span>
              </div>

              <h2 className="font-serif text-3xl font-normal tracking-tight">
                {config?.programmeTitle || "Le Programme"}
              </h2>
              <p className="font-sans text-xs text-white/80">
                {config?.programmeText || "Une partition rythmée pour savourer chaque instant ensemble."}
              </p>
            </div>

            <div className="space-y-2.5">
              {dynamicSteps.map((step, idx) => (
                <div
                  key={`${step.title}-${idx}`}
                  className="p-3.5 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/20 flex items-start gap-3"
                >
                  <div className="rounded-xl px-2.5 py-1 text-center shrink-0 bg-white/20 border border-white/20">
                    <span className="font-serif text-base font-medium">
                      {step.time}
                    </span>
                  </div>
                  <div className="space-y-0.5 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-serif text-sm font-medium">
                        {step.title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wider text-white/60 font-sans shrink-0">
                        0{idx + 1}
                      </span>
                    </div>
                    <p className="text-xs text-white/80 font-sans leading-relaxed">
                      {step.desc}
                    </p>
                    {step.location && (
                      <p className="text-[11px] text-white/90 font-sans font-medium flex items-center gap-1 pt-0.5">
                        <MapPin className="w-3 h-3 text-white/70 shrink-0" />
                        {step.location}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2 text-xs uppercase tracking-wider font-sans font-semibold">
              <a
                href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mariage+Anthony+%26+Oph%C3%A9lie&dates=20270619T123000Z/20270620T040000Z&details=Mariage+au+Domaine+des+Vignes+Blanches&location=Domaine+des+Vignes+Blanches,+Provence"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center gap-1.5 text-[11px]"
              >
                <Calendar className="w-3.5 h-3.5 text-white/70" />
                Calendar
              </a>
              <a
                href="https://maps.google.com/?q=Domaine+des+Vignes+Blanches+Provence"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-2.5 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center gap-1.5 text-[11px]"
              >
                <MapPin className="w-3.5 h-3.5 text-white/70" />
                Localiser
              </a>
            </div>

            <div className="p-4 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/20">
              <DressCodeSection
                title={config?.dressCodeTitle}
                desc={config?.dressCodeDesc}
                colors={config?.dressCodeColors}
                advice={config?.dressCodeAdvice}
                isDark={true}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          CHAPITRE 04 : CADEAUX & ATTENTIONS
         ==================================================== */}
      <section ref={sec3} data-index="3" className="relative z-10 w-full">
        {/* Vue 1 : Photo seule avec légende */}
        <div className="h-[100dvh] w-full flex flex-col justify-end p-6 pb-16 text-white pointer-events-none">
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-white/75 block mb-1">
            Chapitre 04 • Lookbook
          </span>
          <p className="font-serif italic text-xl text-white/95 max-w-xs">
            {chapters[3].imageCaption}
          </p>
          <div className="flex items-center gap-2 text-white/70 text-xs tracking-widest uppercase font-sans mt-4 animate-bounce">
            <span>Cadeaux & Attentions</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Vue 2 : Cadeaux */}
        <div className="px-4 pt-10 pb-32">
          <div className="space-y-5 text-white max-w-md mx-auto w-full">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-white/75 font-semibold font-sans">
                  Chapitre 04
                </span>
                <div className="h-[1px] w-8 bg-white/30" />
                <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">
                  Attentions
                </span>
              </div>

              <h2 className="font-serif text-3xl font-normal tracking-tight">
                {config?.giftsTitle || "Cadeaux & Attentions"}
              </h2>
              <p className="font-sans text-xs text-white/80">
                {config?.giftsSubtitle || "Votre présence est notre plus beau présent"}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/20 space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-white/20 border border-white/20 flex items-center justify-center shrink-0">
                  <Gift className="w-5 h-5 text-white" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-serif text-lg">
                    {config?.giftsMode === "LIST"
                      ? "Notre Liste de Mariage"
                      : config?.giftsMode === "BOTH"
                      ? "Urne de Voyage & Liste en Ligne"
                      : "Une Urne à Mots Doux sur Place"}
                  </h3>
                  <p className="text-xs text-white/80 font-sans leading-relaxed">
                    {config?.giftsMessage ||
                      "Votre présence à nos côtés pour célébrer notre union est le plus précieux des cadeaux. Si toutefois vous désirez témoigner d'une attention particulière, une boîte à mots doux & urne de voyage sera mise à votre disposition le jour J."}
                  </p>
                </div>
              </div>

              {(config?.giftsMode === "LIST" || config?.giftsMode === "BOTH") && config?.giftsListUrl && (
                <a
                  href={config.giftsListUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 rounded-xl bg-white text-[#121316] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2"
                >
                  {config?.giftsListLabel || "Consulter notre liste de mariage"}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}

              {config?.giftsBankIban && (
                <div className="pt-2 text-xs text-white/80 font-sans space-y-1 border-t border-white/15">
                  <span className="text-[10px] uppercase tracking-wider font-semibold block text-white/60">
                    Participation par virement (IBAN) :
                  </span>
                  <span className="font-mono text-white text-[11px] block select-all p-2 rounded-xl bg-white/10 border border-white/15">
                    {config.giftsBankIban}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ====================================================
          CHAPITRE 05 : RSVP & CONFIRMATION
         ==================================================== */}
      <section ref={sec4} data-index="4" className="relative z-10 w-full">
        {/* Vue 1 : Photo seule avec légende */}
        <div className="h-[100dvh] w-full flex flex-col justify-end p-6 pb-16 text-white pointer-events-none">
          <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-white/75 block mb-1">
            Chapitre 05 • Lookbook
          </span>
          <p className="font-serif italic text-xl text-white/95 max-w-xs">
            {chapters[4]?.imageCaption || "Nous avons hâte de vous retrouver."}
          </p>
          <div className="flex items-center gap-2 text-white/70 text-xs tracking-widest uppercase font-sans mt-4 animate-bounce">
            <span>Répondre & Confirmer</span>
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>

        {/* Vue 2 : Formulaire RSVP complet */}
        <div className="px-4 pt-10 pb-40">
          <div className="space-y-4 text-white max-w-md mx-auto w-full">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.3em] text-white/75 font-semibold font-sans">
                  Chapitre 05
                </span>
                <div className="h-[1px] w-8 bg-white/30" />
                <span className="text-xs uppercase tracking-[0.2em] text-white/60 font-sans">
                  Confirmation
                </span>
              </div>

              <h2 className="font-serif text-3xl font-normal tracking-tight">
                {config?.rsvpTitle || "Confirmer Votre Présence"}
              </h2>
              <p className="font-sans text-xs text-white/80">
                {config?.rsvpText ||
                  `Merci de nous transmettre votre réponse avant le ${config?.rsvpDeadline || "1er Mai 2027"}.`}
              </p>
            </div>

            {rsvpState?.success ? (
              <div className="p-8 text-center rounded-2xl bg-black/55 backdrop-blur-xl border border-white/20">
                <div className="w-12 h-12 mx-auto rounded-full bg-white text-[#121316] flex items-center justify-center mb-4">
                  <Heart className="w-5 h-5 stroke-[1.5]" />
                </div>
                <h3 className="font-serif text-2xl">
                  Réponse enregistrée
                </h3>
                <p className="mt-2 text-sm text-white/80 font-sans">
                  {rsvpState.message}
                </p>
              </div>
            ) : (
              <form action={formAction} className="space-y-3.5 p-4 rounded-2xl bg-black/55 backdrop-blur-xl border border-white/20">
                {rsvpState?.message && !rsvpState.success && (
                  <div className="p-3 rounded-xl bg-red-500/20 text-red-200 text-xs text-center border border-red-500/30">
                    {rsvpState.message}
                  </div>
                )}

                {/* Présence */}
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold tracking-wider uppercase text-white/75">
                    Serez-vous présents ?
                  </label>
                  <div className="grid grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() => setAttendance("YES")}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        attendance === "YES"
                          ? "bg-white text-[#121316]"
                          : "bg-white/10 text-white border border-white/15"
                      }`}
                    >
                      {attendance === "YES" && <Check className="w-3.5 h-3.5" />}
                      Avec plaisir
                    </button>
                    <button
                      type="button"
                      onClick={() => setAttendance("NO")}
                      className={`py-2.5 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 cursor-pointer ${
                        attendance === "NO"
                          ? "bg-white text-[#121316]"
                          : "bg-white/10 text-white border border-white/15"
                      }`}
                    >
                      {attendance === "NO" && <Check className="w-3.5 h-3.5" />}
                      À regret
                    </button>
                  </div>
                  <input type="hidden" name="attendance" value={attendance} />
                </div>

                {/* Convives */}
                <div className="space-y-1">
                  <label htmlFor="scrolly-fullName" className="text-[11px] font-semibold tracking-wider uppercase text-white/75">
                    Nom et Prénom *
                  </label>
                  <input
                    id="scrolly-fullName"
                    name="fullName"
                    type="text"
                    required
                    placeholder="Ex: Camille Dupont"
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-sans text-white bg-white/10 border border-white/20 focus:outline-none focus:border-white"
                  />
                </div>

                <div className="space-y-1">
                  <label htmlFor="scrolly-email" className="text-[11px] font-semibold tracking-wider uppercase text-white/75">
                    Adresse e-mail (optionnel)
                  </label>
                  <input
                    id="scrolly-email"
                    name="email"
                    type="email"
                    placeholder="camille@exemple.com"
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-sans text-white bg-white/10 border border-white/20 focus:outline-none focus:border-white"
                  />
                </div>

                {attendance === "YES" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-[11px] font-semibold tracking-wider uppercase text-white/75">
                        Nombre d&apos;invités
                      </label>
                      <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((count) => (
                          <button
                            key={count}
                            type="button"
                            onClick={() => setGuestsCount(count)}
                            className={`flex-1 py-2 rounded-xl text-xs font-semibold ${
                              guestsCount === count
                                ? "bg-white text-[#121316]"
                                : "bg-white/10 text-white border border-white/15"
                            }`}
                          >
                            {count}
                          </button>
                        ))}
                      </div>
                      <input type="hidden" name="guestsCount" value={guestsCount} />
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="scrolly-diet" className="text-[11px] font-semibold tracking-wider uppercase text-white/75">
                        Régimes ou allergies
                      </label>
                      <input
                        id="scrolly-diet"
                        name="dietaryRestrictions"
                        type="text"
                        placeholder="Végétarien, sans gluten..."
                        className="w-full px-4 py-2.5 rounded-xl text-sm font-sans text-white bg-white/10 border border-white/20 focus:outline-none focus:border-white"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-1">
                  <label htmlFor="scrolly-loveNote" className="text-[11px] font-semibold tracking-wider uppercase text-white/75">
                    Un mot pour Anthony & Ophélie
                  </label>
                  <textarea
                    id="scrolly-loveNote"
                    name="loveNote"
                    rows={2}
                    placeholder="Laissez votre message..."
                    className="w-full px-4 py-2.5 rounded-xl text-sm font-sans text-white bg-white/10 border border-white/20 focus:outline-none focus:border-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isPending}
                  className="w-full py-3.5 rounded-xl bg-white text-[#121316] font-semibold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
                >
                  {isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Envoi...
                    </>
                  ) : (
                    "Transmettre ma réponse"
                  )}
                </button>
              </form>
            )}

            <div className="pt-2 text-center text-xs text-white/50 font-sans">
              <p>Anthony & Ophélie • 19.06.2027</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
