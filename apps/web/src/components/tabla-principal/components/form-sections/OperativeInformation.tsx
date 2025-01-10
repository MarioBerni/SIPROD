import { Grid, TextField, MenuItem } from '@mui/material';
import { TablaPrincipal, TipoOperativo, TiempoOperativo } from '../../types';

interface OperativeInformationProps {
  formData: Partial<TablaPrincipal>;
  handleChange: (field: keyof TablaPrincipal) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => void;
  validationErrors: Record<string, string>;
}

export const OperativeInformation = ({ formData, handleChange, validationErrors }: OperativeInformationProps) => {
  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Tipo de Operativo"
          select
          value={formData.tipoOperativo || ''}
          onChange={handleChange('tipoOperativo')}
          error={!!validationErrors.tipoOperativo}
          helperText={validationErrors.tipoOperativo}
          required
        >
          {Object.values(TipoOperativo).map((tipo) => (
            <MenuItem key={tipo} value={tipo}>
              {tipo.replace(/_/g, ' ')}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Tiempo Operativo"
          select
          value={formData.tiempoOperativo || ''}
          onChange={handleChange('tiempoOperativo')}
          error={!!validationErrors.tiempoOperativo}
          helperText={validationErrors.tiempoOperativo}
          required
        >
          {Object.values(TiempoOperativo).map((tiempo) => (
            <MenuItem key={tiempo} value={tiempo}>
              {tiempo.replace(/_/g, ' ')}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <TextField
          fullWidth
          label="Nombre del Operativo"
          value={formData.nombreOperativo || ''}
          onChange={handleChange('nombreOperativo')}
          error={!!validationErrors.nombreOperativo}
          helperText={validationErrors.nombreOperativo}
          required
        />
      </Grid>
    </>
  );
};
