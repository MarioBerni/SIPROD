import { type FC, type SyntheticEvent } from 'react';
import {
  Box,
  Chip,
  TextField,
  Autocomplete,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';

// Mapa de relación entre seccionales y barrios
const seccionalBarriosMap: Record<string, string[]> = {
  '1': ['Ciudad Vieja'],
  '2': ['Centro', 'Barrio Sur', 'Palermo'],
  '3': ['Centro', '18 de Julio', 'Rambla'],
  '4': ['Tres Cruces', 'La Comercial', 'Villa Muñoz', 'Barrio Reus', 'Parque Batlle este'],
  '5': ['Cordón sur', 'Parque Rodó'],
  '6': ['Aguada', 'Bella Vista', 'Arroyo Seco', 'Reducto'],
  '7': ['Prado', 'Capurro', 'Paso Molino'],
  '8': ['Paso de las Duranas', 'Lavalleja sur', 'Peñarol sur', 'Sayago'],
  '9': ['Parque Batlle', 'La Blanqueada sur', 'Villa Dolores norte'],
  '10': ['Pocitos', 'Punta Carretas', 'Villa Dolores sur'],
  '11': ['Buceo', 'Malvín'],
  '12': ['Brazo Oriental', 'Aires Puros', '40 Semanas', 'Barrio Lavalleja', 'Parque Posadas', 'Cerrito'],
  '13': ['Jacinto Vera', 'La Figurita', 'La Blanqueada norte', 'Larrañaga', 'Mercado Modelo'],
  '14': ['Carrasco', 'Carrasco Norte', 'Carrasco Sur', 'Cruz de Carrasco'],
  '15': ['La Unión', 'Malvín Norte', 'Boix y Merino'],
  '16': ['Ituzaingó', 'Villa Española', 'Punta de Rieles sur', 'Bañados de Carrasco'],
  '17': ['Casavalle', 'Las Acacias', 'Marconi', 'Manga', 'Piedras Blancas noreste'],
  '18': ['Punta de Rieles', 'Villa García', 'La Chancha', 'Barrio Capra', 'Puntas de Manga', 'Manga', 'Piedras Blancas sureste'],
  '19': ['La Teja', 'Belvedere'],
  '20': ['Santiago Vázquez'],
  '21': ['Colón', 'Lezica'],
  '22': ['Melilla'],
  '23': ['Paso de la Arena', 'Maracaná'],
  '24': ['Cerro', 'Casabó', 'Santa Catalina', 'La Paloma'],
  '25': ['Bella Italia', 'Jardines del Hipódromo'],
};

// Crear mapa inverso de barrios a seccionales
const barriosSeccionalMap = Object.entries(seccionalBarriosMap).reduce((acc, [seccional, barrios]) => {
  barrios.forEach(barrio => {
    if (!acc[barrio]) {
      acc[barrio] = [];
    }
    acc[barrio].push(seccional);
  });
  return acc;
}, {} as Record<string, string[]>);

// Obtener lista de seccionales ordenada
const seccionalOptions = Object.keys(seccionalBarriosMap).sort((a, b) => a.localeCompare(b, 'es'));

// Obtener lista de barrios ordenada
const barriosOptions = Array.from(new Set(Object.values(seccionalBarriosMap).flat()))
  .sort((a, b) => a.localeCompare(b, 'es'));

// Función para validar que los barrios correspondan a las seccionales seleccionadas
const validateBarriosForSeccionales = (selectedBarrios: string[], selectedSeccionales: string[]): boolean => {
  return selectedBarrios.every(barrio => {
    const seccionales = barriosSeccionalMap[barrio] || [];
    return seccionales.some(s => selectedSeccionales.includes(s));
  });
};

export interface UbicacionFormProps {
  seccional: number[];
  barrios: string[];
  onSeccionalChange: (value: number[]) => void;
  onBarriosChange: (value: string[]) => void;
  errors?: {
    seccional?: string;
    barrios?: string;
  };
}

export const UbicacionForm: FC<UbicacionFormProps> = ({
  seccional = [],
  barrios = [],
  onSeccionalChange,
  onBarriosChange,
  errors = {}
}) => {
  // Convertir números a strings para el Autocomplete
  const seccionalStrings = seccional.map(String);
  
  const handleSeccionalChange = (event: SyntheticEvent<Element, Event>, newValue: string[]) => {
    onSeccionalChange(newValue.map(Number));
  };

  const handleBarriosChange = (event: SyntheticEvent<Element, Event>, newValue: string[]) => {
    // Validar que los barrios seleccionados correspondan a las seccionales
    if (validateBarriosForSeccionales(newValue, seccionalStrings)) {
      onBarriosChange(newValue);
    } else {
      // Si hay barrios que no corresponden, filtrarlos
      const validBarrios = newValue.filter(barrio => {
        const seccionales = barriosSeccionalMap[barrio] || [];
        return seccionales.some(s => seccionalStrings.includes(s));
      });
      onBarriosChange(validBarrios);
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Autocomplete
        multiple
        options={seccionalOptions}
        value={seccionalStrings}
        onChange={handleSeccionalChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Seccional"
            error={!!errors.seccional}
            helperText={errors.seccional}
          />
        )}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              {...getTagProps({ index })}
              key={`seccional-${option}`}
              label={`Seccional ${option}`}
              icon={<LocationOnIcon />}
            />
          ))
        }
      />

      <Autocomplete
        multiple
        options={barriosOptions}
        value={barrios}
        onChange={handleBarriosChange}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Barrios"
            error={!!errors.barrios}
            helperText={errors.barrios}
          />
        )}
        renderTags={(value: string[], getTagProps) =>
          value.map((option: string, index: number) => (
            <Chip
              {...getTagProps({ index })}
              key={`barrio-${option}`}
              label={option}
              icon={<LocationOnIcon />}
            />
          ))
        }
      />
    </Box>
  );
};
