import { useState, useCallback, useEffect } from 'react';
import { TablaPrincipal } from '../types';
import { api } from '@/lib/api';
import { handleError, handleValidationError } from '@/utils/error-handling';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  data?: {
    message?: string;
    errors?: Record<string, string>;
  };
  status?: number;
}

export function useTableData() {
  const [rows, setRows] = useState<TablaPrincipal[]>([]);
  const [loading, setLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [editingRecord, setEditingRecord] = useState<TablaPrincipal | null>(null);
  const [insertIndex, setInsertIndex] = useState<number | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Función para cargar los datos iniciales
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors({});
      
      const response = await api.get('/registros');
      console.log(`Datos cargados: ${JSON.stringify(response.data)}`);
      setRows(response.data || []);
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(`Error al cargar registros: ${error.message}`);
      }
      setError(handleError(error));
      setValidationErrors(handleValidationError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  // Cargar datos al montar el componente
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Manejadores de acciones
  const handleAddClick = () => {
    setError(null);
    setValidationErrors({});
    setEditingRecord(null);
    setInsertIndex(null);
    setIsAddModalOpen(true);
  };

  const handleAddAfterClick = (id: string) => {
    console.log(`Iniciando agregar después de ID: ${id}`);
    setError(null);
    setValidationErrors({});
    setEditingRecord(null);
    // Encontrar el índice de la fila seleccionada
    const index = rows.findIndex(row => row.id === id);
    console.log(`Índice encontrado para inserción: ${index}`);
    setInsertIndex(index + 1);
    setIsAddModalOpen(true);
  };

  const handleCloseAddModal = () => {
    console.log('Cerrando modal y limpiando estado');
    setError(null);
    setValidationErrors({});
    setIsAddModalOpen(false);
    setInsertIndex(null);
    setEditingRecord(null);
  };

  const handleEditClick = (id: string) => {
    console.log(`Iniciando edición para ID: ${id}`);
    const record = rows.find(row => row.id === id);
    if (!record) {
      console.error(`No se encontró el registro con ID: ${id}`);
      return;
    }
    
    // Crear una copia profunda del registro para evitar referencias mutables
    const recordCopy = JSON.parse(JSON.stringify(record));
    console.log(`Registro encontrado para editar:`, recordCopy);
    
    setError(null);
    setValidationErrors({});
    setEditingRecord(recordCopy);
    setInsertIndex(null); // Aseguramos que no haya índice de inserción al editar
    setIsAddModalOpen(true);
  };

  const handleDeleteClick = (id: string) => {
    setDeletingId(id);
    setIsDeleteDialogOpen(true);
  };

  const handleDeleteCancel = () => {
    setIsDeleteDialogOpen(false);
    setDeletingId(null);
  };

  const handleDeleteConfirm = async () => {
    if (!deletingId) return;

    try {
      setLoading(true);
      setError(null);
      
      await api.delete(`/registros/${deletingId}`);
      setRows(prev => prev.filter(row => row.id !== deletingId));
      setIsDeleteDialogOpen(false);
      setDeletingId(null);
    } catch (err: unknown) {
      console.error('Error al eliminar registro:', err);
      const error = err as Error;
      setError(`Error al eliminar registro: ${error.message}`);
      handleError(err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewClick = async (id: string) => {
    try {
      const record = rows.find(row => row.id === id);
      if (record) {
        // Implementar la lógica de visualización
        console.log('Ver registro:', record);
      }
    } catch (err) {
      const error = err as Error;
      console.error('Error al ver registro:', error.message);
    }
  };

  const handleSaveRecord = async (record: Partial<TablaPrincipal>) => {
    try {
      setLoading(true);
      setError(null);
      setValidationErrors({});

      console.log('Datos a enviar al servidor:', JSON.stringify(record, null, 2));
      console.log('Tipos de datos:', Object.entries(record).map(([key, value]) => `${key}: ${typeof value}`));
      
      const response = await api.post('/registros', record);
      console.log('Respuesta del servidor:', response.data);

      const newRecord = response.data;

      setRows(prevRows => {
        const newRows = [...prevRows];
        if (insertIndex !== null) {
          // Insertar en la posición específica
          newRows.splice(insertIndex, 0, newRecord);
        } else {
          // Agregar al final
          newRows.push(newRecord);
        }
        return newRows;
      });

      setIsAddModalOpen(false);
      setInsertIndex(null);
    } catch (err) {
      const error = err as Error;
      console.error('Error al guardar registro:', error.message);
      setError(handleError(err));
      setValidationErrors(handleValidationError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleEditSubmit = async (formData: Partial<TablaPrincipal>) => {
    if (!editingRecord?.id) return;

    try {
      setLoading(true);
      setError(null);
      setValidationErrors({});

      console.log(`Enviando datos de actualización: ${JSON.stringify(formData, null, 2)}`);
      const response = await api.put(`/registros/${editingRecord.id}`, formData);
      console.log(`Respuesta del servidor: ${JSON.stringify(response.data)}`);

      setRows(prev => prev.map(row => 
        row.id === editingRecord.id ? response.data : row
      ));
      handleCloseAddModal();
    } catch (error: unknown) {
      if (error instanceof Error) {
        const axiosError = error as AxiosError<ApiErrorResponse>;
        console.error(`Error detallado al actualizar registro: ${axiosError.message}`);
      }
      setError(handleError(error));
      setValidationErrors(handleValidationError(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData: Partial<TablaPrincipal>) => {
    if (editingRecord) {
      await handleEditSubmit(formData);
    } else {
      await handleSaveRecord(formData);
    }
  };

  return {
    rows,
    loading,
    error,
    validationErrors,
    isAddModalOpen,
    editingRecord,
    handleAddClick,
    handleAddAfterClick,
    handleEditClick,
    handleDeleteClick,
    handleCloseAddModal,
    handleSaveRecord,
    handleViewClick,
    handleSubmit,
    isDeleteDialogOpen,
    handleDeleteCancel,
    handleDeleteConfirm,
    fetchData
  };
};
