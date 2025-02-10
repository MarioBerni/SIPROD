import { Card, CardContent, CardHeader, Grid, Typography, IconButton, Box } from '@mui/material';
import { RecursosActuales } from '@/types/dashboard';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import PetsIcon from '@mui/icons-material/Pets';
import DirectionsWalkIcon from '@mui/icons-material/DirectionsWalk';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import InfoIcon from '@mui/icons-material/Info';

interface RecursoItemProps {
  label: string;
  cantidad: number;
  icon: React.ReactNode;
  onDetalleClick: () => void;
}

const RecursoItem = ({ label, cantidad, icon, onDetalleClick }: RecursoItemProps) => (
  <Grid container alignItems="center" spacing={1} sx={{ mb: 2 }}>
    <Grid item xs={1}>
      {icon}
    </Grid>
    <Grid item xs={7}>
      <Typography variant="body1">{label}</Typography>
    </Grid>
    <Grid item xs={2}>
      <Typography variant="h6" align="center">{cantidad}</Typography>
    </Grid>
    <Grid item xs={2}>
      <IconButton 
        size="small" 
        onClick={onDetalleClick}
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          '&:hover': {
            bgcolor: 'primary.dark',
          },
        }}
      >
        <InfoIcon fontSize="small" />
      </IconButton>
    </Grid>
  </Grid>
);

interface RecursosActualesCardProps {
  datos: RecursosActuales;
  onDetalleClick: (tipo: string) => void;
}

export const RecursosActualesCard = ({ datos, onDetalleClick }: RecursosActualesCardProps) => {
  return (
    <Card>
      <CardHeader 
        title="Recursos Actuales Desplegados" 
        sx={{ 
          bgcolor: 'primary.main',
          color: 'white',
          '& .MuiCardHeader-title': {
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }
        }}
      />
      <CardContent>
        <RecursoItem
          label="Móviles"
          cantidad={datos.moviles.cantidad}
          icon={<DirectionsCarIcon color="primary" />}
          onDetalleClick={() => onDetalleClick('moviles')}
        />
        <RecursoItem
          label="Motos"
          cantidad={datos.motos.cantidad}
          icon={<TwoWheelerIcon color="primary" />}
          onDetalleClick={() => onDetalleClick('motos')}
        />
        <RecursoItem
          label="Hipos"
          cantidad={datos.hipos.cantidad}
          icon={<PetsIcon color="primary" />}
          onDetalleClick={() => onDetalleClick('hipos')}
        />
        <RecursoItem
          label="Pie Tierra"
          cantidad={datos.pieTierra.cantidad}
          icon={<DirectionsWalkIcon color="primary" />}
          onDetalleClick={() => onDetalleClick('pieTierra')}
        />
        <RecursoItem
          label="Choque Apostado"
          cantidad={datos.choqueApostado.cantidad}
          icon={<LocalPoliceIcon color="primary" />}
          onDetalleClick={() => onDetalleClick('choqueApostado')}
        />
        <RecursoItem
          label="Choque en Alerta"
          cantidad={datos.choqueAlerta.cantidad}
          icon={<NotificationsActiveIcon color="primary" />}
          onDetalleClick={() => onDetalleClick('choqueAlerta')}
        />
        <Box sx={{ mt: 2, p: 1, bgcolor: 'grey.100', borderRadius: 1 }}>
          <Typography variant="h6" align="center">
            Total Efectivos: {datos.totalEfectivos}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};
