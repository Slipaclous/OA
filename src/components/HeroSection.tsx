import Image from "next/image";

export function HeroSection() {
  return (
    <section className="relative min-h-[90vh] flex flex-col justify-between px-6 md:px-16 pt-8 pb-14 max-w-7xl mx-auto">
      {/* Barre supérieure épurée */}
      <div className="flex justify-between items-center border-b border-black/[0.06] pb-6">
        <span className="text-[11px] uppercase tracking-[0.28em] text-[#5C626C] font-semibold font-sans">
          Célébration
        </span>
        <div className="text-center">
          <span className="font-serif text-sm md:text-base text-[#121316] font-medium tracking-wide">
            19 Juin 2027
          </span>
        </div>
        <a
          href="#rsvp"
          className="text-[11px] uppercase tracking-[0.25em] text-[#121316] font-semibold hover:text-[#5C626C] transition-colors"
        >
          Confirmer
        </a>
      </div>

      {/* Composition contemporaine chic : Titrage architectural + Grande photo */}
      <div className="my-auto py-10 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Titrage & Présentation */}
        <div className="lg:col-span-6 space-y-6 text-left">
          <span className="text-xs uppercase tracking-[0.35em] text-[#5C626C] font-semibold font-sans block">
            Mariage Civil & Célébration
          </span>

          <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight text-[#121316] leading-[0.95] font-light">
            Anthony <br />
            <span className="font-serif italic font-normal text-[#5C626C]">&</span> Ophélie
          </h1>

          <p className="font-sans text-sm md:text-base text-[#5C626C] max-w-md leading-relaxed font-normal pt-2">
            Nous avons la joie immense de vous inviter à célébrer notre mariage. Une journée entourés de ceux qui nous sont les plus chers.
          </p>

          <div className="pt-6 flex flex-wrap items-center gap-5">
            <a
              href="#rsvp"
              className="px-8 py-4 rounded-xl bg-[#121316] text-[#FFFFFF] text-xs uppercase tracking-[0.2em] font-semibold hover:bg-[#2C2E35] transition-all duration-300 shadow-sm"
            >
              Répondre à l&apos;invitation
            </a>
            <a
              href="#programme"
              className="text-xs uppercase tracking-[0.2em] text-[#5C626C] font-semibold hover:text-[#121316] transition-colors flex items-center gap-2"
            >
              Découvrir le programme
              <span className="text-sm">↓</span>
            </a>
          </div>
        </div>

        {/* Photographie Shooting Contemporain */}
        <div className="lg:col-span-6 relative">
          <div className="emboss-card rounded-2xl p-3 md:p-4 border border-white max-w-lg mx-auto">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden photo-contemporary">
              <Image
                src="/photos/hero.jpg"
                alt="Anthony et Ophélie - Shooting Mariage"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60" />
              <div className="absolute bottom-4 left-5 right-5 flex justify-between items-end text-white">
                <span className="font-serif text-sm tracking-wide">
                  Anthony & Ophélie
                </span>
                <span className="text-[10px] tracking-[0.25em] uppercase opacity-90 font-sans font-medium">
                  19.06.2027
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barre de pied contemporaine */}
      <div className="flex justify-between items-center text-[#949BA5] text-xs pt-4 border-t border-black/[0.06] font-sans">
        <span>Domaine des Vignes Blanches</span>
        <span className="hidden sm:inline">Tenue élégante</span>
        <span>Invitation Nominative</span>
      </div>
    </section>
  );
}
