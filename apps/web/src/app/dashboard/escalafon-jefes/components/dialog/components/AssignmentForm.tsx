'use client';

import { useState } from 'react';
import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Button,
  Stack,
  alpha,
  Typography,
} from '@mui/material';
import {
  LocalPolice as JefeDiaIcon,
  Security as Control222Icon,
} from '@mui/icons-material';
import { AssignmentType, AssignmentFormData } from '../../../types';
import { AssignmentFormProps } from '../types';

type AssignmentTypeInfo = {
  value: AssignmentType;
  label: string;
  icon: typeof JefeDiaIcon;
  color: 'primary' | 'success' | 'warning';
};

const assignmentTypes: AssignmentTypeInfo[] = [
  { 
    value: 'direccionI', 
    label: 'Jefe de Día',
    icon: JefeDiaIcon,
    color: 'primary',
  },
  { 
    value: 'direccionII_GEO', 
    label: 'Servicio 222',
    icon: Control222Icon,
    color: 'success',
  }
];

export function AssignmentForm({
  selectedDate,
  onSubmit,
  onCancel,
  officers,
  initialData,
}: AssignmentFormProps) {
  const [selectedType, setSelectedType] = useState<AssignmentType>(
    initialData?.type || 'direccionI'
  );
  const [selectedOfficerId, setSelectedOfficerId] = useState<number | null>(
    initialData?.officerId || null
  );
  const [description, setDescription] = useState<string>(
    initialData?.description || ''
  );

  const availableOfficers = officers.filter(
    (officer) => officer.estado === 'activo'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !selectedOfficerId) return;

    const formData: AssignmentFormData = {
      type: selectedType,
      officerId: selectedOfficerId,
      date: selectedDate,
      description: description.trim(),
      isSpecialService222: selectedType === 'direccionII_GEO'
    };

    onSubmit(formData);
  };

  const selectedTypeInfo = assignmentTypes.find(type => type.value === selectedType);

  return (
    <form onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <FormControl fullWidth required>
          <InputLabel>Tipo de Asignación</InputLabel>
          <Select
            value={selectedType}
            label="Tipo de Asignación"
            onChange={(e) => setSelectedType(e.target.value as AssignmentType)}
            required
          >
            {assignmentTypes.map((type) => (
              <MenuItem
                key={type.value}
                value={type.value}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 32,
                    height: 32,
                    borderRadius: 1,
                    bgcolor: theme => alpha(theme.palette[type.color].main, 0.12),
                  }}
                >
                  <type.icon sx={{ fontSize: 20, color: `${type.color}.main` }} />
                </Box>
                {type.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth required>
          <InputLabel>Oficial Asignado</InputLabel>
          <Select
            value={selectedOfficerId || ''}
            label="Oficial Asignado"
            onChange={(e) => {
              const value = e.target.value;
              setSelectedOfficerId(value === '' ? null : Number(value));
            }}
            required
          >
            {availableOfficers.map((officer) => (
              <MenuItem
                key={officer.id}
                value={officer.id}
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                  }}
                >
                  <Typography variant="body1">
                    {officer.grado} {officer.apellido}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    ({officer.legajo})
                  </Typography>
                </Box>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Descripción"
          multiline
          rows={3}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
        />

        {selectedTypeInfo && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: theme => alpha(theme.palette[selectedTypeInfo.color].main, 0.12),
              }}
            >
              <selectedTypeInfo.icon sx={{ fontSize: 24, color: `${selectedTypeInfo.color}.main` }} />
            </Box>
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                {selectedTypeInfo.label}
              </Typography>
              {selectedOfficerId !== null && (
                <Typography variant="body2" color="text.secondary">
                  {availableOfficers.find(o => o.id === selectedOfficerId)?.grado} {availableOfficers.find(o => o.id === selectedOfficerId)?.apellido}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={onCancel} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Actualizar' : 'Crear'} Asignación
          </Button>
        </Stack>
      </Stack>
    </form>
  );
}
