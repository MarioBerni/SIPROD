'use client';

import { Box, Grid, useTheme } from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Today as TodayIcon,
  CheckCircle as CheckCircleIcon,
  History as HistoryIcon,
  Warning as WarningIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
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
      icon: AssignmentIcon,
      title: 'Despliegues sin cargar',
      count: 5,
      color: 'error' as const,
      subtitle: 'Pendientes de completar',
    },
    {
      icon: TodayIcon,
      title: 'Despliegues para hoy',
      count: 15,
      color: 'warning' as const,
      subtitle: 'Programados para el día',
    },
    {
      icon: CheckCircleIcon,
      title: 'Despliegues cargados hoy',
      count: 12,
      color: 'success' as const,
      subtitle: 'Completados del día',
    },
    {
      icon: HistoryIcon,
      title: 'Historial de Despliegues',
      count: 248,
      color: 'primary' as const,
      subtitle: 'Total acumulado',
    },
  ];

  const progressData = {
    cargados: {
      label: 'Despliegues Cargados',
      value: 12,
      total: 15,
      color: theme.palette.success.main,
      icon: CheckCircleIcon,
    },
    sinEfecto: {
      label: 'Sin Efecto',
      value: 2,
      total: 15,
      color: theme.palette.warning.main,
      icon: WarningIcon,
    },
    libres: {
      label: 'Libres',
      value: 1,
      total: 15,
      color: theme.palette.error.main,
      icon: BlockIcon,
    },
  };

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
          <Box sx={styles.progressSection}>
            <ProgressSection data={progressData} />
          </Box>
        </Grid>

        {/* Gráfica semanal */}
        <Grid item xs={12} md={6}>
          <Box sx={styles.weeklyChart}>
            <WeeklyChart data={weeklyData} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
