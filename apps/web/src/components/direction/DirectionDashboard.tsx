'use client';

import { Box, Grid, useTheme } from '@mui/material';
import { StatCard } from '@/components/dashboard/StatCard';
import { ProgressSection } from '@/components/dashboard/ProgressSection';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart';
import { getDashboardStyles } from '@/styles/dashboardStyles';
import { getBaseLayoutStyles } from '@/styles/baseLayoutStyles';

// Datos de ejemplo para la gráfica
const weeklyData = [
  { day: 'Lun', percentage: 65 },
  { day: 'Mar', percentage: 75 },
  { day: 'Mié', percentage: 85 },
  { day: 'Jue', percentage: 70 },
  { day: 'Vie', percentage: 90 },
  { day: 'Sáb', percentage: 80 },
  { day: 'Dom', percentage: 95 },
];

export function DirectionDashboard() {
  const theme = useTheme();
  const styles = getDashboardStyles(theme);
  const baseStyles = getBaseLayoutStyles(theme);

  const stats = [
    {
      title: 'Despliegues sin cargar',
      value: '5',
      icon: 'assignment',
      trend: '+2',
      trendLabel: 'vs ayer'
    },
    {
      title: 'Despliegues para hoy',
      value: '15',
      icon: 'today',
      trend: '+5',
      trendLabel: 'vs ayer'
    },
    {
      title: 'Despliegues cargados hoy',
      value: '12',
      icon: 'check_circle',
      trend: '+8',
      trendLabel: 'vs ayer'
    },
    {
      title: 'Historial de Despliegues',
      value: '248',
      icon: 'history',
      trend: '+15%',
      trendLabel: 'vs mes anterior'
    },
  ];

  const progressData = [
    {
      label: 'Despliegues Cargados',
      value: 80, // (12/15) * 100
    },
    {
      label: 'Sin Efecto',
      value: 13, // (2/15) * 100
    },
    {
      label: 'Libres',
      value: 7, // (1/15) * 100
    },
  ];

  return (
    <Box sx={baseStyles.pageContainer}>
      <Grid container spacing={{ xs: 1, sm: 2 }}>
        {/* Estadísticas principales */}
        {stats.map((stat, index) => (
          <Grid item xs={6} sm={6} md={3} key={index}>
            <Box sx={styles.statCard}>
              <StatCard {...stat} />
            </Box>
          </Grid>
        ))}

        {/* Barra de progreso */}
        <Grid item xs={12} md={6}>
          <ProgressSection data={progressData} />
        </Grid>

        {/* Gráfico semanal */}
        <Grid item xs={12} md={6}>
          <WeeklyChart data={weeklyData} />
        </Grid>
      </Grid>
    </Box>
  );
}
