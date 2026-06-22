import axios from 'axios';

// CORRETO - Isso lê a variável que configuramos na Vercel
export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});
// Adiciona o token em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('@ControleGastos:token');

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
