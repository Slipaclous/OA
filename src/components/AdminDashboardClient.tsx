"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowLeft,
  Users,
  CheckCircle2,
  XCircle,
  Music,
  Image as ImageIcon,
  Heart,
  Settings,
  Trash2,
  Download,
  Search,
  Filter,
  Eye,
  Sliders,
  Sparkles,
  ExternalLink,
} from "lucide-react";
import { UploadMediaForm } from "@/components/UploadMediaForm";
import { WeddingConfigForm } from "@/components/WeddingConfigForm";
import { deleteMedia } from "@/app/actions/media";

interface RsvpItem {
  id: string;
  fullName: string;
  email: string | null;
  status: "YES" | "NO";
  guestsCount: number;
  events: string[];
  dietaryRestrictions: string | null;
  songSuggestion: string | null;
  loveNote: string | null;
  createdAt: string | Date;
}

interface MediaItem {
  id: string;
  url: string;
  caption: string | null;
  chapter: number | null;
  sizeBytes: number | null;
  createdAt: string | Date;
}

interface AdminDashboardClientProps {
  rsvps: RsvpItem[];
  mediaList: MediaItem[];
  config: {
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
    rsvpTitle: string;
    rsvpText: string;
    rsvpDeadline: string;
    dressCodeTitle: string;
    dressCodeDesc: string;
    dressCodeColors: string;
    dressCodeAdvice: string;
  };
}

export function AdminDashboardClient({
  rsvps,
  mediaList,
  config,
}: AdminDashboardClientProps) {
  const [activeTab, setActiveTab] = useState<"rsvps" | "photos" | "settings">("rsvps");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | "YES" | "NO">("ALL");

  const confirmedRsvps = rsvps.filter((r) => r.status === "YES");
  const declinedRsvps = rsvps.filter((r) => r.status === "NO");
  const totalGuests = confirmedRsvps.reduce((acc, r) => acc + r.guestsCount, 0);

  // Filtrage intelligent de la table RSVP
  const filteredRsvps = rsvps.filter((r) => {
    const matchesSearch =
      r.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.email && r.email.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.dietaryRestrictions &&
        r.dietaryRestrictions.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (r.songSuggestion &&
        r.songSuggestion.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === "ALL" || r.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  // Export CSV instantané pour le traiteur / wedding planner
  const exportCsv = () => {
    const headers = [
      "Nom Complet",
      "Email",
      "Statut",
      "Nombre Convives",
      "Événements",
      "Régimes & Allergies",
      "Morceau DJ",
      "Message",
      "Date Inscription",
    ];

    const rows = rsvps.map((r) => [
      `"${r.fullName.replace(/"/g, '""')}"`,
      `"${(r.email || "").replace(/"/g, '""')}"`,
      r.status === "YES" ? "Présent" : "Absent",
      r.status === "YES" ? r.guestsCount : 0,
      `"${r.events.join(", ")}"`,
      `"${(r.dietaryRestrictions || "").replace(/"/g, '""')}"`,
      `"${(r.songSuggestion || "").replace(/"/g, '""')}"`,
      `"${(r.loveNote || "").replace(/"/g, '""')}"`,
      new Date(r.createdAt).toLocaleDateString("fr-FR"),
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8,\uFEFF" +
      [headers.join(";"), ...rows.map((row) => row.join(";"))].join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `RSVP_Mariage_Anthony_Ophelie_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="min-h-screen bg-[#F5F6F8] p-4 sm:p-8 md:p-12 max-w-7xl mx-auto space-y-8">
      {/* HEADER ULTRA CHIC & COMPACT */}
      <header className="emboss-card rounded-3xl p-6 md:p-8 border border-white flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Link
              href="/"
              className="px-3 py-1.5 rounded-xl convex-btn text-[11px] font-sans uppercase tracking-wider font-semibold text-[#5C626C] hover:text-[#121316] flex items-center gap-1.5 transition-all"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Retour au site
            </Link>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#949BA5] font-sans font-semibold">
              Live Dashboard
            </span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl text-[#121316]">
            Studio Privé — Anthony & Ophélie
          </h1>
          <p className="font-sans text-xs sm:text-sm text-[#5C626C] mt-1">
            Supervisez les présences en temps réel, exportez pour le traiteur et pilotez la photothèque.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={exportCsv}
            disabled={rsvps.length === 0}
            className="px-5 py-3 rounded-2xl convex-btn text-xs uppercase tracking-wider font-semibold text-[#121316] flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Download className="w-4 h-4 text-[#5C626C]" />
            Exporter CSV Traiteur
          </button>

          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-3 rounded-2xl convex-dark-btn text-white text-xs uppercase tracking-wider font-semibold flex items-center gap-2 cursor-pointer"
          >
            <Eye className="w-4 h-4" />
            Voir le site en direct
          </a>
        </div>
      </header>

      {/* METRIQUES CONVEXES DOCK */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Invités */}
        <div className="emboss-card rounded-3xl p-6 border border-white flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5C626C]">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Total Convives
            </span>
            <div className="w-10 h-10 rounded-2xl convex-pill flex items-center justify-center">
              <Users className="w-5 h-5 text-[#121316]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-serif text-4xl sm:text-5xl text-[#121316] font-light">
              {totalGuests}
            </span>
            <span className="block text-xs text-[#5C626C] mt-1">
              Personnes à table pour le traiteur
            </span>
          </div>
        </div>

        {/* Confirmations */}
        <div className="emboss-card rounded-3xl p-6 border border-white flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5C626C]">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Confirmés
            </span>
            <div className="w-10 h-10 rounded-2xl convex-pill flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-serif text-4xl sm:text-5xl text-[#121316] font-light">
              {confirmedRsvps.length}
            </span>
            <span className="block text-xs text-emerald-700 mt-1 font-medium">
              {rsvps.length > 0
                ? `${Math.round((confirmedRsvps.length / rsvps.length) * 100)}% de taux d'acceptation`
                : "En attente"}
            </span>
          </div>
        </div>

        {/* Désistements */}
        <div className="emboss-card rounded-3xl p-6 border border-white flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5C626C]">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Absents
            </span>
            <div className="w-10 h-10 rounded-2xl convex-pill flex items-center justify-center">
              <XCircle className="w-5 h-5 text-neutral-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-serif text-4xl sm:text-5xl text-[#121316] font-light">
              {declinedRsvps.length}
            </span>
            <span className="block text-xs text-[#949BA5] mt-1">
              Réponses négatives reçues
            </span>
          </div>
        </div>

        {/* Total Réponses */}
        <div className="emboss-card rounded-3xl p-6 border border-white flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#5C626C]">
            <span className="text-xs uppercase tracking-wider font-semibold">
              Photothèque
            </span>
            <div className="w-10 h-10 rounded-2xl convex-pill flex items-center justify-center">
              <ImageIcon className="w-5 h-5 text-[#121316]" />
            </div>
          </div>
          <div className="mt-4">
            <span className="font-serif text-4xl sm:text-5xl text-[#121316] font-light">
              {mediaList.length}
            </span>
            <span className="block text-xs text-[#5C626C] mt-1">
              Clichés haute définition WebP
            </span>
          </div>
        </div>
      </div>

      {/* BARRE D'ONGLETS CONVEXES */}
      <div className="flex items-center gap-3 p-1.5 rounded-2xl convex-btn w-fit max-w-full overflow-x-auto">
        <button
          onClick={() => setActiveTab("rsvps")}
          className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "rsvps"
              ? "convex-dark-btn text-white"
              : "text-[#5C626C] hover:text-[#121316]"
          }`}
        >
          <Users className="w-4 h-4" />
          Réponses Invités ({rsvps.length})
        </button>

        <button
          onClick={() => setActiveTab("photos")}
          className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "photos"
              ? "convex-dark-btn text-white"
              : "text-[#5C626C] hover:text-[#121316]"
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Photothèque WebP ({mediaList.length})
        </button>

        <button
          onClick={() => setActiveTab("settings")}
          className={`px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider font-semibold transition-all cursor-pointer flex items-center gap-2 ${
            activeTab === "settings"
              ? "convex-dark-btn text-white"
              : "text-[#5C626C] hover:text-[#121316]"
          }`}
        >
          <Settings className="w-4 h-4" />
          Dress Code & Paramètres
        </button>
      </div>

      {/* ========================================================
          ONGLET 1 : RÉPONSES DES INVITÉS & FILTRES INTELLIGENTS
         ======================================================== */}
      {activeTab === "rsvps" && (
        <section className="emboss-card rounded-3xl p-6 sm:p-8 border border-white space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-black/[0.06] pb-5">
            <div>
              <h2 className="font-serif text-2xl text-[#121316]">
                Liste Interactive des Invités
              </h2>
              <p className="font-sans text-xs text-[#5C626C] mt-0.5">
                Recherche instantanée par nom, email, régime ou chanson suggérée.
              </p>
            </div>

            {/* Barre de recherche et filtres */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative min-w-[240px]">
                <Search className="w-4 h-4 text-[#949BA5] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Rechercher un invité..."
                  className="deboss-input w-full pl-10 pr-4 py-2.5 rounded-xl text-xs font-sans text-[#121316]"
                />
              </div>

              <div className="flex items-center gap-1.5 p-1 rounded-xl deboss-input">
                <button
                  onClick={() => setStatusFilter("ALL")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    statusFilter === "ALL"
                      ? "bg-[#121316] text-white"
                      : "text-[#5C626C]"
                  }`}
                >
                  Tous ({rsvps.length})
                </button>
                <button
                  onClick={() => setStatusFilter("YES")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    statusFilter === "YES"
                      ? "bg-emerald-700 text-white"
                      : "text-[#5C626C]"
                  }`}
                >
                  Présents ({confirmedRsvps.length})
                </button>
                <button
                  onClick={() => setStatusFilter("NO")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer ${
                    statusFilter === "NO"
                      ? "bg-neutral-600 text-white"
                      : "text-[#5C626C]"
                  }`}
                >
                  Absents ({declinedRsvps.length})
                </button>
              </div>
            </div>
          </div>

          {filteredRsvps.length === 0 ? (
            <div className="text-center py-16">
              <Heart className="w-8 h-8 text-[#949BA5] mx-auto mb-3 stroke-[1.5]" />
              <p className="font-serif italic text-lg text-[#5C626C]">
                {rsvps.length === 0
                  ? "Aucune réponse reçue pour le moment."
                  : "Aucun résultat correspondant à vos filtres."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm font-sans">
                <thead className="border-b border-black/[0.06] text-xs uppercase tracking-[0.15em] text-[#5C626C] font-semibold">
                  <tr>
                    <th className="pb-3.5">Invité(s)</th>
                    <th className="pb-3.5">Statut</th>
                    <th className="pb-3.5">Couverts</th>
                    <th className="pb-3.5">Temps Forts</th>
                    <th className="pb-3.5">Régimes & Allergies</th>
                    <th className="pb-3.5">Morceau DJ</th>
                    <th className="pb-3.5">Mot Doux</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-black/[0.06]">
                  {filteredRsvps.map((rsvp) => (
                    <tr
                      key={rsvp.id}
                      className="hover:bg-black/[0.02] transition-colors group"
                    >
                      <td className="py-4 font-medium text-[#121316]">
                        {rsvp.fullName}
                        {rsvp.email && (
                          <span className="block text-xs text-[#949BA5] font-normal">
                            {rsvp.email}
                          </span>
                        )}
                      </td>
                      <td className="py-4">
                        {rsvp.status === "YES" ? (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                            Présent
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-neutral-100 text-neutral-600 border border-neutral-200">
                            <span className="w-1.5 h-1.5 rounded-full bg-neutral-400" />
                            Absent
                          </span>
                        )}
                      </td>
                      <td className="py-4">
                        <span className="font-serif text-base text-[#121316]">
                          {rsvp.status === "YES" ? `${rsvp.guestsCount} pers.` : "—"}
                        </span>
                      </td>
                      <td className="py-4 text-xs text-[#5C626C]">
                        {rsvp.events.length > 0
                          ? rsvp.events.map((e) => (
                              <span
                                key={e}
                                className="inline-block mr-1.5 mb-1 px-2 py-0.5 rounded-md bg-white border border-black/10 text-[11px]"
                              >
                                {e === "ceremony"
                                  ? "Cérémonie"
                                  : e === "cocktail"
                                  ? "Cocktail"
                                  : e === "brunch"
                                  ? "Brunch"
                                  : e}
                              </span>
                            ))
                          : "—"}
                      </td>
                      <td className="py-4 text-xs">
                        {rsvp.dietaryRestrictions ? (
                          <span className="text-amber-800 font-medium bg-amber-50 px-2 py-1 rounded-md border border-amber-200 inline-block">
                            {rsvp.dietaryRestrictions}
                          </span>
                        ) : (
                          <span className="text-[#949BA5]">—</span>
                        )}
                      </td>
                      <td className="py-4 text-xs text-[#5C626C]">
                        {rsvp.songSuggestion ? (
                          <span className="flex items-center gap-1.5 font-medium text-[#121316]">
                            <Music className="w-3.5 h-3.5 text-[#5C626C]" />
                            {rsvp.songSuggestion}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="py-4 text-xs text-[#121316] max-w-xs truncate font-serif italic" title={rsvp.loveNote || ""}>
                        {rsvp.loveNote || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}

      {/* ========================================================
          ONGLET 2 : PHOTOTHÈQUE & UPLOAD OPTIMISÉ WEBP
         ======================================================== */}
      {activeTab === "photos" && (
        <section className="space-y-6">
          {/* Formulaire d'upload */}
          <div className="emboss-card rounded-3xl p-6 sm:p-8 border border-white space-y-6">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
              <div>
                <h2 className="font-serif text-2xl text-[#121316] flex items-center gap-2.5">
                  <ImageIcon className="w-5 h-5 text-[#121316]" />
                  Téléverser une Nouvelle Photographie
                </h2>
                <p className="font-sans text-xs text-[#5C626C] mt-0.5">
                  Conversion automatique WebP, redimensionnement 2000px & optimisation sans perte de piqué.
                </p>
              </div>
            </div>

            <UploadMediaForm />
          </div>

          {/* Galerie des clichés enregistrés */}
          <div className="emboss-card rounded-3xl p-6 sm:p-8 border border-white space-y-6">
            <div className="flex items-center justify-between border-b border-black/[0.06] pb-4">
              <h3 className="font-serif text-2xl text-[#121316]">
                Photothèque Active ({mediaList.length})
              </h3>
              <span className="text-xs text-[#949BA5] font-sans">
                Visibles dans la galerie plein écran et les chapitres
              </span>
            </div>

            {mediaList.length === 0 ? (
              <div className="text-center py-16">
                <ImageIcon className="w-8 h-8 text-[#949BA5] mx-auto mb-3 stroke-[1.5]" />
                <p className="font-serif italic text-lg text-[#5C626C]">
                  Aucune photo personnalisée pour l&apos;instant. Utilisez le formulaire ci-dessus pour en ajouter.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
                {mediaList.map((m) => (
                  <div
                    key={m.id}
                    className="relative group rounded-2xl overflow-hidden aspect-[4/5] border border-black/10 bg-neutral-100 shadow-sm"
                  >
                    <Image
                      src={m.url}
                      alt={m.caption || "Photo"}
                      fill
                      sizes="(max-width: 768px) 50vw, 250px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Badge emplacement */}
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-sans font-semibold bg-black/60 backdrop-blur-md text-white border border-white/20">
                        {m.chapter ? `Chapitre 0${m.chapter}` : "Galerie Complète"}
                      </span>
                    </div>

                    {/* Overlay au survol */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-3 flex flex-col justify-end text-white z-20">
                      {m.caption && (
                        <p className="font-serif italic text-xs line-clamp-2 mb-2">
                          {m.caption}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-2 border-t border-white/20 text-[10px] font-sans">
                        <span>{m.sizeBytes ? `${Math.round(m.sizeBytes / 1024)} Ko` : "WebP"}</span>
                        <form
                          action={async () => {
                            await deleteMedia(m.id);
                          }}
                        >
                          <button
                            type="submit"
                            className="p-1.5 rounded-full bg-red-600/80 hover:bg-red-600 text-white cursor-pointer transition-colors"
                            title="Supprimer la photo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ========================================================
          ONGLET 3 : PARAMÈTRES DU MARIAGE & DRESS CODE
         ======================================================== */}
      {activeTab === "settings" && (
        <section className="emboss-card rounded-3xl p-6 sm:p-8 border border-white space-y-6">
          <div className="border-b border-black/[0.06] pb-4">
            <h2 className="font-serif text-2xl text-[#121316] flex items-center gap-2.5">
              <Settings className="w-5 h-5 text-[#121316]" />
              Configuration Générale & Dress Code
            </h2>
            <p className="font-sans text-xs text-[#5C626C] mt-0.5">
              Personnalisez la date du mariage, le lieu, la palette du Dress Code et les recommandations aux invités.
            </p>
          </div>

          <WeddingConfigForm initialConfig={config} />
        </section>
      )}
    </main>
  );
}
