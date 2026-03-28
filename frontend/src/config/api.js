const DEV_FALLBACK_API_URL = "http://localhost:5000/api";

const rawApiUrl =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? DEV_FALLBACK_API_URL : undefined);

const hasProtocol = (value) => /^[a-zA-Z][a-zA-Z\d+\-.]*:\/\//.test(value);

const normalizeApiUrl = (value) => {
  if (!value) return value;

  const normalizedInput = String(value).trim();

  if (!import.meta.env.DEV) {
    // Production must provide a fully qualified URL.
    if (!hasProtocol(normalizedInput)) {
      return null;
    }

    try {
      new URL(normalizedInput);
    } catch {
      return null;
    }

    const trimmed = normalizedInput.replace(/\/+$/, "");
    return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
  }

  // Development supports malformed local values like ":5001/api" and host:port.
  const withProtocol = normalizedInput.startsWith(":")
    ? `http://localhost${normalizedInput}`
    : hasProtocol(normalizedInput)
      ? normalizedInput
      : `http://${normalizedInput}`;

  const trimmed = withProtocol.replace(/\/+$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
};

const API_URL = normalizeApiUrl(rawApiUrl);

if (!API_URL) {
  console.error(
    "VITE_API_URL is missing or invalid. In production it must be a fully qualified URL (for example, https://api.example.com/api).",
  );
}

export default API_URL;
