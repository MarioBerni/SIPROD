import React from 'react';
import { Grid, TextField, FormControl } from '@mui/material';
import { TablaPrincipal } from '../../types';
import { format, parseISO } from 'date-fns';

interface DateTimeInformationProps {
  formData: Partial<TablaPrincipal>;
  handleDateChange: (field: keyof TablaPrincipal, value: string) => void;
  handleTimeChange: (field: keyof TablaPrincipal, value: string) => void;
  validationErrors: Record<string, string>;
}

const formatDateForInput = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  try {
    const dateObj = date instanceof Date ? date : parseISO(date as string);
    return format(dateObj, 'yyyy-MM-dd');
  } catch (error) {
    console.error('Error formatting date:', error);
    return '';
  }
};

const formatTimeForInput = (date: Date | string | null | undefined): string => {
  if (!date) return '';
  try {
    const dateObj = date instanceof Date ? date : parseISO(date as string);
    return format(dateObj, 'HH:mm');
  } catch (error) {
    console.error('Error formatting time:', error);
    return '';
  }
};

export const DateTimeInformation: React.FC<DateTimeInformationProps> = ({
  formData,
  handleDateChange,
  handleTimeChange,
  validationErrors
}) => {
  return (
    <Grid container spacing={2}>
      {/* Fecha de Inicio */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!validationErrors.fechaInicio}>
          <TextField
            fullWidth
            label="Fecha de Inicio"
            type="date"
            value={formatDateForInput(formData.fechaInicio)}
            onChange={(e) => handleDateChange('fechaInicio', e.target.value)}
            error={!!validationErrors.fechaInicio}
            helperText={validationErrors.fechaInicio}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
      </Grid>

      {/* Hora de Inicio */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!validationErrors.horaInicio}>
          <TextField
            fullWidth
            label="Hora de Inicio"
            type="time"
            value={formatTimeForInput(formData.horaInicio)}
            onChange={(e) => handleTimeChange('horaInicio', e.target.value)}
            error={!!validationErrors.horaInicio}
            helperText={validationErrors.horaInicio}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
      </Grid>

      {/* Fecha de Fin */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!validationErrors.fechaFin}>
          <TextField
            fullWidth
            label="Fecha de Fin"
            type="date"
            value={formatDateForInput(formData.fechaFin)}
            onChange={(e) => handleDateChange('fechaFin', e.target.value)}
            error={!!validationErrors.fechaFin}
            helperText={validationErrors.fechaFin}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
      </Grid>

      {/* Hora de Fin */}
      <Grid item xs={12} sm={6}>
        <FormControl fullWidth error={!!validationErrors.horaFin}>
          <TextField
            fullWidth
            label="Hora de Fin"
            type="time"
            value={formatTimeForInput(formData.horaFin)}
            onChange={(e) => handleTimeChange('horaFin', e.target.value)}
            error={!!validationErrors.horaFin}
            helperText={validationErrors.horaFin}
            InputLabelProps={{
              shrink: true,
            }}
          />
        </FormControl>
      </Grid>
    </Grid>
  );
};
