import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://baitech.kg/";
export const WSS_URL = 'baitech';

export const $api = axios.create({
  baseURL: BASE_URL,
});

$api.interceptors.request.use((config) => {
if (!config.headers.Authorization) {
  const userToken = typeof window !== "undefined"
    ? localStorage.getItem("access_token")
    : null;
  const adminToken = typeof window !== "undefined"
    ? localStorage.getItem("adminToken")
    : null;

  const token = adminToken || userToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
} 
  if (typeof window !== "undefined") {
    const currentLanguage = localStorage.getItem("language") || "ru";
    config.headers["Accept-Language"] = currentLanguage;
  }

  config.headers["ngrok-skip-browser-warning"] = "true";
  
  return config;
}, (error) => Promise.reject(error));


$api.interceptors.response.use(
  (response) => {
    const lang = localStorage.getItem("language") || "ru";

    const translate = (obj) => {
      if (Array.isArray(obj)) return obj.map(translate);
      if (obj && typeof obj === "object") {
        const newObj = {};
        for (const key in obj) {
          if (key.endsWith("_ru") || key.endsWith("_en") || key.endsWith("_ky")) continue;
          const translated = obj[`${key}_${lang}`] ?? obj[`${key}_ru`] ?? obj[key];
          newObj[key] = translate(translated);
        }
        return newObj;
      }
      return obj;
    };

    response.data = translate(response.data);
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      if (typeof window !== "undefined") {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChange'));
      }
    }
    return Promise.reject(error);
  }
);