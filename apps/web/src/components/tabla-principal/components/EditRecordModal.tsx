import { Dialog, DialogTitle, DialogContent, DialogActions, Button, CircularProgress, Grid } from '@mui/material';
import { TablaPrincipal } from '../types';
import { 
  BasicInformation,
  DateTimeInformation,
  LocationDetails,
  Observations,
  OperativeInformation,
  ResourceInformation,
  UbicacionSection
} from './form-sections';
import { useFormik, FormikHelpers } from 'formik';
import { validationSchema } from '../validation';
import React, { useCallback } from 'react';

interface EditRecordModalProps {
  open: boolean;
  record: TablaPrincipal | null;
  onClose: () => void;
  onSubmit: (values: Partial<TablaPrincipal>) => Promise<void>;
  loading?: boolean;
  validationErrors?: Record<string, string>;
}

export function EditRecordModal({
  open,
  record,
  onClose,
  onSubmit,
  loading = false,
  validationErrors = {},
}: EditRecordModalProps) {
  const formik = useFormik<Partial<TablaPrincipal>>({
    initialValues: record || {},
    validationSchema,
    enableReinitialize: true,
    onSubmit: async (values: Partial<TablaPrincipal>, { setSubmitting }: FormikHelpers<Partial<TablaPrincipal>>) => {
      try {
        await onSubmit(values);
      } finally {
        setSubmitting(false);
      }
    },
  });

  // Adaptador para convertir el handleChange de Formik al formato esperado por los componentes
  const handleFieldChange = useCallback(
    () => (event: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
      formik.handleChange(event);
    },
    [formik]
  );

  // Adaptadores para DateTimeInformation
  const handleDateChange = useCallback(
    (field: keyof TablaPrincipal) => (event: React.ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue(field, new Date(event.target.value));
    },
    [formik]
  );

  const handleTimeChange = useCallback(
    (field: keyof TablaPrincipal) => (event: React.ChangeEvent<HTMLInputElement>) => {
      const [hours, minutes] = event.target.value.split(':');
      const date = formik.values[field] ? new Date(formik.values[field] as Date) : new Date();
      date.setHours(parseInt(hours), parseInt(minutes));
      formik.setFieldValue(field, date);
    },
    [formik]
  );

  const formatDateForInput = useCallback((date: Date | null) => {
    if (!date) return '';
    return new Date(date).toISOString().split('T')[0];
  }, []);

  const formatTimeForInput = useCallback((date: Date | null) => {
    if (!date) return '';
    const d = new Date(date);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  }, []);

  // Manejadores para LocationDetails
  const handleArrayInput = useCallback((field: keyof TablaPrincipal) => (value: string) => {
    const currentArray = (formik.values[field] as string[]) || [];
    formik.setFieldValue(field, [...currentArray, value]);
  }, [formik]);

  const handleArrayDelete = useCallback((field: keyof TablaPrincipal) => (index: number) => {
    const currentArray = (formik.values[field] as string[]) || [];
    formik.setFieldValue(field, currentArray.filter((_, i) => i !== index));
  }, [formik]);

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      scroll="paper"
    >
      <DialogTitle>Editar Registro</DialogTitle>
      <form onSubmit={formik.handleSubmit}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            {/* Información Básica */}
            <BasicInformation 
              formData={formik.values} 
              handleChange={handleFieldChange} 
              validationErrors={validationErrors}
            />

            {/* Información del Operativo */}
            <OperativeInformation 
              formData={formik.values} 
              handleChange={handleFieldChange} 
              validationErrors={validationErrors}
            />

            {/* Información de Fecha y Hora */}
            <DateTimeInformation 
              formData={formik.values} 
              handleDateChange={handleDateChange}
              handleTimeChange={handleTimeChange}
              formatDateForInput={formatDateForInput}
              formatTimeForInput={formatTimeForInput}
              validationErrors={validationErrors}
            />

            {/* Información de Ubicación */}
            <LocationDetails 
              formData={formik.values}
              handleSeccionalInput={handleArrayInput('seccional')}
              handleBarrioInput={handleArrayInput('barrios')}
              handleMapaInput={handleArrayInput('mapa')}
              handlePuntosControlInput={handleArrayInput('puntosControl')}
              handleRecorridosInput={handleArrayInput('recorridos')}
              handleDeleteSeccional={handleArrayDelete('seccional')}
              handleDeleteBarrio={handleArrayDelete('barrios')}
              handleDeleteMapa={handleArrayDelete('mapa')}
              handleDeletePuntosControl={handleArrayDelete('puntosControl')}
              handleDeleteRecorridos={handleArrayDelete('recorridos')}
            />

            {/* Sección de Ubicación */}
            <UbicacionSection 
              formik={formik}
              validationErrors={validationErrors}
            />

            {/* Información de Recursos */}
            <ResourceInformation 
              formData={formik.values}
              handleNumberChange={handleFieldChange}
              validationErrors={validationErrors}
            />

            {/* Observaciones */}
            <Observations 
              formData={formik.values} 
              handleChange={handleFieldChange} 
              validationErrors={validationErrors}
            />
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || formik.isSubmitting}
            startIcon={
              (loading || formik.isSubmitting) && (
                <CircularProgress size={20} color="inherit" />
              )
            }
          >
            Guardar Cambios
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
