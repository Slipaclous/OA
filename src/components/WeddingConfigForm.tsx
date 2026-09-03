"use client";

import { useActionState, useState } from "react";
import { updateWeddingConfig } from "@/app/actions/config";
import {
  Loader2,
  Palette,
  CheckCircle2,
  Plus,
  Trash2,
  FileText,
  Calendar,
  Clock,
  MapPin,
  ListOrdered,
} from "lucide-react";

interface ColorItem {
  name: string;
  hex: string;
}

interface TimelineItem {
  time: string;
  title: string;
  location: string;
  desc: string;
}

interface WeddingConfigData {
  brideName: string;
  groomName: string;
  weddingDate: string;
  venueName: string;
  venueCity: string;
  venueAddress: string;
  invitationSubtitle: string;
  invitationText: string;
  countdownTitle: string;
  countdownText: string;
  programmeTitle: string;
  programmeText: string;
  programmeSchedule?: string;
  rsvpTitle: string;
  rsvpText: string;
  rsvpDeadline: string;
  dressCodeTitle: string;
  dressCodeDesc: string;
  dressCodeColors: string;
  dressCodeAdvice: string;
}

interface ConfigFormProps {
  initialConfig: WeddingConfigData;
}

const defaultSchedule: TimelineItem[] = [
  {
    time: "14:30",
    title: "La Cérémonie Laïque",
    location: "L'Oliveraie du Domaine",
    desc: "Échange des vœux sous les arbres centenaires. Accueil dès 14h00.",
  },
  {
    time: "17:00",
    title: "Le Cocktail",
    location: "La Cour d'Honneur",
    desc: "Rafraîchissements, mets fins et séance photo avec les mariés.",
  },
  {
    time: "20:00",
    title: "Le Dîner",
    location: "La Grande Verrière",
    desc: "Dîner de fête, discours chaleureux et ouverture du bal.",
  },
  {
    time: "23:30",
    title: "La Soirée Dansante",
    location: "Le Salon Festif",
    desc: "DJ set et célébration jusqu'au bout de la nuit.",
  },
];

export function WeddingConfigForm({ initialConfig }: ConfigFormProps) {
  const [state, formAction, isPending] = useActionState(
    async (_prev: { success: boolean; message: string } | null, formData: FormData) => {
      return await updateWeddingConfig(formData);
    },
    null
  );

  const [activeSubTab, setActiveSubTab] = useState<
    "texts" | "programme" | "general" | "dresscode"
  >("programme");

  // Parsing des étapes du programme
  const parseSchedule = (): TimelineItem[] => {
    if (!initialConfig.programmeSchedule) return defaultSchedule;
    try {
      const parsed = JSON.parse(initialConfig.programmeSchedule);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
    return defaultSchedule;
  };

  const [schedule, setSchedule] = useState<TimelineItem[]>(parseSchedule());

  const addScheduleStep = () => {
    setSchedule([
      ...schedule,
      {
        time: "18:00",
        title: "Nouvelle Étape",
        location: "Domaine des Vignes Blanches",
        desc: "Détail du moment partagé avec les convives.",
      },
    ]);
  };

  const removeScheduleStep = (index: number) => {
    setSchedule(schedule.filter((_, i) => i !== index));
  };

  const updateScheduleStep = (
    index: number,
    field: keyof TimelineItem,
    value: string
  ) => {
    const next = [...schedule];
    next[index] = { ...next[index], [field]: value };
    setSchedule(next);
  };

  // Parsing des couleurs existantes
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
    setColors([...colors, { name: "Nouvelle Nuance", hex: "#8A94A0" }]);
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

  const serializedColors = colors.map((c) => `${c.name}:${c.hex}`).join(",");
  const serializedSchedule = JSON.stringify(schedule);

  return (
    <form action={formAction} className="space-y-8">
      {state?.message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2.5 ${
            state.success
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-red-50 text-red-800 border border-red-200"
          }`}
        >
          {state.success && <CheckCircle2 className="w-4 h-4 shrink-0" />}
          {state.message}
        </div>
      )}

      {/* SOUS-NAVIGATION DES PARAMÈTRES */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 rounded-2xl deboss-input w-fit max-w-full">
        <button
          type="button"
          onClick={() => setActiveSubTab("programme")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "programme"
              ? "bg-[#121316] text-white"
              : "text-[#5C626C] hover:text-[#121316]"
          }`}
        >
          <Clock className="w-3.5 h-3.5" />
          Programme ({schedule.length} étapes)
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("texts")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "texts"
              ? "bg-[#121316] text-white"
              : "text-[#5C626C] hover:text-[#121316]"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          Textes des Chapitres
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("general")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "general"
              ? "bg-[#121316] text-white"
              : "text-[#5C626C] hover:text-[#121316]"
          }`}
        >
          <Calendar className="w-3.5 h-3.5" />
          Mariés, Date & Lieu
        </button>

        <button
          type="button"
          onClick={() => setActiveSubTab("dresscode")}
          className={`px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all flex items-center gap-1.5 ${
            activeSubTab === "dresscode"
              ? "bg-[#121316] text-white"
              : "text-[#5C626C] hover:text-[#121316]"
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Palette Dress Code
        </button>
      </div>

      {/* ========================================================
          1. ÉDITION DU PROGRAMME (HEURES, TITRES, LIEUX, DESCRIPTIONS)
         ======================================================== */}
      <div className={`space-y-6 ${activeSubTab === "programme" ? "block" : "hidden"}`}>
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <div>
            <h4 className="font-serif text-xl text-[#121316] flex items-center gap-2">
              <ListOrdered className="w-4 h-4" />
              Déroulé Chronologique de la Journée
            </h4>
            <p className="font-sans text-xs text-[#5C626C] mt-0.5">
              Modifiez les horaires, intitulés, lieux spécifiques et descriptions de chaque étape.
            </p>
          </div>
          <button
            type="button"
            onClick={addScheduleStep}
            className="px-3.5 py-1.5 rounded-xl convex-btn text-xs font-semibold font-sans text-[#121316] flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Ajouter une étape
          </button>
        </div>

        <div className="space-y-4">
          {schedule.map((step, idx) => (
            <div
              key={idx}
              className="p-5 sm:p-6 rounded-2xl emboss-card border border-white space-y-4 relative group"
            >
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#121316] flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#121316] text-white flex items-center justify-center text-[10px]">
                    0{idx + 1}
                  </span>
                  Étape {idx + 1}
                </span>

                {schedule.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeScheduleStep(idx)}
                    className="p-1.5 rounded-lg text-[#949BA5] hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer flex items-center gap-1 text-xs"
                    title="Supprimer cette étape"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Supprimer
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                {/* Heure */}
                <div className="sm:col-span-3 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#5C626C] font-semibold flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Horaire
                  </label>
                  <input
                    type="text"
                    value={step.time}
                    onChange={(e) => updateScheduleStep(idx, "time", e.target.value)}
                    placeholder="14:30"
                    className="deboss-input w-full p-2.5 rounded-xl text-xs font-serif text-lg text-[#121316]"
                  />
                </div>

                {/* Titre */}
                <div className="sm:col-span-5 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#5C626C] font-semibold">
                    Titre de l&apos;Étape
                  </label>
                  <input
                    type="text"
                    value={step.title}
                    onChange={(e) => updateScheduleStep(idx, "title", e.target.value)}
                    placeholder="Ex: La Cérémonie Laïque"
                    className="deboss-input w-full p-2.5 rounded-xl text-xs font-sans font-medium text-[#121316]"
                  />
                </div>

                {/* Lieu */}
                <div className="sm:col-span-4 space-y-1">
                  <label className="text-[11px] uppercase tracking-wider text-[#5C626C] font-semibold flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Lieu précis
                  </label>
                  <input
                    type="text"
                    value={step.location}
                    onChange={(e) => updateScheduleStep(idx, "location", e.target.value)}
                    placeholder="Ex: L'Oliveraie"
                    className="deboss-input w-full p-2.5 rounded-xl text-xs font-sans text-[#121316]"
                  />
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1">
                <label className="text-[11px] uppercase tracking-wider text-[#5C626C] font-semibold">
                  Précisions & Déroulé
                </label>
                <input
                  type="text"
                  value={step.desc}
                  onChange={(e) => updateScheduleStep(idx, "desc", e.target.value)}
                  placeholder="Échange des vœux, rafraîchissements..."
                  className="deboss-input w-full p-2.5 rounded-xl text-xs font-sans text-[#121316]"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Champ JSON sérialisé */}
        <input type="hidden" name="programmeSchedule" value={serializedSchedule} />
      </div>

      {/* ========================================================
          2. ÉDITION DES TEXTES DES CHAPITRES
         ======================================================== */}
      <div className={`space-y-6 ${activeSubTab === "texts" ? "block" : "hidden"}`}>
        {/* Chapitre 01 : Invitation */}
        <div className="p-6 rounded-2xl emboss-card border border-white space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-black/[0.06]">
            <span className="text-xs uppercase tracking-wider text-[#949BA5] font-semibold">
              Chapitre 01
            </span>
            <h4 className="font-serif text-lg text-[#121316]">
              L&apos;Invitation & Message d&apos;accueil
            </h4>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
              Sous-titre / En-tête
            </label>
            <input
              type="text"
              name="invitationSubtitle"
              defaultValue={initialConfig.invitationSubtitle}
              className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
              Texte d&apos;invitation principal
            </label>
            <textarea
              name="invitationText"
              rows={3}
              defaultValue={initialConfig.invitationText}
              className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316] resize-none"
            />
          </div>
        </div>

        {/* Chapitre 02 : Décompte */}
        <div className="p-6 rounded-2xl emboss-card border border-white space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-black/[0.06]">
            <span className="text-xs uppercase tracking-wider text-[#949BA5] font-semibold">
              Chapitre 02
            </span>
            <h4 className="font-serif text-lg text-[#121316]">
              Le Décompte
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Titre
              </label>
              <input
                type="text"
                name="countdownTitle"
                defaultValue={initialConfig.countdownTitle}
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Phrase d&apos;introduction
              </label>
              <input
                type="text"
                name="countdownText"
                defaultValue={initialConfig.countdownText}
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>
          </div>
        </div>

        {/* Chapitre 03 : Programme (Titres) */}
        <div className="p-6 rounded-2xl emboss-card border border-white space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-black/[0.06]">
            <span className="text-xs uppercase tracking-wider text-[#949BA5] font-semibold">
              Chapitre 03
            </span>
            <h4 className="font-serif text-lg text-[#121316]">
              Titre du Chapitre Programme
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Titre
              </label>
              <input
                type="text"
                name="programmeTitle"
                defaultValue={initialConfig.programmeTitle}
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Sous-titre
              </label>
              <input
                type="text"
                name="programmeText"
                defaultValue={initialConfig.programmeText}
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>
          </div>
        </div>

        {/* Chapitre 04 : RSVP */}
        <div className="p-6 rounded-2xl emboss-card border border-white space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-black/[0.06]">
            <span className="text-xs uppercase tracking-wider text-[#949BA5] font-semibold">
              Chapitre 04
            </span>
            <h4 className="font-serif text-lg text-[#121316]">
              Formulaire de Réponse (RSVP)
            </h4>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Titre de la section
              </label>
              <input
                type="text"
                name="rsvpTitle"
                defaultValue={initialConfig.rsvpTitle}
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Date limite de réponse souhaitée
              </label>
              <input
                type="text"
                name="rsvpDeadline"
                defaultValue={initialConfig.rsvpDeadline}
                placeholder="Ex: 1er Mai 2027"
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
              Message explicatif aux invités
            </label>
            <textarea
              name="rsvpText"
              rows={2}
              defaultValue={initialConfig.rsvpText}
              className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316] resize-none"
            />
          </div>
        </div>
      </div>

      {/* ========================================================
          3. ÉDITION INFORMATIONS GÉNÉRALES & MARIÉS
         ======================================================== */}
      <div className={`space-y-6 ${activeSubTab === "general" ? "block" : "hidden"}`}>
        <div className="p-6 rounded-2xl emboss-card border border-white space-y-4">
          <h4 className="font-serif text-lg text-[#121316] pb-2 border-b border-black/[0.06]">
            Prénoms des Mariés
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Prénom de la mariée
              </label>
              <input
                type="text"
                name="brideName"
                defaultValue={initialConfig.brideName}
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Prénom du marié
              </label>
              <input
                type="text"
                name="groomName"
                defaultValue={initialConfig.groomName}
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>
          </div>
        </div>

        <div className="p-6 rounded-2xl emboss-card border border-white space-y-4">
          <h4 className="font-serif text-lg text-[#121316] pb-2 border-b border-black/[0.06]">
            Date & Lieu de la Réception
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Date & Heure du Mariage
              </label>
              <input
                type="datetime-local"
                name="weddingDate"
                defaultValue={initialConfig.weddingDate}
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Nom du Domaine / Lieu
              </label>
              <input
                type="text"
                name="venueName"
                defaultValue={initialConfig.venueName}
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Ville / Région
              </label>
              <input
                type="text"
                name="venueCity"
                defaultValue={initialConfig.venueCity}
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
                Adresse exacte (pour GPS)
              </label>
              <input
                type="text"
                name="venueAddress"
                defaultValue={initialConfig.venueAddress}
                className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================
          4. ÉDITION DRESS CODE
         ======================================================== */}
      <div className={`space-y-6 ${activeSubTab === "dresscode" ? "block" : "hidden"}`}>
        <div className="flex items-center justify-between pb-3 border-b border-black/[0.06]">
          <div>
            <h4 className="font-serif text-xl text-[#121316]">
              Palette Visuelle & Nuances Suggérées
            </h4>
            <p className="font-sans text-xs text-[#5C626C] mt-0.5">
              Sélectionnez les couleurs à la souris ou saisissez leur code HEX.
            </p>
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

        <div className="space-y-1.5">
          <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
            Titre de la recommandation
          </label>
          <input
            type="text"
            name="dressCodeTitle"
            defaultValue={initialConfig.dressCodeTitle}
            className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316]"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {colors.map((color, index) => (
            <div
              key={index}
              className="p-3 rounded-2xl emboss-card border border-white flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="relative w-10 h-10 rounded-xl overflow-hidden shrink-0 shadow-inner border border-black/10 cursor-pointer">
                  <input
                    type="color"
                    value={color.hex}
                    onChange={(e) => updateColorHex(index, e.target.value)}
                    className="absolute -top-3 -left-3 w-16 h-16 cursor-pointer border-0 p-0"
                  />
                </div>
                <div className="min-w-0">
                  <input
                    type="text"
                    value={color.name}
                    onChange={(e) => updateColorName(index, e.target.value)}
                    className="deboss-input px-2.5 py-1 rounded-lg text-xs font-sans font-medium text-[#121316] w-full"
                    placeholder="Nom"
                  />
                  <span className="text-[10px] text-[#949BA5] uppercase font-mono tracking-wider block mt-0.5 px-0.5">
                    {color.hex.toUpperCase()}
                  </span>
                </div>
              </div>

              {colors.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeColor(index)}
                  className="p-1.5 rounded-lg text-[#949BA5] hover:text-red-600 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>

        <input type="hidden" name="dressCodeColors" value={serializedColors} />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
              Description du style
            </label>
            <textarea
              name="dressCodeDesc"
              rows={3}
              defaultValue={initialConfig.dressCodeDesc}
              className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316] resize-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs uppercase tracking-wider text-[#5C626C] font-semibold">
              Conseil pratique (chaussures, pelouse...)
            </label>
            <textarea
              name="dressCodeAdvice"
              rows={3}
              defaultValue={initialConfig.dressCodeAdvice}
              className="deboss-input w-full p-3.5 rounded-xl text-xs font-sans text-[#121316] resize-none"
            />
          </div>
        </div>
      </div>

      {/* BOUTON DE SAUVEGARDE UNIVERSEL */}
      <div className="flex items-center justify-between pt-4 border-t border-black/[0.06]">
        <span className="text-xs text-[#949BA5] font-sans">
          Les modifications sont appliquées instantanément sur le site public.
        </span>

        <button
          type="submit"
          disabled={isPending}
          className="px-8 py-3.5 rounded-2xl convex-dark-btn text-white text-xs uppercase tracking-wider font-semibold cursor-pointer disabled:opacity-50 flex items-center gap-2"
        >
          {isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Sauvegarde en cours...
            </>
          ) : (
            "Enregistrer les modifications"
          )}
        </button>
      </div>
    </form>
  );
}
