"use client";

import { useActionState, useState } from "react";
import { updateWeddingConfig } from "@/app/actions/config";
import { Loader2, Palette, CheckCircle2, Plus, Trash2 } from "lucide-react";

interface ColorItem {
  name: string;
  hex: string;
}

interface ConfigFormProps {
  initialConfig: {
    dressCodeTitle: string;
    dressCodeDesc: string;
    dressCodeColors: string;
    dressCodeAdvice: string;
    brideName: string;
    groomName: string;
    weddingDate: string;
    venueName: string;
    venueCity: string;
  };
}

export function WeddingConfigForm({ initialConfig }: ConfigFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { success: boolean; message: string } | null, formData: FormData) => {
      return await updateWeddingConfig(formData);
    },
    null
  );

  // Parsing initial des couleurs existantes
  const parseInitialColors = (): ColorItem[] => {
    if (!initialConfig.dressCodeColors) return [];
    return initialConfig.dressCodeColors
      .split(",")
      .map((c) => {
        const [name, hex] = c.split(":");
        return {
          name: name?.trim() || "Couleur",
          hex: hex?.trim() || "#121316",
        };
      })
      .filter((c) => c.name && c.hex);
  };

  const [colors, setColors] = useState<ColorItem[]>(
    parseInitialColors().length > 0
      ? parseInitialColors()
      : [
          { name: "Blanc Pur", hex: "#FFFFFF" },
          { name: "Sable Minéral", hex: "#E9ECEF" },
          { name: "Gris Taupe", hex: "#CED4DA" },
          { name: "Ardoise", hex: "#495057" },
          { name: "Noir Profond", hex: "#121316" },
        ]
  );

  const addColor = () => {
    if (colors.length >= 8) return;
    setColors([...colors, { name: "Nouvelle Nuance", hex: "#A0AAB5" }]);
  };

  const removeColor = (index: number) => {
    setColors(colors.filter((_, i) => i !== index));
  };

  const updateColorName = (index: number, name: string) => {
    const next = [...colors];
    next[index].name = name;
    setColors(next);
  };

  const updateColorHex = (index: number, hex: string) => {
    const next = [...colors];
    next[index].hex = hex;
    setColors(next);
  };

  // Valeur sérialisée envoyée au serveur
  const serializedColors = colors.map((c) => `${c.name}:${c.hex}`).join(",");

  return (
    <form action={formAction} className="space-y-8">
      {state?.message && (
        <div
          className={`p-4 rounded-xl text-xs flex items-center gap-2 ${
            state.success
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {state.success && <CheckCircle2 className="w-4 h-4" />}
          {state.message}
        </div>
      )}

      {/* SÉLECTEUR VISUEL DE DRESS CODE */}
      <div className="space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <div className="flex items-center gap-2">
            <Palette className="w-4 h-4 text-[#121316]" />
            <h3 className="font-serif text-xl text-[#121316]">
              Palette & Dress Code Interactif
            </h3>
          </div>
          <button
            type="button"
            onClick={addColor}
            disabled={colors.length >= 8}
            className="px-3.5 py-1.5 rounded-xl convex-btn text-xs font-semibold font-sans text-[#121316] flex items-center gap-1.5 cursor-pointer disabled:opacity-40"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter une couleur
          </button>
        </div>

        {/* Titre */}
        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
            Titre de la recommandation
          </label>
          <input
            type="text"
            name="dressCodeTitle"
            defaultValue={initialConfig.dressCodeTitle}
            placeholder="Ex: Chic Contemporain & Épuré"
            className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
          />
        </div>

        {/* Nuancier Visuel Interactif */}
        <div className="space-y-3">
          <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold block">
            Nuancier des Invités ({colors.length} couleur{colors.length > 1 ? "s" : ""})
          </label>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {colors.map((color, index) => (
              <div
                key={index}
                className="p-3 rounded-2xl emboss-card border border-white flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Sélecteur de couleur HTML5 natif stylisé */}
                  <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-inner border border-black/10 cursor-pointer group">
                    <input
                      type="color"
                      value={color.hex}
                      onChange={(e) => updateColorHex(index, e.target.value)}
                      className="absolute -top-3 -left-3 w-16 h-16 cursor-pointer border-0 p-0"
                    />
                  </div>

                  {/* Nom de la couleur */}
                  <div className="min-w-0">
                    <input
                      type="text"
                      value={color.name}
                      onChange={(e) => updateColorName(index, e.target.value)}
                      className="deboss-input px-2.5 py-1 rounded-lg text-xs font-sans font-medium text-[#121316] w-full"
                      placeholder="Nom de nuance"
                    />
                    <span className="text-[10px] text-[#949BA5] uppercase font-mono tracking-wider block mt-0.5 px-0.5">
                      {color.hex.toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Suppression */}
                {colors.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="p-1.5 rounded-lg text-[#949BA5] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                    title="Supprimer cette couleur"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Champ caché contenant la valeur sérialisée */}
          <input type="hidden" name="dressCodeColors" value={serializedColors} />
        </div>

        {/* Description & Conseils */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
              Description & Esprit du style
            </label>
            <textarea
              name="dressCodeDesc"
              rows={3}
              defaultValue={initialConfig.dressCodeDesc}
              className="deboss-input w-full p-3 rounded-xl text-xs font-sans text-[#121316] resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
              Conseil pratique (chaussures, pelouse, météo...)
            </label>
            <textarea
              name="dressCodeAdvice"
              rows={3}
              defaultValue={initialConfig.dressCodeAdvice}
              className="deboss-input w-full p-3 rounded-xl text-xs font-sans text-[#121316] resize-none"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-7 py-3.5 rounded-2xl convex-dark-btn text-white text-xs uppercase tracking-wider font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Enregistrement...
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </button>
      </div>
    </form>
  );
}
