import { Grid, TextField, Box, Chip } from '@mui/material';
import { TablaPrincipal } from '../../types';

interface LocationDetailsProps {
  formData: Partial<TablaPrincipal>;
  handleSeccionalInput: (value: string) => void;
  handleBarrioInput: (value: string) => void;
  handleMapaInput: (value: string) => void;
  handlePuntosControlInput: (value: string) => void;
  handleRecorridosInput: (value: string) => void;
  handleDeleteSeccional: (index: number) => void;
  handleDeleteBarrio: (index: number) => void;
  handleDeleteMapa: (index: number) => void;
  handleDeletePuntosControl: (index: number) => void;
  handleDeleteRecorridos: (index: number) => void;
}

export const LocationDetails = ({ 
  formData,
  handleSeccionalInput,
  handleBarrioInput,
  handleMapaInput,
  handlePuntosControlInput,
  handleRecorridosInput,
  handleDeleteSeccional,
  handleDeleteBarrio,
  handleDeleteMapa,
  handleDeletePuntosControl,
  handleDeleteRecorridos
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

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Agregar Mapa"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              handleMapaInput(input.value);
              input.value = '';
            }
          }}
        />
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.mapa?.map((item, index) => (
            <Chip
              key={index}
              label={item}
              onDelete={() => handleDeleteMapa(index)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Agregar Puntos de Control"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              handlePuntosControlInput(input.value);
              input.value = '';
            }
          }}
        />
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.puntosControl?.map((punto, index) => (
            <Chip
              key={index}
              label={punto}
              onDelete={() => handleDeletePuntosControl(index)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Grid>

      <Grid item xs={12} sm={6}>
        <TextField
          fullWidth
          label="Agregar Recorridos"
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              const input = e.target as HTMLInputElement;
              handleRecorridosInput(input.value);
              input.value = '';
            }
          }}
        />
        <Box sx={{ mt: 1, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {formData.recorridos?.map((recorrido, index) => (
            <Chip
              key={index}
              label={recorrido}
              onDelete={() => handleDeleteRecorridos(index)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      </Grid>
    </>
  );
};
