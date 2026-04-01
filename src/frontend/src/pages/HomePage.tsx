import { AnimeCard } from "@/components/AnimeCard";
import { Badge } from "@/components/ui/badge";
import { ANIME_DATA } from "@/data/anime";
import { Link, useNavigate } from "@tanstack/react-router";
import { Info, Play, Search, Star, Zap } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";

const FEATURED = ANIME_DATA[0];
const ALL_GENRES = Array.from(new Set(ANIME_DATA.flatMap((a) => a.genres)));

export function HomePage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeGenre, setActiveGenre] = useState<string | null>(null);

  const filteredAnime = ANIME_DATA.filter((a) => {
    const matchesSearch =
      !searchQuery.trim() ||
      a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.genres.some((g) => g.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesGenre = !activeGenre || a.genres.includes(activeGenre);
    return matchesSearch && matchesGenre;
  });

  return (
    <main className="min-h-screen" data-ocid="home.page">
      {/* Hero Section */}
      <section
        className="relative min-h-[75vh] flex items-center overflow-hidden"
        data-ocid="home.section"
      >
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${FEATURED.poster})`,
            filter: "blur(2px) brightness(0.35)",
            transform: "scale(1.06)",
          }}
        />
        <div className="absolute inset-0 hero-overlay" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(0deg, oklch(0.07 0.025 250) 0%, transparent 50%)",
          }}
        />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 py-20 flex flex-col md:flex-row items-center gap-12">
          <motion.div
            className="flex-1 max-w-2xl"
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2 mb-4">
              <Zap
                className="w-4 h-4"
                style={{ color: "oklch(0.82 0.18 198)" }}
              />
              <span
                className="text-xs font-bold uppercase tracking-widest"
                style={{ color: "oklch(0.82 0.18 198)" }}
              >
                Featured Anime
              </span>
            </div>

            <h1
              className="text-5xl md:text-6xl font-black uppercase tracking-tight text-foreground mb-4"
              style={{ lineHeight: 1.1 }}
            >
              {FEATURED.title}
            </h1>

            <div className="flex flex-wrap gap-2 mb-4">
              {FEATURED.genres.map((g) => (
                <span
                  key={g}
                  className="text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wide"
                  style={{
                    background: "oklch(0.82 0.18 198 / 15%)",
                    color: "oklch(0.82 0.18 198)",
                    border: "1px solid oklch(0.82 0.18 198 / 30%)",
                  }}
                >
                  {g}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1.5">
                <Star
                  className="w-5 h-5 fill-current"
                  style={{ color: "oklch(0.78 0.17 80)" }}
                />
                <span
                  className="font-black text-xl"
                  style={{ color: "oklch(0.78 0.17 80)" }}
                >
                  {FEATURED.rating.toFixed(1)}
                </span>
                <span className="text-sm text-muted-foreground">/ 10</span>
              </div>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">
                {FEATURED.type}
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">
                {FEATURED.totalEpisodes} Episodes
              </span>
              <span className="text-muted-foreground">·</span>
              <span className="text-sm text-muted-foreground">
                {FEATURED.year}
              </span>
            </div>

            <p className="text-muted-foreground text-base leading-relaxed mb-8 max-w-lg">
              {FEATURED.synopsis}
            </p>

            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() =>
                  navigate({ to: "/anime/$id", params: { id: FEATURED.id } })
                }
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all neon-pulse"
                style={{
                  background: "oklch(0.82 0.18 198)",
                  color: "oklch(0.07 0.025 250)",
                  boxShadow: "0 0 20px oklch(0.82 0.18 198 / 40%)",
                }}
                data-ocid="hero.primary_button"
              >
                <Play className="w-4 h-4 fill-current" />
                Watch Now
              </button>
              <Link
                to="/anime/$id"
                params={{ id: FEATURED.id }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-sm uppercase tracking-wide transition-all hover:bg-muted"
                style={{
                  background: "transparent",
                  color: "oklch(0.97 0 0)",
                  border: "1.5px solid oklch(0.82 0.18 198 / 50%)",
                }}
                data-ocid="hero.secondary_button"
              >
                <Info className="w-4 h-4" />
                More Info
              </Link>
            </div>
          </motion.div>

          <motion.div
            className="hidden md:block flex-shrink-0"
            initial={{ opacity: 0, x: 40, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2, ease: "easeOut" }}
          >
            <div
              className="w-56 rounded-2xl overflow-hidden border-2"
              style={{
                borderColor: "oklch(0.82 0.18 198 / 50%)",
                boxShadow:
                  "0 0 40px oklch(0.82 0.18 198 / 30%), 0 20px 60px oklch(0 0 0 / 60%)",
              }}
            >
              <img
                src={FEATURED.poster}
                alt={FEATURED.title}
                className="w-full h-auto"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Anime Grid */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 py-16"
        data-ocid="anime.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          {/* Section header + search */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <div
                className="w-1 h-8 rounded-full"
                style={{
                  background: "oklch(0.82 0.18 198)",
                  boxShadow: "0 0 12px oklch(0.82 0.18 198 / 60%)",
                }}
              />
              <h2 className="text-2xl font-black uppercase tracking-wide">
                All Anime
              </h2>
            </div>

            {/* Search bar */}
            <div
              className="flex items-center gap-2 px-4 py-2 rounded-full"
              style={{
                background: "oklch(0.12 0.025 248)",
                border: "1px solid oklch(0.82 0.18 198 / 30%)",
              }}
            >
              <Search
                className="w-4 h-4 shrink-0"
                style={{ color: "oklch(0.82 0.18 198)" }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, genre..."
                className="bg-transparent text-sm outline-none w-44 sm:w-52"
                style={{ color: "oklch(0.97 0 0)" }}
                data-ocid="home.search_input"
              />
            </div>
          </div>

          {filteredAnime.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center py-20 text-center"
              data-ocid="anime.empty_state"
            >
              <Search
                className="w-12 h-12 mb-4"
                style={{ color: "oklch(0.35 0.03 248)" }}
              />
              <p className="text-muted-foreground font-semibold">
                No anime found for "{searchQuery}"
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAnime.map((anime, i) => (
                <AnimeCard key={anime.id} anime={anime} index={i} />
              ))}
            </div>
          )}
        </motion.div>
      </section>

      {/* Genres */}
      <section
        className="max-w-7xl mx-auto px-4 sm:px-6 pb-16"
        data-ocid="categories.section"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-6">
            <div
              className="w-1 h-8 rounded-full"
              style={{
                background: "oklch(0.72 0.19 48)",
                boxShadow: "0 0 12px oklch(0.72 0.19 48 / 60%)",
              }}
            />
            <h2 className="text-2xl font-black uppercase tracking-wide">
              Popular Genres
            </h2>
          </div>
          <div className="flex flex-wrap gap-3">
            <Badge
              variant="outline"
              className="px-4 py-2 text-sm font-semibold uppercase tracking-wide cursor-pointer transition-all"
              style={{
                borderColor:
                  activeGenre === null
                    ? "oklch(0.82 0.18 198)"
                    : "oklch(0.82 0.18 198 / 30%)",
                color:
                  activeGenre === null
                    ? "oklch(0.07 0.025 250)"
                    : "oklch(0.82 0.18 198)",
                background:
                  activeGenre === null
                    ? "oklch(0.82 0.18 198)"
                    : "oklch(0.82 0.18 198 / 8%)",
              }}
              onClick={() => setActiveGenre(null)}
              data-ocid="categories.tab"
            >
              All
            </Badge>
            {ALL_GENRES.map((genre) => (
              <Badge
                key={genre}
                variant="outline"
                className="px-4 py-2 text-sm font-semibold uppercase tracking-wide cursor-pointer transition-all"
                style={{
                  borderColor:
                    activeGenre === genre
                      ? "oklch(0.82 0.18 198)"
                      : "oklch(0.82 0.18 198 / 30%)",
                  color:
                    activeGenre === genre
                      ? "oklch(0.07 0.025 250)"
                      : "oklch(0.82 0.18 198)",
                  background:
                    activeGenre === genre
                      ? "oklch(0.82 0.18 198)"
                      : "oklch(0.82 0.18 198 / 8%)",
                }}
                onClick={() =>
                  setActiveGenre(activeGenre === genre ? null : genre)
                }
                data-ocid="categories.tab"
              >
                {genre}
              </Badge>
            ))}
          </div>
        </motion.div>
      </section>
    </main>
  );
}
