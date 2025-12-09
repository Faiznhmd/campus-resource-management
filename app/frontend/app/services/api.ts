import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  if (!config.headers) config.headers = {};

  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }

  return config;
});

export default api;

// import axios from 'axios';

// // Read JWT token from cookie
// function getTokenFromCookie() {
//   if (typeof document === 'undefined') return null;

//   const match = document.cookie.match(/token=([^;]+)/);
//   return match ? decodeURIComponent(match[1]) : null;
// }

// const api = axios.create({
//   baseURL: 'http://localhost:5000',
//   withCredentials: true, // important for cookie auth
// });

// // Attach Authorization header from cookie token
// api.interceptors.request.use((config) => {
//   const token = getTokenFromCookie();

//   if (!config.headers) config.headers = {};

//   if (token) {
//     config.headers['Authorization'] = `Bearer ${token}`;
//   }

//   return config;
// });

// export default api;
