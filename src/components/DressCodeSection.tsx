interface DressCodeProps {
  title?: string;
  desc?: string;
  colors?: string;
  advice?: string;
  isDark?: boolean;
}

export function DressCodeSection({
  title = "Chic Contemporain & Épuré",
  desc = "Pour une harmonie visuelle élégante sur les photos de la journée, nous vous invitons à privilégier une tenue chic contemporaine, épurée et intemporelle.",
  colors = "Blanc Pur:#FFFFFF,Sable Minéral:#E9ECEF,Gris Taupe:#CED4DA,Ardoise:#495057,Noir Profond:#121316",
  advice = "Le cocktail aura lieu en extérieur dans le parc du domaine, prévoyez des chaussures confortables pour les allées en herbe.",
  isDark = false,
}: DressCodeProps) {
  const parsedColors = colors
    .split(",")
    .map((item) => {
      const [name, hex] = item.split(":");
      return {
        name: name?.trim() || "",
        hex: hex?.trim() || "#121316",
        border: hex?.trim().toLowerCase() === "#ffffff",
      };
    })
    .filter((c) => c.name && c.hex);

  return (
    <div className={`space-y-4 ${isDark ? "" : "pt-6 border-t border-black/[0.06]"}`}>
      <div className="space-y-1.5">
        <span className={`text-[10px] font-semibold tracking-[0.3em] uppercase font-sans ${isDark ? "text-white/70" : "text-[#5C626C]"}`}>
          Atmosphère & Style
        </span>
        <h3 className={`font-serif text-2xl sm:text-3xl font-normal ${isDark ? "text-white" : "text-[#121316]"}`}>
          {title}
        </h3>
        {desc && (
          <p className={`font-sans text-xs sm:text-sm leading-relaxed ${isDark ? "text-white/80" : "text-[#5C626C]"}`}>
            {desc}
          </p>
        )}
      </div>

      {/* Nuancier dynamique */}
      <div className={`rounded-2xl p-5 border space-y-3.5 ${
        isDark
          ? "bg-white/10 border-white/15 text-white"
          : "emboss-card border-white text-[#121316]"
      }`}>
        <span className={`text-[10px] font-sans uppercase tracking-[0.25em] font-semibold block ${isDark ? "text-white/70" : "text-[#5C626C]"}`}>
          Nuances Suggérées
        </span>
        <div className="flex flex-wrap items-center gap-3">
          {parsedColors.map((color) => (
            <div key={color.name} className="flex flex-col items-center gap-1.5">
              <div
                className={`w-10 h-10 rounded-full shadow-inner transition-transform hover:scale-105 ${
                  color.border ? "border border-neutral-300" : ""
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
              <span className="text-[9px] uppercase tracking-wider text-[#949BA5] font-sans font-medium text-center max-w-[65px]">
                {color.name}
              </span>
            </div>
          ))}
        </div>

        {advice && (
          <div className={`pt-2 text-xs font-sans space-y-1 ${isDark ? "text-white/80" : "text-[#5C626C]"}`}>
            <p>
              • <strong>Conseil pratique :</strong> {advice}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
