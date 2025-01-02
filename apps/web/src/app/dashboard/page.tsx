'use client';

import { Box, Typography, Grid, Paper } from '@mui/material';
import { 
  People as PeopleIcon,
  Assignment as AssignmentIcon,
  Settings as SettingsIcon,
  Dashboard as DashboardIcon 
} from '@mui/icons-material';

export default function DashboardPage() {
  const stats = [
    {
      title: 'Usuarios',
      value: '150',
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: '#1976d2'
    },
    {
      title: 'Reportes',
      value: '28',
      icon: <AssignmentIcon sx={{ fontSize: 40 }} />,
      color: '#2e7d32'
    },
    {
      title: 'Configuraciones',
      value: '12',
      icon: <SettingsIcon sx={{ fontSize: 40 }} />,
      color: '#ed6c02'
    },
    {
      title: 'Actividad',
      value: '89%',
      icon: <DashboardIcon sx={{ fontSize: 40 }} />,
      color: '#9c27b0'
    }
  ];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Panel de Control
      </Typography>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              sx={{
                p: 3,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                backgroundColor: 'white',
                borderRadius: 2,
                boxShadow: 3
              }}
            >
              <Box
                sx={{
                  width: 64,
                  height: 64,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: `${stat.color}15`,
                  color: stat.color,
                  mb: 2
                }}
              >
                {stat.icon}
              </Box>
              <Typography variant="h4" component="div" sx={{ mb: 1 }}>
                {stat.value}
              </Typography>
              <Typography color="text.secondary" variant="subtitle1">
                {stat.title}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
