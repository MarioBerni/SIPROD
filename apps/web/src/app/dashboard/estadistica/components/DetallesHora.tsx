import React from 'react';
import { 
  Card, 
  Typography, 
  List, 
  ListItem, 
  Divider, 
  Box,
  useTheme,
  alpha,
  Stack,
  Chip
} from '@mui/material';
import { 
  AccessTime as AccessTimeIcon,
  Person as PersonIcon,
  DirectionsCar as CarIcon,
  TwoWheeler as MotoIcon,
  Pets as PetsIcon
} from '@mui/icons-material';

interface Detalle {
  tipoOperativo: string | null;
  nombreOperativo: string | null;
  horaInicio: string;
  horaFin: string;
  totalPpss: number;
  moviles: number;
  motos: number;
  hipos: number;
}

interface Props {
  hora: number | null;
  totalPpss: number;
  totalMoviles: number;
  totalMotos: number;
  totalHipos: number;
  detalles: Detalle[];
}

const DetallesHora: React.FC<Props> = ({ 
  hora, 
  totalPpss, 
  totalMoviles, 
  totalMotos,
  totalHipos, 
  detalles 
}) => {
  const theme = useTheme();

  if (hora === null) {
    return (
      <Card 
        elevation={0}
        sx={{ 
          p: 3, 
          height: '100%', 
          minHeight: 400,
          bgcolor: 'background.paper',
          border: `1px solid ${theme.palette.grey[200]}`,
        }}
      >
        <Stack spacing={2} alignItems="center" justifyContent="center" height="100%">
          <AccessTimeIcon sx={{ fontSize: 48, color: theme.palette.grey[300] }} />
          <Typography variant="h6" color="textSecondary" align="center">
            Seleccione un punto en la gráfica para ver los detalles
          </Typography>
        </Stack>
      </Card>
    );
  }

  return (
    <Card 
      elevation={0}
      sx={{ 
        height: '100%',
        minHeight: 400,
        bgcolor: 'background.paper',
        border: `1px solid ${theme.palette.grey[200]}`,
      }}
    >
      <Box sx={{ p: 3, borderBottom: `1px solid ${theme.palette.grey[200]}` }}>
        <Typography variant="h5" gutterBottom color="primary" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccessTimeIcon /> {hora}:00 hs
        </Typography>

        <Stack 
          direction="row" 
          spacing={2} 
          sx={{ 
            mt: 3,
            flexWrap: 'wrap',
            gap: 2,
            '& > div': {
              flex: '1 1 calc(50% - 16px)',
              minWidth: '140px',
              p: 2,
              borderRadius: 1,
              bgcolor: alpha(theme.palette.primary.main, 0.05),
            }
          }}
        >
          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PersonIcon color="primary" />
              <Typography variant="subtitle2" color="textSecondary">Personal</Typography>
            </Stack>
            <Typography variant="h4" color="primary.dark">{totalPpss}</Typography>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <CarIcon color="primary" />
              <Typography variant="subtitle2" color="textSecondary">Móviles</Typography>
            </Stack>
            <Typography variant="h4" color="primary.dark">{totalMoviles}</Typography>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <MotoIcon color="primary" />
              <Typography variant="subtitle2" color="textSecondary">Motos</Typography>
            </Stack>
            <Typography variant="h4" color="primary.dark">{totalMotos}</Typography>
          </Box>

          <Box>
            <Stack direction="row" alignItems="center" spacing={1}>
              <PetsIcon color="primary" />
              <Typography variant="subtitle2" color="textSecondary">Hipos</Typography>
            </Stack>
            <Typography variant="h4" color="primary.dark">{totalHipos}</Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ p: 3 }}>
        <Typography 
          variant="subtitle1" 
          color="primary" 
          gutterBottom 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between' 
          }}
        >
          <span>Registros Activos</span>
          <Chip 
            label={detalles.length} 
            size="small" 
            sx={{ 
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              fontWeight: 'bold'
            }} 
          />
        </Typography>

        <List sx={{ 
          mt: 2, 
          maxHeight: 400, 
          overflow: 'auto',
          '& > div': {
            '&:hover': {
              bgcolor: alpha(theme.palette.primary.main, 0.02),
            }
          }
        }}>
          {detalles.map((detalle, index) => (
            <React.Fragment key={index}>
              <ListItem sx={{ 
                flexDirection: 'column', 
                alignItems: 'flex-start',
                p: 2,
                borderRadius: 1,
              }}>
                <Typography 
                  variant="subtitle2" 
                  sx={{ 
                    color: 'primary.main',
                    fontWeight: 'medium'
                  }}
                >
                  {detalle.tipoOperativo || ''} 
                  {detalle.nombreOperativo && ` - ${detalle.nombreOperativo}`}
                </Typography>
                
                <Typography 
                  variant="body2" 
                  color="textSecondary" 
                  sx={{ 
                    display: 'flex',
                    alignItems: 'center',
                    gap: 0.5,
                    mt: 1
                  }}
                >
                  <AccessTimeIcon sx={{ fontSize: 16 }} />
                  {detalle.horaInicio} - {detalle.horaFin}
                </Typography>

                <Stack 
                  direction="row" 
                  spacing={2} 
                  sx={{ 
                    mt: 1,
                    flexWrap: 'wrap',
                    gap: 1,
                    '& > div': {
                      display: 'flex',
                      alignItems: 'center',
                      gap: 0.5
                    }
                  }}
                >
                  <Box>
                    <PersonIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="body2">{detalle.totalPpss}</Typography>
                  </Box>
                  <Box>
                    <CarIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="body2">{detalle.moviles}</Typography>
                  </Box>
                  <Box>
                    <MotoIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="body2">{detalle.motos}</Typography>
                  </Box>
                  <Box>
                    <PetsIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                    <Typography variant="body2">{detalle.hipos}</Typography>
                  </Box>
                </Stack>
              </ListItem>
              {index < detalles.length - 1 && (
                <Divider sx={{ my: 1 }} />
              )}
            </React.Fragment>
          ))}
        </List>
      </Box>
    </Card>
  );
};

export default DetallesHora;
