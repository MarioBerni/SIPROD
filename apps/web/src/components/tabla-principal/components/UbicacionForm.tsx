import { useState, useEffect, useCallback } from 'react';
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

// Obtener todas las seccionales y barrios
const allSeccionales = Object.keys(seccionalBarriosMap).map(seccional => ({
  id: seccional,
  label: `Seccional ${seccional}`
}));

const allBarrios = Array.from(new Set(Object.values(seccionalBarriosMap).flat()))
  .sort((a, b) => a.localeCompare(b, 'es')) // Ordenar alfabéticamente usando el locale español
  .map(barrio => ({
    id: barrio,
    label: barrio
  }));

interface UbicacionFormProps {
  initialSeccionales?: number[];
  initialBarrios?: string[];
  onChange: (seccionales: number[], barrios: string[]) => void;
}

export function UbicacionForm({ initialSeccionales = [], initialBarrios = [], onChange }: UbicacionFormProps) {
  type SeccionalOption = { id: string; label: string };
  type BarrioOption = { id: string; label: string };

  const [selectedSeccionales, setSelectedSeccionales] = useState<SeccionalOption[]>(
    initialSeccionales.map(s => ({ id: s.toString(), label: `Seccional ${s}` }))
  );
  const [selectedBarrios, setSelectedBarrios] = useState<BarrioOption[]>(
    initialBarrios.map(b => ({ id: b, label: b }))
  );

  const updateValues = useCallback((newSeccionales: SeccionalOption[], newBarrios: BarrioOption[]) => {
    onChange(
      newSeccionales.map(s => parseInt(s.id, 10)),
      newBarrios.map(b => b.id)
    );
  }, [onChange]);

  const handleSeccionalChange = (_: React.SyntheticEvent, newValue: SeccionalOption[]) => {
    const newSeccionalIds = newValue.map(s => s.id);
    const newBarrios = Array.from(new Set(newSeccionalIds.flatMap(seccional => seccionalBarriosMap[seccional] || [])));
    
    const updatedBarrios = newBarrios.map(b => ({ id: b, label: b }));
    setSelectedSeccionales(newValue);
    setSelectedBarrios(updatedBarrios);
    updateValues(newValue, updatedBarrios);
  };

  const handleBarrioChange = (_: React.SyntheticEvent, newValue: BarrioOption[]) => {
    const newBarrioIds = newValue.map(b => b.id);
    const newSeccionales = Array.from(new Set(newBarrioIds.flatMap(barrio => barriosSeccionalMap[barrio] || [])));
    
    const updatedSeccionales = newSeccionales.map(s => ({ id: s, label: `Seccional ${s}` }));
    setSelectedBarrios(newValue);
    setSelectedSeccionales(updatedSeccionales);
    updateValues(updatedSeccionales, newValue);
  };

  useEffect(() => {
    setSelectedSeccionales(initialSeccionales.map(s => ({ id: s.toString(), label: `Seccional ${s}` })));
    setSelectedBarrios(initialBarrios.map(b => ({ id: b, label: b })));
  }, [initialSeccionales, initialBarrios]);

  const chipStyles = {
    margin: '3px',
    '& .MuiChip-deleteIcon': {
      marginLeft: '5px',
    },
    height: '28px',
    '& .MuiChip-label': {
      padding: '0 8px',
      fontSize: '0.875rem',
    },
  };

  const autocompleteStyles = {
    flex: 1,
    '& .MuiOutlinedInput-root': {
      padding: '8px !important',
      gap: '5px',
      flexWrap: 'wrap',
      '& .MuiAutocomplete-tag': {
        margin: '2px',
      },
    },
    '& .MuiAutocomplete-endAdornment': {
      right: '8px',
    },
    '& .MuiFormLabel-root': {
      backgroundColor: '#fff',
      padding: '0 8px',
      marginLeft: '-4px',
    },
    '& .MuiInputLabel-shrink': {
      transform: 'translate(14px, -9px) scale(0.75)',
    },
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      gap: 2, 
      width: '100%',
      mt: 3 // Agregando margen superior para mantener consistencia con otras cards
    }}>
      <Autocomplete<SeccionalOption, true>
        multiple
        disableCloseOnSelect
        limitTags={4}
        id="seccionales-tags"
        options={allSeccionales}
        value={selectedSeccionales}
        onChange={handleSeccionalChange}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                label={option.label}
                {...tagProps}
                sx={chipStyles}
                size="small"
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              sx: {
                backgroundColor: '#fff',
                padding: '0 8px',
                marginLeft: '-4px',
              }
            }}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '-4px' }}>
                <LocationOnIcon sx={{ mr: 0.5, fontSize: 20 }} />
                Seccionales
              </Box>
            }
            placeholder={selectedSeccionales.length === 0 ? "Seleccionar seccionales" : ""}
          />
        )}
        sx={autocompleteStyles}
      />

      <Autocomplete<BarrioOption, true>
        multiple
        disableCloseOnSelect
        limitTags={4}
        id="barrios-tags"
        options={allBarrios}
        value={selectedBarrios}
        onChange={handleBarrioChange}
        getOptionLabel={(option) => option.label}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        renderTags={(tagValue, getTagProps) =>
          tagValue.map((option, index) => {
            const { key, ...tagProps } = getTagProps({ index });
            return (
              <Chip
                key={key}
                label={option.label}
                {...tagProps}
                sx={chipStyles}
                size="small"
              />
            );
          })
        }
        renderInput={(params) => (
          <TextField
            {...params}
            InputLabelProps={{
              sx: {
                backgroundColor: '#fff',
                padding: '0 8px',
                marginLeft: '-4px',
              }
            }}
            label={
              <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '-4px' }}>
                <LocationOnIcon sx={{ mr: 0.5, fontSize: 20 }} />
                Barrios
              </Box>
            }
            placeholder={selectedBarrios.length === 0 ? "Seleccionar barrios" : ""}
          />
        )}
        sx={autocompleteStyles}
      />
    </Box>
  );
}
