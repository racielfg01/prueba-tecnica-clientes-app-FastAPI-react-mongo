import  { useState, useEffect, type JSX } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { clientesService, interesesService } from '../services/api';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import type { Cliente, ClienteCreate, Interes } from '../types';

const ClienteForm = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = !!id;
  
  const [intereses, setIntereses] = useState<Interes[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [saving, setSaving] = useState<boolean>(false);
  const [previewImage, setPreviewImage] = useState<string>('');
  
  const [formData, setFormData] = useState<ClienteCreate>({
    nombre: '',
    apellidos: '',
    identificacion: '',
    telefonoCelular: '',
    otroTelefono: '',
    direccion: '',
    fnacimiento: '',
    fAfliacion: '',
    sexo: 'M',
    resenaPersonal: '',
    imagen: '',
    interesesFK: '',
    usuarioId: localStorage.getItem('userid') || ''
  });

  useEffect(() => {
    loadIntereses();
    if (isEditing) {
      loadCliente();
    }
  }, [isEditing, id]);

  const loadIntereses = async (): Promise<void> => {
    try {
      const response = await interesesService.listar();
      setIntereses(response.data || []);
    } catch (error) {
      toast.error('Error al cargar intereses');
      console.error(error);
    }
  };

  const loadCliente = async (): Promise<void> => {
    if (!id) return;
    
    setLoading(true);
    try {
      const response = await clientesService.obtener(id);
      const cliente = response.data;
      setFormData({
        nombre: cliente.nombre || '',
        apellidos: cliente.apellidos || '',
        identificacion: cliente.identificacion || '',
        telefonoCelular: cliente.telefonoCelular || cliente.celular || '',
        otroTelefono: cliente.otroTelefono || '',
        direccion: cliente.direccion || '',
        fnacimiento: cliente.fnacimiento?.split('T')[0] || '',
        fAfliacion: cliente.fAfliacion?.split('T')[0] || '',
        sexo: cliente.sexo || 'M',
        resenaPersonal: cliente.resenaPersonal || '',
        imagen: cliente.imagen || '',
        interesesFK: cliente.interesesId || cliente.interesesFK || '',
        usuarioId: localStorage.getItem('userid') || ''
      });
      if (cliente.imagen) {
        setPreviewImage(cliente.imagen);
      }
    } catch (error) {
      toast.error('Error al cargar cliente');
      navigate('/clientes');
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setFormData({ ...formData, imagen: base64String });
        setPreviewImage(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    
    // Validar campos requeridos
    const requiredFields = ['nombre', 'apellidos', 'identificacion', 'telefonoCelular', 'direccion', 'fnacimiento', 'fAfliacion', 'interesesFK'];
    for (const field of requiredFields) {
      if (!formData[field as keyof ClienteCreate]) {
        toast.error(`El campo ${field} es requerido`);
        return;
      }
    }

    setSaving(true);
    try {
      if (isEditing && id) {
        await clientesService.actualizar({
          id: id,
          nombre: formData.nombre,
          apellidos: formData.apellidos,
          identificacion: formData.identificacion,
          celular: formData.telefonoCelular,
          otroTelefono: formData.otroTelefono || '',
          direccion: formData.direccion,
          fnacimiento: formData.fnacimiento,
          fAfliacion: formData.fAfliacion,
          sexo: formData.sexo,
          resenaPersonal: formData.resenaPersonal || '',
          imagen: formData.imagen || '',
          interesesFK: formData.interesesFK,
          usuarioId: formData.usuarioId
        });
        toast.success('Cliente actualizado correctamente');
      } else {
        await clientesService.crear(formData);
        toast.success('Cliente creado correctamente');
      }
      navigate('/clientes');
    } catch (error: any) {
      const errorMsg = error.response?.data?.detail || `Error al ${isEditing ? 'actualizar' : 'crear'} cliente`;
      toast.error(errorMsg);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <LoadingSpinner />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="p-4 sm:p-6 max-w-4xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">
          {isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Imagen del Cliente */}
            <div className="md:col-span-2 flex justify-center mb-4">
              <div className="text-center">
                <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden mx-auto">
                  {previewImage ? (
                    <img src={previewImage} alt="Cliente" className="w-full h-full object-cover" />
                  ) : (
                    <div className="text-gray-400 text-center">
                      <svg className="w-8 h-8 sm:w-12 sm:h-12 mx-auto" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                      </svg>
                    </div>
                  )}
                </div>
                <label className="mt-2 inline-block">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                  <span className="text-sm text-blue-600 cursor-pointer hover:text-blue-800">
                    Subir Imagen
                  </span>
                </label>
                <p className="text-xs text-gray-500 mt-1">Opcional</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.nombre}
                onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                className="input-field text-sm sm:text-base"
                maxLength={50}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellidos <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.apellidos}
                onChange={(e) => setFormData({ ...formData, apellidos: e.target.value })}
                className="input-field text-sm sm:text-base"
                maxLength={100}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Identificación <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.identificacion}
                onChange={(e) => setFormData({ ...formData, identificacion: e.target.value })}
                className="input-field text-sm sm:text-base"
                maxLength={20}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono Celular <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.telefonoCelular}
                onChange={(e) => setFormData({ ...formData, telefonoCelular: e.target.value })}
                className="input-field text-sm sm:text-base"
                maxLength={20}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Otro Teléfono
              </label>
              <input
                type="text"
                value={formData.otroTelefono}
                onChange={(e) => setFormData({ ...formData, otroTelefono: e.target.value })}
                className="input-field text-sm sm:text-base"
                maxLength={20}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Dirección <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={formData.direccion}
                onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                className="input-field text-sm sm:text-base"
                maxLength={200}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Nacimiento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.fnacimiento}
                onChange={(e) => setFormData({ ...formData, fnacimiento: e.target.value })}
                className="input-field text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Fecha de Afiliación <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={formData.fAfliacion}
                onChange={(e) => setFormData({ ...formData, fAfliacion: e.target.value })}
                className="input-field text-sm sm:text-base"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Sexo <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.sexo}
                onChange={(e) => setFormData({ ...formData, sexo: e.target.value as 'M' | 'F' })}
                className="input-field text-sm sm:text-base"
                required
              >
                <option value="M">Masculino</option>
                <option value="F">Femenino</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Intereses <span className="text-red-500">*</span>
              </label>
              <select
                value={formData.interesesFK}
                onChange={(e) => setFormData({ ...formData, interesesFK: e.target.value })}
                className="input-field text-sm sm:text-base"
                required
              >
                <option value="">Seleccione un interés</option>
                {intereses.map((interes) => (
                  <option key={interes.id} value={interes.id}>
                    {interes.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reseña Personal
              </label>
              <textarea
                value={formData.resenaPersonal}
                onChange={(e) => setFormData({ ...formData, resenaPersonal: e.target.value })}
                className="input-field text-sm sm:text-base"
                rows={3}
                maxLength={200}
                placeholder="Escriba una reseña personal del cliente..."
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.resenaPersonal?.length || 0}/200 caracteres
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => navigate('/clientes')}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-200 text-sm sm:text-base w-full sm:w-auto"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm sm:text-base w-full sm:w-auto"
            >
              {saving ? <LoadingSpinner size="sm" /> : null}
              {saving ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ClienteForm;