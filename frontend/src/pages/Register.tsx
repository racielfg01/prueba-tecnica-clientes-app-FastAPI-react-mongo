import  { useState, type JSX } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Register = (): JSX.Element => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState<boolean>(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = (): boolean => {
    if (!formData.username.trim() || !formData.email.trim() || !formData.password.trim()) {
      toast.error('Todos los campos son obligatorios');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error('Ingrese un correo electrónico válido');
      return false;
    }

    if (formData.password.length < 8 || formData.password.length > 20) {
      toast.error('La contraseña debe tener entre 8 y 20 caracteres');
      return false;
    }

    if (!/[A-Z]/.test(formData.password)) {
      toast.error('La contraseña debe tener al menos una mayúscula');
      return false;
    }

    if (!/[a-z]/.test(formData.password)) {
      toast.error('La contraseña debe tener al menos una minúscula');
      return false;
    }

    if (!/[0-9]/.test(formData.password)) {
      toast.error('La contraseña debe tener al menos un número');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      await authService.register(formData.username, formData.email, formData.password);
      toast.success('Usuario creado correctamente');
      navigate('/login');
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Error al registrar usuario';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slideIn">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">Crear Cuenta</h1>
          <p className="text-blue-100 text-center mt-2 text-sm sm:text-base">Regístrate para comenzar</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Usuario <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="input-field"
              placeholder="Ingrese su usuario"
              disabled={loading}
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Correo Electrónico <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="input-field"
              placeholder="usuario@ejemplo.com"
              disabled={loading}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="input-field"
              placeholder="Mínimo 8 caracteres"
              disabled={loading}
            />
            <p className="text-xs text-gray-500 mt-1">
              Debe tener entre 8-20 caracteres, una mayúscula, una minúscula y un número
            </p>
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Confirmar Contraseña <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="input-field"
              placeholder="Repita su contraseña"
              disabled={loading}
            />
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'REGISTRARSE'}
          </button>
        </form>
        
        <div className="text-center pb-6 sm:pb-8 px-4">
          <Link to="/login" className="text-blue-600 hover:text-blue-800 transition duration-200 text-sm sm:text-base">
            ¿Ya tiene una cuenta? Inicie Sesión
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;