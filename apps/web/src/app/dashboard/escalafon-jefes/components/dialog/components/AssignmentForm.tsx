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
  DirectionsRun as OpEspecialesIcon,
} from '@mui/icons-material';
import { Officer, Assignment } from '../../../types';
import { AssignmentFormData } from '../types';
import { format } from 'date-fns';

interface AssignmentFormProps {
  selectedDate: Date;
  onSubmit: (data: AssignmentFormData) => void;
  onCancel: () => void;
  officers: Officer[];
  initialData?: Assignment;
}

type AssignmentTypeInfo = {
  value: AssignmentFormData['type'];
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
    value: 'direccionII', 
    label: 'Servicio 222',
    icon: Control222Icon,
    color: 'success',
  },
  { 
    value: 'geo', 
    label: 'Operativo Especial',
    icon: OpEspecialesIcon,
    color: 'warning',
  },
];

export function AssignmentForm({
  selectedDate,
  onSubmit,
  onCancel,
  officers,
  initialData,
}: AssignmentFormProps) {
  const [selectedType, setSelectedType] = useState<AssignmentFormData['type']>(
    (initialData?.type as AssignmentFormData['type']) || 'direccionI'
  );
  const [selectedOfficerId, setSelectedOfficerId] = useState(initialData?.officerId || '');
  const [description, setDescription] = useState(initialData?.description ?? '');

  const availableOfficers = officers.filter(
    (officer) => officer.estado === 'activo'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedType || !selectedOfficerId) return;

    onSubmit({
      type: selectedType,
      officerId: selectedOfficerId,
      description: description.trim(),
      startDate: format(selectedDate, 'yyyy-MM-dd'),
      endDate: format(selectedDate, 'yyyy-MM-dd'),
    });
  };

  const selectedTypeInfo = assignmentTypes.find(type => type.value === selectedType);

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <Stack spacing={3}>
        <FormControl fullWidth>
          <InputLabel>Tipo de Asignación</InputLabel>
          <Select
            value={selectedType}
            label="Tipo de Asignación"
            onChange={(e) => setSelectedType(e.target.value as AssignmentFormData['type'])}
            required
            sx={{
              '& .MuiSelect-select': {
                display: 'flex',
                alignItems: 'center',
                gap: 1,
              },
            }}
          >
            {assignmentTypes.map((type) => {
              const Icon = type.icon;
              return (
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
                      width: 28,
                      height: 28,
                      borderRadius: 1,
                      bgcolor: theme => alpha(theme.palette[type.color].main, 0.12),
                    }}
                  >
                    <Icon sx={{ fontSize: 18, color: `${type.color}.main` }} />
                  </Box>
                  {type.label}
                </MenuItem>
              );
            })}
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>Oficial Asignado</InputLabel>
          <Select
            value={selectedOfficerId}
            label="Oficial Asignado"
            onChange={(e) => setSelectedOfficerId(e.target.value)}
            required
          >
            {availableOfficers.map((officer) => (
              <MenuItem key={officer.id} value={officer.id}>
                {`${officer.grado} ${officer.apellido}, ${officer.nombre}`}
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
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              p: 2,
              borderRadius: 1,
              bgcolor: theme => alpha(theme.palette[selectedTypeInfo.color].main, 0.08),
            }}
          >
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
              {selectedOfficerId && (
                <Typography variant="body2" color="text.secondary">
                  {availableOfficers.find(o => o.id === selectedOfficerId)?.grado} {availableOfficers.find(o => o.id === selectedOfficerId)?.apellido}
                </Typography>
              )}
            </Box>
          </Box>
        )}

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button onClick={onCancel} variant="outlined" color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            {initialData ? 'Guardar Cambios' : 'Crear Asignación'}
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
