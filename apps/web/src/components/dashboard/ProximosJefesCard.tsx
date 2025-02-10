import { Box, Card, CardContent, Typography, Divider, Skeleton } from '@mui/material';
import { CalendarToday as CalendarIcon } from '@mui/icons-material';

interface JefeInfo {
  nombre: string;
  grado: string;
}

interface DiaInfo {
  fecha: string;
  jefePrincipal: JefeInfo;
  jefeSecundario: JefeInfo;
}

interface ProximosJefesCardProps {
  dias?: DiaInfo[];
  loading?: boolean;
  error?: string;
}

export const ProximosJefesCard = ({ dias, loading = false, error }: ProximosJefesCardProps) => {
  if (error) {
    return (
      <Card sx={{ height: '100%', boxShadow: 2 }}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  const DiaSection = ({ dia }: { dia: DiaInfo }) => (
    <Box sx={{ mb: 2 }}>
      <Typography variant="subtitle1" fontWeight="bold" color="primary">
        {dia.fecha}
      </Typography>
      {loading ? (
        <>
          <Skeleton width="60%" />
          <Skeleton width="40%" />
          <Skeleton width="60%" />
          <Skeleton width="40%" />
        </>
      ) : (
        <>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Jefe Principal:
          </Typography>
          <Typography variant="body1">{dia.jefePrincipal.nombre}</Typography>
          <Typography variant="body2" color="text.secondary">
            {dia.jefePrincipal.grado}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, mb: 1 }}>
            Jefe Secundario:
          </Typography>
          <Typography variant="body1">{dia.jefeSecundario.nombre}</Typography>
          <Typography variant="body2" color="text.secondary">
            {dia.jefeSecundario.grado}
          </Typography>
        </>
      )}
    </Box>
  );

  return (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <CalendarIcon color="primary" sx={{ mr: 1 }} />
          <Typography variant="h6">Próximos Jefes de Día</Typography>
        </Box>
        
        {dias?.map((dia, index) => (
          <Box key={dia.fecha}>
            <DiaSection dia={dia} />
            {index < dias.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};
