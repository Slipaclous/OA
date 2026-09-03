"use server";

import { prisma } from "@/lib/prisma";
import { rsvpSchema } from "@/lib/validations";
import { revalidatePath } from "next/cache";

export type ActionResponse = {
  success: boolean;
  message: string;
  errors?: Record<string, string[]>;
};

export async function submitRsvp(
  prevState: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const rawEvents = formData.getAll("events").map(String);
    const rawData = {
      fullName: formData.get("fullName"),
      email: formData.get("email") || undefined,
      status: formData.get("status"),
      guestsCount: Number(formData.get("guestsCount") || 1),
      events: rawEvents.length > 0 ? rawEvents : ["ceremony", "cocktail", "dinner"],
      dietaryRestrictions: formData.get("dietaryRestrictions") || undefined,
      songSuggestion: formData.get("songSuggestion") || undefined,
      loveNote: formData.get("loveNote") || undefined,
    };

    const parsed = rsvpSchema.safeParse(rawData);

    if (!parsed.success) {
      return {
        success: false,
        message: "Veuillez vérifier les informations renseignées.",
        errors: parsed.error.flatten().fieldErrors,
      };
    }

    await prisma.rsvp.create({
      data: {
        fullName: parsed.data.fullName,
        email: parsed.data.email || null,
        status: parsed.data.status,
        guestsCount: parsed.data.status === "YES" ? parsed.data.guestsCount : 0,
        events: parsed.data.status === "YES" ? parsed.data.events : [],
        dietaryRestrictions: parsed.data.dietaryRestrictions || null,
        songSuggestion: parsed.data.songSuggestion || null,
        loveNote: parsed.data.loveNote || null,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return {
      success: true,
      message:
        parsed.data.status === "YES"
          ? "Votre présence est confirmée avec joie. Nous avons hâte de célébrer ce moment avec vous !"
          : "Votre réponse a bien été enregistrée. Nous regretterons votre absence mais penserons fort à vous.",
    };
  } catch (error) {
    console.error("Erreur enregistrement RSVP:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
    };
  }
}
