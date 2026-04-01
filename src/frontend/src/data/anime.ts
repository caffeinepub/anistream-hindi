export interface Server {
  name: string;
  url: string;
  type: "drive" | "vimeo" | "external";
}

export interface Episode {
  id: string;
  number: number;
  title: string;
  driveId?: string;
  servers?: Server[];
}

export interface Anime {
  id: string;
  title: string;
  type: "TV Series" | "Movie";
  year: number;
  rating: number;
  genres: string[];
  language: string;
  status: string;
  totalEpisodes: number;
  synopsis: string;
  poster: string;
  mainCharacters: string[];
  episodes: Episode[];
}

export function getEmbedUrl(driveId: string): string {
  return `https://drive.google.com/file/d/${driveId}/preview`;
}

export function getVimeoEmbedUrl(vimeoUrl: string): string {
  const match = vimeoUrl.match(/vimeo\.com\/(\d+)/);
  if (match) {
    return `https://player.vimeo.com/video/${match[1]}?autoplay=1&title=0&byline=0&portrait=0&dnt=1&fullscreen=1`;
  }
  return vimeoUrl;
}

export function getServerEmbedUrl(server: Server): string {
  if (server.type === "drive") {
    const match = server.url.match(/\/d\/([^/]+)/);
    return match ? getEmbedUrl(match[1]) : server.url;
  }
  if (server.type === "vimeo") {
    return getVimeoEmbedUrl(server.url);
  }
  return server.url;
}

export function getAnimeById(id: string): Anime | undefined {
  return ANIME_DATA.find((a) => a.id === id);
}

export function getAllEpisodes(anime: Anime): Episode[] {
  if (anime.type === "Movie") {
    return anime.episodes;
  }
  return Array.from({ length: anime.totalEpisodes }, (_, i) => {
    const num = i + 1;
    const found = anime.episodes.find((ep) => ep.number === num);
    return (
      found ?? {
        id: `ep${num}`,
        number: num,
        title: `Episode ${num}`,
        driveId: undefined,
      }
    );
  });
}

export const ANIME_DATA: Anime[] = [
  {
    id: "death-note",
    title: "Death Note",
    type: "TV Series",
    year: 2006,
    rating: 9.0,
    genres: ["Thriller", "Mystery", "Supernatural", "Psychological"],
    language: "Hindi Dub",
    status: "Completed",
    totalEpisodes: 37,
    synopsis:
      "A brilliant high school student named Light Yagami discovers a mysterious notebook that kills anyone whose name is written in it. He uses this power to cleanse the world of crime, but a genius detective known only as L is closing in on him.",
    poster:
      "/assets/screenshot_20260331_030145_2-019d40ab-f4a7-7234-9f8d-57491c94f1bc.jpg",
    mainCharacters: ["Light Yagami", "L Lawliet", "Ryuk", "Misa Amane"],
    episodes: [
      {
        id: "e2",
        number: 2,
        title: "Confrontation",
        driveId: "11VaV35YkGr88mjTxEUbCErXZNMsCwrUd",
      },
      {
        id: "e3",
        number: 3,
        title: "Dealings",
        driveId: "1wPCFNhqqF5cAb2LPjrW3tIiBL4na6734",
        servers: [
          {
            name: "Server 1",
            url: "https://vimeo.com/1178920316",
            type: "vimeo",
          },
          {
            name: "Server 2",
            url: "https://drive.google.com/file/d/1wPCFNhqqF5cAb2LPjrW3tIiBL4na6734/view",
            type: "drive",
          },
        ],
      },
      {
        id: "e4",
        number: 4,
        title: "Pursuit",
        driveId: "1VjZPk3KuZBIpWwEVY2xz_YfCeby-kTTq",
      },
      {
        id: "e5",
        number: 5,
        title: "Tactics",
        driveId: "1g1zNCw6FhG_bj5Co1DSj4n1_fF3QPigY",
      },
    ],
  },
  {
    id: "your-name",
    title: "Your Name",
    type: "Movie",
    year: 2016,
    rating: 8.4,
    genres: ["Romance", "Fantasy", "Drama"],
    language: "Hindi Dub",
    status: "Completed",
    totalEpisodes: 1,
    synopsis:
      "Two strangers who have never met begin mysteriously swapping bodies. As they try to understand their strange connection, they discover their destinies are deeply intertwined.",
    poster: "/assets/your_name-019d40ac-013e-7065-99e2-17e706bf48af.png",
    mainCharacters: ["Taki Tachibana", "Mitsuha Miyamizu"],
    episodes: [
      {
        id: "movie",
        number: 1,
        title: "Your Name (Full Movie)",
        driveId: "1fjCbo6ksP7jfEmED1NMJn9dl8sn93Xig",
      },
    ],
  },
  {
    id: "buddy-daddies",
    title: "Buddy Daddies",
    type: "TV Series",
    year: 2023,
    rating: 7.8,
    genres: ["Action", "Comedy", "Slice of Life"],
    language: "Hindi Dub",
    status: "Completed",
    totalEpisodes: 13,
    synopsis:
      "Two skilled assassins are suddenly forced to care for a young girl. Now they must balance their dangerous lives with raising an innocent child.",
    poster:
      "/assets/img_20260331_030000-019d40ab-fe33-7258-8b77-4a1e1f8608f2.jpg",
    mainCharacters: ["Kazuki Kurusu", "Rei Suwa", "Miri Unasaka"],
    episodes: [],
  },
];
