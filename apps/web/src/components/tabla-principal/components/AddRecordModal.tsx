import React, { useState, useEffect, useMemo } from 'react';
import { TablaPrincipal } from '../types';
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
import { 
  Departamento, 
  Unidad, 
  TipoOrden, 
  TipoOperativo, 
  TiempoOperativo 
} from '../types/generated';
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
  barriosOptions: string[];
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
        mb: { xs: 2, sm: 2.5, md: 3 },
        p: { xs: 2, sm: 2.5 },
        borderRadius: { xs: '8px', sm: '12px' },
        backgroundColor: sectionColors[color].light,
        border: `1px solid ${sectionColors[color].border}`,
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          boxShadow: `0 4px 12px ${alpha(theme.palette.common.black, 0.05)}`,
          borderColor: sectionColors[color].main,
        },
        '& .MuiFormControl-root': {
          mb: { xs: 1.5, sm: 2 },
        },
        '& .MuiInputBase-root': {
          borderRadius: { xs: '6px', sm: '8px' },
        },
        '& .MuiAutocomplete-root': {
          '& .MuiOutlinedInput-root': {
            padding: '3px !important',
          }
        },
        '& .MuiChip-root': {
          height: '28px',
          fontSize: '0.85rem',
          borderRadius: '6px',
          margin: '2px',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 },
          mb: { xs: 1.5, sm: 2, md: 2.5 },
        }}
      >
        <Icon sx={{ 
          color: sectionColors[color].main,
          fontSize: { xs: 20, sm: 24 },
        }} />
        <Typography
          variant="h6"
          sx={{
            fontWeight: 600,
            color: sectionColors[color].main,
            fontSize: { xs: '1rem', sm: '1.1rem' },
          }}
        >
          {title}
        </Typography>
      </Box>
      {children}
    </Box>
  );
};

// Componente AutocompleteField

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  validationErrors = {},
  mode = 'add',
  initialData = null}) => {
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

    // Limpiar valores vacíos de enums y asegurar que los arrays estén correctamente formateados
    const cleanedData: Partial<TablaPrincipal> = {
      ...formData,
      departamento: formData.departamento || undefined,
      unidad: formData.unidad || undefined,
      tipoOrden: formData.tipoOrden || undefined,
      tipoOperativo: formData.tipoOperativo || undefined,
      tiempoOperativo: formData.tiempoOperativo || undefined,
      totalPpss,
      // Asegurar que los arrays estén inicializados y procesados correctamente
      seccional: Array.isArray(formData.seccional) ? formData.seccional : [],
      barrios: Array.isArray(formData.barrios) 
        ? formData.barrios.map(barrio => barrio.trim()).filter(barrio => barrio !== '')
        : []
    };

    setInternalValidationErrors({});
    onSubmit(cleanedData);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: { xs: '12px', sm: '16px' },
          boxShadow: (theme) => `0 8px 32px ${alpha(theme.palette.common.black, 0.08)}`,
          maxHeight: '90vh',
          margin: { xs: 1, sm: 2 },
          width: '100%',
        }
      }}
    >
      <DialogTitle
        sx={{
          px: { xs: 2, sm: 3 },
          pt: { xs: 2, sm: 3 },
          pb: { xs: 1.5, sm: 2 },
          display: 'flex',
          alignItems: 'center',
          gap: { xs: 1, sm: 1.5 },
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: (theme) => theme.palette.primary.main,
          color: 'white',
        }}
      >
        {mode === 'add' ? (
          <AddCircleOutlineIcon sx={{ 
            fontSize: { xs: 24, sm: 28 } 
          }} />
        ) : (
          <InfoIcon sx={{ 
            fontSize: { xs: 24, sm: 28 } 
          }} />
        )}
        <Typography 
          variant="h5" 
          component="span" 
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.25rem', sm: '1.5rem' },
          }}
        >
          {mode === 'add' ? 'Agregar Nuevo Registro' : 'Editar Registro'}
        </Typography>
      </DialogTitle>

      <DialogContent 
        sx={{ 
          p: { xs: 2, sm: 3 },
          '&::-webkit-scrollbar': {
            width: '8px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '4px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '4px',
            '&:hover': {
              background: '#666',
            },
          },
        }}
      >
        <form onSubmit={handleSubmit}>
          <Grid 
            container 
            spacing={{ xs: 2, sm: 3 }}
            sx={{
              '& .MuiGrid-item': {
                width: '100%',
              }
            }}
          >
            <Grid 
              item 
              xs={12}
              sx={{
                display: 'flex',
                flexDirection: 'column',
                gap: { xs: 2, sm: 2.5, md: 3 },
              }}
            >
              <FormSection 
                icon={DescriptionIcon} 
                title="Información Básica"
                color="basic"
              >
                <BasicInformation 
                  formData={formData}
                  handleChange={handleChange}
                  validationErrors={allValidationErrors}
                />
              </FormSection>

              <FormSection 
                icon={InfoIcon} 
                title="Detalles del Operativo"
                color="operative"
              >
                <OperativeInformation 
                  formData={formData}
                  handleChange={handleChange}
                  validationErrors={allValidationErrors}
                />
              </FormSection>

              <FormSection 
                icon={GroupIcon} 
                title="Recursos Asignados"
                color="resources"
              >
                <ResourceInformation 
                  formData={formData}
                  handleNumberChange={handleNumberChange}
                  validationErrors={allValidationErrors}
                />
              </FormSection>

              <FormSection 
                icon={LocationOnIcon} 
                title="Ubicación"
                color="location"
              >
                <UbicacionForm
                  seccional={formData.seccional || []}
                  barrios={formData.barrios || []}
                  onSeccionalChange={(newValue) => {
                    setFormData(prev => ({
                      ...prev,
                      seccional: newValue,
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
              </FormSection>

              <FormSection 
                icon={AccessTimeIcon} 
                title="Período del Operativo"
                color="datetime"
              >
                <DateTimeInformation 
                  formData={formData}
                  handleDateChange={handleDateChange}
                  handleTimeChange={handleTimeChange}
                  validationErrors={allValidationErrors}
                />
              </FormSection>

              <FormSection 
                icon={NoteIcon} 
                title="Observaciones"
                color="observations"
              >
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Observaciones"
                  value={formData.observacionesOrden || ''}
                  onChange={handleChange('observacionesOrden')}
                  error={!!validationErrors.observacionesOrden}
                  helperText={validationErrors.observacionesOrden}
                  variant="outlined"
                  placeholder="Ingrese las observaciones del operativo..."
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: 'white',
                      borderRadius: { xs: '6px', sm: '8px' },
                    }
                  }}
                />
              </FormSection>
            </Grid>
          </Grid>
        </form>
      </DialogContent>

      <DialogActions 
        sx={{ 
          px: { xs: 2, sm: 3 }, 
          py: { xs: 2, sm: 2.5 },
          gap: { xs: 1, sm: 1.5 },
          borderTop: (theme) => `1px solid ${theme.palette.divider}`,
          backgroundColor: (theme) => alpha(theme.palette.primary.main, 0.03),
        }}
      >
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            borderRadius: { xs: '6px', sm: '8px' },
            textTransform: 'none',
            px: { xs: 2, sm: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
          }}
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading}
          sx={{
            borderRadius: { xs: '6px', sm: '8px' },
            textTransform: 'none',
            px: { xs: 2, sm: 3 },
            fontSize: { xs: '0.875rem', sm: '1rem' },
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