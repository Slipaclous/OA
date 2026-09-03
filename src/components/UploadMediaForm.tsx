"use client";

import { useActionState, useState } from "react";
import { uploadOptimizedMedia } from "@/app/actions/media";
import { Loader2, UploadCloud, CheckCircle2, AlertCircle } from "lucide-react";

export function UploadMediaForm() {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { success: boolean; message: string } | null, formData: FormData) => {
      return await uploadOptimizedMedia(formData);
    },
    null
  );

  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  return (
    <form action={formAction} className="space-y-5">
      {state?.message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            state.success
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {state.success ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          {state.message}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        {/* Fichier avec pré-visualisation */}
        <div className="md:col-span-5 space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
            Sélectionner la photo
          </label>
          <input
            type="file"
            name="file"
            accept="image/*"
            required
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                setSelectedFileName(e.target.files[0].name);
              }
            }}
            className="deboss-input w-full p-3 rounded-xl text-xs font-sans text-[#121316] file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-[#121316] file:text-white hover:file:bg-[#2C2E35]"
          />
        </div>

        {/* Chapitre / Destination */}
        <div className="md:col-span-3 space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
            Emplacement / Chapitre
          </label>
          <select
            name="chapter"
            defaultValue=""
            className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316] cursor-pointer"
          >
            <option value="">Galerie Complète (Plein Écran)</option>
            <option value="1">Chapitre 01 • L&apos;Invitation (Volet)</option>
            <option value="2">Chapitre 02 • Le Décompte (Volet)</option>
            <option value="3">Chapitre 03 • Le Programme (Volet)</option>
            <option value="4">Chapitre 04 • Cadeaux & Attentions (Volet)</option>
            <option value="5">Chapitre 05 • La Réponse RSVP (Volet)</option>
          </select>
        </div>

        {/* Légende */}
        <div className="md:col-span-4 space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
            Légende ou Titre du cliché (optionnel)
          </label>
          <input
            type="text"
            name="caption"
            placeholder="Ex: Séance au soleil couchant..."
            className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <span className="text-[11px] text-[#949BA5] font-sans">
          ⚡ <strong>Optimisation automatique :</strong> compression WebP, redimensionnement intelligent 2000px & nettoyage des métadonnées lourdes.
        </span>

        <button
          type="submit"
          disabled={isPending}
          className="px-7 py-3.5 rounded-xl bg-[#121316] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#2C2E35] transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 shrink-0"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Compression & Envoi...
            </>
          ) : (
            <>
              <UploadCloud className="w-4 h-4" />
              Uploader la photo
            </>
          )}
        </button>
      </div>
    </form>
  );
}
