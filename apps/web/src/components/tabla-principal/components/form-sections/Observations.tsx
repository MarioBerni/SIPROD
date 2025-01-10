import { Grid, TextField } from '@mui/material';
import { TablaPrincipal } from '../../types';

interface ObservationsProps {
  formData: Partial<TablaPrincipal>;
  handleChange: (field: keyof TablaPrincipal) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => void;
  validationErrors: Record<string, string>;
}

export const Observations = ({ formData, handleChange, validationErrors }: ObservationsProps) => {
  return (
    <Grid item xs={12}>
      <TextField
        fullWidth
        label="Observaciones"
        multiline
        rows={4}
        value={formData.observacionesOrden || ''}
        onChange={handleChange('observacionesOrden')}
        error={!!validationErrors.observacionesOrden}
        helperText={validationErrors.observacionesOrden}
      />
    </Grid>
  );
};
