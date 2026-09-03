"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateWeddingConfig(formData: FormData) {
  try {
    const brideName = (formData.get("brideName") as string) || "Ophélie";
    const groomName = (formData.get("groomName") as string) || "Anthony";
    const weddingDateRaw = formData.get("weddingDate") as string;
    const venueName = (formData.get("venueName") as string) || "Domaine des Vignes Blanches";
    const venueCity = (formData.get("venueCity") as string) || "Provence, France";
    const venueAddress = (formData.get("venueAddress") as string) || "Route du Château, 84000 Provence";

    // Textes Chapitres
    const invitationSubtitle = (formData.get("invitationSubtitle") as string) || "Mariage Civil & Célébration";
    const invitationText = (formData.get("invitationText") as string) || "";
    const countdownTitle = (formData.get("countdownTitle") as string) || "Le Décompte";
    const countdownText = (formData.get("countdownText") as string) || "";
    const programmeTitle = (formData.get("programmeTitle") as string) || "Le Programme de la Journée";
    const programmeText = (formData.get("programmeText") as string) || "";
    const programmeSchedule = (formData.get("programmeSchedule") as string) || "";
    const rsvpTitle = (formData.get("rsvpTitle") as string) || "Confirmer Votre Présence";
    const rsvpText = (formData.get("rsvpText") as string) || "";
    const rsvpDeadline = (formData.get("rsvpDeadline") as string) || "1er Mai 2027";

    // Dress Code
    const dressCodeTitle = (formData.get("dressCodeTitle") as string) || "Chic Contemporain & Épuré";
    const dressCodeDesc = (formData.get("dressCodeDesc") as string) || "";
    const dressCodeColors = (formData.get("dressCodeColors") as string) || "";
    const dressCodeAdvice = (formData.get("dressCodeAdvice") as string) || "";

    await prisma.weddingConfig.upsert({
      where: { id: "default" },
      update: {
        brideName,
        groomName,
        weddingDate: weddingDateRaw ? new Date(weddingDateRaw) : undefined,
        venueName,
        venueCity,
        venueAddress,
        invitationSubtitle,
        invitationText,
        countdownTitle,
        countdownText,
        programmeTitle,
        programmeText,
        programmeSchedule: programmeSchedule || undefined,
        rsvpTitle,
        rsvpText,
        rsvpDeadline,
        dressCodeTitle,
        dressCodeDesc,
        dressCodeColors,
        dressCodeAdvice,
      },
      create: {
        id: "default",
        brideName,
        groomName,
        weddingDate: weddingDateRaw ? new Date(weddingDateRaw) : new Date("2027-06-19T14:30:00.000Z"),
        venueName,
        venueCity,
        venueAddress,
        invitationSubtitle,
        invitationText,
        countdownTitle,
        countdownText,
        programmeTitle,
        programmeText,
        programmeSchedule: programmeSchedule || undefined,
        rsvpTitle,
        rsvpText,
        rsvpDeadline,
        dressCodeTitle,
        dressCodeDesc,
        dressCodeColors,
        dressCodeAdvice,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, message: "Programme et paramètres enregistrés avec succès !" };
  } catch (error) {
    console.error("Erreur mise à jour config:", error);
    return { success: false, message: "Erreur lors de la sauvegarde" };
  }
}
