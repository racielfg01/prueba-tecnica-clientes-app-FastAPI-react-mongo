// Tipos para Cliente
export interface Cliente {
  id: string
  nombre: string
  apellidos: string
  identificacion: string
  telefonoCelular: string
  otroTelefono?: string
  direccion: string
  fnacimiento: string
  fAfliacion: string
  sexo: 'M' | 'F'
  resenaPersonal?: string
  imagen?: string
  interesesId?: string
  interesesFK?: string
  usuarioId?: string
  celular?: string
}

export interface ClienteCreate {
  nombre: string
  apellidos: string
  identificacion: string
  telefonoCelular: string
  otroTelefono?: string
  direccion: string
  fnacimiento: string
  fAfliacion: string
  sexo: 'M' | 'F'
  resenaPersonal?: string
  imagen?: string
  interesesFK: string
  usuarioId: string
}

export interface ClienteUpdate {
  id: string
  nombre: string
  apellidos: string
  identificacion: string
  celular: string
  otroTelefono?: string
  direccion: string
  fnacimiento: string
  fAfliacion: string
  sexo: 'M' | 'F'
  resenaPersonal?: string
  imagen?: string
  interesesFK: string
  usuarioId: string
}

// Tipos para Autenticación
export interface LoginRequest {
  username: string
  password: string
}

export interface LoginResponse {
  success: boolean
  token: string
  userid: string
  username: string
  expiration?: string
}

export interface RegisterRequest {
  username: string
  email: string
  password: string
}

export interface RegisterResponse {
  success: boolean
  message: string
}

// Tipos para Intereses
export interface Interes {
  id: string
  nombre: string
}

// Tipos para Filtros
export interface ClienteFilters {
  identification: string
  nombre: string
}

// Tipos para Modal
export interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
}

// Tipos para LoadingSpinner
export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  fullScreen?: boolean
}

// Tipos para Layout
export interface LayoutProps {
  children: React.ReactNode
}

// Tipos para PrivateRoute
export interface PrivateRouteProps {
  children: React.ReactNode
}