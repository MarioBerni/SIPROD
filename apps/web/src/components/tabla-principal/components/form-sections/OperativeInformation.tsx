import React from 'react';
import {
  Grid,
  Autocomplete,
  TextField,
} from '@mui/material';
import {
  TablaPrincipal,
  TipoOperativo,
  TipoOperativoLabel,
  TiempoOperativo,
  TiempoOperativoLabel,
} from '../../types';

interface OperativeInformationProps {
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

export const OperativeInformation: React.FC<OperativeInformationProps> = ({
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

  const tipoOperativoOptions = getEnumOptions(TipoOperativo, TipoOperativoLabel);
  const tiempoOperativoOptions = getEnumOptions(TiempoOperativo, TiempoOperativoLabel);

  const findSelectedOption = (value: string | undefined, options: Option[]): Option | null => {
    if (!value) return null;
    return options.find(option => option.value === value) || null;
  };

  return (
    <Grid container spacing={2}>
      {/* Tipo de Operativo */}
      <Grid item xs={12} sm={6}>
        <Autocomplete
          size="small"
          fullWidth
          value={findSelectedOption(formData.tipoOperativo, tipoOperativoOptions)}
          onChange={(_, newValue) => {
            handleChange('tipoOperativo')({
              target: { value: newValue?.value || '' }
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          options={tipoOperativoOptions}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Tipo de Operativo"
              error={!!validationErrors.tipoOperativo}
              helperText={validationErrors.tipoOperativo}
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

      {/* Tiempo de Operativo */}
      <Grid item xs={12} sm={6}>
        <Autocomplete
          size="small"
          fullWidth
          value={findSelectedOption(formData.tiempoOperativo, tiempoOperativoOptions)}
          onChange={(_, newValue) => {
            handleChange('tiempoOperativo')({
              target: { value: newValue?.value || '' }
            } as React.ChangeEvent<HTMLInputElement>);
          }}
          options={tiempoOperativoOptions}
          getOptionLabel={(option) => option.label}
          renderInput={(params) => (
            <TextField
              {...params}
              variant="outlined"
              label="Tiempo de Operativo"
              error={!!validationErrors.tiempoOperativo}
              helperText={validationErrors.tiempoOperativo}
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

      {/* Nombre del Operativo */}
      <Grid item xs={12}>
        <TextField
          size="small"
          fullWidth
          variant="outlined"
          label="Nombre del Operativo"
          value={formData.nombreOperativo || ''}
          onChange={handleChange('nombreOperativo')}
          error={!!validationErrors.nombreOperativo}
          helperText={validationErrors.nombreOperativo}
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
