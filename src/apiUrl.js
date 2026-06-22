// Para activar la API real desde otro entorno, crea un archivo .env con:
// REACT_APP_API_URL=http://localhost:4000/api/v1
const DEFAULT_API_URL = "http://localhost:4000/api/v1";

export const apiUrl = (process.env.REACT_APP_API_URL || DEFAULT_API_URL).replace(/\/$/, "");

export const buildApiUrl = (path = "") => {
  if (!path) return apiUrl;
  return `${apiUrl}${path.startsWith("/") ? path : `/${path}`}`;
};
