import { AnimeCard } from "@/components/AnimeCard";
import { ANIME_DATA } from "@/data/anime";
import { motion } from "motion/react";

export function BrowsePage() {
  const tvSeries = ANIME_DATA.filter((a) => a.type === "TV Series");
  const movies = ANIME_DATA.filter((a) => a.type === "Movie");

  return (
    <main
      className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 py-12"
      data-ocid="browse.page"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center gap-3 mb-10">
          <div
            className="w-1 h-8 rounded-full"
            style={{
              background: "oklch(0.82 0.18 198)",
              boxShadow: "0 0 12px oklch(0.82 0.18 198 / 60%)",
            }}
          />
          <h1 className="text-3xl font-black uppercase tracking-wide">
            Browse Anime
          </h1>
        </div>

        {tvSeries.length > 0 && (
          <section className="mb-12">
            <h2
              className="text-xl font-black uppercase tracking-wide mb-6"
              style={{ color: "oklch(0.82 0.18 198)" }}
            >
              TV Series
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {tvSeries.map((anime, i) => (
                <AnimeCard key={anime.id} anime={anime} index={i} />
              ))}
            </div>
          </section>
        )}

        {movies.length > 0 && (
          <section>
            <h2
              className="text-xl font-black uppercase tracking-wide mb-6"
              style={{ color: "oklch(0.72 0.19 48)" }}
            >
              Movies
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {movies.map((anime, i) => (
                <AnimeCard key={anime.id} anime={anime} index={i} />
              ))}
            </div>
          </section>
        )}
      </motion.div>
    </main>
  );
}
