import type { Anime } from "@/data/anime";
import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { motion } from "motion/react";

interface AnimeCardProps {
  anime: Anime;
  index?: number;
}

export function AnimeCard({ anime, index = 0 }: AnimeCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link
        to="/anime/$id"
        params={{ id: anime.id }}
        className="block group"
        data-ocid={`anime.item.${index + 1}`}
      >
        <div
          className="card-hover rounded-2xl overflow-hidden border"
          style={{
            background: "oklch(0.12 0.025 248)",
            borderColor: "oklch(0.82 0.18 198 / 25%)",
            boxShadow: "0 4px 20px oklch(0 0 0 / 40%)",
          }}
        >
          {/* Poster */}
          <div className="relative aspect-[2/3] overflow-hidden">
            <img
              src={anime.poster}
              alt={anime.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            {/* Type badge */}
            <div className="absolute top-3 left-3">
              <span
                className="text-xs font-bold px-2 py-1 rounded-full uppercase tracking-wider"
                style={{
                  background:
                    anime.type === "Movie"
                      ? "oklch(0.72 0.19 48 / 90%)"
                      : "oklch(0.82 0.18 198 / 90%)",
                  color: "oklch(0.07 0.025 250)",
                }}
              >
                {anime.type}
              </span>
            </div>
            {/* Year badge */}
            <div className="absolute top-3 right-3">
              <span
                className="text-xs font-semibold px-2 py-1 rounded-full"
                style={{
                  background: "oklch(0.07 0.02 250 / 80%)",
                  color: "oklch(0.65 0.06 248)",
                  border: "1px solid oklch(0.82 0.18 198 / 15%)",
                }}
              >
                {anime.year}
              </span>
            </div>
            {/* Hover overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300" />
          </div>

          {/* Info */}
          <div className="p-4">
            <h3 className="font-bold text-base text-foreground line-clamp-1 mb-0.5 group-hover:text-cyan-glow transition-colors">
              {anime.title}
            </h3>

            {/* Genres */}
            <div className="flex flex-wrap gap-1 mb-3">
              {anime.genres.slice(0, 3).map((g) => (
                <span
                  key={g}
                  className="text-xs px-2 py-0.5 rounded-full"
                  style={{
                    background: "oklch(0.82 0.18 198 / 10%)",
                    color: "oklch(0.82 0.18 198)",
                    border: "1px solid oklch(0.82 0.18 198 / 20%)",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>
            {/* Rating */}
            <div className="flex items-center gap-1.5">
              <Star
                className="w-4 h-4 fill-current"
                style={{ color: "oklch(0.78 0.17 80)" }}
              />
              <span
                className="text-sm font-bold"
                style={{ color: "oklch(0.78 0.17 80)" }}
              >
                {anime.rating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">/ 10</span>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
