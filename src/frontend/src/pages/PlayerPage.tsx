import {
  type Server,
  getAnimeById,
  getEmbedUrl,
  getServerEmbedUrl,
} from "@/data/anime";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  ArrowLeft,
  FastForward,
  Play,
  SkipBack,
  SkipForward,
} from "lucide-react";
import { motion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";

export function PlayerPage() {
  const { animeId, episodeId } = useParams({
    from: "/watch/$animeId/$episodeId",
  });
  const navigate = useNavigate();

  const anime = getAnimeById(animeId);
  const [selectedServerIndex, setSelectedServerIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const localTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset currentTime when episode or server changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset on route change
  useEffect(() => {
    setCurrentTime(0);
    if (localTimerRef.current) {
      clearInterval(localTimerRef.current);
      localTimerRef.current = null;
    }
  }, [episodeId, selectedServerIndex]);

  // Cleanup timer on unmount
  useEffect(() => {
    return () => {
      if (localTimerRef.current) clearInterval(localTimerRef.current);
    };
  }, []);

  // Derived values (safe to compute before early return since anime may be null)
  const currentEp = anime?.episodes.find((ep) => ep.id === episodeId);
  const currentIndex =
    anime?.episodes.findIndex((ep) => ep.id === episodeId) ?? -1;
  const hasServers = !!(currentEp?.servers && currentEp.servers.length > 0);
  const isVimeoE3 =
    episodeId === "e3" && selectedServerIndex === 0 && hasServers;

  // Listen for Vimeo timeupdate messages (override local timer if available)
  useEffect(() => {
    if (!isVimeoE3) return;
    const handler = (e: MessageEvent) => {
      try {
        const data = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
        if (data.event === "timeupdate") {
          setCurrentTime(data.data.seconds);
          // Stop local timer since Vimeo API is working
          if (localTimerRef.current) {
            clearInterval(localTimerRef.current);
            localTimerRef.current = null;
          }
        }
      } catch {
        // ignore parse errors
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [isVimeoE3]);

  const handleIframeLoad = useCallback(() => {
    if (!isVimeoE3) return;
    // Try Vimeo API
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method: "addEventListener", value: "timeupdate" }),
      "*",
    );
    // Start local fallback timer in case Vimeo API doesn't respond
    if (localTimerRef.current) clearInterval(localTimerRef.current);
    const startTime = Date.now();
    localTimerRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setCurrentTime((_prev) => {
        // Only update from local timer if Vimeo hasn't taken over
        // We use a simple heuristic: if prev is still very close to elapsed, keep updating
        return elapsed;
      });
      // Auto-stop timer after skip intro window
      if ((Date.now() - startTime) / 1000 > 85) {
        if (localTimerRef.current) {
          clearInterval(localTimerRef.current);
          localTimerRef.current = null;
        }
      }
    }, 500);
  }, [isVimeoE3]);

  const handleSkipIntro = useCallback(() => {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ method: "setCurrentTime", value: 79 }),
      "*",
    );
    setCurrentTime(79);
    if (localTimerRef.current) {
      clearInterval(localTimerRef.current);
      localTimerRef.current = null;
    }
  }, []);

  if (!anime) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Anime not found</h2>
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            className="text-cyan-glow hover:underline"
          >
            ← Back to Home
          </button>
        </div>
      </div>
    );
  }

  const showSkipIntro = isVimeoE3 && currentTime >= 4 && currentTime < 79;

  let embedUrl: string | null = null;
  if (hasServers && currentEp?.servers) {
    const server: Server =
      currentEp.servers[selectedServerIndex] ?? currentEp.servers[0];
    embedUrl = getServerEmbedUrl(server);
  } else if (currentEp?.driveId) {
    embedUrl = getEmbedUrl(currentEp.driveId);
  }

  const prevEp =
    currentIndex > 0 ? anime.episodes[currentIndex - 1] : undefined;
  const nextEp =
    currentIndex >= 0 && currentIndex < anime.episodes.length - 1
      ? anime.episodes[currentIndex + 1]
      : undefined;
  const showPrev = !!(prevEp?.driveId || prevEp?.servers?.length);
  const showNext = !!(nextEp?.driveId || nextEp?.servers?.length);

  const isMovie = anime.type === "Movie";

  return (
    <main className="min-h-screen" data-ocid="player.page">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6">
        {/* Header */}
        <motion.div
          className="flex items-center gap-4 mb-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <button
            type="button"
            onClick={() =>
              navigate({ to: "/anime/$id", params: { id: anime.id } })
            }
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors p-2 rounded-lg hover:bg-muted"
            data-ocid="player.back.button"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
          <div>
            <h1 className="font-black text-xl text-foreground">
              {anime.title}
            </h1>
            <p className="text-sm text-muted-foreground">
              {isMovie
                ? "Full Movie"
                : currentEp
                  ? `Episode ${currentEp.number}: ${currentEp.title}`
                  : ""}
            </p>
          </div>
        </motion.div>

        {/* Server Selector */}
        {hasServers && currentEp?.servers && (
          <motion.div
            className="flex gap-2 mb-4"
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {currentEp.servers.map((server, idx) => (
              <button
                key={server.name}
                type="button"
                onClick={() => setSelectedServerIndex(idx)}
                className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                style={{
                  background:
                    selectedServerIndex === idx
                      ? "oklch(0.82 0.18 198)"
                      : "oklch(0.15 0.028 248)",
                  color:
                    selectedServerIndex === idx
                      ? "oklch(0.07 0.025 250)"
                      : "oklch(0.82 0.18 198)",
                  border:
                    selectedServerIndex === idx
                      ? "none"
                      : "1px solid oklch(0.82 0.18 198 / 30%)",
                  boxShadow:
                    selectedServerIndex === idx
                      ? "0 0 12px oklch(0.82 0.18 198 / 40%)"
                      : "none",
                }}
                data-ocid={`player.server.button.${idx}`}
              >
                {server.name}
              </button>
            ))}
          </motion.div>
        )}

        {/* Video Player */}
        <motion.div
          key={`${episodeId}-${selectedServerIndex}`}
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          data-ocid="player.canvas_target"
          style={{
            position: "relative",
            border: "1px solid oklch(0.82 0.18 198 / 30%)",
            boxShadow:
              "0 0 40px oklch(0.82 0.18 198 / 20%), 0 20px 60px oklch(0 0 0 / 60%)",
            borderRadius: "1rem",
          }}
        >
          {embedUrl ? (
            <div
              style={{
                position: "relative",
                aspectRatio: "16/9",
                width: "100%",
                borderRadius: "1rem",
                overflow: "hidden",
              }}
            >
              <iframe
                ref={isVimeoE3 ? iframeRef : undefined}
                src={embedUrl}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                title={
                  isMovie
                    ? `${anime.title} — Full Movie`
                    : `${anime.title} — Episode ${currentEp?.number}`
                }
                onLoad={isVimeoE3 ? handleIframeLoad : undefined}
              />
            </div>
          ) : (
            <div
              className="w-full flex flex-col items-center justify-center gap-4 py-24"
              style={{
                background: "oklch(0.10 0.022 250)",
                borderRadius: "1rem",
              }}
              data-ocid="player.error_state"
            >
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center"
                style={{
                  background: "oklch(0.15 0.025 248)",
                  border: "2px solid oklch(0.82 0.18 198 / 20%)",
                }}
              >
                <Play
                  className="w-8 h-8"
                  style={{ color: "oklch(0.45 0.04 248)" }}
                />
              </div>
              <p className="text-muted-foreground font-semibold">
                Video not available yet
              </p>
              <p className="text-sm text-muted-foreground">
                This episode is coming soon
              </p>
            </div>
          )}

          {/* Skip Intro Button — outside overflow:hidden so it's always visible */}
          {showSkipIntro && (
            <motion.button
              type="button"
              onClick={handleSkipIntro}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.25 }}
              style={{
                position: "absolute",
                bottom: "20px",
                right: "20px",
                zIndex: 20,
                background: "oklch(0.10 0.022 250 / 92%)",
                border: "1px solid oklch(0.82 0.18 198 / 80%)",
                color: "oklch(0.82 0.18 198)",
                boxShadow: "0 0 20px oklch(0.82 0.18 198 / 50%)",
                backdropFilter: "blur(8px)",
                borderRadius: "0.5rem",
                padding: "10px 18px",
                fontWeight: "700",
                fontSize: "0.9rem",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "6px",
                pointerEvents: "auto",
              }}
              data-ocid="player.skip_intro.button"
            >
              <FastForward className="w-4 h-4" />
              Skip Intro
            </motion.button>
          )}
        </motion.div>

        {/* Episode info + navigation */}
        <motion.div
          className="mt-6 space-y-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <div
            className="rounded-xl p-5 border"
            style={{
              background: "oklch(0.12 0.025 248)",
              borderColor: "oklch(0.82 0.18 198 / 20%)",
            }}
          >
            <h2 className="font-black text-lg mb-2">
              {isMovie
                ? `${anime.title} — Full Movie`
                : currentEp
                  ? `Episode ${currentEp.number}: ${currentEp.title}`
                  : ""}
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {anime.synopsis}
            </p>
          </div>

          {/* Prev / Next navigation */}
          {!isMovie && (showPrev || showNext) && (
            <div className="flex gap-3">
              {showPrev && prevEp && (
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/watch/$animeId/$episodeId",
                      params: { animeId: anime.id, episodeId: prevEp.id },
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all"
                  style={{
                    background: "oklch(0.15 0.028 248)",
                    border: "1px solid oklch(0.82 0.18 198 / 20%)",
                    color: "oklch(0.82 0.18 198)",
                  }}
                  data-ocid="player.pagination_prev"
                >
                  <SkipBack className="w-4 h-4" />
                  Ep {prevEp.number}
                </button>
              )}
              {showNext && nextEp && (
                <button
                  type="button"
                  onClick={() =>
                    navigate({
                      to: "/watch/$animeId/$episodeId",
                      params: { animeId: anime.id, episodeId: nextEp.id },
                    })
                  }
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all neon-pulse"
                  style={{
                    background: "oklch(0.82 0.18 198)",
                    color: "oklch(0.07 0.025 250)",
                    boxShadow: "0 0 12px oklch(0.82 0.18 198 / 30%)",
                  }}
                  data-ocid="player.pagination_next"
                >
                  Ep {nextEp.number}
                  <SkipForward className="w-4 h-4" />
                </button>
              )}
            </div>
          )}

          {/* Episode list for quick navigation */}
          {!isMovie && anime.episodes.length > 1 && (
            <div
              className="rounded-xl p-4 border"
              style={{
                background: "oklch(0.10 0.022 250)",
                borderColor: "oklch(0.82 0.18 198 / 15%)",
              }}
            >
              <h3
                className="text-xs font-black uppercase tracking-wider mb-3"
                style={{ color: "oklch(0.82 0.18 198)" }}
              >
                Episodes
              </h3>
              <div className="flex flex-wrap gap-2">
                {anime.episodes
                  .filter((ep) => ep.driveId || ep.servers?.length)
                  .map((ep) => (
                    <button
                      key={ep.id}
                      type="button"
                      onClick={() =>
                        navigate({
                          to: "/watch/$animeId/$episodeId",
                          params: { animeId: anime.id, episodeId: ep.id },
                        })
                      }
                      className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                      style={{
                        background:
                          ep.id === episodeId
                            ? "oklch(0.82 0.18 198)"
                            : "oklch(0.15 0.028 248)",
                        color:
                          ep.id === episodeId
                            ? "oklch(0.07 0.025 250)"
                            : "oklch(0.82 0.18 198)",
                        border:
                          ep.id === episodeId
                            ? "none"
                            : "1px solid oklch(0.82 0.18 198 / 25%)",
                        boxShadow:
                          ep.id === episodeId
                            ? "0 0 10px oklch(0.82 0.18 198 / 40%)"
                            : "none",
                      }}
                      data-ocid={`player.episode.button.${ep.number}`}
                    >
                      EP {ep.number}
                    </button>
                  ))}
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </main>
  );
}
