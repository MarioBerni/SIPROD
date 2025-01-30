import { type FC, type SyntheticEvent } from 'react';
import {
  Chip,
  TextField,
  Autocomplete,
  Grid,
  Typography,
} from '@mui/material';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { useMemo } from 'react';
import { styled } from '@mui/material/styles';

// Mapa de relación entre seccionales y barrios
const seccionalBarriosMap: Record<string, string[]> = {
  '1': ['Ciudad Vieja'],
  '2': ['Barrio Sur', 'Palermo'],
  '3': ['Centro'],
  '4': ['Tres Cruces', 'La Comercial', 'Reus al Norte', 'La Figurita', 'Goes'],
  '5': ['Cordón', 'Parque Rodó'],
  '6': ['Aguada', 'Bella Vista', 'Reducto'],
  '7': ['Prado', 'Capurro', 'Belvedere'],
  '8': ['Peñarol', 'Sayago', 'Paso De Las Duranas'],
  '9': ['Parque Batlle', 'La Blanqueada sur', 'Villa Dolores'],
  '10': ['Pocitos', 'Punta Carretas'],
  '11': ['Buceo', 'Malvín'],
  '12': ['Brazo Oriental', 'Aires Puros', 'Atahualpa', 'Cerrito', 'Barrio Lavalleja Sur', 'Barrio Lavalleja'],
  '13': ['Pérez Castellanos', 'Villa Española', 'Mercado Modelo', 'Jacinto Vera', 'Larrañaga'],
  '14': ['Bañados de Carrasco', 'Carrasco Norte', 'Carrasco', 'Punta Gorda', 'Cruz de Carrasco'],
  '15': ['La Unión', 'Malvín Norte', 'Boix y Merino'],
  '16': ['Maroñas', 'Flor de Maroñas', 'Ituzaingó', 'Jardines del Hipódromo'],
  '17': ['Barrio Coppola', 'Marconi', 'Barrio Borro', 'Casavalle', 'Piedras Blancas', 'Barrio Nuevo Ellauri', 'Barrio Plácido Ellauri', 'Manga', 'Asentamiento 21 de Enero', 'Mendoza', 'Puntas del Miguelete'],
  '18': ['Piedras Blancas', 'Puntas de Manga', 'Barrio Capra', 'Villa García', 'Punta de Rieles'],
  '19': ['Nuevo Paris', 'Conciliación', 'Belvedere', 'Tres Ombúes', 'La Teja', 'Verdisol', 'Paso Molino'],
  '20': ['Santiago Vázquez'],
  '21': ['Colón', 'La Carbonera', 'Abayubá'],
  '22': ['Melilla', 'Lezica'],
  '23': ['Paso de la Arena', 'Pajas Blancas', 'Maracaná', 'Los Bulevares', 'Las Torres'],
  '24': ['Cerro', 'Cerro Norte', 'Santa Catalina', 'Casabó', 'La Paloma'],
  '25': ['Barrio Vista Linda', 'Bella Italia', 'Chacarita de los Padres', 'Punta de Rieles'],
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
export const barriosOptions = Array.from(new Set(Object.values(seccionalBarriosMap).flat()))
  .sort((a, b) => a.localeCompare(b, 'es', { sensitivity: 'base' }));

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
  };

  // Manejar cambio de barrios
  const handleBarriosChange = (
    _event: SyntheticEvent<Element, Event>,
    newValue: string[]
  ) => {
    // Procesar y limpiar los nuevos valores
    const processedBarrios = newValue
      .map(barrio => barrio.trim())
      .filter(barrio => barrio !== '');

    // Mantener los barrios seleccionados y permitir nuevos valores
    onBarriosChange(processedBarrios);

    // Si hay barrios predefinidos, actualizar las seccionales correspondientes
    const selectedSeccionales = new Set<string>();
    processedBarrios.forEach(barrio => {
      const seccionales = barriosSeccionalMap[barrio] || [];
      seccionales.forEach(s => selectedSeccionales.add(s));
    });

    // Solo actualizar seccionales si hay barrios predefinidos seleccionados
    if (selectedSeccionales.size > 0) {
      const newSeccionales = Array.from(selectedSeccionales)
        .map(Number)
        .sort((a, b) => a - b);
      onSeccionalChange(newSeccionales);
    }
  };

  // Estilos con emotion
  const NewBarrioText = styled(Typography)({
    fontStyle: 'italic'
  });

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
              placeholder="Seleccione las seccionales (opcional)"
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
          freeSolo
          options={availableBarrios}
          value={barrios}
          onChange={handleBarriosChange}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              // Prevenir el comportamiento por defecto
              event.preventDefault();
              
              // Obtener el valor actual del input
              const input = event.target as HTMLInputElement;
              const newBarrio = input.value.trim();
              
              if (newBarrio && !barrios.includes(newBarrio)) {
                // Agregar el nuevo barrio a la lista
                handleBarriosChange(
                  event,
                  [...barrios, newBarrio]
                );
                
                // Limpiar el input
                input.value = '';
              }
            }
          }}
          filterOptions={(options, params) => {
            const filtered = options.filter(option =>
              option.toLowerCase().includes(params.inputValue.toLowerCase())
            );

            // Agregar la opción de crear un nuevo barrio si el valor no existe
            const inputValue = params.inputValue.trim();
            if (inputValue !== '' && !options.includes(inputValue) && !barrios.includes(inputValue)) {
              filtered.push(`${inputValue} (Nuevo)`);
            }

            return filtered;
          }}
          renderOption={(props, option) => (
            <li {...props}>
              {option.endsWith(' (Nuevo)') ? (
                <NewBarrioText>
                  {option.replace(' (Nuevo)', '')}
                </NewBarrioText>
              ) : (
                option
              )}
            </li>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Barrios"
              error={!!errors.barrios}
              helperText={errors.barrios || 'Seleccione o ingrese barrios (opcional)'}
              placeholder="Seleccione o ingrese barrios"
            />
          )}
          renderTags={(value: string[], getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={option.replace(' (Nuevo)', '')}
                icon={<LocationOnIcon />}
              />
            ))
          }
        />
      </Grid>
    </Grid>
  );
};
