import { Grid, TextField, Box, Chip } from '@mui/material';
import { TablaPrincipal } from '../../types';

interface LocationDetailsProps {
  formData: Partial<TablaPrincipal>;
  handleSeccionalInput: (value: string) => void;
  handleBarrioInput: (value: string) => void;
  handleDeleteSeccional: (index: number) => void;
  handleDeleteBarrio: (index: number) => void;
  validationErrors: Record<string, string>;
}

export const LocationDetails = ({ 
  formData,
  handleSeccionalInput,
  handleBarrioInput,
  handleDeleteSeccional,
  handleDeleteBarrio,
  validationErrors
}: LocationDetailsProps) => {
  return (
    <>
      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Agregar Seccional"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              handleSeccionalInput(input.value);
              input.value = '';
            }
          }}
          error={!!validationErrors.seccional}
          helperText={validationErrors.seccional}
        />
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.seccional?.map((sec, index) => (
            <Chip
              key={index}
              label={sec.toString()}
              onDelete={() => handleDeleteSeccional(index)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Agregar Barrio"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              handleBarrioInput(input.value);
              input.value = '';
            }
          }}
          error={!!validationErrors.barrios}
          helperText={validationErrors.barrios}
        />
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.barrios?.map((barrio, index) => (
            <Chip
              key={index}
              label={barrio}
              onDelete={() => handleDeleteBarrio(index)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Grid>
    </>
  );
};
