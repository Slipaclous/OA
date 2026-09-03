import Image from "next/image";

interface PhotoItem {
  id: string;
  src: string;
  alt: string;
  caption: string;
  tag: string;
}

const defaultPhotos: PhotoItem[] = [
  {
    id: "1",
    src: "/photos/lookbook.jpg",
    alt: "Shooting Anthony & Ophélie",
    caption: "Instants spontanés capturés en pleine lumière.",
    tag: "Série 01",
  },
  {
    id: "2",
    src: "/photos/detail.jpg",
    alt: "Détail de la bague et des matières",
    caption: "Les détails, les textures et les précieux préparatifs.",
    tag: "Série 02",
  },
  {
    id: "3",
    src: "/photos/hero.jpg",
    alt: "Anthony & Ophélie",
    caption: "La complicité d'un regard tourné vers l'avenir.",
    tag: "Série 03",
  },
];

export function LookbookGallery() {
  return (
    <section className="py-24 px-6 md:px-12 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 pb-6 border-b border-black/[0.06] gap-6">
        <div>
          <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#5C626C]">
            Galerie
          </span>
          <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-[#121316] mt-2 font-normal">
            Le Shooting Photo
          </h2>
        </div>
        <p className="font-sans text-sm md:text-base text-[#5C626C] max-w-md">
          Quelques clichés de nos séances photos partagées, en attendant de vivre cette journée unique à vos côtés.
        </p>
      </div>

      {/* Grille contemporaine épurée */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Photo principale */}
        <div className="md:col-span-7 space-y-4">
          <div className="emboss-card rounded-2xl p-3 md:p-4 border border-white">
            <div className="relative aspect-[3/4] w-full rounded-xl overflow-hidden photo-contemporary">
              <Image
                src={defaultPhotos[0].src}
                alt={defaultPhotos[0].alt}
                fill
                sizes="(max-width: 768px) 100vw, 60vw"
                className="object-cover object-center"
              />
            </div>
          </div>
          <div className="flex justify-between items-baseline px-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#121316] font-semibold font-sans">
              {defaultPhotos[0].tag}
            </span>
            <p className="font-sans text-xs md:text-sm text-[#5C626C]">
              {defaultPhotos[0].caption}
            </p>
          </div>
        </div>

        {/* Colonne latérale */}
        <div className="md:col-span-5 space-y-10 md:pt-12">
          {/* Photo secondaire */}
          <div className="space-y-4">
            <div className="emboss-card rounded-2xl p-3 border border-white">
              <div className="relative aspect-[4/3] w-full rounded-xl overflow-hidden photo-contemporary">
                <Image
                  src={defaultPhotos[1].src}
                  alt={defaultPhotos[1].alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 40vw"
                  className="object-cover object-center"
                />
              </div>
            </div>
            <div className="flex justify-between items-baseline px-2">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#121316] font-semibold font-sans">
                {defaultPhotos[1].tag}
              </span>
              <p className="font-sans text-xs md:text-sm text-[#5C626C]">
                {defaultPhotos[1].caption}
              </p>
            </div>
          </div>

          {/* Carte textuelle contemporaine */}
          <div className="emboss-card rounded-2xl p-8 border border-white text-center space-y-3">
            <span className="text-2xl text-[#121316] font-serif">“</span>
            <p className="font-serif italic text-xl md:text-2xl text-[#121316] leading-snug font-normal">
              Le bonheur ne vaut que s&apos;il est partagé.
            </p>
            <span className="block text-[10px] tracking-[0.2em] uppercase text-[#949BA5] pt-2 font-sans font-semibold">
              Anthony & Ophélie
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
