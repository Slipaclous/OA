"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function updateWeddingConfig(formData: FormData) {
  try {
    const dressCodeTitle = (formData.get("dressCodeTitle") as string) || "Chic Contemporain & Épuré";
    const dressCodeDesc = (formData.get("dressCodeDesc") as string) || "";
    const dressCodeColors = (formData.get("dressCodeColors") as string) || "";
    const dressCodeAdvice = (formData.get("dressCodeAdvice") as string) || "";
    const brideName = (formData.get("brideName") as string) || "Ophélie";
    const groomName = (formData.get("groomName") as string) || "Anthony";
    const weddingDateRaw = formData.get("weddingDate") as string;
    const venueName = (formData.get("venueName") as string) || "Domaine des Vignes Blanches";
    const venueCity = (formData.get("venueCity") as string) || "Provence, France";

    await prisma.weddingConfig.upsert({
      where: { id: "default" },
      update: {
        dressCodeTitle,
        dressCodeDesc,
        dressCodeColors,
        dressCodeAdvice,
        brideName,
        groomName,
        weddingDate: weddingDateRaw ? new Date(weddingDateRaw) : undefined,
        venueName,
        venueCity,
      },
      create: {
        id: "default",
        dressCodeTitle,
        dressCodeDesc,
        dressCodeColors,
        dressCodeAdvice,
        brideName,
        groomName,
        weddingDate: weddingDateRaw ? new Date(weddingDateRaw) : new Date("2027-06-19T14:30:00.000Z"),
        venueName,
        venueCity,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, message: "Configuration mise à jour avec succès !" };
  } catch (error) {
    console.error("Erreur mise à jour config:", error);
    return { success: false, message: "Erreur lors de la sauvegarde" };
  }
}
