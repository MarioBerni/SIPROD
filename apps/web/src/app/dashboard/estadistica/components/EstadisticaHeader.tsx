import React from 'react';
import { 
  Box, 
  Typography, 
  Paper,
  Grid,
  useTheme,
  alpha,
  Stack,
  Chip
} from '@mui/material';
import { 
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  TwoWheeler as MotoIcon,
  DirectionsRun as HipoIcon,
  AccessTime as AccessTimeIcon
} from '@mui/icons-material';

interface Props {
  totalPpss: number;
  totalMoviles: number;
  totalMotos: number;
  totalHipos: number;
  horaSeleccionada: number | null;
}

const EstadisticaHeader: React.FC<Props> = ({
  totalPpss,
  totalMoviles,
  totalMotos,
  totalHipos,
  horaSeleccionada
}) => {
  const theme = useTheme();

  const stats = [
    { 
      icon: <PersonIcon sx={{ fontSize: 32 }} />, 
      label: 'Personal', 
      value: totalPpss,
      color: theme.palette.primary.main
    },
    { 
      icon: <CarIcon sx={{ fontSize: 32 }} />, 
      label: 'Móviles', 
      value: totalMoviles,
      color: theme.palette.secondary.main
    },
    { 
      icon: <MotoIcon sx={{ fontSize: 32 }} />, 
      label: 'Motos', 
      value: totalMotos,
      color: theme.palette.success.main
    },
    { 
      icon: <HipoIcon sx={{ fontSize: 32 }} />, 
      label: 'Hipos', 
      value: totalHipos,
      color: theme.palette.warning.main
    }
  ];

  return (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
        <AccessTimeIcon sx={{ fontSize: 32, color: 'primary.main' }} />
        <Typography variant="h4" color="primary">
          Estadísticas
        </Typography>
        {horaSeleccionada !== null && (
          <Chip
            label={`Hora ${horaSeleccionada}:00`}
            color="primary"
            variant="outlined"
            size="medium"
            sx={{ 
              ml: 2,
              height: 32,
              borderRadius: 2,
              '& .MuiChip-label': {
                px: 2,
                fontSize: '1rem',
              }
            }}
          />
        )}
        {horaSeleccionada === null && (
          <Typography 
            variant="subtitle1" 
            color="text.secondary"
            sx={{ ml: 2 }}
          >
            (Totales del día)
          </Typography>
        )}
      </Box>

      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                height: '100%',
                bgcolor: alpha(stat.color, 0.05),
                border: `1px solid ${alpha(stat.color, 0.1)}`,
                transition: 'all 0.3s ease',
                '&:hover': {
                  bgcolor: alpha(stat.color, 0.1),
                  transform: 'translateY(-2px)',
                }
              }}
            >
              <Stack spacing={2}>
                <Box sx={{ color: stat.color }}>
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="h3" sx={{ color: stat.color, mb: 1 }}>
                    {stat.value}
                  </Typography>
                  <Typography variant="subtitle2" color="text.secondary">
                    {stat.label} {horaSeleccionada !== null ? `(${horaSeleccionada}:00)` : '(Total)'}
                  </Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default EstadisticaHeader;
