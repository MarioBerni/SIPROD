'use client';

import { Box, Typography, Grid, Paper } from '@mui/material';
import { Service } from '@/data/__mocks__/servicesMock';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import EventBusyIcon from '@mui/icons-material/EventBusy';

interface StatCardProps {
  title: string;
  count: number;
  icon: React.ReactNode;
}

const StatCard = ({ title, count, icon }: StatCardProps) => (
  <Paper elevation={2} sx={{ p: 2 }}>
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
      {icon}
      <Box>
        <Typography variant="h6">{count}</Typography>
        <Typography variant="body2" color="text.secondary">
          {title}
        </Typography>
      </Box>
    </Box>
  </Paper>
);

interface ServiceStatisticsProps {
  services: Service[];
}

export const ServiceStatistics = ({ services }: ServiceStatisticsProps) => {
  const stats = {
    jefeDia: services.filter(s => s.type === 'JEFE_DIA').length,
    cursos: services.filter(s => s.type === 'CURSO').length,
    licencias: services.filter(s => s.type === 'LICENCIA').length
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <StatCard
          title="Servicios de Jefe de Día"
          count={stats.jefeDia}
          icon={<AssignmentIcon color="primary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
      <Grid item xs={12}>
        <StatCard
          title="Cursos"
          count={stats.cursos}
          icon={<SchoolIcon color="primary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
      <Grid item xs={12}>
        <StatCard
          title="Licencias"
          count={stats.licencias}
          icon={<EventBusyIcon color="primary" sx={{ fontSize: 40 }} />}
        />
      </Grid>
    </Grid>
  );
};
