import { Calendar, MapPin } from "lucide-react";

interface TimelineItem {
  time: string;
  title: string;
  location: string;
  description: string;
  detail?: string;
}

const steps: TimelineItem[] = [
  {
    time: "14:30",
    title: "La Cérémonie Laïque",
    location: "L'Oliveraie du Domaine",
    description:
      "Échange des vœux et des alliances dans le parc. Accueil des convives dès 14h00.",
  },
  {
    time: "17:00",
    title: "Le Cocktail",
    location: "La Cour d'Honneur",
    description:
      "Rafraîchissements, pièces de cocktail et séance photo avec les mariés.",
  },
  {
    time: "20:00",
    title: "Le Dîner",
    location: "La Grande Verrière",
    description:
      "Dîner festif, surprises des proches et ouverture du bal.",
  },
  {
    time: "23:30",
    title: "La Soirée Dansante",
    location: "Le Salon Festif",
    description:
      "Fête et musique jusqu'au bout de la nuit avec notre DJ.",
  },
];

export function TimelineSection() {
  return (
    <section id="programme" className="py-24 px-6 md:px-12 max-w-5xl mx-auto">
      <div className="text-center mb-14">
        <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#5C626C]">
          Le Déroulement
        </span>
        <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-[#121316] mt-3 font-normal">
          Le Programme de la Journée
        </h2>
        <p className="font-sans text-sm md:text-base text-[#5C626C] mt-2">
          Samedi 19 Juin 2027 • Les temps forts de notre union
        </p>
      </div>

      <div className="space-y-5">
        {steps.map((step, idx) => (
          <div
            key={step.title}
            className="emboss-card rounded-2xl p-6 md:p-7 border border-white flex flex-col md:flex-row md:items-center justify-between gap-6"
          >
            <div className="flex items-start md:items-center gap-6">
              {/* Horloge / Heure neumorphique moderne */}
              <div className="deboss-input rounded-xl px-5 py-3 text-center min-w-[95px]">
                <span className="font-serif text-2xl md:text-3xl text-[#121316] font-medium">
                  {step.time}
                </span>
              </div>

              {/* Contenu */}
              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <h3 className="font-serif text-xl md:text-2xl text-[#121316]">
                    {step.title}
                  </h3>
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#949BA5] font-semibold font-sans">
                    0{idx + 1}
                  </span>
                </div>
                <p className="text-xs md:text-sm text-[#5C626C] font-sans leading-relaxed max-w-xl">
                  {step.description}
                </p>
              </div>
            </div>

            {/* Lieu */}
            <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 pt-4 md:pt-0 border-black/[0.06] gap-1.5 shrink-0">
              <span className="text-xs font-sans text-[#121316] font-medium flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#5C626C]" />
                {step.location}
              </span>
              <span className="text-[10px] tracking-[0.2em] uppercase text-[#949BA5] font-sans">
                Domaine
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Ajout Calendrier & Accès */}
      <div className="mt-12 flex flex-wrap justify-center items-center gap-4 text-xs uppercase tracking-[0.2em] font-sans font-semibold">
        <a
          href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=Mariage+Anthony+%26+Oph%C3%A9lie&dates=20270619T123000Z/20270620T040000Z&details=Mariage+Anthony+et+Oph%C3%A9lie+au+Domaine+des+Vignes+Blanches&location=Domaine+des+Vignes+Blanches,+Provence"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 rounded-xl deboss-input text-[#121316] hover:bg-white transition-all flex items-center gap-2"
        >
          <Calendar className="w-4 h-4 text-[#5C626C]" />
          Ajouter à Google Calendar
        </a>
        <a
          href="https://maps.google.com/?q=Domaine+des+Vignes+Blanches+Provence"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 rounded-xl deboss-input text-[#121316] hover:bg-white transition-all flex items-center gap-2"
        >
          <MapPin className="w-4 h-4 text-[#5C626C]" />
          Itinéraire
        </a>
      </div>
    </section>
  );
}
