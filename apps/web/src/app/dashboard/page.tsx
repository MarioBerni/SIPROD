'use client';

import { Box, Grid, Typography, alpha } from '@mui/material';
import { DashboardOutlined as DashboardIcon } from '@mui/icons-material';
import { StatCard } from '@/components/dashboard/StatCard';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { ProgressSection } from '@/components/dashboard/ProgressSection';

const weeklyData = [
  { day: 'Lun', percentage: 65 },
  { day: 'Mar', percentage: 75 },
  { day: 'Mie', percentage: 85 },
  { day: 'Jue', percentage: 70 },
  { day: 'Vie', percentage: 90 },
  { day: 'Sab', percentage: 80 },
  { day: 'Dom', percentage: 95 },
];

const progressData = [
  { label: 'Despliegues Completados', value: 85 },
  { label: 'Pruebas Exitosas', value: 92 },
  { label: 'Cobertura de Código', value: 78 },
];

export default function DashboardPage() {
  const stats = [
    {
      title: 'Despliegues Totales',
      value: '2,845',
      icon: '📦',
      trend: '+12.5%',
      trendLabel: 'vs último mes',
    },
    {
      title: 'Tiempo Promedio',
      value: '1.2h',
      icon: '⏱️',
      trend: '-8.4%',
      trendLabel: 'vs último mes',
    },
    {
      title: 'Tasa de Éxito',
      value: '98.2%',
      icon: '✅',
      trend: '+3.2%',
      trendLabel: 'vs último mes',
    },
    {
      title: 'Recursos Activos',
      value: '156',
      icon: '🔧',
      trend: '+5.3%',
      trendLabel: 'vs último mes',
    },
  ];

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
      {/* Encabezado del Dashboard */}
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
            <DashboardIcon sx={{ fontSize: 24 }} />
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
              Panel de Control
            </Typography>
            <Typography 
              variant="body2" 
              sx={{
                color: 'text.secondary',
                fontWeight: 500,
              }}
            >
              Gestión y monitoreo de despliegues
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* Contenido principal */}
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
        {/* Tarjetas de estadísticas */}
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <StatCard {...stat} />
          </Grid>
        ))}

        {/* Gráfico semanal */}
        <Grid item xs={12} md={8}>
          <WeeklyChart data={weeklyData} />
        </Grid>

        {/* Sección de progreso */}
        <Grid item xs={12} md={4}>
          <ProgressSection data={progressData} />
        </Grid>
      </Grid>
    </Box>
  );
}
