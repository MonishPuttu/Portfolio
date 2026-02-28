const API_URL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000/api" : undefined);

if (!API_URL) {
  console.error(
    "VITE_API_URL is not set. API calls will fail. Set it in your .env file.",
  );
}

export default API_URL;
