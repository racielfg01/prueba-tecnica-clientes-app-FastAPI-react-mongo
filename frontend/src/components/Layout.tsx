import  { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaBars, FaTimes, FaUser, FaHome, FaUsers, FaSignOutAlt } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { authService } from '../services/api';
import type { LayoutProps } from '../types';

const Layout = ({ children }: LayoutProps): JSX.Element => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const username = localStorage.getItem('username');

  const handleLogout = async (): Promise<void> => {
    try {
      await authService.logout(username);
      localStorage.removeItem('token');
      localStorage.removeItem('userid');
      localStorage.removeItem('username');
      toast.success('Sesión cerrada correctamente');
      navigate('/login');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      localStorage.clear();
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      {/* Navbar */}
      <nav className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg sticky top-0 z-50">
        <div className="px-4 py-3 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="text-white hover:text-gray-300 transition duration-200"
            >
              {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
            </button>
            <h1 className="text-xl font-bold">Innovasoft S.A</h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <span className="hidden sm:flex items-center gap-2">
              <FaUser />
              {username}
            </span>
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-3 py-2 sm:px-4 rounded-lg transition duration-200 flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
            >
              <FaSignOutAlt />
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Sidebar y contenido principal */}
      <div className="flex flex-1 relative">
        {/* Sidebar overlay para móviles */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside
          className={`bg-white shadow-lg transition-all duration-300 ${
            sidebarOpen ? 'w-64' : 'w-0 overflow-hidden'
          } fixed md:relative z-40 h-[calc(100vh-64px)] md:h-auto`}
        >
          <div className="p-4 space-y-2">
            <button
              onClick={() => { navigate('/'); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition duration-200"
            >
              <FaHome />
              <span>Inicio</span>
            </button>
            <button
              onClick={() => { navigate('/clientes'); setSidebarOpen(false); }}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-blue-50 rounded-lg transition duration-200"
            >
              <FaUsers />
              <span>Clientes</span>
            </button>
          </div>
        </aside>

        {/* Contenido principal */}
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;