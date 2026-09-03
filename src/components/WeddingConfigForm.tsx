"use client";

import { useActionState } from "react";
import { updateWeddingConfig } from "@/app/actions/config";
import { Loader2, Palette, CheckCircle2 } from "lucide-react";

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

  return (
    <form action={formAction} className="space-y-6">
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

      {/* Dress Code Fields */}
      <div className="space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-black/[0.06]">
          <Palette className="w-4 h-4 text-[#121316]" />
          <h3 className="font-serif text-lg text-[#121316]">
            Personnalisation du Dress Code
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
              Titre du Dress Code
            </label>
            <input
              type="text"
              name="dressCodeTitle"
              defaultValue={initialConfig.dressCodeTitle}
              className="deboss-input w-full p-3 rounded-xl text-xs font-sans text-[#121316]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
              Couleurs suggérées (Nom:CodeHex séparés par des virgules)
            </label>
            <input
              type="text"
              name="dressCodeColors"
              defaultValue={initialConfig.dressCodeColors}
              placeholder="Blanc:#FFFFFF,Sable:#E9ECEF,Ardoise:#495057"
              className="deboss-input w-full p-3 rounded-xl text-xs font-sans text-[#121316]"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
            Description & Consignes de style
          </label>
          <textarea
            name="dressCodeDesc"
            rows={2}
            defaultValue={initialConfig.dressCodeDesc}
            className="deboss-input w-full p-3 rounded-xl text-xs font-sans text-[#121316] resize-none"
          />
        </div>

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
            Conseil pratique (ex: chaussures, météo...)
          </label>
          <input
            type="text"
            name="dressCodeAdvice"
            defaultValue={initialConfig.dressCodeAdvice}
            className="deboss-input w-full p-3 rounded-xl text-xs font-sans text-[#121316]"
          />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isPending}
          className="px-6 py-3 rounded-xl bg-[#121316] text-white text-xs uppercase tracking-wider font-semibold hover:bg-[#2C2E35] transition-all cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
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
