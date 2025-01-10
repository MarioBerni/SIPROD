import { Box, Typography, useTheme } from '@mui/material';
import { SvgIconComponent } from '@mui/icons-material';
import React from 'react';

interface FormSectionProps {
  icon: SvgIconComponent;
  title: string;
  color: string;
  children: React.ReactNode;
}

export const FormSection = ({ icon: Icon, title, color, children }: FormSectionProps) => {
  const theme = useTheme();

  const getColorByType = (type: string) => {
    const colors = {
      basic: theme.palette.primary.main,
      operative: theme.palette.secondary.main,
      datetime: theme.palette.info.main,
      resources: theme.palette.success.main,
      location: theme.palette.warning.main,
      observations: theme.palette.error.main,
    };
    return colors[type as keyof typeof colors] || theme.palette.primary.main;
  };

  return (
    <Box
      sx={{
        mb: 2,
        backgroundColor: theme.palette.background.paper,
        borderRadius: 1,
        boxShadow: 1,
        position: 'relative',
        '&:hover': {
          boxShadow: 2,
        },
        transition: 'box-shadow 0.3s ease-in-out',
        overflow: 'visible'
      }}
    >
      <Box sx={{ p: 3 }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            mb: 2,
            gap: 1,
          }}
        >
          <Icon sx={{ color: getColorByType(color) }} />
          <Typography variant="h6" component="h3" sx={{ color: getColorByType(color) }}>
            {title}
          </Typography>
        </Box>
        <Box 
          sx={{ 
            mt: 2,
            '& .MuiTextField-root': {
              mb: 0
            },
            '& .MuiFormControl-root': {
              mb: 0
            }
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
