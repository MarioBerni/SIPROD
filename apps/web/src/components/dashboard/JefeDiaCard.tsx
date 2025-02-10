import { Box, Card, CardContent, Typography, Divider, Skeleton, Grid } from '@mui/material';
import { Person as PersonIcon } from '@mui/icons-material';

interface JefeInfo {
  nombre: string;
  grado: string;
}

interface JefeDiaCardProps {
  jefeDir1?: JefeInfo;
  jefeDir2?: JefeInfo;
  jefeMañanaPrincipal?: JefeInfo;
  jefeMañanaSecundario?: JefeInfo;
  loading?: boolean;
  error?: string;
}

export const JefeDiaCard = ({ 
  jefeDir1, 
  jefeDir2, 
  jefeMañanaPrincipal,
  jefeMañanaSecundario,
  loading = false, 
  error 
}: JefeDiaCardProps) => {
  if (error) {
    return (
      <Card sx={{ height: '100%', boxShadow: 2 }}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  const JefeSection = ({ nombre, grado }: { nombre?: string; grado?: string }) => (
    <Box>
      {loading ? (
        <>
          <Skeleton width="80%" />
          <Skeleton width="60%" />
        </>
      ) : nombre ? (
        <>
          <Typography>{nombre}</Typography>
          <Typography color="textSecondary" variant="body2">
            {grado}
          </Typography>
        </>
      ) : (
        <Typography color="textSecondary">No asignado</Typography>
      )}
    </Box>
  );

  return (
    <Card sx={{ height: '100%', boxShadow: 2 }}>
      <CardContent>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <PersonIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Jefes de Día Actual
          </Typography>
        </Box>

        {/* Jefes Actuales */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={6}>
            <Typography 
              color="primary"
              sx={{ 
                fontWeight: 500,
                mb: 1
              }}
            >
              Dirección I
            </Typography>
            <JefeSection 
              nombre={jefeDir1?.nombre}
              grado={jefeDir1?.grado}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography 
              color="primary"
              sx={{ 
                fontWeight: 500,
                mb: 1
              }}
            >
              Dirección II y GEO
            </Typography>
            <JefeSection 
              nombre={jefeDir2?.nombre}
              grado={jefeDir2?.grado}
            />
          </Grid>
        </Grid>

        {/* Jefes de Mañana */}
        <Divider sx={{ my: 2 }} />
        <Typography 
          variant="subtitle1" 
          sx={{ 
            fontWeight: 500,
            mb: 2,
            color: 'text.secondary'
          }}
        >
          Mañana
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <Typography 
              color="primary"
              sx={{ 
                fontWeight: 500,
                mb: 1,
                fontSize: '0.875rem'
              }}
            >
              Jefe Principal
            </Typography>
            <JefeSection 
              nombre={jefeMañanaPrincipal?.nombre}
              grado={jefeMañanaPrincipal?.grado}
            />
          </Grid>

          <Grid item xs={6}>
            <Typography 
              color="primary"
              sx={{ 
                fontWeight: 500,
                mb: 1,
                fontSize: '0.875rem'
              }}
            >
              Jefe Secundario
            </Typography>
            <JefeSection 
              nombre={jefeMañanaSecundario?.nombre}
              grado={jefeMañanaSecundario?.grado}
            />
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};
