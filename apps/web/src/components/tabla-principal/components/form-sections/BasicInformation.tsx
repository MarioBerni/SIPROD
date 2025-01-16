import React from 'react';
import {
  Grid,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  TablaPrincipal,
  Departamento,
  DepartamentoLabel,
  Unidad,
  UnidadLabel,
  TipoOrden,
  TipoOrdenLabel,
} from '../../types';

interface BasicInformationProps {
  formData: Partial<TablaPrincipal>;
  handleChange: (field: keyof TablaPrincipal) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  validationErrors: Record<string, string>;
}

interface Option {
  value: string;
  label: string;
}

const autocompleteStyles = {
  '& .MuiOutlinedInput-root': {
    padding: '8px !important',
    gap: '5px',
    flexWrap: 'wrap',
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

export const BasicInformation: React.FC<BasicInformationProps> = ({
  formData,
  handleChange,
  validationErrors
}) => {
  const getEnumOptions = <T extends { [key: string]: string }>(
    enumObj: T,
    labelObj: { [key: string]: string }
  ): Option[] => {
    return Object.entries(enumObj)
      .filter(([key]) => isNaN(Number(key)))
      .map(([key]) => ({
        value: key,
        label: labelObj[key as keyof typeof labelObj]
      }));
  };

  const departamentoOptions = getEnumOptions(Departamento, DepartamentoLabel);
  const unidadOptions = getEnumOptions(Unidad, UnidadLabel);
  const tipoOrdenOptions = getEnumOptions(TipoOrden, TipoOrdenLabel);

  const findSelectedOption = (value: string | undefined, options: Option[]): Option | null => {
    if (!value) return null;
    return options.find(option => option.value === value) || null;
  };

  return (
    <Grid container spacing={2}>
      {/* Departamento */}
      <Grid item xs={12} sm={6}>
        <Autocomplete
          size="small"
          fullWidth
          value={findSelectedOption(formData.departamento, departamentoOptions)}
          onChange={(_, newValue) => {
            handleChange('departamento')({
              target: { value: newValue?.value || '' }
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          options={departamentoOptions}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Departamento"
              error={!!validationErrors.departamento}
              helperText={validationErrors.departamento}
              InputLabelProps={{
                sx: {
                  backgroundColor: '#fff',
                  padding: '0 8px',
                  marginLeft: '-4px',
                }
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          sx={autocompleteStyles}
        />
      </Grid>

      {/* Unidad */}
      <Grid item xs={12} sm={6}>
        <Autocomplete
          size="small"
          fullWidth
          value={findSelectedOption(formData.unidad, unidadOptions)}
          onChange={(_, newValue) => {
            handleChange('unidad')({
              target: { value: newValue?.value || '' }
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          options={unidadOptions}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Unidad"
              error={!!validationErrors.unidad}
              helperText={validationErrors.unidad}
              InputLabelProps={{
                sx: {
                  backgroundColor: '#fff',
                  padding: '0 8px',
                  marginLeft: '-4px',
                }
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          sx={autocompleteStyles}
        />
      </Grid>

      {/* Tipo de Orden */}
      <Grid item xs={12} sm={6}>
        <Autocomplete
          size="small"
          fullWidth
          value={findSelectedOption(formData.tipoOrden, tipoOrdenOptions)}
          onChange={(_, newValue) => {
            handleChange('tipoOrden')({
              target: { value: newValue?.value || '' }
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          options={tipoOrdenOptions}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Tipo de Orden"
              error={!!validationErrors.tipoOrden}
              helperText={validationErrors.tipoOrden}
              InputLabelProps={{
                sx: {
                  backgroundColor: '#fff',
                  padding: '0 8px',
                  marginLeft: '-4px',
                }
              }}
            />
          )}
          isOptionEqualToValue={(option, value) => option.value === value.value}
          sx={autocompleteStyles}
        />
      </Grid>

      {/* Número de Orden */}
      <Grid item xs={12} sm={6}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Número de Orden"
          value={formData.nroOrden || ''}
          onChange={handleChange('nroOrden')}
          error={!!validationErrors.nroOrden}
          helperText={validationErrors.nroOrden}
          InputLabelProps={{
            sx: {
              backgroundColor: '#fff',
              padding: '0 8px',
              marginLeft: '-4px',
            }
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              padding: '8.5px 14px',
            }
          }}
        />
      </Grid>
    </Grid>
  );
};
