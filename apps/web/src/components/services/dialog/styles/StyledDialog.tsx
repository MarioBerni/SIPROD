'use client';

import { Dialog, styled, alpha, DialogProps } from '@mui/material';
import { StyledComponent } from '@mui/styled-engine';

export const StyledDialog: StyledComponent<DialogProps> = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    background: theme.palette.background.paper,
    color: theme.palette.text.primary,
    borderRadius: theme.shape.borderRadius * 2,
    boxShadow: theme.shadows[10],
    overflow: 'hidden',
  },
  '& .MuiDialogTitle-root': {
    background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.primary.main} 100%)`,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2, 3),
    borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogContentText-root': {
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  '& .MuiListItem-root': {
    borderRadius: theme.shape.borderRadius,
    marginBottom: theme.spacing(1),
    backgroundColor: alpha(theme.palette.primary.main, 0.04),
    border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
    transition: theme.transitions.create(['background-color', 'border-color', 'box-shadow']),
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
      borderColor: alpha(theme.palette.primary.main, 0.2),
      boxShadow: theme.shadows[2],
    },
  },
  '& .MuiListItemText-primary': {
    color: theme.palette.text.primary,
    fontWeight: 500,
  },
  '& .MuiListItemText-secondary': {
    color: theme.palette.text.secondary,
  },
  '& .MuiTextField-root': {
    marginBottom: theme.spacing(2),
    '& .MuiOutlinedInput-root': {
      backgroundColor: theme.palette.background.paper,
      borderRadius: theme.shape.borderRadius,
      '& fieldset': {
        borderColor: alpha(theme.palette.primary.main, 0.2),
      },
      '&:hover fieldset': {
        borderColor: theme.palette.primary.main,
      },
      '&.Mui-focused fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },
    '& .MuiInputLabel-root': {
      color: theme.palette.text.secondary,
      '&.Mui-focused': {
        color: theme.palette.primary.main,
      },
    },
    '& .MuiInputBase-input': {
      color: theme.palette.text.primary,
    },
  },
  '& .MuiIconButton-root': {
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.primary.main, 0.08),
    },
  },
}));
