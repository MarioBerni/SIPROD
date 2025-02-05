import { SxProps, Theme } from '@mui/material';

export const dialogContentStyle: SxProps<Theme> = {
  p: 3,
  display: 'flex',
  flexDirection: 'column',
  gap: 2,
};

export const dialogActionStyle: SxProps<Theme> = {
  px: 3,
  py: 2,
  bgcolor: 'background.default',
};

export const formControlStyle: SxProps<Theme> = {
  width: '100%',
};

export const datePickerStyle: SxProps<Theme> = {
  width: '100%',
};

export const submitButtonStyle: SxProps<Theme> = {
  px: 4,
  py: 1,
};
