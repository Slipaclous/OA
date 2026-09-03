import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Users, CheckCircle2, XCircle, Music, Image as ImageIcon, Heart, Settings, Trash2 } from "lucide-react";
import { UploadMediaForm } from "@/components/UploadMediaForm";
import { WeddingConfigForm } from "@/components/WeddingConfigForm";
import { deleteMedia } from "@/app/actions/media";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const rsvps = await prisma.rsvp.findMany({
    orderBy: { createdAt: "desc" },
  });

  const mediaList = await prisma.media.findMany({
    orderBy: { createdAt: "desc" },
  });

  let config = await prisma.weddingConfig.findUnique({
    where: { id: "default" },
  });

  if (!config) {
    config = await prisma.weddingConfig.create({
      data: {
        id: "default",
        brideName: "Ophélie",
        groomName: "Anthony",
        weddingDate: new Date("2027-06-19T14:30:00.000Z"),
        venueName: "Domaine des Vignes Blanches",
        venueCity: "Provence, France",
        dressCodeTitle: "Chic Contemporain & Épuré",
        dressCodeDesc:
          "Pour une harmonie visuelle élégante sur les photos de la journée, nous vous invitons à privilégier une tenue chic contemporaine, épurée et intemporelle.",
        dressCodeColors:
          "Blanc Pur:#FFFFFF,Sable Minéral:#E9ECEF,Gris Taupe:#CED4DA,Ardoise:#495057,Noir Profond:#121316",
        dressCodeAdvice:
          "Le cocktail aura lieu en extérieur dans le parc du domaine, prévoyez des chaussures confortables pour les allées en herbe.",
      },
    });
  }

  const confirmedRsvps = rsvps.filter((r) => r.status === "YES");
  const declinedRsvps = rsvps.filter((r) => r.status === "NO");
  const totalGuests = confirmedRsvps.reduce((acc, r) => acc + r.guestsCount, 0);

  return (
    <main className="min-h-screen bg-[#F8F9FA] p-6 md:p-12 max-w-7xl mx-auto space-y-10">
      {/* En-tête */}
      <div className="flex flex-col md:flex-row md:items-center justify-between border-b border-black/[0.06] pb-6 gap-4">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#5C626C] hover:text-[#121316] mb-3 font-semibold font-sans"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Retour au site
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl text-[#121316]">
            Espace Privé — Anthony & Ophélie
          </h1>
          <p className="font-sans text-sm text-[#5C626C] mt-1">
            Gestion des réponses, décompte traiteur, Dress Code et photothèque optimisée WebP.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-xs uppercase tracking-[0.2em] text-[#5C626C] bg-white px-4 py-2 rounded-xl border border-black/[0.06] font-semibold">
            {rsvps.length} Réponse{rsvps.length > 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {/* Cartes métriques */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="emboss-card rounded-2xl p-6 border border-white">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-[#5C626C] font-semibold">
              Total Convives
            </span>
            <Users className="w-5 h-5 text-[#121316]" />
          </div>
          <p className="font-serif text-4xl text-[#121316] mt-4 font-light">
            {totalGuests}
          </p>
          <span className="text-xs text-[#5C626C] mt-1 block font-sans">
            Personnes confirmées
          </span>
        </div>

        <div className="emboss-card rounded-2xl p-6 border border-white">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-[#5C626C] font-semibold">
              Confirmations
            </span>
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="font-serif text-4xl text-[#121316] mt-4 font-light">
            {confirmedRsvps.length}
          </p>
          <span className="text-xs text-[#5C626C] mt-1 block font-sans">
            Invitations acceptées
          </span>
        </div>

        <div className="emboss-card rounded-2xl p-6 border border-white">
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-[0.2em] text-[#5C626C] font-semibold">
              Désistements
            </span>
            <XCircle className="w-5 h-5 text-neutral-400" />
          </div>
          <p className="font-serif text-4xl text-[#121316] mt-4 font-light">
            {declinedRsvps.length}
          </p>
          <span className="text-xs text-[#949BA5] mt-1 block font-sans">
            Personnes absentes
          </span>
        </div>
      </div>

      {/* Paramètres Dress Code */}
      <div className="emboss-card rounded-2xl p-8 border border-white space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
          <h2 className="font-serif text-2xl text-[#121316] flex items-center gap-3">
            <Settings className="w-5 h-5 text-[#121316]" />
            Paramètres de l&apos;Événement & Dress Code
          </h2>
          <span className="text-xs text-[#949BA5] uppercase tracking-[0.2em] font-semibold">
            Modifiable en direct
          </span>
        </div>

        <WeddingConfigForm
          initialConfig={{
            dressCodeTitle: config.dressCodeTitle,
            dressCodeDesc: config.dressCodeDesc,
            dressCodeColors: config.dressCodeColors,
            dressCodeAdvice: config.dressCodeAdvice,
            brideName: config.brideName,
            groomName: config.groomName,
            weddingDate: config.weddingDate.toISOString().slice(0, 16),
            venueName: config.venueName,
            venueCity: config.venueCity,
          }}
        />
      </div>

      {/* Upload & Gestionnaire des Photos */}
      <div className="emboss-card rounded-2xl p-8 border border-white space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
          <h2 className="font-serif text-2xl text-[#121316] flex items-center gap-3">
            <ImageIcon className="w-5 h-5 text-[#121316]" />
            Photothèque & Upload Optimisé (WebP / Sharp)
          </h2>
          <span className="text-xs text-[#949BA5] uppercase tracking-[0.2em] font-semibold">
            {mediaList.length} Cliché{mediaList.length > 1 ? "s" : ""} enregistré{mediaList.length > 1 ? "s" : ""}
          </span>
        </div>

        <UploadMediaForm />

        {/* Grille des photos déjà enregistrées */}
        {mediaList.length > 0 && (
          <div className="pt-6 border-t border-black/[0.06] space-y-4">
            <h3 className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold font-sans">
              Photos enregistrées
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {mediaList.map((m) => (
                <div
                  key={m.id}
                  className="relative group rounded-xl overflow-hidden aspect-[3/4] border border-black/10 bg-neutral-100"
                >
                  <Image
                    src={m.url}
                    alt={m.caption || "Photo"}
                    fill
                    sizes="(max-width: 768px) 50vw, 200px"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white text-[10px]">
                    <span className="font-sans font-semibold">
                      {m.chapter ? `Chapitre 0${m.chapter}` : "Galerie"}
                    </span>
                    <div className="flex items-center justify-between">
                      <span>{m.sizeBytes ? `${Math.round(m.sizeBytes / 1024)} Ko` : ""}</span>
                      <form action={async () => {
                        "use server";
                        await deleteMedia(m.id);
                      }}>
                        <button
                          type="submit"
                          className="p-1 rounded-full bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                          title="Supprimer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Tableau des Réponses */}
      <div className="emboss-card rounded-2xl p-8 border border-white space-y-6">
        <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
          <h2 className="font-serif text-2xl text-[#121316]">
            Liste des Réponses des Invités
          </h2>
        </div>

        {rsvps.length === 0 ? (
          <div className="text-center py-12">
            <Heart className="w-8 h-8 text-[#949BA5] mx-auto mb-3 stroke-[1.5]" />
            <p className="font-sans text-sm text-[#5C626C]">
              Aucune réponse reçue pour le moment.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm font-sans">
              <thead className="border-b border-black/[0.06] text-xs uppercase tracking-[0.15em] text-[#5C626C] font-semibold">
                <tr>
                  <th className="pb-3">Invité(s)</th>
                  <th className="pb-3">Statut</th>
                  <th className="pb-3">Convives</th>
                  <th className="pb-3">Événements</th>
                  <th className="pb-3">Régimes & Allergies</th>
                  <th className="pb-3">Musique</th>
                  <th className="pb-3">Mot Doux</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-black/[0.06]">
                {rsvps.map((rsvp) => (
                  <tr key={rsvp.id} className="hover:bg-black/[0.02] transition-colors">
                    <td className="py-4 font-medium text-[#121316]">
                      {rsvp.fullName}
                      {rsvp.email && (
                        <span className="block text-xs text-[#949BA5] font-normal">
                          {rsvp.email}
                        </span>
                      )}
                    </td>
                    <td className="py-4">
                      {rsvp.status === "YES" ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-[#121316] text-[#FFFFFF] font-medium">
                          Présent
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs bg-neutral-100 text-neutral-600 font-medium">
                          Absent
                        </span>
                      )}
                    </td>
                    <td className="py-4 text-[#121316]">
                      {rsvp.status === "YES" ? rsvp.guestsCount : 0}
                    </td>
                    <td className="py-4 text-xs text-[#5C626C]">
                      {rsvp.events.join(", ")}
                    </td>
                    <td className="py-4 text-xs text-[#121316]">
                      {rsvp.dietaryRestrictions || "—"}
                    </td>
                    <td className="py-4 text-xs text-[#5C626C]">
                      {rsvp.songSuggestion ? (
                        <span className="flex items-center gap-1">
                          <Music className="w-3.5 h-3.5 text-[#121316]" />
                          {rsvp.songSuggestion}
                        </span>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="py-4 text-xs text-[#121316] max-w-xs truncate font-serif italic">
                      {rsvp.loveNote || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}
