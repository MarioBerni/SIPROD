'use client';

import { useState, useCallback } from 'react';
import { License } from '../types';

export const useLicenseManagement = () => {
  const [licenses, setLicenses] = useState<License[]>([
    {
      id: '1',
      type: 'medical',
      startDate: '2025-02-05',
      endDate: '2025-02-10',
      status: 'pending',
      description: 'Licencia médica por gripe',
    },
    {
      id: '2',
      type: 'personal',
      startDate: '2025-02-15',
      endDate: '2025-02-20',
      status: 'approved',
      description: 'Licencia por asuntos personales',
    },
    {
      id: '3',
      type: 'medical',
      startDate: '2025-02-25',
      endDate: '2025-03-05',
      status: 'pending',
      description: 'Control médico programado',
    },
  ]);

  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newLicense, setNewLicense] = useState<Partial<License>>({});
  const [editLicense, setEditLicense] = useState<License | null>(null);

  // Función simple para formatear la fecha para mostrar
  const formatDateForDisplay = (dateString: string) => {
    console.log('[formatDateForDisplay] Fecha recibida:', dateString);
    const [year, month, day] = dateString.split('-');
    console.log('[formatDateForDisplay] Componentes:', { year, month, day });
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  };

  const getActiveLicenses = useCallback(() => {
    return licenses.filter(license => 
      license.status === 'pending' || license.status === 'approved'
    );
  }, [licenses]);

  const updateLicenseStatus = useCallback((id: string, status: License['status']) => {
    setLicenses(prevLicenses =>
      prevLicenses.map(license =>
        license.id === id ? { ...license, status } : license
      )
    );
  }, []);

  const handleAdd = () => {
    setIsAdding(true);
    setNewLicense({});
  };

  const handleSaveNew = () => {
    if (
      newLicense.startDate && 
      newLicense.endDate && 
      newLicense.type && 
      ['medical', 'personal', 'annual', 'other'].includes(newLicense.type)
    ) {
      console.log('[handleSaveNew] Fechas a guardar:', {
        startDate: newLicense.startDate,
        endDate: newLicense.endDate
      });

      const newLicenseEntry: License = {
        id: Date.now().toString(),
        startDate: newLicense.startDate,
        endDate: newLicense.endDate,
        type: newLicense.type,
        status: 'pending',
        description: newLicense.description || '',
      };

      console.log('[handleSaveNew] Nueva licencia a agregar:', newLicenseEntry);

      setLicenses(prevLicenses => {
        const updatedLicenses = [...prevLicenses, newLicenseEntry];
        console.log('[handleSaveNew] Lista actualizada de licencias:', updatedLicenses);
        return updatedLicenses;
      });

      setIsAdding(false);
      setNewLicense({});
    } else {
      console.error('[handleSaveNew] Error: Faltan campos requeridos o tipo inválido');
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleEdit = (license: License) => {
    console.log('[handleEdit] Licencia a editar:', license);
    setEditingId(license.id);
    setEditLicense(license);
  };

  const handleSaveEdit = () => {
    if (editLicense) {
      console.log('[handleSaveEdit] Fechas a guardar:', {
        startDate: editLicense.startDate,
        endDate: editLicense.endDate
      });

      setLicenses(prevLicenses => {
        const updatedLicenses = prevLicenses.map((l) =>
          l.id === editLicense.id
            ? {
                ...editLicense,
                startDate: editLicense.startDate,
                endDate: editLicense.endDate,
              }
            : l
        );
        console.log('[handleSaveEdit] Lista actualizada de licencias:', updatedLicenses);
        return updatedLicenses;
      });

      setEditingId(null);
      setEditLicense(null);
    }
  };

  const handleDelete = useCallback((id: string) => {
    setLicenses(prevLicenses => prevLicenses.filter(license => license.id !== id));
  }, []);

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditLicense(null);
  };

  const handleCancelAdd = () => {
    setIsAdding(false);
    setNewLicense({});
  };

  return {
    licenses,
    isAdding,
    editingId,
    newLicense,
    editLicense,
    formatDateForDisplay,
    getActiveLicenses,
    updateLicenseStatus,
    handleAdd,
    handleSaveNew,
    handleEdit,
    handleSaveEdit,
    handleDelete,
    handleCancelEdit,
    handleCancelAdd,
    setNewLicense,
    setEditLicense,
  };
};
