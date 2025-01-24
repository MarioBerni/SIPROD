import { Autocomplete, TextField, Box, Typography, useTheme } from '@mui/material';
import { DirectionAutocompleteProps } from './types';
import { DireccionOption } from './options';

export interface ExtendedDirectionAutocompleteProps extends DirectionAutocompleteProps {
  options: DireccionOption[];
}

export const DirectionAutocomplete = ({
  title,
  value,
  onChange,
  options,
}: ExtendedDirectionAutocompleteProps) => {
  const theme = useTheme();
  
  return (
    <Box sx={{ mb: 2 }}>
      <Typography 
        variant="h6" 
        gutterBottom 
        sx={{ 
          fontWeight: 500, 
          color: theme.palette.primary.main,
          mb: 2
        }}
      >
        {title}
      </Typography>
      <Autocomplete
        value={value}
        onChange={(_, newValue) => onChange(newValue)}
        options={options}
        disablePortal
        sx={{ 
          width: '100%',
          '& .MuiOutlinedInput-root': {
            '&:hover fieldset': {
              borderColor: theme.palette.primary.main,
            },
            '&.Mui-focused fieldset': {
              borderColor: theme.palette.primary.main,
            },
          },
        }}
        renderInput={(params) => (
          <TextField 
            {...params} 
            placeholder="Seleccionar opción"
          />
        )}
        renderOption={(props, option) => {
          // eslint-disable-next-line @typescript-eslint/no-unused-vars
          const { key, ...otherProps } = props;
          return (
            <li key={option.id} {...otherProps}>
              {option.label}
            </li>
          );
        }}
      />
    </Box>
  );
};
