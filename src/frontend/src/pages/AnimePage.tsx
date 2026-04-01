import { Badge } from "@/components/ui/badge";
import { getAllEpisodes, getAnimeById } from "@/data/anime";
import { Link, useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  Calendar,
  Film,
  Globe,
  Languages,
  Play,
  Star,
  Users,
} from "lucide-react";
import { motion } from "motion/react";

export function AnimePage() {
  const { id } = useParams({ from: "/anime/$id" });
  const navigate = useNavigate();
  const anime = getAnimeById(id);

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Anime not found</h2>
          <Link to="/" className="text-cyan-glow hover:underline">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const episodes = getAllEpisodes(anime);
  const availableCount = anime.episodes.filter((e) => e.driveId).length;

  return (
    <main className="min-h-screen" data-ocid="anime.page">
      {/* Hero Banner */}
      <section className="relative h-[55vh] flex items-end overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${anime.poster})`,
            filter: "blur(3px) brightness(0.3)",
            transform: "scale(1.05)",
          }}
        />
        <div className="absolute inset-0 hero-overlay-full" />

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 pb-8">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="flex items-center gap-2 mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors"
            data-ocid="anime.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </button>

          <div className="flex flex-col md:flex-row items-start md:items-end gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex-shrink-0"
            >
              <div
                className="w-36 md:w-48 rounded-xl overflow-hidden border-2"
                style={{
                  borderColor: "oklch(0.82 0.18 198 / 50%)",
                  boxShadow: "0 0 30px oklch(0.82 0.18 198 / 25%)",
                }}
              >
                <img
                  src={anime.poster}
                  alt={anime.title}
                  className="w-full h-auto"
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                  style={{
                    background:
                      anime.type === "Movie"
                        ? "oklch(0.72 0.19 48)"
                        : "oklch(0.82 0.18 198)",
                    color: "oklch(0.07 0.025 250)",
                  }}
                >
                  {anime.type}
                </span>
                <span
                  className="text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide"
                  style={{
                    background: "oklch(0.18 0.06 140)",
                    color: "oklch(0.72 0.18 140)",
                    border: "1px solid oklch(0.72 0.18 140 / 30%)",
                  }}
                >
                  {anime.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-5xl font-black uppercase tracking-tight text-foreground mb-3">
                {anime.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Star
                    className="w-5 h-5 fill-current"
                    style={{ color: "oklch(0.78 0.17 80)" }}
                  />
                  <span
                    className="font-black text-lg"
                    style={{ color: "oklch(0.78 0.17 80)" }}
                  >
                    {anime.rating.toFixed(1)}
                  </span>
                  <span className="text-sm text-muted-foreground">/ 10</span>
                </div>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  {anime.year}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-sm text-muted-foreground">
                  {anime.language}
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Main content */}
          <motion.div
            className="lg:col-span-2 space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <section>
              <h2
                className="text-lg font-black uppercase tracking-wide mb-3"
                style={{ color: "oklch(0.82 0.18 198)" }}
              >
                Synopsis
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {anime.synopsis}
              </p>
            </section>

            <section>
              <h2
                className="text-lg font-black uppercase tracking-wide mb-3"
                style={{ color: "oklch(0.82 0.18 198)" }}
              >
                Genres
              </h2>
              <div className="flex flex-wrap gap-2">
                {anime.genres.map((g) => (
                  <span
                    key={g}
                    className="text-sm font-semibold px-3 py-1.5 rounded-full"
                    style={{
                      background: "oklch(0.82 0.18 198 / 12%)",
                      color: "oklch(0.82 0.18 198)",
                      border: "1px solid oklch(0.82 0.18 198 / 25%)",
                    }}
                  >
                    {g}
                  </span>
                ))}
              </div>
            </section>

            <section>
              <h2
                className="text-lg font-black uppercase tracking-wide mb-3"
                style={{ color: "oklch(0.82 0.18 198)" }}
              >
                <Users className="w-5 h-5 inline mr-2" />
                Main Characters
              </h2>
              <div className="flex flex-wrap gap-2">
                {anime.mainCharacters.map((c) => (
                  <span
                    key={c}
                    className="text-sm font-medium px-3 py-1.5 rounded-lg"
                    style={{
                      background: "oklch(0.15 0.028 248)",
                      color: "oklch(0.97 0 0)",
                      border: "1px solid oklch(0.82 0.18 198 / 15%)",
                    }}
                  >
                    {c}
                  </span>
                ))}
              </div>
            </section>

            {/* Movie watch button */}
            {anime.type === "Movie" && anime.episodes[0]?.driveId && (
              <section>
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/watch/$animeId/$episodeId",
                      params: {
                        animeId: anime.id,
                        episodeId: anime.episodes[0].id,
                      },
                    })
                  }
                  className="flex items-center gap-2 px-8 py-4 text-base font-bold uppercase tracking-wide rounded-xl neon-pulse transition-all"
                  style={{
                    background: "oklch(0.82 0.18 198)",
                    color: "oklch(0.07 0.025 250)",
                    boxShadow: "0 0 20px oklch(0.82 0.18 198 / 40%)",
                  }}
                  data-ocid="anime.primary_button"
                >
                  <Play className="w-5 h-5 fill-current" />
                  Watch Movie
                </button>
              </section>
            )}
          </motion.div>

          {/* Sidebar */}
          <motion.div
            className="space-y-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div
              className="rounded-2xl p-5 border space-y-4"
              style={{
                background: "oklch(0.12 0.025 248)",
                borderColor: "oklch(0.82 0.18 198 / 20%)",
              }}
            >
              <h3
                className="text-sm font-black uppercase tracking-wide"
                style={{ color: "oklch(0.82 0.18 198)" }}
              >
                Info
              </h3>
              {[
                { icon: Film, label: "Type", value: anime.type },
                { icon: Calendar, label: "Year", value: String(anime.year) },
                {
                  icon: Film,
                  label: anime.type === "Movie" ? "Format" : "Episodes",
                  value:
                    anime.type === "Movie"
                      ? "Full Movie"
                      : `${anime.totalEpisodes} total (${availableCount} available)`,
                },
                { icon: Globe, label: "Country", value: "Japan" },
                { icon: Languages, label: "Language", value: anime.language },
                { icon: Users, label: "Status", value: anime.status },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-3">
                  <Icon
                    className="w-4 h-4 mt-0.5 flex-shrink-0"
                    style={{ color: "oklch(0.82 0.18 198)" }}
                  />
                  <div>
                    <div className="text-xs text-muted-foreground uppercase tracking-wide">
                      {label}
                    </div>
                    <div className="text-sm font-semibold text-foreground">
                      {value}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Episodes Section */}
        {anime.type === "TV Series" && (
          <motion.section
            className="mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            data-ocid="episodes.section"
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="w-1 h-8 rounded-full"
                style={{
                  background: "oklch(0.82 0.18 198)",
                  boxShadow: "0 0 12px oklch(0.82 0.18 198 / 60%)",
                }}
              />
              <h2 className="text-2xl font-black uppercase tracking-wide">
                Episodes
              </h2>
              <span className="text-sm text-muted-foreground">
                ({availableCount} / {anime.totalEpisodes} available)
              </span>
            </div>

            <div
              className="overflow-y-auto rounded-xl"
              style={{ maxHeight: "600px" }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 pr-1">
                {episodes.map((ep) => (
                  <div
                    key={ep.id}
                    className="rounded-xl p-4 border flex items-center justify-between gap-3 transition-all"
                    style={{
                      background: ep.driveId
                        ? "oklch(0.12 0.025 248)"
                        : "oklch(0.10 0.018 248)",
                      borderColor: ep.driveId
                        ? "oklch(0.82 0.18 198 / 25%)"
                        : "oklch(0.82 0.18 198 / 8%)",
                    }}
                    data-ocid={`episodes.item.${ep.number}`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className="text-xs font-black w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{
                          background: ep.driveId
                            ? "oklch(0.82 0.18 198 / 20%)"
                            : "oklch(0.15 0.02 248)",
                          color: ep.driveId
                            ? "oklch(0.82 0.18 198)"
                            : "oklch(0.40 0.02 248)",
                        }}
                      >
                        {ep.number}
                      </span>
                      <div className="min-w-0">
                        <div
                          className={`text-sm font-semibold truncate ${
                            ep.driveId
                              ? "text-foreground"
                              : "text-muted-foreground"
                          }`}
                        >
                          {ep.title}
                        </div>
                      </div>
                    </div>

                    {ep.driveId ? (
                      <button
                        type="button"
                        onClick={() =>
                          navigate({
                            to: "/watch/$animeId/$episodeId",
                            params: {
                              animeId: anime.id,
                              episodeId: ep.id,
                            },
                          })
                        }
                        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all neon-pulse"
                        style={{
                          background: "oklch(0.82 0.18 198)",
                          color: "oklch(0.07 0.025 250)",
                        }}
                        data-ocid={`episodes.button.${ep.number}`}
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                      </button>
                    ) : (
                      <Badge
                        variant="outline"
                        className="flex-shrink-0 text-xs px-2 py-0.5"
                        style={{
                          background: "oklch(0.13 0.02 248)",
                          color: "oklch(0.38 0.02 248)",
                          borderColor: "oklch(0.25 0.02 248)",
                        }}
                      >
                        Soon
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </div>
    </main>
  );
}
