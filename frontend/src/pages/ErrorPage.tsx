import  { type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaHome, FaArrowLeft } from 'react-icons/fa';

const ErrorPage = (): JSX.Element => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="text-center">
        {/* Animación del error */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="text-9xl font-bold text-gray-700 animate-pulse">404</div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-32 h-32 bg-blue-500 rounded-full opacity-20 animate-ping"></div>
            </div>
          </div>
        </div>

        {/* Mensaje de error */}
        <h1 className="text-4xl font-bold text-white mb-4">Página No Encontrada</h1>
        <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto">
          Lo sentimos, la página que estás buscando no existe o ha sido movida.
        </p>

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition duration-200"
          >
            <FaArrowLeft />
            Volver Atrás
          </button>
          
          <button
            onClick={() => navigate('/')}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200"
          >
            <FaHome />
            Ir al Inicio
          </button>
        </div>

        {/* Información adicional */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <p className="text-gray-500 text-sm">
            ¿Necesitas ayuda? Contacta a soporte@innovasoft.com
          </p>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;