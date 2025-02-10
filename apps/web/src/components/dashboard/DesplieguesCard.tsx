import { Box, Card, CardContent, Typography, Chip, Skeleton } from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';

interface DespliegueInfo {
  id: string;
  titulo: string;
  estado: 'activo' | 'pendiente' | 'completado';
  tipo: string;
  hora: string;
}

interface DesplieguesCardProps {
  titulo: string;
  despliegues?: DespliegueInfo[];
  loading?: boolean;
  error?: string;
}

export const DesplieguesCard = ({ titulo, despliegues, loading = false, error }: DesplieguesCardProps) => {
  if (error) {
    return (
      <Card sx={{ height: '100%', boxShadow: 2 }}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'activo':
        return 'success';
      case 'pendiente':
        return 'warning';
      case 'completado':
        return 'info';
      default:
        return 'default';
    }
  };

  const DespliegueItem = ({ despliegue }: { despliegue: DespliegueInfo }) => (
    <Box sx={{ mb: 2, p: 1.5, bgcolor: 'background.default', borderRadius: 1 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Typography variant="subtitle2">{despliegue.titulo}</Typography>
        <Chip
          label={despliegue.estado}
          size="small"
          color={getEstadoColor(despliegue.estado) as 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'}
          sx={{ textTransform: 'capitalize' }}
        />
      </Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {despliegue.tipo}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {despliegue.hora}
        </Typography>
      </Box>
    </Box>
  );

  return (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <AssignmentIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">{titulo}</Typography>
        </Box>

        {loading ? (
          [...Array(3)].map((_, index) => (
            <Box key={index} sx={{ mb: 2 }}>
              <Skeleton variant="rectangular" height={80} sx={{ borderRadius: 1 }} />
            </Box>
          ))
        ) : (
          <>
            {despliegues?.length === 0 ? (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 2 }}>
                No hay despliegues para mostrar
              </Typography>
            ) : (
              despliegues?.map((despliegue) => (
                <DespliegueItem key={despliegue.id} despliegue={despliegue} />
              ))
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};
