'use client';

import { useEffect } from 'react';
import { Box, Typography, alpha } from '@mui/material';
import { usePageTitle } from '@/contexts/PageTitleContext';
import { Person as PersonIcon } from '@mui/icons-material';
import { ServiceManager } from '@/components/services/ServiceManager';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

export default function MisServiciosPage() {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('Mis Servicios', PersonIcon);
  }, [setPageTitle]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        {/* Encabezado de la página */}
        <Box
          sx={{
            width: '100%',
            p: 2.5,
            mb: 3,
            borderRadius: 2,
            bgcolor: 'background.paper',
            boxShadow: 1,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: `0 4px 20px ${alpha('#1565C0', 0.15)}`,
            },
          }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1.5,
            }}
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: 1.5,
                bgcolor: alpha('#1565C0', 0.12),
                color: '#1565C0',
              }}
            >
              <PersonIcon sx={{ fontSize: 24 }} />
            </Box>
            <Box>
              <Typography 
                variant="h6" 
                sx={{ 
                  fontWeight: 600,
                  mb: 0.5,
                  color: 'text.primary',
                }}
              >
                Mis Servicios
              </Typography>
              <Typography 
                variant="body2" 
                sx={{
                  color: 'text.secondary',
                  fontWeight: 500,
                }}
              >
                Gestiona tus servicios y asignaciones en el calendario
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Contenido Principal */}
        <ServiceManager />
      </Box>
    </LocalizationProvider>
  );
}
