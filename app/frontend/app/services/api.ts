// // frontend/services/api.ts
// import axios from 'axios';

// // Helper to read token from cookie
// function getTokenFromCookie() {
//   if (typeof document === 'undefined') return null;

//   const match = document.cookie.match(/token=([^;]+)/);
//   return match ? decodeURIComponent(match[1]) : null;
// }

// const api = axios.create({
//   baseURL: 'http://localhost:5000',
//   withCredentials: true,
// });

// // Interceptor → attach token before every request
// api.interceptors.request.use((config) => {
//   if (typeof window !== 'undefined') {
//     const token = localStorage.getItem('token');
//   }
//   return config;
// });
// export default api;
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  config.headers = config.headers || {};

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

export default api;
