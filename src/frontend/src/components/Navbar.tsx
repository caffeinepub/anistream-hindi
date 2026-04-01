import { ANIME_DATA, type Anime, type Episode } from "@/data/anime";
import { Link, useNavigate } from "@tanstack/react-router";
import { Film, Home, Search, Tv, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface AnimeResult {
  kind: "anime";
  anime: Anime;
}
interface EpisodeResult {
  kind: "episode";
  anime: Anime;
  episode: Episode;
}
interface GenreResult {
  kind: "genre";
  genre: string;
  animes: Anime[];
}

type SearchResult = AnimeResult | EpisodeResult | GenreResult;

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  }, [searchOpen]);

  useEffect(() => {
    const q = query.trim().toLowerCase();

    if (!q) {
      // Show all anime when empty
      setResults(
        ANIME_DATA.map((anime) => ({ kind: "anime" as const, anime })),
      );
      return;
    }

    const found: SearchResult[] = [];

    // Anime matches
    for (const anime of ANIME_DATA) {
      if (anime.title.toLowerCase().includes(q)) {
        found.push({ kind: "anime", anime });
      }
    }

    // Episode matches
    for (const anime of ANIME_DATA) {
      for (const episode of anime.episodes) {
        if (
          episode.title.toLowerCase().includes(q) ||
          `episode ${episode.number}`.includes(q) ||
          `ep ${episode.number}`.includes(q) ||
          String(episode.number) === q
        ) {
          found.push({ kind: "episode", anime, episode });
        }
      }
    }

    // Genre matches
    const genreMap = new Map<string, Anime[]>();
    for (const anime of ANIME_DATA) {
      for (const genre of anime.genres) {
        if (genre.toLowerCase().includes(q)) {
          if (!genreMap.has(genre)) genreMap.set(genre, []);
          genreMap.get(genre)!.push(anime);
        }
      }
    }
    for (const [genre, animes] of genreMap.entries()) {
      found.push({ kind: "genre", genre, animes });
    }

    setResults(found);
  }, [query]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setSearchOpen(false);
        setQuery("");
      }
    }
    if (searchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchOpen]);

  function handleAnimeClick(id: string) {
    navigate({ to: "/anime/$id", params: { id } });
    setSearchOpen(false);
    setQuery("");
  }

  function handleEpisodeClick(animeId: string, episodeId: string) {
    navigate({
      to: "/watch/$animeId/$episodeId",
      params: { animeId, episodeId },
    });
    setSearchOpen(false);
    setQuery("");
  }

  return (
    <header
      className="sticky top-0 z-50 w-full"
      style={{
        background: "oklch(0.07 0.025 250 / 90%)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid oklch(0.82 0.18 198 / 20%)",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-6">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 flex-shrink-0"
          data-ocid="nav.link"
        >
          <img
            src="/assets/uploads/app-019d2e93-b1a3-729e-b00d-b2e8ff0a484b-1.png"
            alt="AniStream Logo"
            className="w-9 h-9 rounded-full object-cover"
            style={{
              border: "2px solid oklch(0.82 0.18 198)",
              boxShadow:
                "0 0 10px oklch(0.82 0.18 198 / 60%), 0 0 20px oklch(0.82 0.18 198 / 30%)",
            }}
          />
          <div className="flex flex-col leading-none">
            <span className="font-black text-base tracking-widest uppercase text-cyan-glow">
              AniStream
            </span>
            <span
              className="text-[10px] font-semibold tracking-wider uppercase"
              style={{ color: "oklch(0.78 0.17 80)" }}
            >
              Hindi
            </span>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 flex-1">
          <Link
            to="/"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            data-ocid="nav.home.link"
          >
            <Home className="w-4 h-4" />
            Home
          </Link>
          <Link
            to="/browse"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            data-ocid="nav.browse.link"
          >
            <Tv className="w-4 h-4" />
            Browse
          </Link>
          <Link
            to="/movies"
            className="text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1.5"
            data-ocid="nav.movies.link"
          >
            <Film className="w-4 h-4" />
            Movies
          </Link>
        </nav>

        {/* Search */}
        <div className="flex items-center gap-3 ml-auto" ref={containerRef}>
          {searchOpen ? (
            <div className="relative">
              <div
                className="flex items-center rounded-full px-4 py-1.5 gap-2"
                style={{
                  background: "oklch(0.15 0.028 248)",
                  border: "1px solid oklch(0.82 0.18 198 / 40%)",
                }}
              >
                <Search
                  className="w-4 h-4 shrink-0"
                  style={{ color: "oklch(0.82 0.18 198)" }}
                />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search anime, episodes, genres..."
                  className="bg-transparent text-sm outline-none w-52"
                  style={{ color: "oklch(0.97 0 0)" }}
                  data-ocid="nav.search_input"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchOpen(false);
                    setQuery("");
                  }}
                  className="p-0.5 rounded-full hover:bg-muted transition-colors"
                  data-ocid="nav.search.close_button"
                >
                  <X
                    className="w-3.5 h-3.5"
                    style={{ color: "oklch(0.82 0.18 198)" }}
                  />
                </button>
              </div>

              {/* Dropdown */}
              <div
                className="absolute top-full mt-2 right-0 w-80 rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto"
                style={{
                  background: "oklch(0.1 0.03 250)",
                  border: "1px solid oklch(0.82 0.18 198 / 30%)",
                  boxShadow: "0 8px 32px oklch(0 0 0 / 60%)",
                }}
                data-ocid="nav.search.dropdown_menu"
              >
                {results.length === 0 ? (
                  <p
                    className="text-sm text-muted-foreground px-4 py-3"
                    data-ocid="nav.search.empty_state"
                  >
                    No results found
                  </p>
                ) : (
                  <>
                    {/* Anime results */}
                    {results.filter((r) => r.kind === "anime").length > 0 && (
                      <>
                        <div
                          className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
                          style={{
                            color: "oklch(0.82 0.18 198)",
                            borderBottom:
                              "1px solid oklch(0.82 0.18 198 / 15%)",
                          }}
                        >
                          Anime
                        </div>
                        {results
                          .filter((r): r is AnimeResult => r.kind === "anime")
                          .map((r, i) => (
                            <button
                              key={r.anime.id}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleAnimeClick(r.anime.id);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                              data-ocid={`nav.search.anime.${i + 1}`}
                            >
                              <img
                                src={r.anime.poster}
                                alt={r.anime.title}
                                className="w-9 h-12 rounded object-cover shrink-0"
                                style={{
                                  border:
                                    "1px solid oklch(0.82 0.18 198 / 20%)",
                                }}
                              />
                              <div className="flex flex-col min-w-0">
                                <span
                                  className="text-sm font-semibold truncate"
                                  style={{ color: "oklch(0.97 0 0)" }}
                                >
                                  {r.anime.title}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {r.anime.type} · {r.anime.year}
                                </span>
                                <span
                                  className="text-xs"
                                  style={{ color: "oklch(0.78 0.17 80)" }}
                                >
                                  ⭐ {r.anime.rating.toFixed(1)}
                                </span>
                              </div>
                            </button>
                          ))}
                      </>
                    )}

                    {/* Episode results */}
                    {results.filter((r) => r.kind === "episode").length > 0 && (
                      <>
                        <div
                          className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
                          style={{
                            color: "oklch(0.72 0.19 48)",
                            borderTop: "1px solid oklch(0.82 0.18 198 / 15%)",
                            borderBottom:
                              "1px solid oklch(0.82 0.18 198 / 15%)",
                          }}
                        >
                          Episodes
                        </div>
                        {results
                          .filter(
                            (r): r is EpisodeResult => r.kind === "episode",
                          )
                          .map((r, i) => (
                            <button
                              key={`${r.anime.id}-${r.episode.id}`}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleEpisodeClick(r.anime.id, r.episode.id);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                              data-ocid={`nav.search.episode.${i + 1}`}
                            >
                              <div
                                className="w-9 h-12 rounded shrink-0 flex items-center justify-center text-xs font-bold"
                                style={{
                                  background: "oklch(0.15 0.04 250)",
                                  border: "1px solid oklch(0.72 0.19 48 / 40%)",
                                  color: "oklch(0.72 0.19 48)",
                                }}
                              >
                                EP{r.episode.number}
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span
                                  className="text-sm font-semibold truncate"
                                  style={{ color: "oklch(0.97 0 0)" }}
                                >
                                  {r.episode.title}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {r.anime.title} · Ep {r.episode.number}
                                </span>
                                <span
                                  className="text-xs"
                                  style={{
                                    color:
                                      r.episode.driveId || r.episode.servers
                                        ? "oklch(0.7 0.18 145)"
                                        : "oklch(0.5 0.05 250)",
                                  }}
                                >
                                  {r.episode.driveId || r.episode.servers
                                    ? "Available"
                                    : "Coming Soon"}
                                </span>
                              </div>
                            </button>
                          ))}
                      </>
                    )}

                    {/* Genre results */}
                    {results.filter((r) => r.kind === "genre").length > 0 && (
                      <>
                        <div
                          className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-widest"
                          style={{
                            color: "oklch(0.75 0.18 300)",
                            borderTop: "1px solid oklch(0.82 0.18 198 / 15%)",
                            borderBottom:
                              "1px solid oklch(0.82 0.18 198 / 15%)",
                          }}
                        >
                          Genres
                        </div>
                        {results
                          .filter((r): r is GenreResult => r.kind === "genre")
                          .map((r, i) => (
                            <button
                              key={r.genre}
                              type="button"
                              onMouseDown={(e) => {
                                e.preventDefault();
                                handleAnimeClick(r.animes[0].id);
                              }}
                              className="w-full flex items-center gap-3 px-3 py-2.5 hover:bg-white/5 transition-colors text-left"
                              data-ocid={`nav.search.genre.${i + 1}`}
                            >
                              <div
                                className="w-9 h-12 rounded shrink-0 flex items-center justify-center text-lg"
                                style={{
                                  background: "oklch(0.15 0.04 300)",
                                  border:
                                    "1px solid oklch(0.75 0.18 300 / 40%)",
                                }}
                              >
                                🎭
                              </div>
                              <div className="flex flex-col min-w-0">
                                <span
                                  className="text-sm font-semibold truncate"
                                  style={{ color: "oklch(0.97 0 0)" }}
                                >
                                  {r.genre}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  {r.animes.map((a) => a.title).join(", ")}
                                </span>
                              </div>
                            </button>
                          ))}
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="p-2 rounded-full hover:bg-muted transition-colors"
              data-ocid="nav.search.button"
            >
              <Search
                className="w-5 h-5"
                style={{ color: "oklch(0.82 0.18 198)" }}
              />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
