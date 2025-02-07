import { Grid, TextField, Autocomplete } from '@mui/material';
import { FormikProps } from 'formik';
import React from 'react';

interface TablaPrincipal {
  seccional: number[];
  barrios: string[];
  // ... otros campos
}

interface UbicacionSectionProps {
  formik: FormikProps<Partial<TablaPrincipal>>;
  validationErrors?: Record<string, string>;
}

export function UbicacionSection({ formik, validationErrors = {} }: UbicacionSectionProps) {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Autocomplete<number, true>
          multiple
          id="seccional"
          options={[1, 2, 3]} // Opciones de ejemplo, reemplazar con las reales
          value={formik.values.seccional || []}
          onChange={(_, newValue) => {
            formik.setFieldValue('seccional', newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Seccional"
              error={formik.touched.seccional && Boolean(formik.errors.seccional)}
              helperText={
                (formik.touched.seccional && formik.errors.seccional as string) ||
                validationErrors.seccional
              }
            />
          )}
        />
      </Grid>
      <Grid item xs={12}>
        <Autocomplete<string, true>
          multiple
          id="barrios"
          options={[]} // TODO: Agregar opciones de barrios
          value={formik.values.barrios || []}
          onChange={(_, newValue) => {
            formik.setFieldValue('barrios', newValue);
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Barrios"
              error={formik.touched.barrios && Boolean(formik.errors.barrios)}
              helperText={
                (formik.touched.barrios && formik.errors.barrios as string) ||
                validationErrors.barrios
              }
            />
          )}
        />
      </Grid>
      {/* TODO: Agregar componentes para mapa, puntos de control y recorridos */}
    </Grid>
  );
}
