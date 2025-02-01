import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Grid } from '@mui/material';
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
import { Spinner } from '@/components/ui/Spinner';

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
      formik.setFieldValue(field, event.target.value);
    },
    [formik]
  );

  const handleTimeChange = useCallback(
    (field: keyof TablaPrincipal) => (event: React.ChangeEvent<HTMLInputElement>) => {
      formik.setFieldValue(field, event.target.value);
    },
    [formik]
  );

  // Manejadores para LocationDetails
  const handleArrayInput = useCallback((field: keyof TablaPrincipal) => (value: string) => {
    const currentValues = formik.values[field] as string[] | number[];
    if (Array.isArray(currentValues)) {
      formik.setFieldValue(field, [...currentValues, value]);
    } else {
      formik.setFieldValue(field, [value]);
    }
  }, [formik]);

  const handleArrayDelete = useCallback((field: keyof TablaPrincipal) => (index: number) => {
    const currentValues = formik.values[field] as string[] | number[];
    if (Array.isArray(currentValues)) {
      const newValues = [...currentValues];
      newValues.splice(index, 1);
      formik.setFieldValue(field, newValues);
    }
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
              validationErrors={validationErrors}
            />

            {/* Información de Ubicación */}
            <LocationDetails 
              formData={formik.values}
              handleSeccionalInput={handleArrayInput('seccional')}
              handleBarrioInput={handleArrayInput('barrios')}
              handleDeleteSeccional={handleArrayDelete('seccional')}
              handleDeleteBarrio={handleArrayDelete('barrios')}
              validationErrors={validationErrors}
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
                <Spinner fullScreen={false} size="small" />
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
