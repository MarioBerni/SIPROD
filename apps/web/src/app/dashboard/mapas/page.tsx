'use client';

import { Card, Container, Grid, useTheme } from '@mui/material';
import { useEffect } from 'react';
import { usePageTitle } from '@/contexts/PageTitleContext';
import MapIcon from '@mui/icons-material/Map';
import { StatCard } from '@/components/dashboard/StatCard';
import { MapView } from '@/components/maps/MapView';

// Datos de ejemplo para las estadísticas
const stats = [
  {
    title: 'Puntos de Control',
    value: '24',
    icon: 'location_on',
    trend: '+5%',
    trendLabel: 'vs semana anterior'
  },
  {
    title: 'Personal Asignado',
    value: '128',
    icon: 'people',
    trend: '+12%',
    trendLabel: 'vs mes anterior'
  },
  {
    title: 'Vehículos',
    value: '45',
    icon: 'directions_car',
    trend: '-3%',
    trendLabel: 'vs semana anterior'
  },
  {
    title: 'Operativos',
    value: '8',
    icon: 'assignment_turned_in',
    trend: '+25%',
    trendLabel: 'vs mes anterior'
  },
];

export default function MapasPage() {
  const theme = useTheme();
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('Mapas', MapIcon);
  }, [setPageTitle]);

  const handlePolygonSave = (coordinates: [number, number][]) => {
    // TODO: Implementar la lógica para guardar el polígono en la base de datos
    console.log('Polígono guardado:', coordinates);
  };

  return (
    <Container 
      maxWidth={false} 
      sx={{ 
        py: { xs: 1.5, sm: 2, md: 3 }, 
        px: { xs: 1, sm: 2, md: 3 }, 
      }}
    >
      <Grid 
        container 
        spacing={{ xs: 1.5, sm: 2, md: 3 }} 
      >
        {/* Estadísticas principales */}
        {stats.map((stat, index) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={3} 
            key={index}
            sx={{
              '& .MuiCard-root': {
                height: '100%',
                '& .MuiCardContent-root': {
                  padding: { xs: 1.5, sm: 2 }, 
                }
              }
            }}
          >
            <StatCard {...stat} />
          </Grid>
        ))}

        {/* Área del Mapa */}
        <Grid 
          item 
          xs={12}
          sx={{
            height: { xs: 'calc(100vh - 400px)', sm: 'calc(100vh - 450px)' },
            minHeight: { xs: '400px', sm: '500px' },
          }}
        >
          <Card
            sx={{
              height: '100%',
              backgroundColor: theme.palette.background.paper,
              borderRadius: 2,
              boxShadow: theme.shadows[1],
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <MapView
              center={[-58.3712, -34.6083]} // Buenos Aires
              zoom={12}
              onPolygonSave={handlePolygonSave}
            />
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
