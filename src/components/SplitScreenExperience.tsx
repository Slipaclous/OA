"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { submitRsvp } from "@/app/actions/rsvp";
import { useActionState } from "react";
import {
  Calendar,
  MapPin,
  Heart,
  Check,
  Loader2,
  Lock,
  ArrowRight,
  Maximize2,
  Gift,
  ExternalLink,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { FullscreenGallery, GalleryPhoto } from "@/components/FullscreenGallery";
import { DressCodeSection } from "@/components/DressCodeSection";
import { MobileAppleScrollytelling } from "@/components/MobileAppleScrollytelling";

interface LookbookChapter {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  image: string;
  imageAlt: string;
  imageCaption: string;
}

const chapters: LookbookChapter[] = [
  {
    id: "invitation",
    number: "01",
    title: "L'Invitation",
    subtitle: "Anthony & Ophélie",
    image: "/photos/hero.jpg",
    imageAlt: "Anthony et Ophélie - Shooting Mariage",
    imageCaption: "Anthony & Ophélie — 19 Juin 2027",
  },
  {
    id: "countdown",
    number: "02",
    title: "Le Décompte",
    subtitle: "Vers le grand jour",
    image: "/photos/lookbook.jpg",
    imageAlt: "Shooting au coucher de soleil",
    imageCaption: "Chaque instant compte jusqu'au 19 Juin 2027.",
  },
  {
    id: "programme",
    number: "03",
    title: "Le Programme",
    subtitle: "Le déroulé de la journée",
    image: "/photos/detail.jpg",
    imageAlt: "Détail de la bague et des matières",
    imageCaption: "Les préparatifs et l'art des détails.",
  },
  {
    id: "cadeaux",
    number: "04",
    title: "Cadeaux",
    subtitle: "Attentions & Urne",
    image: "/photos/lookbook.jpg",
    imageAlt: "Boîte à souvenirs et cadeaux",
    imageCaption: "Votre présence est notre plus précieux présent.",
  },
  {
    id: "rsvp",
    number: "05",
    title: "Votre Réponse",
    subtitle: "Confirmer votre présence",
    image: "/photos/hero.jpg",
    imageAlt: "Shooting Anthony & Ophélie",
    imageCaption: "Nous avons hâte de célébrer à vos côtés.",
  },
];

const galleryPhotos: GalleryPhoto[] = [
  {
    src: "/photos/hero.jpg",
    alt: "Anthony et Ophélie - Cour d'honneur",
    caption: "L'harmonie des lignes architecturales et de l'émotion partagée.",
    tag: "Planche 01 • L'Union",
  },
  {
    src: "/photos/lookbook.jpg",
    alt: "Shooting coucher de soleil",
    caption: "La liberté d'un éclat de rire sous la lumière dorée du soir.",
    tag: "Planche 02 • Spontanéité",
  },
  {
    src: "/photos/detail.jpg",
    alt: "Détail de l'alliance et matière de soie",
    caption: "Les alliances, la texture des tissus et la précision des détails.",
    tag: "Planche 03 • Matière",
  },
];

const timelineSteps = [
  {
    time: "14:30",
    title: "La Cérémonie Laïque",
    location: "L'Oliveraie du Domaine",
    desc: "Échange des vœux sous les arbres centenaires. Accueil dès 14h00.",
  },
  {
    time: "17:00",
    title: "Le Cocktail",
    location: "La Cour d'Honneur",
    desc: "Rafraîchissements, mets fins et séance photo avec les mariés.",
  },
  {
    time: "20:00",
    title: "Le Dîner",
    location: "La Grande Verrière",
    desc: "Dîner de fête, discours chaleureux et ouverture du bal.",
  },
  {
    time: "23:30",
    title: "La Soirée Dansante",
    location: "Le Salon Festif",
    desc: "DJ set et célébration jusqu'au bout de la nuit.",
  },
];

interface SplitScreenProps {
  config?: {
    brideName?: string;
    groomName?: string;
    weddingDate?: string;
    venueName?: string;
    venueCity?: string;
    venueAddress?: string;
    invitationSubtitle?: string;
    invitationText?: string;
    countdownTitle?: string;
    countdownText?: string;
    programmeTitle?: string;
    programmeText?: string;
    programmeSchedule?: string;
    giftsTitle?: string;
    giftsSubtitle?: string;
    giftsMode?: string;
    giftsMessage?: string;
    giftsListUrl?: string;
    giftsListLabel?: string;
    giftsBankIban?: string;
    rsvpTitle?: string;
    rsvpText?: string;
    rsvpDeadline?: string;
    dressCodeTitle?: string;
    dressCodeDesc?: string;
    dressCodeColors?: string;
    dressCodeAdvice?: string;
  };
  mediaList?: Array<{
    id: string;
    url: string;
    caption: string | null;
    chapter: number | null;
  }>;
}

export function SplitScreenExperience({ config, mediaList = [] }: SplitScreenProps) {
  const [activeChapter, setActiveChapter] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const [galleryStartIndex, setGalleryStartIndex] = useState(0);

  // Construction dynamique des chapitres avec les photos uploadées si disponibles
  const dynamicChapters = chapters.map((ch, idx) => {
    const customPhoto = mediaList.find((m) => m.chapter === idx + 1);
    if (customPhoto) {
      return {
        ...ch,
        image: customPhoto.url,
        imageCaption: customPhoto.caption || ch.imageCaption,
      };
    }
    return ch;
  });

  // Construction de la photothèque complète pour le mode plein écran
  const allGalleryPhotos: GalleryPhoto[] =
    mediaList.length > 0
      ? mediaList.map((m, idx) => ({
          src: m.url,
          alt: m.caption || `Photo ${idx + 1}`,
          caption: m.caption || `Cliché ${idx + 1} • Shooting Anthony & Ophélie`,
          tag: m.chapter ? `Chapitre 0${m.chapter}` : `Planche 0${idx + 1}`,
        }))
      : galleryPhotos;

  // État du compte à rebours
  const [timeLeft, setTimeLeft] = useState<{
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
  }>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const target = new Date(config?.weddingDate || "2027-06-19T14:30:00.000Z").getTime();
    const calculate = () => {
      const now = new Date().getTime();
      const diff = target - now;
      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    };
    calculate();
    const timer = setInterval(calculate, 1000);
    return () => clearInterval(timer);
  }, []);

  // Détection du scroll synchronisé UNIQUEMENT sur Desktop (pour animer le Lookbook à gauche)
  useEffect(() => {
    const handleScroll = () => {
      // Sur mobile, chaque chapitre est affiché individuellement en fondu : pas d'interférence avec le scroll
      if (window.innerWidth < 1024) return;

      const scrollPosition = window.scrollY + window.innerHeight / 3;
      const chapterElements = chapters.map((c) =>
        document.getElementById(c.id)
      );

      for (let i = chapterElements.length - 1; i >= 0; i--) {
        const el = chapterElements[i];
        if (el && el.offsetTop <= scrollPosition) {
          setActiveChapter(i);
          break;
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Formulaire RSVP
  const [rsvpState, formAction, isPending] = useActionState(submitRsvp, null);
  const [attendance, setAttendance] = useState<"YES" | "NO">("YES");
  const [guestsCount, setGuestsCount] = useState(1);

  const scrollToChapter = (id: string, index: number) => {
    setActiveChapter(index);
    if (window.innerWidth < 1024) {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const openFullscreen = (index: number) => {
    setGalleryStartIndex(index);
    setIsGalleryOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-[#F8F9FA] text-[#121316]">
      {/* HEADER ÉPURÉ FIXE : Translucide sombre sur mobile pour se fondre dans la photo, clair sur desktop */}
      <header className="fixed top-0 left-0 right-0 z-40 px-5 sm:px-8 md:px-12 py-3.5 bg-black/40 lg:bg-[#F8F9FA]/90 backdrop-blur-md border-b border-white/10 lg:border-black/[0.04] flex items-center justify-between text-white lg:text-[#121316]">
        <div className="flex items-center gap-3">
          <span className="font-serif text-lg sm:text-xl font-medium tracking-tight text-white lg:text-[#121316]">
            {config?.brideName || "Ophélie"} <span className="font-serif italic text-white/70 lg:text-[#5C626C]">&</span> {config?.groomName || "Anthony"}
          </span>
          <span className="hidden sm:inline-block text-[10px] uppercase tracking-[0.25em] text-white/60 lg:text-[#949BA5] font-sans">
            19.06.2027
          </span>
        </div>

        {/* Navigation Desktop */}
        <nav className="hidden lg:flex items-center gap-1.5">
          {chapters.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => scrollToChapter(ch.id, idx)}
              className={`px-3 py-1.5 rounded-lg text-xs font-sans font-semibold tracking-wider transition-all duration-200 cursor-pointer ${
                activeChapter === idx
                  ? "bg-[#121316] text-[#FFFFFF]"
                  : "text-[#5C626C] hover:text-[#121316] hover:bg-black/[0.03]"
              }`}
            >
              <span>{ch.title}</span>
            </button>
          ))}

          <button
            onClick={() => openFullscreen(0)}
            className="px-3 py-1.5 rounded-lg border border-black/10 text-[#121316] text-xs font-sans font-semibold hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer ml-1"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Galerie</span>
          </button>

          <Link
            href="/admin"
            title="Espace Privé"
            className="p-2 ml-1 rounded-lg text-[#949BA5] hover:text-[#121316] hover:bg-black/[0.03] transition-colors"
          >
            <Lock className="w-4 h-4" />
          </Link>
        </nav>

        {/* Action rapide mobile dans le header : uniquement une icône discrète pour la galerie */}
        <div className="flex lg:hidden items-center">
          <button
            onClick={() => openFullscreen(0)}
            title="Galerie photos"
            aria-label="Ouvrir la galerie photos"
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/15 transition-all cursor-pointer active:scale-95 flex items-center justify-center"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* EXPÉRIENCE MOBILE : Apple Scrollytelling (Photo plein écran fixée + texte qui glisse en surimpression) */}
      <MobileAppleScrollytelling
        chapters={dynamicChapters}
        config={config}
        timeLeft={timeLeft}
        timelineSteps={timelineSteps}
        rsvpState={rsvpState}
        formAction={formAction}
        isPending={isPending}
        attendance={attendance}
        setAttendance={setAttendance}
        guestsCount={guestsCount}
        setGuestsCount={setGuestsCount}
      />

      {/* DISPOSITION DESKTOP : Split-Screen interactif haute couture */}
      <div className="hidden lg:flex min-h-screen pt-0 overflow-x-hidden">
        {/* ========================================================
            VOLET GAUCHE (DESKTOP) : Le Lookbook Photo Fixe & Immersif
           ======================================================== */}
        <div className="hidden lg:block lg:w-1/2 lg:h-screen lg:sticky lg:top-0 p-8 xl:p-12">
          <div className="relative w-full h-full rounded-3xl overflow-hidden shadow-2xl border border-white bg-neutral-900 group">
            {/* Ligne d'avancement verticale discrète */}
            <div className="absolute top-8 left-8 z-30 flex flex-col gap-2">
              {chapters.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-1 transition-all duration-500 rounded-full ${
                    activeChapter === idx
                      ? "h-8 bg-white shadow-sm"
                      : "h-2 bg-white/40"
                  }`}
                />
              ))}
            </div>

            {/* Bouton d'agrandissement en survol */}
            <button
              onClick={() => openFullscreen(activeChapter % allGalleryPhotos.length)}
              className="absolute top-8 right-8 z-30 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white backdrop-blur-md border border-white/20 transition-all cursor-pointer opacity-0 group-hover:opacity-100 flex items-center gap-2 text-xs font-sans font-semibold"
            >
              <Maximize2 className="w-4 h-4" />
              Plein écran
            </button>

            {dynamicChapters.map((ch, idx) => (
              <div
                key={ch.id}
                className={`absolute inset-0 transition-all duration-700 ease-in-out ${
                  activeChapter === idx
                    ? "opacity-100 z-10 scale-100"
                    : "opacity-0 z-0 scale-105 pointer-events-none"
                }`}
              >
                <Image
                  src={ch.image}
                  alt={ch.imageAlt}
                  fill
                  priority={idx === 0}
                  sizes="50vw"
                  className="object-cover object-center transition-transform duration-1000 ease-out hover:scale-102"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/15 to-transparent" />

                {/* Légende du cliché actif */}
                <div className="absolute bottom-8 left-8 right-8 flex items-end justify-between text-white z-20">
                  <div>
                    <span className="text-[11px] font-sans font-semibold tracking-[0.3em] uppercase text-white/70 block mb-1">
                      Chapitre {ch.number} • Cliché du Shooting
                    </span>
                    <p className="font-serif italic text-xl text-white/95">
                      {ch.imageCaption}
                    </p>
                  </div>
                  <button
                    onClick={() => openFullscreen(idx % allGalleryPhotos.length)}
                    className="font-sans text-xs tracking-widest uppercase text-white/80 hover:text-white border border-white/30 hover:border-white px-3 py-1.5 rounded-full transition-all cursor-pointer"
                  >
                    Agrandir
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            VOLET DROIT : Déroulé Interactif
            Sur Mobile : Photo sticky 100dvh par chapitre, et informations qui glissent par-dessus au scroll
            Sur Desktop : Défilement fluide élégant à droite du Lookbook
           ======================================================== */}
        <div className="w-full lg:w-1/2 lg:px-12 xl:px-16 lg:py-24 lg:space-y-32">
          {/* ====================================================
              CHAPITRE 01 : L'INVITATION
             ==================================================== */}
          <section
            id="invitation"
            className="relative w-full lg:min-h-[75vh]"
          >
            {/* SUR MOBILE : Photo plein écran immersive sans masque */}
            <div className="lg:hidden relative h-[100dvh] w-full overflow-hidden">
              <Image
                src={dynamicChapters[0].image}
                alt={dynamicChapters[0].imageAlt}
                fill
                priority
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              {/* Légende et invitation au scroll */}
              <div className="absolute bottom-12 left-6 right-6 flex items-end justify-between text-white pointer-events-none">
                <div>
                  <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-white/75 block mb-1">
                    Chapitre 01 • Lookbook
                  </span>
                  <p className="font-serif italic text-lg text-white/95">
                    {dynamicChapters[0].imageCaption}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 text-white/80 animate-bounce">
                  <span className="text-[10px] tracking-widest uppercase font-sans">Défiler</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* CONTENU QUI MONTE AU SCROLL : Carte élégante transparente sur mobile (zéro halo blanc), emboss-card sur desktop */}
            <div className="relative z-10 p-4 sm:p-8 lg:p-0">
              <div className="rounded-3xl p-6 sm:p-8 bg-black/50 backdrop-blur-xl border border-white/20 text-white lg:bg-white lg:text-[#121316] lg:border-white/90 lg:emboss-card lg:shadow-2xl space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/75 lg:text-[#5C626C] font-semibold font-sans">
                      Chapitre 01
                    </span>
                    <div className="h-[1px] w-8 bg-white/30 lg:bg-black/15" />
                    <span className="text-xs uppercase tracking-[0.2em] text-white/60 lg:text-[#949BA5] font-sans">
                      {config?.invitationSubtitle || "Invitation"}
                    </span>
                  </div>

                  <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-tight leading-[0.98] font-light">
                    {config?.brideName || "Ophélie"} <br />
                    <span className="font-serif italic text-white/75 lg:text-[#5C626C]">&</span> {config?.groomName || "Anthony"}
                  </h1>

                  <p className="font-sans text-sm sm:text-base md:text-lg text-white/85 lg:text-[#5C626C] leading-relaxed pt-1 max-w-lg">
                    {config?.invitationText ||
                      "Deux regards complices, des projets partagés et l'envie de sceller notre histoire entourés de ceux qui comptent le plus. Nous serions infiniment touchés de vous compter parmi nous."}
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-white/10 border border-white/20 lg:bg-white lg:deboss-input lg:border-black/[0.05] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-white/70 lg:text-[#5C626C] font-semibold block">
                      Date & Lieu
                    </span>
                    <p className="font-serif text-xl sm:text-2xl mt-0.5">
                      {config?.weddingDate
                        ? new Date(config.weddingDate).toLocaleDateString("fr-FR", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })
                        : "19 Juin 2027"}
                    </p>
                    <p className="text-xs text-white/75 lg:text-[#5C626C] font-sans">
                      {config?.venueName || "Domaine des Vignes Blanches"}, {config?.venueCity || "Provence"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* ====================================================
              CHAPITRE 02 : LE DÉCOMPTE
             ==================================================== */}
          <section
            id="countdown"
            className="relative w-full lg:min-h-[75vh]"
          >
            {/* SUR MOBILE : Image calée plein écran en flux continu */}
            <div className="lg:hidden relative h-[100dvh] w-full overflow-hidden">
              <Image
                src={dynamicChapters[1].image}
                alt={dynamicChapters[1].imageAlt}
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-12 left-6 right-6 flex items-end justify-between text-white pointer-events-none">
                <div>
                  <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-white/75 block mb-1">
                    Chapitre 02 • Lookbook
                  </span>
                  <p className="font-serif italic text-lg text-white/95">
                    {dynamicChapters[1].imageCaption}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 text-white/80 animate-bounce">
                  <span className="text-[10px] tracking-widest uppercase font-sans">Décompte</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* CONTENU QUI MONTE AU SCROLL : Sans halo blanc opaque sur mobile */}
            <div className="relative z-10 p-4 sm:p-8 lg:p-0">
              <div className="rounded-3xl p-6 sm:p-8 bg-black/50 backdrop-blur-xl border border-white/20 text-white lg:bg-white lg:text-[#121316] lg:border-white/90 lg:emboss-card lg:shadow-2xl space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/75 lg:text-[#5C626C] font-semibold font-sans">
                      Chapitre 02
                    </span>
                    <div className="h-[1px] w-8 bg-white/30 lg:bg-black/15" />
                    <span className="text-xs uppercase tracking-[0.2em] text-white/60 lg:text-[#949BA5] font-sans">
                      L&apos;Horizon
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
                    {config?.countdownTitle || "Le Décompte"}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-white/85 lg:text-[#5C626C] max-w-md">
                    {config?.countdownText ||
                      "Les mois, les jours et les secondes qui nous séparent du moment où nous nous dirons « oui »."}
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-6">
                  {[
                    { label: "Jours", value: timeLeft.days },
                    { label: "Heures", value: timeLeft.hours },
                    { label: "Minutes", value: timeLeft.minutes },
                    { label: "Secondes", value: timeLeft.seconds },
                  ].map((unit) => (
                    <div
                      key={unit.label}
                      className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-2xl bg-white/10 border border-white/15 lg:bg-transparent lg:border-0 lg:convex-pill"
                    >
                      <span className="font-serif text-3xl sm:text-5xl font-light tracking-tight">
                        {String(unit.value).padStart(2, "0")}
                      </span>
                      <span className="text-[10px] tracking-[0.25em] uppercase text-white/70 lg:text-[#5C626C] font-sans font-semibold mt-1">
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
          <section
            id="programme"
            className="relative w-full lg:min-h-[75vh]"
          >
            {/* SUR MOBILE : Image calée plein écran en flux continu */}
            <div className="lg:hidden relative h-[100dvh] w-full overflow-hidden">
              <Image
                src={dynamicChapters[2].image}
                alt={dynamicChapters[2].imageAlt}
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-12 left-6 right-6 flex items-end justify-between text-white pointer-events-none">
                <div>
                  <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-white/75 block mb-1">
                    Chapitre 03 • Lookbook
                  </span>
                  <p className="font-serif italic text-lg text-white/95">
                    {dynamicChapters[2].imageCaption}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 text-white/80 animate-bounce">
                  <span className="text-[10px] tracking-widest uppercase font-sans">Programme</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* CONTENU QUI MONTE AU SCROLL : Sans halo blanc opaque sur mobile */}
            <div className="relative z-10 p-4 sm:p-8 lg:p-0">
              <div className="rounded-3xl p-6 sm:p-8 bg-black/50 backdrop-blur-xl border border-white/20 text-white lg:bg-white lg:text-[#121316] lg:border-white/90 lg:emboss-card lg:shadow-2xl space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/75 lg:text-[#5C626C] font-semibold font-sans">
                      Chapitre 03
                    </span>
                    <div className="h-[1px] w-8 bg-white/30 lg:bg-black/15" />
                    <span className="text-xs uppercase tracking-[0.2em] text-white/60 lg:text-[#949BA5] font-sans">
                      Déroulé
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
                    {config?.programmeTitle || "Le Programme de la Journée"}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-white/85 lg:text-[#5C626C]">
                    {config?.programmeText || "Une partition rythmée pour savourer chaque instant ensemble."}
                  </p>
                </div>

                {/* Timeline dynamique */}
                <div className="space-y-3">
                  {(() => {
                    let dynamicSteps = timelineSteps;
                    if (config?.programmeSchedule) {
                      try {
                        const parsed = JSON.parse(config.programmeSchedule);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                          dynamicSteps = parsed;
                        }
                      } catch {}
                    }

                    return dynamicSteps.map((step, idx) => (
                      <div
                        key={`${step.title}-${idx}`}
                        className="p-4 sm:p-5 rounded-2xl bg-white/10 border border-white/15 lg:bg-white lg:deboss-input lg:border-black/[0.05] flex items-start gap-3 sm:gap-5"
                      >
                        <div className="rounded-xl px-3 py-1.5 text-center shrink-0 min-w-[65px] sm:min-w-[80px] bg-white/20 border border-white/20 lg:bg-white lg:shadow-sm lg:border-black/[0.04]">
                          <span className="font-serif text-lg sm:text-2xl font-medium">
                            {step.time}
                          </span>
                        </div>
                        <div className="space-y-0.5 min-w-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-serif text-base sm:text-xl">
                              {step.title}
                            </h3>
                            <span className="text-[10px] uppercase tracking-wider text-white/60 lg:text-[#949BA5] font-sans shrink-0">
                              0{idx + 1}
                            </span>
                          </div>
                          <p className="text-xs text-white/80 lg:text-[#5C626C] font-sans leading-relaxed">
                            {step.desc}
                          </p>
                          {step.location && (
                            <p className="text-[11px] text-white/90 lg:text-[#121316] font-sans font-medium flex items-center gap-1 pt-0.5">
                              <MapPin className="w-3 h-3 text-white/70 lg:text-[#5C626C] shrink-0" />
                              {step.location}
                            </p>
                          )}
                        </div>
                      </div>
                    ));
                  })()}
                </div>

                <div className="flex flex-wrap gap-2.5 pt-1 text-xs uppercase tracking-wider font-sans font-semibold">
                  <a
                    href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mariage+Anthony+%26+Oph%C3%A9lie&dates=20270619T123000Z/20270620T040000Z&details=Mariage+au+Domaine+des+Vignes+Blanches&location=Domaine+des+Vignes+Blanches,+Provence"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 lg:bg-white lg:deboss-input lg:border-black/[0.05] flex items-center gap-1.5 transition-all text-[11px]"
                  >
                    <Calendar className="w-3.5 h-3.5 text-white/70 lg:text-[#5C626C]" />
                    Google Calendar
                  </a>
                  <a
                    href="https://maps.google.com/?q=Domaine+des+Vignes+Blanches+Provence"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2.5 rounded-xl bg-white/10 border border-white/20 lg:bg-white lg:deboss-input lg:border-black/[0.05] flex items-center gap-1.5 transition-all text-[11px]"
                  >
                    <MapPin className="w-3.5 h-3.5 text-white/70 lg:text-[#5C626C]" />
                    Localiser
                  </a>
                </div>

                <DressCodeSection
                  title={config?.dressCodeTitle}
                  desc={config?.dressCodeDesc}
                  colors={config?.dressCodeColors}
                  advice={config?.dressCodeAdvice}
                />
              </div>
            </div>
          </section>

          {/* ====================================================
              CHAPITRE 04 : CADEAUX & ATTENTIONS
             ==================================================== */}
          <section
            id="cadeaux"
            className="relative w-full lg:min-h-[75vh]"
          >
            {/* SUR MOBILE : Image calée plein écran en flux continu */}
            <div className="lg:hidden relative h-[100dvh] w-full overflow-hidden">
              <Image
                src={dynamicChapters[3].image}
                alt={dynamicChapters[3].imageAlt}
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-12 left-6 right-6 flex items-end justify-between text-white pointer-events-none">
                <div>
                  <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-white/75 block mb-1">
                    Chapitre 04 • Lookbook
                  </span>
                  <p className="font-serif italic text-lg text-white/95">
                    {dynamicChapters[3].imageCaption}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 text-white/80 animate-bounce">
                  <span className="text-[10px] tracking-widest uppercase font-sans">Cadeaux</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* CONTENU QUI MONTE AU SCROLL : Sans halo blanc opaque sur mobile */}
            <div className="relative z-10 p-4 sm:p-8 lg:p-0">
              <div className="rounded-3xl p-6 sm:p-8 bg-black/50 backdrop-blur-xl border border-white/20 text-white lg:bg-white lg:text-[#121316] lg:border-white/90 lg:emboss-card lg:shadow-2xl space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/75 lg:text-[#5C626C] font-semibold font-sans">
                      Chapitre 04
                    </span>
                    <div className="h-[1px] w-8 bg-white/30 lg:bg-black/15" />
                    <span className="text-xs uppercase tracking-[0.2em] text-white/60 lg:text-[#949BA5] font-sans">
                      Attentions
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight">
                    {config?.giftsTitle || "Cadeaux & Attentions"}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm md:text-base text-white/85 lg:text-[#5C626C]">
                    {config?.giftsSubtitle || "Votre présence est notre plus beau présent"}
                  </p>
                </div>

                <div className="p-5 sm:p-6 rounded-2xl bg-white/10 border border-white/15 lg:bg-white lg:deboss-input lg:border-black/[0.05] space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/20 lg:bg-white lg:shadow-sm lg:border-black/[0.04] flex items-center justify-center shrink-0">
                      <Gift className="w-6 h-6 text-white lg:text-[#121316]" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-serif text-xl">
                        {config?.giftsMode === "LIST"
                          ? "Notre Liste de Mariage"
                          : config?.giftsMode === "BOTH"
                          ? "Urne de Voyage & Liste en Ligne"
                          : "Une Urne à Mots Doux sur Place"}
                      </h3>
                      <p className="text-xs sm:text-sm text-white/80 lg:text-[#5C626C] font-sans leading-relaxed pt-0.5">
                        {config?.giftsMessage ||
                          "Votre présence à nos côtés pour célébrer notre union est le plus précieux des cadeaux. Si toutefois vous désirez témoigner d'une attention particulière, une boîte à mots doux & urne de voyage sera mise à votre disposition le jour J."}
                      </p>
                    </div>
                  </div>

                  {/* Bouton vers la liste */}
                  {(config?.giftsMode === "LIST" || config?.giftsMode === "BOTH") &&
                    config?.giftsListUrl && (
                      <div className="pt-3 border-t border-white/10 lg:border-black/[0.06] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <span className="text-xs text-white/75 lg:text-[#5C626C] font-sans">
                          Pour consulter nos envies ou participer à distance :
                        </span>
                        <a
                          href={config.giftsListUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-5 py-3 rounded-xl bg-white text-[#121316] text-xs uppercase tracking-wider font-semibold flex items-center justify-center gap-2 cursor-pointer transition-all"
                        >
                          {config?.giftsListLabel || "Consulter notre liste de mariage"}
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>
                    )}

                  {config?.giftsBankIban && (
                    <div className="pt-3 border-t border-white/10 lg:border-black/[0.06] text-xs text-white/80 lg:text-[#5C626C] font-sans space-y-1">
                      <span className="text-[10px] uppercase tracking-wider font-semibold block text-white/60 lg:text-[#949BA5]">
                        Participation par virement (IBAN) :
                      </span>
                      <span className="font-mono text-white lg:text-[#121316] text-[11px] block select-all p-2.5 rounded-xl bg-white/10 lg:bg-white shadow-sm border border-white/15 lg:border-black/[0.04]">
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
          <section
            id="rsvp"
            className="relative w-full lg:min-h-[75vh] pb-24 lg:pb-0"
          >
            {/* SUR MOBILE : Image calée plein écran en flux continu */}
            <div className="lg:hidden relative h-[100dvh] w-full overflow-hidden">
              <Image
                src={dynamicChapters[4]?.image || dynamicChapters[0].image}
                alt={dynamicChapters[4]?.imageAlt || "Confirmation"}
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

              <div className="absolute bottom-12 left-6 right-6 flex items-end justify-between text-white pointer-events-none">
                <div>
                  <span className="text-[10px] font-sans font-semibold tracking-[0.3em] uppercase text-white/75 block mb-1">
                    Chapitre 05 • Lookbook
                  </span>
                  <p className="font-serif italic text-lg text-white/95">
                    {dynamicChapters[4]?.imageCaption || "Nous avons hâte de vous retrouver."}
                  </p>
                </div>
                <div className="flex flex-col items-center gap-1 text-white/80 animate-bounce">
                  <span className="text-[10px] tracking-widest uppercase font-sans">Répondre</span>
                  <ChevronDown className="w-4 h-4" />
                </div>
              </div>
            </div>

            {/* CONTENU QUI MONTE AU SCROLL : Sans halo blanc opaque sur mobile */}
            <div className="relative z-10 p-4 sm:p-8 lg:p-0">
              <div className="rounded-3xl p-6 sm:p-8 bg-black/50 backdrop-blur-xl border border-white/20 text-white lg:bg-white lg:text-[#121316] lg:border-white/90 lg:emboss-card lg:shadow-2xl space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <span className="text-xs uppercase tracking-[0.3em] text-white/75 lg:text-[#5C626C] font-semibold font-sans">
                      Chapitre 05
                    </span>
                    <div className="h-[1px] w-8 bg-white/30 lg:bg-black/15" />
                    <span className="text-xs uppercase tracking-[0.2em] text-white/60 lg:text-[#949BA5] font-sans">
                      Confirmation
                    </span>
                  </div>

                  <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#121316] font-normal tracking-tight">
                    {config?.rsvpTitle || "Confirmer Votre Présence"}
                  </h2>
                  <p className="font-sans text-xs sm:text-sm text-[#5C626C]">
                    {config?.rsvpText ||
                      `Merci de nous transmettre votre réponse avant le ${config?.rsvpDeadline || "1er Mai 2027"}.`}
                  </p>
                </div>

                {rsvpState?.success ? (
                  <div className="p-8 sm:p-10 text-center rounded-2xl deboss-input border border-black/[0.05]">
                    <div className="w-12 h-12 mx-auto rounded-full bg-[#121316] text-white flex items-center justify-center mb-4">
                      <Heart className="w-5 h-5 stroke-[1.5]" />
                    </div>
                    <h3 className="font-serif text-2xl text-[#121316]">
                      Réponse enregistrée
                    </h3>
                    <p className="mt-2 text-sm text-[#5C626C] font-sans">
                      {rsvpState.message}
                    </p>
                  </div>
                ) : (
                  <form
                    action={formAction}
                    className="space-y-5"
                  >
                    {rsvpState?.message && !rsvpState.success && (
                      <div className="p-3 rounded-xl bg-red-50 text-red-700 text-xs text-center border border-red-200">
                        {rsvpState.message}
                      </div>
                    )}

                    {/* Présence */}
                    <div className="space-y-2">
                      <label className="text-[11px] font-semibold tracking-wider uppercase text-[#5C626C]">
                        Serez-vous présents ?
                      </label>
                      <div className="grid grid-cols-2 gap-3">
                        <button
                          type="button"
                          onClick={() => setAttendance("YES")}
                          className={`py-3.5 px-4 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 ${
                            attendance === "YES"
                              ? "convex-dark-btn text-white"
                              : "convex-btn text-[#5C626C]"
                          }`}
                        >
                          {attendance === "YES" && <Check className="w-3.5 h-3.5" />}
                          Avec plaisir
                        </button>
                        <button
                          type="button"
                          onClick={() => setAttendance("NO")}
                          className={`py-3.5 px-4 rounded-xl text-xs font-semibold cursor-pointer flex items-center justify-center gap-2 ${
                            attendance === "NO"
                              ? "convex-dark-btn text-white"
                              : "convex-btn text-[#5C626C]"
                          }`}
                        >
                          {attendance === "NO" && <Check className="w-3.5 h-3.5" />}
                          À regret
                        </button>
                      </div>
                      <input type="hidden" name="attendance" value={attendance} />
                    </div>

                    {/* Convives */}
                    <div className="space-y-2">
                      <label
                        htmlFor="fullName"
                        className="text-[11px] font-semibold tracking-wider uppercase text-[#5C626C]"
                      >
                        Nom et Prénom *
                      </label>
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        required
                        placeholder="Ex: Camille Dupont"
                        className="deboss-input w-full px-4 py-3.5 rounded-xl text-sm font-sans text-[#121316]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label
                        htmlFor="email"
                        className="text-[11px] font-semibold tracking-wider uppercase text-[#5C626C]"
                      >
                        Adresse e-mail (optionnel)
                      </label>
                      <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="camille@exemple.com"
                        className="deboss-input w-full px-4 py-3.5 rounded-xl text-sm font-sans text-[#121316]"
                      />
                    </div>

                    {attendance === "YES" && (
                      <>
                        {/* Nombre d'invités */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-semibold tracking-wider uppercase text-[#5C626C]">
                            Nombre d&apos;invités (vous inclus)
                          </label>
                          <div className="flex items-center gap-2">
                            {[1, 2, 3, 4, 5].map((count) => (
                              <button
                                key={count}
                                type="button"
                                onClick={() => setGuestsCount(count)}
                                className={`flex-1 py-3 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                                  guestsCount === count
                                    ? "convex-dark-btn text-white"
                                    : "convex-btn text-[#5C626C]"
                                }`}
                              >
                                {count}
                              </button>
                            ))}
                          </div>
                          <input type="hidden" name="guestsCount" value={guestsCount} />
                        </div>

                        {/* Événements */}
                        <div className="space-y-2">
                          <label className="text-[11px] font-semibold tracking-wider uppercase text-[#5C626C]">
                            Présence aux temps forts
                          </label>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                            {[
                              { id: "ceremony", label: "Cérémonie" },
                              { id: "cocktail", label: "Cocktail" },
                              { id: "brunch", label: "Brunch" },
                            ].map((evt) => (
                              <label
                                key={evt.id}
                                className="deboss-input flex items-center gap-2 p-3 rounded-xl cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  name="events"
                                  value={evt.id}
                                  defaultChecked
                                  className="accent-[#121316] w-3.5 h-3.5"
                                />
                                <span className="text-xs font-sans text-[#121316]">
                                  {evt.label}
                                </span>
                              </label>
                            ))}
                          </div>
                        </div>

                        {/* Régimes */}
                        <div className="space-y-1.5">
                          <label
                            htmlFor="dietaryRestrictions"
                            className="text-[11px] font-semibold tracking-wider uppercase text-[#5C626C]"
                          >
                            Régimes ou allergies
                          </label>
                          <input
                            id="dietaryRestrictions"
                            name="dietaryRestrictions"
                            type="text"
                            placeholder="Végétarien, sans gluten..."
                            className="deboss-input w-full px-4 py-3 rounded-xl text-sm font-sans text-[#121316]"
                          />
                        </div>

                        {/* Musique */}
                        <div className="space-y-1.5">
                          <label
                            htmlFor="songSuggestion"
                            className="text-[11px] font-semibold tracking-wider uppercase text-[#5C626C]"
                          >
                            Une chanson pour le DJ
                          </label>
                          <input
                            id="songSuggestion"
                            name="songSuggestion"
                            type="text"
                            placeholder="Artiste - Titre"
                            className="deboss-input w-full px-4 py-3 rounded-xl text-sm font-sans text-[#121316]"
                          />
                        </div>
                      </>
                    )}

                    {/* Mot doux */}
                    <div className="space-y-1.5">
                      <label
                        htmlFor="loveNote"
                        className="text-[11px] font-semibold tracking-wider uppercase text-[#5C626C]"
                      >
                        Un mot pour Anthony & Ophélie
                      </label>
                      <textarea
                        id="loveNote"
                        name="loveNote"
                        rows={3}
                        placeholder="Laissez votre message..."
                        className="deboss-input w-full px-4 py-3 rounded-xl text-sm font-sans text-[#121316] resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={isPending}
                      className="w-full py-4 rounded-xl convex-dark-btn text-white font-semibold text-xs uppercase tracking-wider cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
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

                {/* Footer discret */}
                <div className="pt-8 text-center text-xs text-[#949BA5] font-sans border-t border-black/[0.05]">
                  <p>Anthony & Ophélie • 19.06.2027</p>
                </div>

                {/* Bouton retour chapitres sur mobile */}
                <div className="pt-2 lg:hidden">
                  <button
                    onClick={() => scrollToChapter("invitation", 0)}
                    className="w-full py-3.5 rounded-2xl convex-btn text-[#5C626C] text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>Revenir au début</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>

      {/* MODALE GALERIE PLEIN ÉCRAN */}
      <FullscreenGallery
        photos={allGalleryPhotos}
        isOpen={isGalleryOpen}
        initialIndex={galleryStartIndex}
        onClose={() => setIsGalleryOpen(false)}
      />
    </div>
  );
}
