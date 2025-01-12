import { useState, useEffect, useMemo } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Grid,
  Typography,
  Box,
  Alert,
  CircularProgress,
  useTheme,
  alpha,
  Card,
  CardContent
} from '@mui/material';
import { 
  Close as CloseIcon,
  Info as InfoIcon,
  Description as DescriptionIcon,
  AccessTime as AccessTimeIcon,
  Group as GroupIcon,
  LocationOn as LocationOnIcon,
  Note as NoteIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Save as SaveIcon
} from '@mui/icons-material';
import { TablaPrincipal, Departamento, Unidad, TipoOrden, TipoOperativo, TiempoOperativo } from '../types';
import { format, isValid, parse } from 'date-fns';

// Importar secciones del formulario
import { BasicInformation } from './form-sections/BasicInformation';
import { OperativeInformation } from './form-sections/OperativeInformation';
import { DateTimeInformation } from './form-sections/DateTimeInformation';
import { ResourceInformation } from './form-sections/ResourceInformation';
import { Observations } from './form-sections/Observations';
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

// Componente para el encabezado de cada sección
const SectionHeader = ({ 
  icon: Icon, 
  title, 
  color 
}: { 
  icon: React.ElementType; 
  title: string;
  color: keyof typeof sectionColors;
}) => {
  const theme = useTheme();
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        mb: 2,
        p: 1.5,
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
        borderBottom: `2px solid ${sectionColors[color].main}`,
        boxShadow: `0 1px 2px ${alpha(theme.palette.common.black, 0.05)}`
      }}
    >
      <Icon sx={{ mr: 1, color: sectionColors[color].main }} />
      <Typography 
        variant="h6" 
        sx={{ 
          color: sectionColors[color].main,
          fontWeight: 600
        }}
      >
        {title}
      </Typography>
    </Box>
  );
};

// Componente para la sección del formulario
const FormSection = ({ 
  icon, 
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
    <Card
      sx={{
        mb: 2,
        backgroundColor: theme.palette.background.paper,
        transition: theme.transitions.create(['box-shadow', 'border-color'], {
          duration: theme.transitions.duration.shorter,
        }),
        '&:hover': {
          boxShadow: `0 0 0 1px ${sectionColors[color].border}, ${theme.shadows[2]}`,
        },
        border: `1px solid ${theme.palette.grey[200]}`,
        borderRadius: 1,
        overflow: 'visible'
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <SectionHeader icon={icon} title={title} color={color} />
        <Box 
          sx={{ 
            mt: 2,
            '& .MuiTextField-root': {
              '& .MuiOutlinedInput-root': {
                '&.Mui-focused fieldset': {
                  borderColor: sectionColors[color].main,
                  borderWidth: '1.5px'
                },
                '&:hover fieldset': {
                  borderColor: sectionColors[color].border,
                },
              },
              '& .MuiInputLabel-root.Mui-focused': {
                color: sectionColors[color].main,
              },
            },
            '& .MuiFormLabel-root.Mui-focused': {
              color: sectionColors[color].main,
            },
            '& .MuiChip-root': {
              backgroundColor: sectionColors[color].light,
              borderColor: sectionColors[color].border,
              '& .MuiChip-deleteIcon': {
                color: sectionColors[color].main,
                '&:hover': {
                  color: theme.palette.error.main,
                },
              },
            },
          }}
        >
          {children}
        </Box>
      </CardContent>
    </Card>
  );
};

export const AddRecordModal: React.FC<AddRecordModalProps> = ({
  open,
  onClose,
  onSubmit,
  loading = false,
  error = null,
  validationErrors: externalValidationErrors = {},
  mode = 'add',
  initialData
}: AddRecordModalProps) => {
  const theme = useTheme();
  
  // Estado inicial del formulario para modo 'add'
  const emptyFormData = useMemo<Partial<TablaPrincipal>>(() => ({
    departamento: '' as Departamento,
    unidad: '' as Unidad,
    tipoOrden: '' as TipoOrden,
    nroOrden: '',
    tipoOperativo: '' as TipoOperativo,
    tiempoOperativo: '' as TiempoOperativo,
    nombreOperativo: '',
    fechaInicio: undefined,
    horaInicio: undefined,
    fechaFin: undefined,
    horaFin: undefined,
    observacionesOrden: '',
    seccional: [],
    mapa: [],
    puntosControl: [],
    recorridos: [],
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
    if (mode === 'edit' && initialData) {
      console.log('Actualizando formulario para edición:', initialData);
      // Asegurarse de que las fechas sean instancias de Date
      const formattedData = {
        ...initialData,
        fechaInicio: initialData.fechaInicio ? new Date(initialData.fechaInicio) : undefined,
        horaInicio: initialData.horaInicio ? new Date(initialData.horaInicio) : undefined,
        fechaFin: initialData.fechaFin ? new Date(initialData.fechaFin) : undefined,
        horaFin: initialData.horaFin ? new Date(initialData.horaFin) : undefined
      };
      setFormData(formattedData);
    } else if (mode === 'add') {
      console.log('Inicializando formulario vacío');
      setFormData(emptyFormData);
    }
  }, [initialData, mode, emptyFormData]);

  const [internalValidationErrors, setInternalValidationErrors] = useState<Record<string, string>>({});

  // Combinar errores de validación externos e internos
  const allValidationErrors = { ...internalValidationErrors, ...externalValidationErrors };

  // Efecto para resetear el formulario cuando se cierra el modal
  useEffect(() => {
    if (!open) {
      if (mode === 'edit' && initialData) {
        const formattedData = {
          ...initialData,
          fechaInicio: initialData.fechaInicio ? new Date(initialData.fechaInicio) : undefined,
          horaInicio: initialData.horaInicio ? new Date(initialData.horaInicio) : undefined,
          fechaFin: initialData.fechaFin ? new Date(initialData.fechaFin) : undefined,
          horaFin: initialData.horaFin ? new Date(initialData.horaFin) : undefined
        };
        setFormData(formattedData);
      } else {
        setFormData(emptyFormData);
      }
      setInternalValidationErrors({});
    }
  }, [open, initialData, mode, emptyFormData]);

  const handleChange = (field: keyof TablaPrincipal) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = event.target.value;
    console.log(`Cambiando campo ${field}:`, value);
    
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNumberChange = (field: keyof TablaPrincipal) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = parseInt(event.target.value as string, 10) || 0;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatDateForInput = (date: Date | null): string => {
    if (!date) return '';
    return format(date, 'yyyy-MM-dd');
  };

  const formatTimeForInput = (date: Date | null): string => {
    if (!date) return '';
    return format(date, 'HH:mm');
  };

  const handleDateChange = (field: keyof TablaPrincipal) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    try {
      const parsedDate = parse(value, 'yyyy-MM-dd', new Date());
      if (!isValid(parsedDate)) {
        return;
      }

      const currentTime = formData[field as keyof typeof formData] as Date || new Date();
      parsedDate.setHours(currentTime.getHours(), currentTime.getMinutes());

      setFormData(prev => ({
        ...prev,
        [field]: parsedDate
      }));
    } catch (error) {
      console.error('Error al parsear la fecha:', error);
    }
  };

  const handleTimeChange = (field: keyof TablaPrincipal) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = event.target.value;
    try {
      const [hours, minutes] = value.split(':').map(Number);
      const currentDate = formData[field as keyof typeof formData] as Date || new Date();
      const newDate = new Date(currentDate);
      newDate.setHours(hours, minutes);

      if (!isValid(newDate)) {
        return;
      }

      setFormData(prev => ({
        ...prev,
        [field]: newDate
      }));
    } catch (error) {
      console.error('Error al parsear la hora:', error);
    }
  };




  const handleUbicacionChange = (seccionales: number[], barrios: string[]) => {
    setFormData(prev => ({
      ...prev,
      seccional: seccionales,
      barrios: barrios
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const requiredFields: Array<keyof TablaPrincipal> = [
      'departamento',
      'unidad',
      'tipoOrden',
      'nroOrden',
      'tipoOperativo',
      'tiempoOperativo',
      'nombreOperativo',
      'fechaInicio',
      'horaInicio',
      'horaFin',
      'fechaFin'
    ];

    const missingFields = requiredFields.filter(field => !formData[field]);
    if (missingFields.length > 0) {
      console.error('Campos requeridos faltantes:', missingFields);
      return;
    }
    
    const totalPpss = (formData.ppssEnMovil || 0) + 
                     (formData.ssoo || 0) + 
                     (formData.pieTierra || 0) +
                     (formData.antidisturbioApostado || 0) +
                     (formData.antidisturbioAlerta || 0) +
                     (formData.geoApostado || 0) +
                     (formData.geoAlerta || 0);

    const dataToSubmit = {
      ...formData,
      totalPpss
    };

    onSubmit(dataToSubmit);
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="xl"
      fullWidth
    >
      <DialogTitle sx={{ 
        bgcolor: 'primary.main', 
        color: 'primary.contrastText',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <Box display="flex" alignItems="center">
          {mode === 'add' ? (
            <>
              <AddIcon sx={{ mr: 1 }} />
              Agregar Nuevo Registro
            </>
          ) : (
            <>
              <EditIcon sx={{ mr: 1 }} />
              Editar Registro
            </>
          )}
        </Box>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: 'inherit',
            '&:hover': {
              bgcolor: alpha('#fff', 0.1)
            }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <form onSubmit={handleSubmit}>
        <DialogContent sx={{ px: 3 }}>
          {error && (
            <Alert 
              severity="error" 
              sx={{ 
                mb: 2,
                borderRadius: 1,
                backgroundColor: alpha(theme.palette.error.main, 0.05),
                color: theme.palette.error.main,
                '& .MuiAlert-icon': {
                  color: theme.palette.error.main
                }
              }}
            >
              {error}
            </Alert>
          )}

          <Box sx={{ mt: 1 }}>
            {/* Sección 1: Información Básica */}
            <FormSection 
              icon={DescriptionIcon} 
              title="Información Básica"
              color="basic"
            >
              <Grid container spacing={2}>
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
              <Grid container spacing={2}>
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
              <Grid container spacing={2}>
                <DateTimeInformation 
                  formData={formData}
                  handleDateChange={handleDateChange}
                  handleTimeChange={handleTimeChange}
                  formatDateForInput={formatDateForInput}
                  formatTimeForInput={formatTimeForInput}
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
              <Grid container spacing={2}>
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
              <Grid container spacing={2}>
                <UbicacionForm
                  initialSeccionales={formData.seccional}
                  initialBarrios={formData.barrios}
                  onChange={handleUbicacionChange}
                />
              </Grid>
            </FormSection>

            {/* Sección 6: Observaciones */}
            <FormSection 
              icon={NoteIcon} 
              title="Observaciones"
              color="observations"
            >
              <Grid container spacing={2}>
                <Observations 
                  formData={formData}
                  handleChange={handleChange}
                  validationErrors={allValidationErrors}
                />
              </Grid>
            </FormSection>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: 'background.default' }}>
          <Button
            onClick={onClose}
            variant="outlined"
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={loading}
            startIcon={loading ? <CircularProgress size={20} /> : mode === 'add' ? <AddIcon /> : <SaveIcon />}
          >
            {mode === 'add' ? 'Agregar' : 'Guardar Cambios'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};