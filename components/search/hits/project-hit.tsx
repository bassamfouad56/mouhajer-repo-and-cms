"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Calendar } from "lucide-react";
import type { ProjectHit } from "@/lib/algolia/types";

interface ProjectHitProps {
  hit: ProjectHit;
  locale: string;
  onClick?: () => void;
}

export function ProjectHitComponent({ hit, locale, onClick }: ProjectHitProps) {
  const title =
    hit.title?.[locale as "en" | "ar"] || hit.title?.en || "Untitled";

  return (
    <Link
      href={`/${locale}/projects/${hit.slug}`}
      onClick={onClick}
      className="group flex items-center gap-4 rounded-lg border-l-4 border-[#8f7852] bg-white/5 p-4 transition-all hover:bg-[#8f7852]/10"
    >
      {/* Thumbnail */}
      {hit.mainImage && (
        <div className="relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md bg-neutral-800">
          <Image
            src={hit.mainImage}
            alt={title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium uppercase tracking-wider text-[#8f7852]">
            Project
          </span>
          {hit.industry && (
            <span className="rounded-full bg-[#8f7852]/20 px-2 py-0.5 text-xs text-[#8f7852]">
              {hit.industry}
            </span>
          )}
        </div>

        <h4 className="mt-1 truncate font-medium text-white group-hover:text-[#8f7852]">
          {title}
        </h4>

        <div className="mt-1 flex items-center gap-3 text-xs text-neutral-400">
          {hit.location && (
            <span className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              {hit.location}
            </span>
          )}
          {hit.year && (
            <span className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              {hit.year}
            </span>
          )}
        </div>
      </div>

      {/* Arrow indicator */}
      <div className="text-neutral-500 transition-transform group-hover:translate-x-1 group-hover:text-[#8f7852]">
        →
      </div>
    </Link>
  );
}
