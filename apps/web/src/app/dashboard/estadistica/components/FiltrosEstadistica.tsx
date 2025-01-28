import React from 'react';
import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Typography,
  IconButton,
  Tooltip,
  useTheme,
  OutlinedInput,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from '@mui/material';
import {
  FilterAlt as FilterIcon,
  RestartAlt as ResetIcon,
} from '@mui/icons-material';
import { Zona, ZonaLabel } from '../types/zona';
import { TiempoOperativo, Unidad } from '@prisma/client';
import { EstadisticasFiltros } from '../services/estadisticas.service';

interface Props {
  filtros: EstadisticasFiltros;
  onChange: (filtros: EstadisticasFiltros) => void;
}

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const FILTROS_VACIOS: EstadisticasFiltros = {
  zona: [],
  unidad: [],
  tiempoOperativo: [],
  mostrarSeccionales: false,
  mostrarBarrios: false,
};

type FiltroKey = keyof Pick<EstadisticasFiltros, 'zona' | 'unidad' | 'tiempoOperativo'>;
type FiltroValue<T extends FiltroKey> = EstadisticasFiltros[T][number];

const FiltrosEstadistica: React.FC<Props> = ({ filtros, onChange }) => {
  const theme = useTheme();

  const handleChange = (key: keyof EstadisticasFiltros, value: EstadisticasFiltros[keyof EstadisticasFiltros]) => {
    onChange({
      ...filtros,
      [key]: value
    });
  };

  const handleCheckboxChange = (campo: 'mostrarSeccionales' | 'mostrarBarrios') => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...filtros,
      [campo]: event.target.checked,
    });
  };

  const handleDelete = <T extends FiltroKey>(campo: T, valor: FiltroValue<T>) => {
    const nuevosFiltros = {
      ...filtros,
      [campo]: (filtros[campo] as FiltroValue<T>[]).filter(v => v !== valor),
    };
    onChange(nuevosFiltros);
  };

  const limpiarFiltros = () => {
    onChange(FILTROS_VACIOS);
  };

  // Función para formatear valores enum
  const formatearValorEnum = (valor: string): string => {
    // Casos especiales
    if (valor === 'GEO') return 'GEO';
    
    // Manejar números romanos
    const tieneNumeroRomano = valor.match(/_([IVX]+)$/);
    if (tieneNumeroRomano) {
      const base = valor.slice(0, tieneNumeroRomano.index);
      const numeroRomano = tieneNumeroRomano[1];
      return base
        .split('_')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(' ') + ' ' + numeroRomano;
    }

    // Caso general
    return valor
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  const contarFiltrosActivos = () => {
    return Object.values(filtros).filter(valor => 
      Array.isArray(valor) && valor.length > 0
    ).length;
  };

  return (
    <Box>
      {/* Encabezado de Filtros */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: 1, 
          mb: 3,
          pb: 2,
          borderBottom: 1,
          borderColor: 'divider'
        }}
      >
        <FilterIcon color="primary" sx={{ fontSize: 20 }} />
        <Typography variant="subtitle1" color="primary" sx={{ fontWeight: 500 }}>
          Filtros de Búsqueda
        </Typography>
        <Box sx={{ flexGrow: 1 }} />
        {contarFiltrosActivos() > 0 && (
          <Tooltip title="Restablecer filtros">
            <IconButton 
              size="small" 
              onClick={limpiarFiltros}
              sx={{ 
                color: theme.palette.grey[500],
                '&:hover': {
                  color: theme.palette.primary.main,
                }
              }}
            >
              <ResetIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>

      {/* Contenedor de Filtros */}
      <Box 
        sx={{ 
          display: 'flex',
          gap: 2,
          flexWrap: 'wrap'
        }}
      >
        {/* Filtro de Zona */}
        <FormControl 
          sx={{ 
            minWidth: 200,
            flex: 1,
          }}
          size="small"
        >
          <InputLabel id="zona-label">Zona</InputLabel>
          <Select<Zona[]>
            labelId="zona-label"
            id="zona"
            multiple
            value={filtros.zona}
            input={<OutlinedInput label="Zona" />}
            onChange={(event) => handleChange('zona', event.target.value as Zona[])}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={ZonaLabel[value]} size="small" />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {Object.entries(ZonaLabel).map(([value, label]) => (
              <MenuItem 
                key={value} 
                value={value as Zona}
                sx={{
                  fontWeight: filtros.zona.includes(value as Zona) ? 500 : 400,
                  bgcolor: filtros.zona.includes(value as Zona)
                    ? `${theme.palette.primary.main}15` 
                    : 'transparent',
                }}
              >
                {label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro de Unidad */}
        <FormControl 
          sx={{ 
            minWidth: 200,
            flex: 1,
          }}
          size="small"
        >
          <InputLabel id="unidad-label">Unidad</InputLabel>
          <Select<Unidad[]>
            labelId="unidad-label"
            id="unidad"
            multiple
            value={filtros.unidad}
            input={<OutlinedInput label="Unidad" />}
            onChange={(event) => handleChange('unidad', event.target.value as Unidad[])}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={formatearValorEnum(value)} size="small" />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {Object.values(Unidad).map((unidad) => (
              <MenuItem 
                key={unidad} 
                value={unidad}
                sx={{
                  fontWeight: filtros.unidad.includes(unidad) ? 500 : 400,
                  bgcolor: filtros.unidad.includes(unidad)
                    ? `${theme.palette.primary.main}15` 
                    : 'transparent',
                }}
              >
                {formatearValorEnum(unidad)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Filtro de Tiempo Operativo */}
        <FormControl 
          sx={{ 
            minWidth: 200,
            flex: 1,
          }}
          size="small"
        >
          <InputLabel id="tiempo-operativo-label">Tiempo Operativo</InputLabel>
          <Select<TiempoOperativo[]>
            labelId="tiempo-operativo-label"
            id="tiempo-operativo"
            multiple
            value={filtros.tiempoOperativo}
            input={<OutlinedInput label="Tiempo Operativo" />}
            onChange={(event) => handleChange('tiempoOperativo', event.target.value as TiempoOperativo[])}
            renderValue={(selected) => (
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                {selected.map((value) => (
                  <Chip key={value} label={formatearValorEnum(value)} size="small" />
                ))}
              </Box>
            )}
            MenuProps={MenuProps}
          >
            {Object.values(TiempoOperativo).map((tiempo) => (
              <MenuItem 
                key={tiempo} 
                value={tiempo}
                sx={{
                  fontWeight: filtros.tiempoOperativo.includes(tiempo) ? 500 : 400,
                  bgcolor: filtros.tiempoOperativo.includes(tiempo)
                    ? `${theme.palette.primary.main}15` 
                    : 'transparent',
                }}
              >
                {formatearValorEnum(tiempo)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {/* Checkboxes para Seccionales y Barrios */}
      <Box sx={{ mt: 2, mb: 2 }}>
        <FormGroup row>
          <FormControlLabel
            control={
              <Checkbox
                checked={filtros.mostrarSeccionales}
                onChange={handleCheckboxChange('mostrarSeccionales')}
                name="mostrarSeccionales"
              />
            }
            label="Mostrar gráfica por Seccionales"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={filtros.mostrarBarrios}
                onChange={handleCheckboxChange('mostrarBarrios')}
                name="mostrarBarrios"
              />
            }
            label="Mostrar gráfica por Barrios"
          />
        </FormGroup>
      </Box>

      {/* Indicador de Filtros Activos */}
      {contarFiltrosActivos() > 0 && (
        <Box sx={{ mt: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          {filtros.zona.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {filtros.zona.map((value) => (
                <Chip
                  key={value}
                  label={`Zona: ${ZonaLabel[value]}`}
                  size="small"
                  color="primary"
                  onDelete={() => handleDelete('zona', value)}
                />
              ))}
            </Box>
          )}
          {filtros.unidad.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {filtros.unidad.map((value) => (
                <Chip
                  key={value}
                  label={`Unidad: ${formatearValorEnum(value)}`}
                  size="small"
                  color="primary"
                  onDelete={() => handleDelete('unidad', value)}
                />
              ))}
            </Box>
          )}
          {filtros.tiempoOperativo.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {filtros.tiempoOperativo.map((value) => (
                <Chip
                  key={value}
                  label={`Tiempo: ${formatearValorEnum(value)}`}
                  size="small"
                  color="primary"
                  onDelete={() => handleDelete('tiempoOperativo', value)}
                />
              ))}
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default FiltrosEstadistica;
