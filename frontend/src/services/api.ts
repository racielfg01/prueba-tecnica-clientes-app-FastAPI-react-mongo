import axios from 'axios';
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosError } from 'axios';
import type { 
  LoginResponse, 
  RegisterResponse,
  Cliente,
  ClienteCreate,
  ClienteUpdate,
  Interes 
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// Interceptor para agregar token
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores 401
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: (username: string, password: string) => 
    api.post<LoginResponse>('/auth/login', { username, password }),
  
  register: (username: string, email: string, password: string) => 
    api.post<RegisterResponse>('/auth/register', { username, email, password }),
  
  logout: (username: string | null) => 
    api.post('/auth/logout', null, { params: { username } }),
};

export const clientesService = {
  listar: (identification: string, nombre: string, usuarioId: string | null) => 
    api.post<Cliente[]>('/clientes/listar', null, { 
      params: { identification, nombre, usuarioId } 
    }),
  
  obtener: (clienteId: string) => 
    api.get<Cliente>(`/clientes/obtener/${clienteId}`),
  
  crear: (data: ClienteCreate) => 
    api.post('/clientes/crear', data),
  
  actualizar: (data: ClienteUpdate) => 
    api.post('/clientes/actualizar', data),
  
  eliminar: (clienteId: string, usuarioId: string | null) => 
    api.delete(`/clientes/eliminar/${clienteId}`, { params: { usuarioId } }),
};

export const interesesService = {
  listar: () => api.get<Interes[]>('/intereses/listado'),
};

export default api;