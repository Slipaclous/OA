"use server";

import { put, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import sharp from "sharp";

export async function uploadOptimizedMedia(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    const caption = (formData.get("caption") as string) || "";
    const chapterRaw = formData.get("chapter");
    const chapter = chapterRaw !== null && chapterRaw !== "" ? Number(chapterRaw) : null;
    const section = (formData.get("section") as "HERO" | "LOOKBOOK" | "COUNTDOWN" | "TIMELINE") || "LOOKBOOK";

    if (!file || file.size === 0) {
      return { success: false, message: "Veuillez sélectionner une image." };
    }

    // 1. Lire le buffer original
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 2. Traitement d'optimisation haute performance avec Sharp :
    // - Redimensionnement maximal à 2000px de large (parfait pour écrans Retina 4K sans excès de poids)
    // - Conversion en WebP moderne avec compression intelligente (qualité 82%)
    // - Suppression des métadonnées lourdes (EXIF inutiles)
    const optimizedBuffer = await sharp(buffer)
      .resize({
        width: 2000,
        height: 2000,
        fit: "inside",
        withoutEnlargement: true,
      })
      .webp({ quality: 82, effort: 4 })
      .toBuffer();

    const metadata = await sharp(optimizedBuffer).metadata();

    const cleanFilename = file.name
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9_-]/g, "_");
    const filename = `photos/${Date.now()}-${cleanFilename}.webp`;

    // 3. Upload optimisé sur Vercel Blob
    const blob = await put(filename, optimizedBuffer, {
      access: "public",
      contentType: "image/webp",
    });

    // 4. Enregistrement en base de données Neon
    await prisma.media.create({
      data: {
        url: blob.url,
        caption: caption || null,
        section: section,
        chapter: chapter,
        width: metadata.width || null,
        height: metadata.height || null,
        sizeBytes: optimizedBuffer.length,
      },
    });

    revalidatePath("/admin");
    revalidatePath("/");

    const savedKb = Math.round((file.size - optimizedBuffer.length) / 1024);
    const finalKb = Math.round(optimizedBuffer.length / 1024);

    return {
      success: true,
      message: `Photo optimisée et enregistrée (${finalKb} Ko au lieu de ${Math.round(
        file.size / 1024
      )} Ko, gain: -${savedKb} Ko).`,
    };
  } catch (error) {
    console.error("Erreur lors de l'optimisation et de l'upload:", error);
    return {
      success: false,
      message: "Une erreur est survenue lors de l'optimisation ou de l'envoi de la photo.",
    };
  }
}

export async function deleteMedia(id: string) {
  try {
    const media = await prisma.media.findUnique({ where: { id } });
    if (!media) return { success: false, message: "Photo introuvable" };

    // Suppression sur Vercel Blob
    if (media.url.includes("blob.vercel-storage.com")) {
      try {
        await del(media.url);
      } catch (e) {
        console.warn("Erreur suppression blob distant:", e);
      }
    }

    // Suppression en DB
    await prisma.media.delete({ where: { id } });

    revalidatePath("/admin");
    revalidatePath("/");

    return { success: true, message: "Photo supprimée" };
  } catch (error) {
    console.error("Erreur suppression:", error);
    return { success: false, message: "Échec de la suppression" };
  }
}
