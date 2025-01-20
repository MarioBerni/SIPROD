import { type FC, type SyntheticEvent } from 'react';
import {
  Chip,
  TextField,
  Autocomplete,
  Grid
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useMemo } from 'react';

// Mapa de relación entre seccionales y barrios
const seccionalBarriosMap: Record<string, string[]> = {
  '1': ['Ciudad Vieja'],
  '2': ['Centro', 'Barrio Sur', 'Palermo'],
  '3': ['Centro', '18 de Julio', 'Rambla'],
  '4': ['Tres Cruces', 'La Comercial', 'Villa Muñoz', 'Barrio Reus', 'Parque Batlle este'],
  '5': ['Cordón sur', 'Parque Rodó'],
  '6': ['Aguada', 'Bella Vista', 'Arroyo Seco', 'Reducto'],
  '7': ['Prado', 'Capurro', 'Paso Molino'],
  '8': ['Paso de las Duranas', 'Peñarol sur', 'Sayago'],
  '9': ['Parque Batlle', 'La Blanqueada sur', 'Villa Dolores norte'],
  '10': ['Pocitos', 'Punta Carretas', 'Villa Dolores sur'],
  '11': ['Buceo', 'Malvín'],
  '12': ['Brazo Oriental', 'Aires Puros', 'Lavalleja sur','40 Semanas', 'Barrio Lavalleja', 'Parque Posadas', 'Cerrito'],
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

// Obtener lista de seccionales ordenada numéricamente
const seccionalOptions = Object.keys(seccionalBarriosMap)
  .map(Number)
  .sort((a, b) => a - b)
  .map(String);

// Obtener lista de barrios ordenada alfabéticamente
const barriosOptions = Array.from(new Set(Object.values(seccionalBarriosMap).flat()))
  .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

// Función para validar que los barrios correspondan a las seccionales seleccionadas

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
  
  // Obtener los barrios disponibles según las seccionales seleccionadas
  const availableBarrios = useMemo(() => {
    if (seccionalStrings.length === 0) return barriosOptions;
    const filteredBarrios = new Set<string>();
    seccionalStrings.forEach(sec => {
      const barriosForSeccional = seccionalBarriosMap[sec] || [];
      barriosForSeccional.forEach(barrio => filteredBarrios.add(barrio));
    });
    return Array.from(filteredBarrios).sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));
  }, [seccionalStrings]);

  // Manejar cambio de seccional
  const handleSeccionalChange = (event: SyntheticEvent<Element, Event>, newValue: string[]) => {
    const newSeccionales = newValue.map(Number);
    onSeccionalChange(newSeccionales);
    
    // Cargar automáticamente todos los barrios correspondientes a las seccionales seleccionadas
    const newBarrios = new Set<string>();
    newValue.forEach(sec => {
      const barriosForSeccional = seccionalBarriosMap[sec] || [];
      barriosForSeccional.forEach(barrio => newBarrios.add(barrio));
    });
    
    // Convertir a array y ordenar
    const sortedBarrios = Array.from(newBarrios).sort((a, b) => 
      a.localeCompare(b, 'es', { sensitivity: 'base' })
    );
    
    onBarriosChange(sortedBarrios);
  };

  // Manejar cambio de barrios
  const handleBarriosChange = (event: SyntheticEvent<Element, Event>, newValue: string[]) => {
    // Obtener todas las seccionales correspondientes a los barrios seleccionados
    const selectedSeccionales = new Set<string>();
    newValue.forEach(barrio => {
      const seccionales = barriosSeccionalMap[barrio] || [];
      seccionales.forEach(s => selectedSeccionales.add(s));
    });

    // Actualizar seccionales
    const newSeccionales = Array.from(selectedSeccionales)
      .map(Number)
      .sort((a, b) => a - b);
    
    onSeccionalChange(newSeccionales);
    onBarriosChange(newValue);
  };

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
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
              placeholder="Seleccione las seccionales"
            />
          )}
          renderTags={(value: string[], getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={`Seccional ${option}`}
                icon={<LocationOnIcon />}
              />
            ))
          }
        />
      </Grid>
      <Grid item xs={12} md={6}>
        <Autocomplete
          multiple
          options={availableBarrios}
          value={barrios}
          onChange={handleBarriosChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Barrios"
              error={!!errors.barrios}
              helperText={errors.barrios || 'Seleccione los barrios correspondientes a las seccionales'}
              placeholder="Seleccione los barrios"
            />
          )}
          renderTags={(value: string[], getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option}
                icon={<LocationOnIcon />}
              />
            ))
          }
        />
      </Grid>
    </Grid>
  );
};
