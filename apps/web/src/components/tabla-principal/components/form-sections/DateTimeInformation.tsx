import { Grid, TextField } from '@mui/material';
import { TablaPrincipal } from '../../types';

interface DateTimeInformationProps {
  formData: Partial<TablaPrincipal>;
  handleDateChange: (field: keyof TablaPrincipal) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  handleTimeChange: (field: keyof TablaPrincipal) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  formatDateForInput: (date: Date | null) => string;
  formatTimeForInput: (date: Date | null) => string;
  validationErrors: Record<string, string>;
}

export const DateTimeInformation = ({ 
  formData, 
  handleDateChange, 
  handleTimeChange, 
  formatDateForInput, 
  formatTimeForInput, 
  validationErrors 
}: DateTimeInformationProps) => {
  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Fecha de Inicio"
          type="date"
          value={formatDateForInput(formData.fechaInicio as Date)}
          onChange={handleDateChange('fechaInicio')}
          error={!!validationErrors.fechaInicio}
          helperText={validationErrors.fechaInicio}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Hora de Inicio"
          type="time"
          value={formatTimeForInput(formData.horaInicio as Date)}
          onChange={handleTimeChange('horaInicio')}
          error={!!validationErrors.horaInicio}
          helperText={validationErrors.horaInicio}
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Fecha de Fin"
          type="date"
          value={formatDateForInput(formData.fechaFin as Date)}
          onChange={handleDateChange('fechaFin')}
          error={!!validationErrors.fechaFin}
          helperText={validationErrors.fechaFin}
          InputLabelProps={{ shrink: true }}
        />
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Hora de Fin"
          type="time"
          value={formatTimeForInput(formData.horaFin as Date)}
          onChange={handleTimeChange('horaFin')}
          error={!!validationErrors.horaFin}
          helperText={validationErrors.horaFin}
          InputLabelProps={{ shrink: true }}
          inputProps={{ step: 300 }}
        />
      </Grid>
    </>
  );
};
