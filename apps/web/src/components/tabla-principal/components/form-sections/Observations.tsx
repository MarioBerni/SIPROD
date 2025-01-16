import React from 'react';
import { Grid, TextField } from '@mui/material';
import { TablaPrincipal } from '../../types';

interface ObservationsProps {
  formData: Partial<TablaPrincipal>;
  handleChange: (field: keyof TablaPrincipal) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  validationErrors: Record<string, string>;
}

export const Observations: React.FC<ObservationsProps> = ({
  formData,
  handleChange,
  validationErrors
}) => {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <TextField
          fullWidth
          multiline
          rows={4}
          label="Observaciones de la Orden"
          value={formData.observacionesOrden || ''}
          onChange={handleChange('observacionesOrden')}
          error={!!validationErrors.observacionesOrden}
          helperText={validationErrors.observacionesOrden}
        />
      </Grid>
    </Grid>
  );
};