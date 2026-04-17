const apiPrefix = "/api/v2";

const baseURL =
  import.meta.env.VITE_APP_API_BASE_URL || "http://localhost:5050";

const appName = import.meta.env.VITE_APP_NAME || "Medicine";

export { baseURL, apiPrefix, appName };
