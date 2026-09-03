interface DressCodeProps {
  title?: string;
  desc?: string;
  colors?: string;
  advice?: string;
}

export function DressCodeSection({
  title = "Chic Contemporain & Épuré",
  desc = "Pour une harmonie visuelle élégante sur les photos de la journée, nous vous invitons à privilégier une tenue chic contemporaine, épurée et intemporelle.",
  colors = "Blanc Pur:#FFFFFF,Sable Minéral:#E9ECEF,Gris Taupe:#CED4DA,Ardoise:#495057,Noir Profond:#121316",
  advice = "Le cocktail aura lieu en extérieur dans le parc du domaine, prévoyez des chaussures confortables pour les allées en herbe.",
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
    <div className="space-y-6 pt-6 border-t border-black/[0.06]">
      <div className="space-y-2">
        <span className="text-[11px] font-semibold tracking-[0.3em] uppercase text-[#5C626C] font-sans">
          Atmosphère & Style
        </span>
        <h3 className="font-serif text-2xl sm:text-3xl text-[#121316] font-normal">
          {title}
        </h3>
        {desc && (
          <p className="font-sans text-sm text-[#5C626C] leading-relaxed">
            {desc}
          </p>
        )}
      </div>

      {/* Nuancier dynamique */}
      <div className="emboss-card rounded-2xl p-6 border border-white space-y-4">
        <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-[#5C626C] font-semibold block">
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
          <div className="pt-2 text-xs text-[#5C626C] font-sans space-y-1">
            <p>
              • <strong>Conseil pratique :</strong> {advice}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
