import { Box, Card, CardContent, Typography, LinearProgress, Stack } from '@mui/material';
import { LocationOn } from '@mui/icons-material';

interface BarrioInfo {
  nombre: string;
  porcentaje: number;
}

interface NivelPatrullajeCardProps {
  barrios: BarrioInfo[];
  loading?: boolean;
  error?: string;
}

export const NivelPatrullajeCard = ({ 
  barrios, 
  loading = false, 
  error 
}: NivelPatrullajeCardProps) => {
  const total = barrios.reduce((sum, barrio) => sum + barrio.porcentaje, 0);

  if (error) {
    return (
      <Card sx={{ height: '100%', boxShadow: 2 }}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <LocationOn sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Nivel de Patrullaje Por Barrio
          </Typography>
        </Box>

        <Stack spacing={2}>
          {barrios.map((barrio, index) => (
            <Box key={index}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 0.5 
              }}>
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontWeight: 500,
                    minWidth: '120px'
                  }}
                >
                  {barrio.nombre}
                </Typography>
                <Typography 
                  variant="body2" 
                  color="text.primary"
                  sx={{ fontWeight: 500 }}
                >
                  {barrio.porcentaje}%
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={barrio.porcentaje} 
                sx={{
                  height: 6,
                  borderRadius: 1,
                  bgcolor: 'background.default',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 1,
                    bgcolor: 'primary.main'
                  }
                }}
              />
            </Box>
          ))}
        </Stack>

        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          mt: 2,
          pt: 2,
          borderTop: 1,
          borderColor: 'divider'
        }}>
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ fontWeight: 500 }}
          >
            Total: {total}%
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
