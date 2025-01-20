'use client';

import { useState, useEffect } from 'react';
import {
  Grid,
  FormControl,
  Box,
  Button,
  Card,
  Divider,
  Autocomplete,
  Chip,
  CircularProgress,
  Typography,
  TextField,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { tablaPrincipalApi } from '@/lib/api';
import { FilterFormState, CustomTable } from '../types';
import { 
  UnidadLabel, 
  TiempoOperativoLabel,
  Unidad,
  TiempoOperativo,
} from '@/components/tabla-principal/types/generated';

interface FilterFormProps {
  filters: FilterFormState;
  onFilterChange: (filters: FilterFormState) => void;
}

const TURNOS = ['06:00 a 14:00', '14:00 a 22:00', '22:00 a 06:00'] as const;
const ORGANIZACION_OPTIONS = [
  'Unidad',
  'Tiempo Operativo',
  'Nombre Operativo',
  'Turno',
  'Grupos Operativos',
] as const;

export default function FilterForm({ filters, onFilterChange }: FilterFormProps) {
  const [loading, setLoading] = useState(true);
  const [options, setOptions] = useState<{
    unidades: string[];
    tiemposOperativos: string[];
    nombresOperativos: string[];
  }>({
    unidades: [],
    tiemposOperativos: [],
    nombresOperativos: []
  });

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const data = await tablaPrincipalApi.getFilterOptions();
        setOptions({
          unidades: data.unidades.map(value => UnidadLabel[value as keyof typeof Unidad]),
          tiemposOperativos: data.tiemposOperativos.map(value => TiempoOperativoLabel[value as keyof typeof TiempoOperativo]),
          nombresOperativos: data.nombresOperativos
        });
      } catch (error) {
        console.error('Error fetching options:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOptions();
  }, []);

  const handleFilterChange = <K extends keyof FilterFormState>(
    field: K,
    newValue: FilterFormState[K]
  ) => {
    // Campos que no requieren conversión de enum
    if (
      field === 'customTables' ||
      field === 'incluirInforme' ||
      field === 'customGroups' ||
      field === 'groupTitles'
    ) {
      const newFilters: FilterFormState = {
        ...filters,
        [field]: newValue,
      };
      onFilterChange(newFilters);
      return;
    }

    // Campos que son arrays de strings y requieren conversión
    if (Array.isArray(newValue)) {
      if (field === 'unidades') {
        const formattedValue = newValue.map(value => {
          const entry = Object.entries(UnidadLabel).find(([key]) => UnidadLabel[key as keyof typeof UnidadLabel] === value);
          return entry ? entry[0] : value;
        });
        const newFilters: FilterFormState = {
          ...filters,
          [field]: formattedValue,
        };
        onFilterChange(newFilters);
      } else if (field === 'tiemposOperativos') {
        const formattedValue = newValue.map(value => {
          const entry = Object.entries(TiempoOperativoLabel).find(([key]) => TiempoOperativoLabel[key as keyof typeof TiempoOperativoLabel] === value);
          return entry ? entry[0] : value;
        });
        const newFilters: FilterFormState = {
          ...filters,
          [field]: formattedValue,
        };
        onFilterChange(newFilters);
      } else {
        // Para otros arrays (nombresOperativos, turnos)
        const newFilters: FilterFormState = {
          ...filters,
          [field]: newValue,
        };
        onFilterChange(newFilters);
      }
    } else {
      // Para campos string individuales (organizarPor)
      const newFilters: FilterFormState = {
        ...filters,
        [field]: newValue,
      };
      onFilterChange(newFilters);
    }
  };

  const handleAddTable = () => {
    const newTable: CustomTable = {
      id: `table-${Date.now()}`,
      title: '',
      selectedOperativos: []
    };

    handleFilterChange('customTables', [...filters.customTables, newTable]);
  };

  const handleTableChange = <K extends keyof CustomTable>(
    tableIndex: number,
    field: K,
    value: CustomTable[K]
  ) => {
    const updatedTables = [...filters.customTables];
    updatedTables[tableIndex] = {
      ...updatedTables[tableIndex],
      [field]: value,
    };
    handleFilterChange('customTables', updatedTables);
  };

  const handleRemoveTable = (tableIndex: number) => {
    const updatedTables = filters.customTables.filter((_, index) => index !== tableIndex);
    handleFilterChange('customTables', updatedTables);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={200}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ '& .MuiFormControl-root': { mb: 1 } }}>
      <Grid container spacing={1.5}>
        <Grid item xs={12}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 1.5, 
              color: theme => theme.palette.text.primary,
              fontWeight: 600
            }}
          >
            Filtros de Búsqueda
          </Typography>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <Autocomplete
              multiple
              size="small"
              options={options.unidades}
              value={filters.unidades.map(value => UnidadLabel[value as keyof typeof Unidad])}
              onChange={(_, newValue) => handleFilterChange('unidades', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...chipProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option}
                      size="small"
                      {...chipProps}
                      sx={{
                        borderRadius: '12px',
                        '& .MuiChip-deleteIcon': {
                          color: theme => theme.palette.primary.main,
                        },
                      }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Unidades"
                  placeholder="Seleccionar unidades"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <Autocomplete
              multiple
              size="small"
              options={options.tiemposOperativos}
              value={filters.tiemposOperativos.map(value => TiempoOperativoLabel[value as keyof typeof TiempoOperativo])}
              onChange={(_, newValue) => handleFilterChange('tiemposOperativos', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...chipProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option}
                      size="small"
                      {...chipProps}
                      sx={{
                        borderRadius: '12px',
                        '& .MuiChip-deleteIcon': {
                          color: theme => theme.palette.primary.main,
                        },
                      }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Tiempos Operativos"
                  placeholder="Seleccionar tiempos"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <Autocomplete
              multiple
              size="small"
              options={options.nombresOperativos}
              value={filters.nombresOperativos}
              onChange={(_, newValue) => handleFilterChange('nombresOperativos', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...chipProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option}
                      size="small"
                      {...chipProps}
                      sx={{
                        borderRadius: '12px',
                        '& .MuiChip-deleteIcon': {
                          color: theme => theme.palette.primary.main,
                        },
                      }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Nombres de Operativos"
                  placeholder="Seleccionar nombres"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <Autocomplete
              multiple
              size="small"
              options={TURNOS}
              value={filters.turnos}
              onChange={(_, newValue) => handleFilterChange('turnos', newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => {
                  const { key, ...chipProps } = getTagProps({ index });
                  return (
                    <Chip
                      key={key}
                      label={option}
                      size="small"
                      {...chipProps}
                      sx={{
                        borderRadius: '12px',
                        '& .MuiChip-deleteIcon': {
                          color: theme => theme.palette.primary.main,
                        },
                      }}
                    />
                  );
                })
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Turnos"
                  placeholder="Seleccionar turnos"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <FormControl fullWidth size="small">
            <Autocomplete
              size="small"
              options={ORGANIZACION_OPTIONS}
              value={filters.organizarPor}
              onChange={(_, newValue) => handleFilterChange('organizarPor', newValue || '')}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Organizar por"
                  placeholder="Seleccionar organización"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
              )}
            />
          </FormControl>
        </Grid>

        <Grid item xs={12}>
          <Divider sx={{ my: 1 }} />
        </Grid>

        <Grid item xs={12}>
          <Typography 
            variant="subtitle1" 
            sx={{ 
              mb: 1,
              color: theme => theme.palette.text.primary,
              fontWeight: 600
            }}
          >
            Tablas Personalizadas
          </Typography>
        </Grid>

        {filters.customTables.map((table, index) => (
          <Grid item xs={12} key={table.id}>
            <Card 
              variant="outlined" 
              sx={{ 
                p: 1.5,
                borderRadius: '8px',
                borderColor: theme => theme.palette.divider,
                '&:hover': {
                  borderColor: theme => theme.palette.primary.main,
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  label="Título de la Tabla"
                  value={table.title}
                  onChange={(e) => handleTableChange(index, 'title', e.target.value)}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px',
                    },
                  }}
                />
                <IconButton
                  size="small"
                  onClick={() => handleRemoveTable(index)}
                  color="error"
                  sx={{ ml: 0.5 }}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
              
              <Autocomplete
                multiple
                size="small"
                options={options.nombresOperativos}
                value={table.selectedOperativos}
                onChange={(_, newValue) => handleTableChange(index, 'selectedOperativos', newValue)}
                renderTags={(value, getTagProps) =>
                  value.map((option, index) => {
                    const { key, ...chipProps } = getTagProps({ index });
                    return (
                      <Chip
                        key={key}
                        label={option}
                        size="small"
                        {...chipProps}
                        sx={{
                          borderRadius: '12px',
                          '& .MuiChip-deleteIcon': {
                            color: theme => theme.palette.primary.main,
                          },
                        }}
                      />
                    );
                  })
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Operativos"
                    placeholder="Seleccionar operativos"
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '8px',
                      },
                    }}
                  />
                )}
              />
            </Card>
          </Grid>
        ))}

        <Grid item xs={12}>
          <Button
            size="small"
            startIcon={<AddIcon />}
            onClick={handleAddTable}
            variant="outlined"
            sx={{
              mt: 1,
              borderRadius: '8px',
              textTransform: 'none',
              borderColor: theme => theme.palette.primary.main,
              color: theme => theme.palette.primary.main,
              '&:hover': {
                borderColor: theme => theme.palette.primary.dark,
                bgcolor: theme => theme.palette.primary.main + '0A',
              },
            }}
          >
            Agregar Nueva Tabla
          </Button>
        </Grid>
      </Grid>
    </Box>
  );
}
