import { Grid, TextField, MenuItem } from '@mui/material';
import { TablaPrincipal, Departamento, Unidad, TipoOrden } from '../../types';

interface BasicInformationProps {
  formData: Partial<TablaPrincipal>;
  handleChange: (field: keyof TablaPrincipal) => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => void;
  validationErrors: Record<string, string>;
}

export const BasicInformation = ({ formData, handleChange, validationErrors }: BasicInformationProps) => {
  // Función auxiliar para manejar valores nulos o undefined
  const getValue = <T,>(value: T | null | undefined): T | string => value === null || value === undefined ? '' : value;

  return (
    <>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Departamento"
          select
          value={getValue(formData.departamento)}
          onChange={handleChange('departamento')}
          error={!!validationErrors.departamento}
          helperText={validationErrors.departamento}
          required
        >
          {Object.values(Departamento).map((dep) => (
            <MenuItem key={dep} value={dep}>
              {dep.replace(/_/g, ' ')}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Unidad"
          select
          value={getValue(formData.unidad)}
          onChange={handleChange('unidad')}
          error={!!validationErrors.unidad}
          helperText={validationErrors.unidad}
          required
        >
          {Object.values(Unidad).map((unit) => (
            <MenuItem key={unit} value={unit}>
              {unit.replace(/_/g, ' ')}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Tipo de Orden"
          select
          value={getValue(formData.tipoOrden)}
          onChange={handleChange('tipoOrden')}
          error={!!validationErrors.tipoOrden}
          helperText={validationErrors.tipoOrden}
          required
        >
          {Object.values(TipoOrden).map((tipo) => (
            <MenuItem key={tipo} value={tipo}>
              {tipo.replace(/_/g, ' ')}
            </MenuItem>
          ))}
        </TextField>
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <TextField
          fullWidth
          label="Nro. de Orden"
          value={getValue(formData.nroOrden)}
          onChange={handleChange('nroOrden')}
          error={!!validationErrors.nroOrden}
          helperText={validationErrors.nroOrden}
          required
        />
      </Grid>
    </>
  );
};
