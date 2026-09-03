"use client";

import { useActionState, useState } from "react";
import { submitRsvp, ActionResponse } from "@/app/actions/rsvp";
import { Check, Heart, Loader2 } from "lucide-react";

const initialState: ActionResponse | null = null;

export function RsvpForm() {
  const [state, formAction, isPending] = useActionState(submitRsvp, initialState);
  const [attendance, setAttendance] = useState<"YES" | "NO">("YES");
  const [guestsCount, setGuestsCount] = useState<number>(1);

  return (
    <section id="rsvp" className="relative py-24 px-6 md:px-12 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#5C626C]">
          Confirmation
        </span>
        <h2 className="font-serif text-3xl md:text-5xl tracking-tight text-[#121316] mt-3 font-normal">
          Confirmer Votre Présence
        </h2>
        <p className="font-sans text-sm md:text-base text-[#5C626C] mt-2 max-w-xl mx-auto">
          Merci de nous transmettre votre réponse avant le 1er Mai 2027 pour nous aider dans l&apos;organisation.
        </p>
      </div>

      {state?.success ? (
        <div className="emboss-card rounded-2xl p-10 md:p-14 text-center border border-white">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#121316] text-[#FFFFFF] flex items-center justify-center mb-5 shadow-sm">
            <Heart className="w-6 h-6 stroke-[1.5]" />
          </div>
          <h3 className="font-serif text-2xl md:text-3xl text-[#121316]">
            Réponse bien reçue !
          </h3>
          <p className="mt-3 text-[#5C626C] font-sans text-sm md:text-base leading-relaxed max-w-md mx-auto">
            {state.message}
          </p>
        </div>
      ) : (
        <form
          action={formAction}
          className="emboss-card rounded-2xl p-8 md:p-12 border border-white space-y-7"
        >
          {state?.message && !state.success && (
            <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm text-center">
              {state.message}
            </div>
          )}

          {/* Choix Présence Neumorphique Épuré */}
          <div className="space-y-3">
            <label className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5C626C]">
              Serez-vous présents ?
            </label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setAttendance("YES")}
                className={`py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  attendance === "YES"
                    ? "bg-[#121316] text-[#FFFFFF] shadow-sm"
                    : "deboss-input text-[#5C626C] hover:text-[#121316]"
                }`}
              >
                {attendance === "YES" && <Check className="w-4 h-4" />}
                Avec plaisir
              </button>
              <button
                type="button"
                onClick={() => setAttendance("NO")}
                className={`py-4 px-6 rounded-xl text-sm font-semibold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer ${
                  attendance === "NO"
                    ? "bg-[#121316] text-[#FFFFFF] shadow-sm"
                    : "deboss-input text-[#5C626C] hover:text-[#121316]"
                }`}
              >
                {attendance === "NO" && <Check className="w-4 h-4" />}
                Malheureusement non
              </button>
            </div>
            <input type="hidden" name="status" value={attendance} />
          </div>

          {/* Nom & Prénom */}
          <div className="space-y-2">
            <label
              htmlFor="fullName"
              className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5C626C]"
            >
              Vos Nom & Prénom *
            </label>
            <input
              id="fullName"
              name="fullName"
              type="text"
              required
              placeholder="Ex: Camille & Thomas Mercier"
              className="deboss-input w-full px-5 py-3.5 rounded-xl text-[#121316] placeholder:text-[#949BA5] text-sm font-sans"
            />
            {state?.errors?.fullName && (
              <p className="text-xs text-red-600">
                {state.errors.fullName[0]}
              </p>
            )}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5C626C]"
            >
              Adresse Email (pour vous transmettre les infos)
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="exemple@email.com"
              className="deboss-input w-full px-5 py-3.5 rounded-xl text-[#121316] placeholder:text-[#949BA5] text-sm font-sans"
            />
            {state?.errors?.email && (
              <p className="text-xs text-red-600">{state.errors.email[0]}</p>
            )}
          </div>

          {attendance === "YES" && (
            <>
              {/* Nombre de personnes */}
              <div className="space-y-2">
                <label className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5C626C]">
                  Nombre de personnes
                </label>
                <div className="flex items-center gap-3">
                  {[1, 2, 3, 4].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setGuestsCount(num)}
                      className={`w-12 h-12 rounded-xl text-sm font-semibold transition-all duration-150 cursor-pointer ${
                        guestsCount === num
                          ? "bg-[#121316] text-[#FFFFFF] shadow-sm"
                          : "deboss-input text-[#5C626C] hover:text-[#121316]"
                      }`}
                    >
                      {num}
                    </button>
                  ))}
                  <input
                    type="hidden"
                    name="guestsCount"
                    value={guestsCount}
                  />
                </div>
              </div>

              {/* Événements */}
              <div className="space-y-3">
                <label className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5C626C]">
                  Présence aux moments clés
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    { id: "ceremony", label: "Cérémonie Laïque" },
                    { id: "cocktail", label: "Cocktail & Dîner" },
                    { id: "brunch", label: "Brunch du Dimanche" },
                  ].map((evt) => (
                    <label
                      key={evt.id}
                      className="deboss-input flex items-center gap-3 p-4 rounded-xl cursor-pointer hover:border-black/20"
                    >
                      <input
                        type="checkbox"
                        name="events"
                        value={evt.id}
                        defaultChecked
                        className="accent-[#121316] w-4 h-4 rounded"
                      />
                      <span className="text-xs font-sans text-[#121316] font-medium">
                        {evt.label}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Régimes et allergies */}
              <div className="space-y-2">
                <label
                  htmlFor="dietaryRestrictions"
                  className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5C626C]"
                >
                  Régimes particuliers ou allergies
                </label>
                <input
                  id="dietaryRestrictions"
                  name="dietaryRestrictions"
                  type="text"
                  placeholder="Végétarien, sans gluten, intolérances..."
                  className="deboss-input w-full px-5 py-3.5 rounded-xl text-[#121316] placeholder:text-[#949BA5] text-sm font-sans"
                />
              </div>

              {/* Chanson DJ */}
              <div className="space-y-2">
                <label
                  htmlFor="songSuggestion"
                  className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5C626C]"
                >
                  Une chanson pour la playlist
                </label>
                <input
                  id="songSuggestion"
                  name="songSuggestion"
                  type="text"
                  placeholder="Artiste - Titre"
                  className="deboss-input w-full px-5 py-3.5 rounded-xl text-[#121316] placeholder:text-[#949BA5] text-sm font-sans"
                />
              </div>
            </>
          )}

          {/* Mot doux */}
          <div className="space-y-2">
            <label
              htmlFor="loveNote"
              className="text-[11px] font-semibold tracking-[0.2em] uppercase text-[#5C626C]"
            >
              Un message pour Anthony & Ophélie
            </label>
            <textarea
              id="loveNote"
              name="loveNote"
              rows={3}
              placeholder="Votre petit mot..."
              className="deboss-input w-full px-5 py-3.5 rounded-xl text-[#121316] placeholder:text-[#949BA5] text-sm font-sans resize-none"
            />
          </div>

          <div className="pt-3 flex justify-center">
            <button
              type="submit"
              disabled={isPending}
              className="px-9 py-4 rounded-xl bg-[#121316] text-[#FFFFFF] font-semibold tracking-wide text-xs uppercase transition-all duration-200 hover:bg-[#2C2E35] hover:shadow-md disabled:opacity-50 flex items-center gap-3 cursor-pointer"
            >
              {isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Envoi en cours...
                </>
              ) : (
                "Envoyer ma réponse"
              )}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
