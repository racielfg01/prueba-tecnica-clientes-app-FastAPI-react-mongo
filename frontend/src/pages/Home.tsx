import  { type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUsers, FaUserPlus, FaChartLine, FaShieldAlt } from 'react-icons/fa';
import Layout from '../components/Layout';

const Home = (): JSX.Element => {
  const navigate = useNavigate();
  const username = localStorage.getItem('username');

  const stats = [
    { title: 'Clientes Activos', value: '0', icon: FaUsers, color: 'bg-blue-500' },
    { title: 'Registros Hoy', value: '0', icon: FaUserPlus, color: 'bg-green-500' },
    { title: 'Tasa de Crecimiento', value: '0%', icon: FaChartLine, color: 'bg-purple-500' },
    { title: 'Seguridad', value: 'Alta', icon: FaShieldAlt, color: 'bg-red-500' },
  ];

  const quickActions = [
    { title: 'Gestionar Clientes', description: 'Ver, crear, editar y eliminar clientes', action: () => navigate('/clientes'), icon: FaUsers, color: 'text-blue-600' },
    { title: 'Nuevo Cliente', description: 'Registrar un nuevo cliente en el sistema', action: () => navigate('/clientes/nuevo'), icon: FaUserPlus, color: 'text-green-600' },
  ];

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        {/* Bienvenida */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 rounded-lg shadow-lg p-4 sm:p-6 text-white">
          <h1 className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">
            ¡Bienvenido, {username}!
          </h1>
          <p className="text-blue-100 text-sm sm:text-base">
            Panel de control del Sistema de Gestión de Clientes Innovasoft S.A
          </p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 sm:p-6 transition-transform hover:scale-105">
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <div className={`${stat.color} p-2 sm:p-3 rounded-lg`}>
                    <Icon className="text-white text-lg sm:text-xl" />
                  </div>
                  <span className="text-xl sm:text-2xl font-bold text-gray-800">{stat.value}</span>
                </div>
                <h3 className="text-gray-600 font-medium text-sm sm:text-base">{stat.title}</h3>
              </div>
            );
          })}
        </div>

        {/* Acciones Rápidas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <button
                key={index}
                onClick={action.action}
                className="bg-white rounded-lg shadow-md p-4 sm:p-6 text-left transition-all hover:shadow-lg hover:scale-105"
              >
                <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3">
                  <Icon className={`${action.color} text-2xl sm:text-3xl`} />
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{action.title}</h3>
                </div>
                <p className="text-gray-600 text-sm sm:text-base">{action.description}</p>
              </button>
            );
          })}
        </div>

        {/* Información del Sistema */}
        <div className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4">Información del Sistema</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <p className="text-sm text-gray-500">Versión</p>
              <p className="font-medium text-gray-800">1.0.0</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Última Actualización</p>
              <p className="font-medium text-gray-800">{new Date().toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Estado</p>
              <p className="font-medium text-green-600">Activo</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Soporte</p>
              <p className="font-medium text-gray-800 text-sm sm:text-base">soporte@innovasoft.com</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Home;