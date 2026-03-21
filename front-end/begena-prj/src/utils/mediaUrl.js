const ABSOLUTE_URL_REGEX = /^(https?:)?\/\//i;

export function normalizeMediaUrl(url, fallback = "", apiBaseUrl = "") {
  const raw = typeof url === "string" ? url.trim() : "";
  if (!raw) return fallback;
  if (ABSOLUTE_URL_REGEX.test(raw) || raw.startsWith("/")) return raw;

  const normalizedBase = (apiBaseUrl || "").replace(/\/$/, "");
  if (!normalizedBase) return raw;
  return `${normalizedBase}/uploads/${raw}`;
}

export function normalizeSongMedia(song, apiBaseUrl = "") {
  const audioCandidate = song?.audioUrl || song?.url || "";
  const posterCandidate = song?.posterUrl || "";

  return {
    ...song,
    audioUrl: normalizeMediaUrl(audioCandidate, "", apiBaseUrl),
    posterUrl: normalizeMediaUrl(
      posterCandidate,
      "/default-poster.jpg",
      apiBaseUrl,
    ),
    artist: song?.artist || "Unknown Artist",
  };
}
