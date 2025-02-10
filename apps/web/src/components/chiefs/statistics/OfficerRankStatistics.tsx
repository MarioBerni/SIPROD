'use client';

import { Grid, Paper, Typography, alpha } from '@mui/material';
import { Officer, Assignment } from '@/app/dashboard/escalafon-jefes/types';

interface OfficerRankStatisticsProps {
  officers: Officer[];
  assignments: Assignment[];
}

export const OfficerRankStatistics = ({ officers, assignments }: OfficerRankStatisticsProps) => {
  const stats = [
    {
      title: 'Total Personal',
      value: officers.length.toString(),
      icon: '👥',
    },
    {
      title: 'Activos',
      value: officers.filter(o => o.estado === 'activo').length.toString(),
      icon: '✅',
    },
    {
      title: 'En Servicio',
      value: assignments.filter(a => a.status === 'confirmado').length.toString(),
      icon: '🔄',
    },
    {
      title: 'Licencias',
      value: officers.filter(o => o.estado === 'licencia').length.toString(),
      icon: '📋',
    },
  ];

  return (
    <Grid container spacing={3} sx={{ mb: 3 }}>
      {stats.map((stat, index) => (
        <Grid item xs={12} sm={6} md={3} key={index}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              textAlign: 'center',
              borderRadius: 2,
              bgcolor: 'background.paper',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-4px)',
                boxShadow: `0 4px 20px ${alpha('#1565C0', 0.15)}`,
              },
            }}
          >
            <Typography variant="h2" sx={{ fontSize: '2rem', mb: 1 }}>
              {stat.icon}
            </Typography>
            <Typography variant="h6" sx={{ mb: 0.5 }}>
              {stat.value}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {stat.title}
            </Typography>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
};
