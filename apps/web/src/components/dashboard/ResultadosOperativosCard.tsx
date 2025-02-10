import { Card, CardContent, CardHeader, Grid, Typography, Box } from '@mui/material';
import { ResultadoOperativo } from '@/types/dashboard';
import ControlPointIcon from '@mui/icons-material/ControlPoint';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import DirectionsCarIcon from '@mui/icons-material/DirectionsCar';
import TwoWheelerIcon from '@mui/icons-material/TwoWheeler';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import WarningIcon from '@mui/icons-material/Warning';

interface ResultadoItemProps {
  label: string;
  valor: number;
  icon?: React.ReactNode;
}

const ResultadoItem = ({ label, valor, icon }: ResultadoItemProps) => (
  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
    {icon && (
      <Box sx={{ mr: 1, color: 'primary.main' }}>
        {icon}
      </Box>
    )}
    <Typography variant="body2" sx={{ flex: 1 }}>
      {label}
    </Typography>
    <Typography variant="h6" sx={{ ml: 2, minWidth: 50, textAlign: 'right' }}>
      {valor}
    </Typography>
  </Box>
);

interface ResultadosOperativosCardProps {
  datos: ResultadoOperativo;
}

export const ResultadosOperativosCard = ({ datos }: ResultadosOperativosCardProps) => {
  return (
    <Card>
      <CardHeader
        title="Resultados Operativos"
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
        <Grid container spacing={2}>
          {/* Columna izquierda */}
          <Grid item xs={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                Puntos de Control
              </Typography>
              <ResultadoItem
                label="Total"
                valor={datos.puntosControl}
                icon={<ControlPointIcon />}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                Registros
              </Typography>
              <ResultadoItem
                label="Personas"
                valor={datos.registros.personas}
                icon={<PersonSearchIcon />}
              />
              <ResultadoItem
                label="Autos"
                valor={datos.registros.autos}
                icon={<DirectionsCarIcon />}
              />
              <ResultadoItem
                label="Motos"
                valor={datos.registros.motos}
                icon={<TwoWheelerIcon />}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                Incautaciones
              </Typography>
              <ResultadoItem
                label="Autos"
                valor={datos.incautaciones.autos}
                icon={<DirectionsCarIcon />}
              />
              <ResultadoItem
                label="Motos"
                valor={datos.incautaciones.motos}
                icon={<TwoWheelerIcon />}
              />
            </Box>
          </Grid>

          {/* Columna derecha */}
          <Grid item xs={6}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                Incautación Armas
              </Typography>
              <ResultadoItem
                label="Fuego"
                valor={datos.incautacionArmas.fuego}
                icon={<LocalPoliceIcon />}
              />
              <ResultadoItem
                label="Blanca"
                valor={datos.incautacionArmas.blanca}
                icon={<WarningIcon />}
              />
              <ResultadoItem
                label="Cartucho"
                valor={datos.incautacionArmas.cartucho}
                icon={<LocalPoliceIcon />}
              />
            </Box>

            <Box>
              <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 'bold', color: 'primary.main' }}>
                Incautación Sustancias
              </Typography>
              <ResultadoItem
                label="Cocaína (kg)"
                valor={datos.incautacionSustancias.cocaina}
              />
              <ResultadoItem
                label="Pasta Base (kg)"
                valor={datos.incautacionSustancias.pastaBase}
              />
              <ResultadoItem
                label="Vegetal (kg)"
                valor={datos.incautacionSustancias.vegetal}
              />
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
