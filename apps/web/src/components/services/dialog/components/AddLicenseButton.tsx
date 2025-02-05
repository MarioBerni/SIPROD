'use client';

import { FC } from 'react';
import { Button, Box, useTheme, alpha } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AddLicenseButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export const AddLicenseButton: FC<AddLicenseButtonProps> = ({ onClick, disabled }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        mt: 2,
        mb: 1,
      }}
    >
      <Button
        variant="contained"
        onClick={onClick}
        disabled={disabled}
        startIcon={<AddIcon />}
        sx={{
          borderRadius: theme.shape.borderRadius * 2,
          textTransform: 'none',
          px: 3,
          py: 1,
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          boxShadow: theme.shadows[2],
          '&:hover': {
            backgroundColor: theme.palette.primary.dark,
            boxShadow: theme.shadows[4],
          },
          '&:active': {
            boxShadow: theme.shadows[1],
          },
          '&.Mui-disabled': {
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: alpha(theme.palette.primary.main, 0.26),
          },
        }}
      >
        Agregar Licencia
      </Button>
    </Box>
  );
};
