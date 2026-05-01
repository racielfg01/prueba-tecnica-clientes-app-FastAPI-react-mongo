import  { useState, useEffect, useCallback, type JSX } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaArrowLeft, FaEye } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { clientesService } from '../services/api';
import Layout from '../components/Layout';
import Modal from '../components/Modal';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Cliente, ClienteFilters } from '../types';

const ClientesList = (): JSX.Element => {
  const navigate = useNavigate();
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [filters, setFilters] = useState<ClienteFilters>({ identification: '', nombre: '' });
  const [loading, setLoading] = useState<boolean>(false);
  const [showDeleteModal, setShowDeleteModal] = useState<boolean>(false);
  const [selectedCliente, setSelectedCliente] = useState<Cliente | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);

  const usuarioId = localStorage.getItem('userid');

  const loadClientes = useCallback(async (): Promise<void> => {
    if (!usuarioId) return;
    
    setLoading(true);
    try {
      const response = await clientesService.listar(
        filters.identification,
        filters.nombre,
        usuarioId
      );
      setClientes(response.data || []);
    } catch (error) {
      toast.error('Error al cargar clientes');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [filters.identification, filters.nombre, usuarioId]);

  useEffect(() => {
    loadClientes();
  }, [loadClientes]);

  const handleSearch = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    loadClientes();
  };

  const handleDelete = async (): Promise<void> => {
    if (!selectedCliente) return;
    
    try {
      await clientesService.eliminar(selectedCliente.id, usuarioId);
      toast.success('Cliente eliminado correctamente');
      setShowDeleteModal(false);
      loadClientes();
    } catch (error) {
      toast.error('Error al eliminar cliente');
    }
  };

  const handleViewDetail = (cliente: Cliente): void => {
    setSelectedCliente(cliente);
    setShowDetailModal(true);
  };

  const handleResetFilters = (): void => {
    setFilters({ identification: '', nombre: '' });
  };

  return (
    <Layout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Consulta de Clientes</h1>
          <button
            onClick={() => navigate('/')}
            className="btn-secondary flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <FaArrowLeft /> Regresar
          </button>
        </div>

        {/* Filtros */}
        <div className="card">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Identificación
                </label>
                <input
                  type="text"
                  placeholder="Buscar por identificación"
                  value={filters.identification}
                  onChange={(e) => setFilters({ ...filters, identification: e.target.value })}
                  className="input-field"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Buscar por nombre"
                  value={filters.nombre}
                  onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
                  className="input-field"
                />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <button type="submit" className="btn-primary flex items-center justify-center gap-2 text-sm sm:text-base">
                <FaSearch /> Buscar
              </button>
              <button type="button" onClick={handleResetFilters} className="btn-secondary text-sm sm:text-base">
                Limpiar
              </button>
            </div>
          </form>
        </div>

        {/* Botón Agregar */}
        <div className="flex justify-end">
          <button
            onClick={() => navigate('/clientes/nuevo')}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center gap-2 text-sm sm:text-base w-full sm:w-auto justify-center"
          >
            <FaPlus /> Agregar Cliente
          </button>
        </div>

        {/* Tabla de Clientes - Vista de tarjetas en móvil, tabla en desktop */}
        <div className="card overflow-hidden">
          {loading ? (
            <div className="py-12">
              <LoadingSpinner />
            </div>
          ) : (
            <>
              {/* Vista móvil: Tarjetas */}
              <div className="block sm:hidden space-y-4">
                {clientes.length === 0 ? (
                  <p className="text-center py-8 text-gray-500">No hay clientes registrados</p>
                ) : (
                  clientes.map((cliente) => (
                    <div key={cliente.id} className="border border-gray-200 rounded-lg p-4 space-y-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-900">{cliente.nombre} {cliente.apellidos}</p>
                          <p className="text-sm text-gray-500">{cliente.identificacion}</p>
                        </div>
                        <div className="flex gap-3">
                          <button
                            onClick={() => handleViewDetail(cliente)}
                            className="text-green-600 hover:text-green-800"
                          >
                            <FaEye />
                          </button>
                          <button
                            onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => {
                              setSelectedCliente(cliente);
                              setShowDeleteModal(true);
                            }}
                            className="text-red-600 hover:text-red-800"
                          >
                            <FaTrash />
                          </button>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{cliente.telefonoCelular}</p>
                      <p className="text-xs text-gray-400 font-mono">{cliente.id?.substring(0, 8)}...</p>
                    </div>
                  ))
                )}
              </div>

              {/* Vista desktop: Tabla */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Apellidos</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Identificación</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clientes.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="text-center py-8 text-gray-500">
                          No hay clientes registrados
                        </td>
                      </tr>
                    ) : (
                      clientes.map((cliente) => (
                        <tr key={cliente.id} className="hover:bg-gray-50 transition duration-150">
                          <td className="px-6 py-4 text-sm text-gray-900 font-mono">
                            {cliente.id?.substring(0, 8)}...
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-900">{cliente.nombre}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{cliente.apellidos}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{cliente.identificacion}</td>
                          <td className="px-6 py-4 text-sm text-gray-900">{cliente.telefonoCelular}</td>
                          <td className="px-6 py-4 text-sm space-x-3">
                            <button
                              onClick={() => handleViewDetail(cliente)}
                              className="text-green-600 hover:text-green-800 transition duration-200"
                              title="Ver detalle"
                            >
                              <FaEye />
                            </button>
                            <button
                              onClick={() => navigate(`/clientes/editar/${cliente.id}`)}
                              className="text-blue-600 hover:text-blue-800 transition duration-200"
                              title="Editar"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => {
                                setSelectedCliente(cliente);
                                setShowDeleteModal(true);
                              }}
                              className="text-red-600 hover:text-red-800 transition duration-200"
                              title="Eliminar"
                            >
                              <FaTrash />
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de Confirmación de Eliminación */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirmar Eliminación"
        confirmText="Eliminar"
        cancelText="Cancelar"
      >
        <p className="text-gray-700">
          ¿Está seguro que desea eliminar al cliente{' '}
          <strong>{selectedCliente?.nombre} {selectedCliente?.apellidos}</strong>?
        </p>
        <p className="text-sm text-red-600 mt-2">Esta acción no se puede deshacer.</p>
      </Modal>

      {/* Modal de Detalle del Cliente */}
      <Modal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        title="Detalle del Cliente"
      >
        {selectedCliente && (
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm font-medium text-gray-500">Nombre Completo</p>
                <p className="text-gray-900">{selectedCliente.nombre} {selectedCliente.apellidos}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Identificación</p>
                <p className="text-gray-900">{selectedCliente.identificacion}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Teléfono Celular</p>
                <p className="text-gray-900">{selectedCliente.telefonoCelular}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Otro Teléfono</p>
                <p className="text-gray-900">{selectedCliente.otroTelefono || 'N/A'}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-gray-500">Dirección</p>
                <p className="text-gray-900">{selectedCliente.direccion}</p>
              </div>
              {selectedCliente.resenaPersonal && (
                <div className="col-span-2">
                  <p className="text-sm font-medium text-gray-500">Reseña Personal</p>
                  <p className="text-gray-900">{selectedCliente.resenaPersonal}</p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </Layout>
  );
};

export default ClientesList;