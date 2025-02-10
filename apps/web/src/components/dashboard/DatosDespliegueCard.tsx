import { Box, Card, CardContent, Typography, Stack } from '@mui/material';
import { DirectionsCar, TwoWheeler, Pets, Group } from '@mui/icons-material';

interface DatosDespliegueCardProps {
  moviles: number;
  motos: number;
  hipo: number;
  efectivos: number;
  error?: string;
}

export const DatosDespliegueCard = ({ 
  moviles, 
  motos, 
  hipo, 
  efectivos, 
  error 
}: DatosDespliegueCardProps) => {
  const items = [
    { icon: DirectionsCar, label: 'Móviles', value: moviles, color: 'primary.main' },
    { icon: TwoWheeler, label: 'Motos', value: motos, color: 'info.main' },
    { icon: Pets, label: 'Hipo', value: hipo, color: 'success.main' },
    { icon: Group, label: 'Efectivos', value: efectivos, color: 'warning.main' },
  ];

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
        <Typography variant="h6" sx={{ mb: 3 }}>
          Datos de Despliegue
        </Typography>

        <Stack spacing={2.5}>
          {items.map((item, index) => (
            <Box 
              key={index}
              sx={{ 
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 1,
                  bgcolor: `${item.color}15`,
                  mr: 2
                }}
              >
                <item.icon sx={{ color: item.color }} />
              </Box>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="body2" color="text.secondary">
                  {item.label}
                </Typography>
                <Typography variant="h6">
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}
        </Stack>
      </CardContent>
    </Card>
  );
};
