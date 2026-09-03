import { prisma } from "@/lib/prisma";
import { AdminDashboardClient } from "@/components/AdminDashboardClient";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const rsvps = await prisma.rsvp.findMany({
    orderBy: { createdAt: "desc" },
  });

  const mediaList = await prisma.media.findMany({
    orderBy: [{ chapter: "asc" }, { createdAt: "desc" }],
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
        venueAddress: "Route du Château, 84000 Provence",
        invitationSubtitle: "Mariage Civil & Célébration",
        invitationText:
          "Deux regards complices, des projets partagés et l'envie de sceller notre histoire entourés de ceux qui comptent le plus. Nous serions infiniment touchés de vous compter parmi nous.",
        countdownTitle: "Le Décompte",
        countdownText:
          "Les mois, les jours et les secondes qui nous séparent du moment où nous nous dirons « oui ».",
        programmeTitle: "Le Programme de la Journée",
        programmeText: "Une partition rythmée pour savourer chaque instant ensemble.",
        rsvpTitle: "Confirmer Votre Présence",
        rsvpText:
          "Merci de nous transmettre votre réponse avant le 1er Mai 2027 afin de nous aider dans l'organisation.",
        rsvpDeadline: "1er Mai 2027",
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

  return (
    <AdminDashboardClient
      rsvps={rsvps.map((r) => ({
        id: r.id,
        fullName: r.fullName,
        email: r.email,
        status: r.status,
        guestsCount: r.guestsCount,
        events: r.events,
        dietaryRestrictions: r.dietaryRestrictions,
        songSuggestion: r.songSuggestion,
        loveNote: r.loveNote,
        createdAt: r.createdAt.toISOString(),
      }))}
      mediaList={mediaList.map((m) => ({
        id: m.id,
        url: m.url,
        caption: m.caption,
        chapter: m.chapter,
        sizeBytes: m.sizeBytes,
        createdAt: m.createdAt.toISOString(),
      }))}
      config={{
        brideName: config.brideName,
        groomName: config.groomName,
        weddingDate: config.weddingDate.toISOString().slice(0, 16),
        venueName: config.venueName,
        venueCity: config.venueCity,
        venueAddress: config.venueAddress,
        invitationSubtitle: config.invitationSubtitle,
        invitationText: config.invitationText,
        countdownTitle: config.countdownTitle,
        countdownText: config.countdownText,
        programmeTitle: config.programmeTitle,
        programmeText: config.programmeText,
        rsvpTitle: config.rsvpTitle,
        rsvpText: config.rsvpText,
        rsvpDeadline: config.rsvpDeadline,
        dressCodeTitle: config.dressCodeTitle,
        dressCodeDesc: config.dressCodeDesc,
        dressCodeColors: config.dressCodeColors,
        dressCodeAdvice: config.dressCodeAdvice,
      }}
    />
  );
}
