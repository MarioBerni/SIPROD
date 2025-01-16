import React, { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Grid,
  Typography,
  Box,
  useTheme,
  alpha,
  SelectChangeEvent,
  TextField,
  Autocomplete,
  Chip
} from '@mui/material';
import { 
  Info as InfoIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  LocationOn as LocationOnIcon,
  Note as NoteIcon,
  AddCircleOutline as AddCircleOutlineIcon
} from '@mui/icons-material';
import { TablaPrincipal, Departamento, Unidad, TipoOrden, TipoOperativo, TiempoOperativo } from '../types';
import { isValid } from 'date-fns';

// Importar secciones del formulario
import { BasicInformation } from './form-sections/BasicInformation';
import { OperativeInformation } from './form-sections/OperativeInformation';
import { DateTimeInformation } from './form-sections/DateTimeInformation';
import { ResourceInformation } from './form-sections/ResourceInformation';
import { UbicacionForm } from './UbicacionForm';

interface AddRecordModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (formData: Partial<TablaPrincipal>) => void;
  loading?: boolean;
  error?: string | null;
  validationErrors?: Record<string, string>;
  mode?: 'add' | 'edit';
  initialData?: TablaPrincipal | null;
}

// Definición de colores basados en el theme institucional
const sectionColors = {
  basic: {
    main: '#1a3b6e', // Azul institucional
    light: alpha('#1a3b6e', 0.05),
    border: alpha('#1a3b6e', 0.2)
  },
  operative: {
    main: '#2c3e50', // Gris azulado profesional
    light: alpha('#2c3e50', 0.05),
    border: alpha('#2c3e50', 0.2)
  },
  datetime: {
    main: '#1a3b6e', // Azul institucional
    light: alpha('#1a3b6e', 0.05),
    border: alpha('#1a3b6e', 0.2)
  },
  resources: {
    main: '#2d5a27', // Verde institucional
    light: alpha('#2d5a27', 0.05),
    border: alpha('#2d5a27', 0.2)
  },
  location: {
    main: '#2c3e50', // Gris azulado profesional
    light: alpha('#2c3e50', 0.05),
    border: alpha('#2c3e50', 0.2)
  },
  observations: {
    main: '#1a3b6e', // Azul institucional
    light: alpha('#1a3b6e', 0.05),
    border: alpha('#1a3b6e', 0.2)
  }
};

// Componente para la sección del formulario
const FormSection = ({ 
  icon: Icon, 
  title, 
  children,
  color
}: { 
  icon: React.ElementType; 
  title: string; 
  children: React.ReactNode;
  color: keyof typeof sectionColors;
}) => {
  const theme = useTheme();
  
  return (
    <Box
      sx={{
        mb: 4,
        position: 'relative',
        '&:last-child': {
          mb: 0
        }
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 2,
          mb: 3,
        }}
      >
        <Box
          sx={{
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '12px',
            backgroundColor: alpha(sectionColors[color].main, 0.08),
            color: sectionColors[color].main,
          }}
        >
          <Icon sx={{ fontSize: 24 }} />
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 600,
            color: theme.palette.text.primary,
          }}
        >
          {title}
        </Typography>
      </Box>

      <Box
        sx={{
          pl: 7,
          position: 'relative',
          '&:before': {
            content: '""',
            position: 'absolute',
            left: '20px',
            top: '-10px',
            bottom: '0',
            width: '1px',
            bgcolor: theme.palette.divider,
            opacity: 0.3,
          },
          '& .MuiFormControl-root': {
            mb: 3,
            '& .MuiInputBase-root': {
              backgroundColor: theme.palette.background.paper,
              transition: 'all 0.2s ease-in-out',
              borderRadius: '12px',
              border: `1px solid ${theme.palette.divider}`,
              '&:hover': {
                borderColor: sectionColors[color].main,
                backgroundColor: alpha(sectionColors[color].light, 0.1),
              },
              '&.Mui-focused': {
                borderColor: sectionColors[color].main,
                boxShadow: `0 0 0 2px ${alpha(sectionColors[color].main, 0.2)}`,
                backgroundColor: theme.palette.background.paper,
              },
              '& fieldset': {
                border: 'none',
              }
            },
            '& .MuiInputLabel-root': {
              '&.Mui-focused': {
                color: sectionColors[color].main,
              }
            }
          },
          '& .MuiAutocomplete-root': {
            '& .MuiOutlinedInput-root': {
              padding: '4px !important',
            }
          },
          '& .MuiChip-root': {
            borderRadius: '8px',
            height: '28px',
            fontSize: '0.85rem',
            backgroundColor: alpha(sectionColors[color].light, 0.2),
            borderColor: 'transparent',
            '&:hover': {
              backgroundColor: alpha(sectionColors[color].main, 0.1),
            },
            '& .MuiChip-deleteIcon': {
              fontSize: '16px',
              color: alpha(sectionColors[color].main, 0.7),
              '&:hover': {
                color: theme.palette.error.main,
              },
            },
          }
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

// Componente AutocompleteField
const AutocompleteField = ({
  options,
  value,
  onChange,
  label,
  error,
  helperText,
  multiple = false,
  required = false
}: {
  options: string[];
  value: string | string[] | null;
  onChange: (value: string | string[]) => void;
  label: string;
  error?: boolean;
  helperText?: string;
  multiple?: boolean;
  required?: boolean;
}) => {
  return (
    <Autocomplete
      multiple={multiple}
      options={options}
      value={value || (multiple ? [] : null)}
      onChange={(_, newValue) => onChange(newValue || (multiple ? [] : ''))}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          required={required}
        />
      )}
      renderTags={(tagValue: string[], getTagProps) =>
        tagValue.map((option: string, index: number) => (
          <Chip
            {...getTagProps({ index })}
            key={`chip-${index}`}
            variant="outlined"
            label={option}
          />
        ))
      }
    />
  );
};

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  validationErrors = {},
  mode = 'add',
  initialData = null
}) => {
  // Estado inicial del formulario para modo 'add'
  const emptyFormData = useMemo<Partial<TablaPrincipal>>(() => ({
    departamento: '' as Departamento,
    unidad: '' as Unidad,
    tipoOrden: '' as TipoOrden,
    tipoOperativo: '' as TipoOperativo,
    tiempoOperativo: '' as TiempoOperativo,
    nroOrden: '',
    nombreOperativo: '',
    fechaInicio: undefined,
    horaInicio: undefined,
    fechaFin: undefined,
    horaFin: undefined,
    observacionesOrden: '',
    seccional: [],
    barrios: [],
    moviles: undefined,
    ppssEnMovil: undefined,
    ssoo: undefined,
    motos: undefined,
    motosBitripuladas: undefined,
    hipos: undefined,
    canes: undefined,
    pieTierra: undefined,
    drones: undefined,
    antidisturbioApostado: undefined,
    antidisturbioAlerta: undefined,
    geoApostado: undefined,
    geoAlerta: undefined,
    totalPpss: undefined
  }), []);

  const [formData, setFormData] = useState<Partial<TablaPrincipal>>(mode === 'edit' ? initialData || {} : emptyFormData);

  // Efecto para actualizar el formulario cuando cambian los datos iniciales
  useEffect(() => {
    if (open) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData);
      } else {
        setFormData(emptyFormData);
      }
    }
  }, [open, initialData, mode, emptyFormData]);

  const [internalValidationErrors, setInternalValidationErrors] = useState<Record<string, string>>({});

  // Combinar errores de validación externos e internos
  const allValidationErrors = { ...internalValidationErrors, ...validationErrors };

  // Efecto para resetear el formulario cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      if (mode === 'edit' && initialData) {
        setFormData(initialData);
      } else {
        setFormData(emptyFormData);
      }
      setInternalValidationErrors({});
    }
  }, [open, initialData, mode, emptyFormData]);

  const handleChange = (field: keyof TablaPrincipal) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent<string>
  ) => {
    const value = event.target.value;
    
    // Manejar arrays
    if (['seccional', 'barrios'].includes(field)) {
      const arrayValue = Array.isArray(value) ? value : value ? value.split(',').map(item => item.trim()) : [];
      setFormData(prev => ({
        ...prev,
        [field]: arrayValue
      }));
      return;
    }

    // Manejar números
    if ([
      'moviles', 'ppssEnMovil', 'ssoo', 'motos', 'motosBitripuladas',
      'hipos', 'canes', 'pieTierra', 'drones', 'antidisturbioApostado',
      'antidisturbioAlerta', 'geoApostado', 'geoAlerta', 'totalPpss'
    ].includes(field)) {
      const numberValue = value === '' ? undefined : Number(value);
      setFormData(prev => ({
        ...prev,
        [field]: numberValue
      }));
      return;
    }

    // Manejar otros campos
    setFormData(prev => ({
      ...prev,
      [field]: value === '' ? undefined : value
    }));
  };

  const handleNumberChange = (field: keyof TablaPrincipal) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = parseInt(event.target.value as string, 10) || 0;
    setFormData((prev: Partial<TablaPrincipal>) => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDateChange = (field: keyof TablaPrincipal, value: string) => {
    try {
      const newDate = value ? new Date(value) : undefined;
      
      if (value && !isValid(newDate)) {
        console.error(`Fecha inválida para ${String(field)}: ${value}`);
        return;
      }

      setFormData((prev: Partial<TablaPrincipal>) => ({
        ...prev,
        [field]: newDate
      }));
    } catch (error) {
      console.error(`Error al procesar fecha para ${String(field)}:`, error);
    }
  };

  const handleTimeChange = (field: keyof TablaPrincipal, value: string) => {
    try {
      const newDate = value ? new Date(`1970-01-01T${value}`) : undefined;

      if (value && !isValid(newDate)) {
        console.error(`Hora inválida para ${String(field)}: ${value}`);
        return;
      }

      setFormData((prev: Partial<TablaPrincipal>) => ({
        ...prev,
        [field]: newDate
      }));
    } catch (error) {
      console.error(`Error al procesar hora para ${String(field)}:`, error);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const totalPpss = (formData.ppssEnMovil || 0) + 
                     (formData.motos || 0) +
                     (formData.hipos || 0) +
                     (formData.pieTierra || 0) +
                     ((formData.motosBitripuladas || 0) * 2); // Duplicar el valor de motos bitripuladas

    // Limpiar valores vacíos de enums
    const cleanedData: Partial<TablaPrincipal> = {
      ...formData,
      departamento: formData.departamento || undefined,
      unidad: formData.unidad || undefined,
      tipoOrden: formData.tipoOrden || undefined,
      tipoOperativo: formData.tipoOperativo || undefined,
      tiempoOperativo: formData.tiempoOperativo || undefined,
      totalPpss,
      // Asegurar que los arrays estén inicializados
      seccional: formData.seccional || [],
      barrios: formData.barrios || []
    };

    onSubmit(cleanedData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '16px',
          boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
        }
      }}
    >
      <DialogTitle
        sx={{
          px: 3,
          pt: 3,
          pb: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1,
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        {mode === 'add' ? (
          <AddCircleOutlineIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        ) : (
          <InfoIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        )}
        <Typography variant="h5" component="span" sx={{ fontWeight: 600 }}>
          {mode === 'add' ? 'Agregar Nuevo Registro' : 'Editar Registro'}
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          {/* Sección 1: Información Básica */}
          <FormSection 
            icon={DescriptionIcon} 
            title="Información Básica"
            color="basic"
          >
            <Grid container spacing={3}>
              <BasicInformation 
                formData={formData}
                handleChange={handleChange}
                validationErrors={allValidationErrors}
              />
            </Grid>
          </FormSection>

          {/* Sección 2: Información del Operativo */}
          <FormSection 
            icon={InfoIcon} 
            title="Detalles del Operativo"
            color="operative"
          >
            <Grid container spacing={3}>
              <OperativeInformation 
                formData={formData}
                handleChange={handleChange}
                validationErrors={allValidationErrors}
              />
            </Grid>
          </FormSection>

          {/* Sección 3: Fechas y Horas */}
          <FormSection 
            icon={AccessTimeIcon} 
            title="Período del Operativo"
            color="datetime"
          >
            <Grid container spacing={3}>
              <DateTimeInformation 
                formData={formData}
                handleDateChange={handleDateChange}
                handleTimeChange={handleTimeChange}
                validationErrors={allValidationErrors}
              />
            </Grid>
          </FormSection>

          {/* Sección 4: Recursos */}
          <FormSection 
            icon={GroupIcon} 
            title="Recursos Asignados"
            color="resources"
          >
            <Grid container spacing={3}>
              <ResourceInformation 
                formData={formData}
                handleNumberChange={handleNumberChange}
                validationErrors={allValidationErrors}
              />
            </Grid>
          </FormSection>

          {/* Sección 5: Ubicación */}
          <FormSection 
            icon={LocationOnIcon} 
            title="Ubicación"
            color="location"
          >
            <Grid container spacing={3}>
              <UbicacionForm
                seccional={formData.seccional || []}
                barrios={formData.barrios || []}
                onSeccionalChange={(newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    seccional: newValue,
                    barrios: newValue.length === 0 ? [] : prev.barrios
                  }));
                }}
                onBarriosChange={(newValue) => {
                  setFormData(prev => ({
                    ...prev,
                    barrios: newValue
                  }));
                }}
                errors={{
                  seccional: allValidationErrors.seccional,
                  barrios: allValidationErrors.barrios
                }}
              />
            </Grid>
          </FormSection>

          {/* Sección 6: Observaciones */}
          <FormSection 
            icon={NoteIcon} 
            title="Observaciones"
            color="observations"
          >
            <AutocompleteField
              options={['Opción 1', 'Opción 2', 'Opción 3']}
              value={formData.observacionesOrden || ''}
              onChange={(value) => {
                setFormData(prev => ({
                  ...prev,
                  observacionesOrden: Array.isArray(value) ? value[0] : value
                }));
              }}
              label="Observaciones"
              error={!!validationErrors.observacionesOrden}
              helperText={validationErrors.observacionesOrden}
              multiple={false}
            />
          </FormSection>
        </form>
      </DialogContent>

      <DialogActions 
        sx={{ 
          px: 3, 
          py: 2.5,
          gap: 1,
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            px: 3,
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            borderRadius: '10px',
            textTransform: 'none',
            px: 3,
            boxShadow: 'none',
            '&:hover': {
              boxShadow: 'none',
            }
          }}
        >
          {loading ? 'Guardando...' : mode === 'add' ? 'Guardar Registro' : 'Actualizar Registro'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};