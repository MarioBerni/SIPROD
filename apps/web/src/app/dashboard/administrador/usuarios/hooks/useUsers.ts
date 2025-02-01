import { useState, useCallback } from 'react';
import { User, UserFormData, Grado, Rol } from '../types';
import { usersApi } from '@/lib/fetchApi';
import { handleError } from '../utils';

const initialFormData: UserFormData = {
  nombre: '',
  correo: '',
  contrasenaActual: '',
  grado: Grado.AG_2DA,
  rol: Rol.OPERADOR,
  cargo: '',
  terminosCondiciones: false,
  activo: true
};

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const users = await usersApi.getAll();
      setUsers(users);
      setError(null);
    } catch (error: unknown) {
      console.error('Error al cargar usuarios:', error);
      setError(handleError(error));
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpenCreateDialog = useCallback(() => {
    setFormData(initialFormData);
    setEditingId(null);
    setError(null);
    setOpenDialog(true);
  }, []);

  const handleOpenEditDialog = useCallback((user: User) => {
    setFormData({
      nombre: user.nombre,
      correo: user.correo,
      contrasenaActual: '',
      grado: user.grado,
      rol: user.rol,
      cargo: user.cargo,
      terminosCondiciones: user.terminosCondiciones,
      activo: user.activo
    });
    setEditingId(user.id);
    setError(null);
    setOpenDialog(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
    setFormData(initialFormData);
    setEditingId(null);
    setError(null);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string | boolean | Grado | Rol } }) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  }, []);

  const handleCheckboxChange = useCallback((name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [name]: event.target.checked
    }));
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (editingId) {
        await usersApi.update(editingId, formData);
      } else {
        await usersApi.create(formData);
      }

      await loadUsers();
      handleCloseDialog();
    } catch (error: unknown) {
      console.error('Error al guardar usuario:', error);
      setError(handleError(error));
    } finally {
      setLoading(false);
    }
  }, [editingId, formData, loadUsers, handleCloseDialog]);

  const handleDelete = useCallback(async (userId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      setLoading(true);
      try {
        await usersApi.delete(userId);
        await loadUsers();
        setError(null);
      } catch (error: unknown) {
        console.error('Error al eliminar usuario:', error);
        setError(handleError(error));
      } finally {
        setLoading(false);
      }
    }
  }, [loadUsers]);

  return {
    users,
    loading,
    error,
    openDialog,
    editingId,
    formData,
    loadUsers,
    handleOpenCreateDialog,
    handleOpenEditDialog,
    handleCloseDialog,
    handleInputChange,
    handleCheckboxChange,
    handleSubmit,
    handleDelete
  };
}
