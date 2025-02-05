'use client';

import { useEffect } from 'react';
import { Grid, Box, Typography, alpha } from '@mui/material';
import { usePageTitle } from '@/contexts/PageTitleContext';
import { Person as PersonIcon, CalendarMonth as CalendarIcon, ListAlt as ListIcon } from '@mui/icons-material';
import { ServiceCalendar } from '@/components/services/ServiceCalendar';
import { ActiveServicesCard } from '@/components/services/ActiveServicesCard';

export default function MisServiciosPage() {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('Mis Servicios', PersonIcon);
  }, [setPageTitle]);

  return (
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
      <Grid 
        container 
        spacing={3} 
        sx={{ 
          width: '100%',
          m: 0,
          '& > .MuiGrid-item': {
            paddingRight: '24px',
            paddingLeft: '24px',
          }
        }}
      >
        {/* Sección del Calendario */}
        <Grid item xs={12} lg={7}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: 1,
              height: '100%',
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
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  bgcolor: alpha('#1565C0', 0.12),
                  color: '#1565C0',
                }}
              >
                <CalendarIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Calendario de Servicios
              </Typography>
            </Box>
            <ServiceCalendar />
          </Box>
        </Grid>

        {/* Sección de Servicios Activos */}
        <Grid item xs={12} lg={5}>
          <Box
            sx={{
              p: 2.5,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: 1,
              height: '100%',
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
                mb: 2,
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 1.5,
                  bgcolor: alpha('#1565C0', 0.12),
                  color: '#1565C0',
                }}
              >
                <ListIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Servicios Activos
              </Typography>
            </Box>
            <ActiveServicesCard />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
