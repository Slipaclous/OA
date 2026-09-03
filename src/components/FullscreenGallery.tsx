"use client";

import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

export interface GalleryPhoto {
  src: string;
  alt: string;
  caption: string;
  tag: string;
}

interface FullscreenGalleryProps {
  photos: GalleryPhoto[];
  isOpen: boolean;
  initialIndex?: number;
  onClose: () => void;
}

export function FullscreenGallery({
  photos,
  isOpen,
  initialIndex = 0,
  onClose,
}: FullscreenGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const nextPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
  }, [photos.length]);

  const prevPhoto = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // Raccourcis clavier (Échap, Flèches)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextPhoto();
      if (e.key === "ArrowLeft") prevPhoto();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, nextPhoto, prevPhoto, onClose]);

  if (!isOpen || photos.length === 0) return null;

  const current = photos[currentIndex];

  return (
    <div className="fixed inset-0 z-[100] bg-[#121316]/95 backdrop-blur-xl flex flex-col justify-between p-6 md:p-10 select-none animate-in fade-in duration-300">
      {/* Barre supérieure : compteur & fermeture */}
      <div className="flex items-center justify-between text-white/80 z-10">
        <div className="flex items-center gap-3">
          <span className="text-xs uppercase tracking-[0.3em] font-sans font-semibold">
            Planche {currentIndex + 1} / {photos.length}
          </span>
          <span className="text-xs text-white/40">•</span>
          <span className="text-xs tracking-widest uppercase text-white/60 font-sans">
            Shooting Anthony & Ophélie
          </span>
        </div>

        <button
          onClick={onClose}
          className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
          title="Fermer (Échap)"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Zone centrale : Image plein cadre avec flèches */}
      <div className="relative flex-1 my-4 flex items-center justify-center">
        {/* Bouton Précédent */}
        <button
          onClick={prevPhoto}
          className="absolute left-2 md:left-6 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 transition-all cursor-pointer"
          title="Précédent (Flèche gauche)"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        {/* Photographie active */}
        <div className="relative w-full h-full max-w-5xl max-h-[75vh] flex items-center justify-center">
          <Image
            src={current.src}
            alt={current.alt}
            fill
            priority
            sizes="90vw"
            className="object-contain"
          />
        </div>

        {/* Bouton Suivant */}
        <button
          onClick={nextPhoto}
          className="absolute right-2 md:right-6 z-20 p-3 rounded-full bg-black/40 hover:bg-black/70 text-white border border-white/20 transition-all cursor-pointer"
          title="Suivant (Flèche droite)"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      </div>

      {/* Barre inférieure : Légende & vignettes */}
      <div className="flex flex-col md:flex-row md:items-end justify-between text-white/90 gap-4 border-t border-white/10 pt-4 z-10">
        <div>
          <span className="text-[10px] font-sans uppercase tracking-[0.25em] text-white/60 block">
            {current.tag}
          </span>
          <p className="font-serif italic text-base md:text-lg text-white/95">
            {current.caption}
          </p>
        </div>

        {/* Mini vignettes cliquables */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {photos.map((p, idx) => (
            <button
              key={p.src + idx}
              onClick={() => setCurrentIndex(idx)}
              className={`relative w-12 h-12 rounded-lg overflow-hidden shrink-0 border transition-all cursor-pointer ${
                currentIndex === idx
                  ? "border-white scale-105 shadow-md"
                  : "border-white/30 opacity-50 hover:opacity-100"
              }`}
            >
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="48px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
