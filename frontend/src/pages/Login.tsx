import  { useState, useEffect, type JSX } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';

const Login = (): JSX.Element => {
  const navigate = useNavigate();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [rememberMe, setRememberMe] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const savedUsername = localStorage.getItem('rememberedUsername');
    if (savedUsername) {
      setUsername(savedUsername);
      setRememberMe(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    if (!username.trim() || !password.trim()) {
      toast.error('Usuario y contraseña son requeridos');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.login(username, password);
      if (response.data.success) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userid', response.data.userid);
        localStorage.setItem('username', response.data.username);
        
        if (rememberMe) {
          localStorage.setItem('rememberedUsername', username);
        } else {
          localStorage.removeItem('rememberedUsername');
        }
        
        toast.success(`¡Bienvenido ${response.data.username}!`);
        navigate('/');
      }
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || 'Error al iniciar sesión';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-gray-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden transform transition-all animate-slideIn">
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-white text-center">Innovasoft S.A</h1>
          <p className="text-blue-100 text-center mt-2 text-sm sm:text-base">Sistema de Gestión de Clientes</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 sm:p-8">
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field"
              placeholder="Ingrese su usuario"
              disabled={loading}
            />
          </div>
          
          <div className="mb-4 sm:mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              placeholder="Ingrese su contraseña"
              disabled={loading}
            />
          </div>
          
          <div className="mb-4 sm:mb-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="mr-2"
                disabled={loading}
              />
              <span className="text-gray-700 text-sm sm:text-base">Recuérdame</span>
            </label>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
          >
            {loading ? <LoadingSpinner size="sm" /> : 'INICIAR SESIÓN'}
          </button>
        </form>
        
        <div className="text-center pb-6 sm:pb-8 px-4">
          <Link to="/register" className="text-blue-600 hover:text-blue-800 transition duration-200 text-sm sm:text-base">
            ¿No tiene una cuenta? Regístrese
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;