import { SxProps, Theme } from '@mui/material';

export const formFieldStyles: SxProps<Theme> = {
  '& .MuiOutlinedInput-root': {
    height: '40px',
    '& fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.23)',
      transition: 'border-color 0.2s ease-in-out',
    },
    '&:hover fieldset': {
      borderColor: 'rgba(0, 0, 0, 0.87)',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
    }
  },
  '& .MuiAutocomplete-input': {
    padding: '4.5px 4px !important',
  },
  '& .MuiInputLabel-root': {
    transform: 'translate(14px, 8px) scale(1)',
    '&.Mui-focused, &.MuiFormLabel-filled': {
      transform: 'translate(14px, -9px) scale(0.75)',
    }
  },
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    fontSize: '0.7rem',
  }
};

export const autocompleteStyles = {
  ...formFieldStyles,
  '& .MuiAutocomplete-endAdornment': {
    top: 'calc(50% - 15px)',
  }
};

export const textFieldStyles = {
  ...formFieldStyles,
  '& .MuiOutlinedInput-input': {
    padding: '8.5px 14px',
  }
};
