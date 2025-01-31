'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Box, 
  Container, 
  Paper, 
  CircularProgress,
  Alert,
  useTheme,
  alpha,
  Grid
} from '@mui/material';
import FiltrosEstadistica from './components/FiltrosEstadistica';
import GraficaEstadistica from './components/GraficaEstadistica';
import EstadisticaHeader from './components/EstadisticaHeader';
import TablaEstadisticasAccordion from './components/TablaEstadisticasAccordion';
import GraficasDistribucion from './components/GraficasDistribucion';
import { EstadisticasFiltros } from './types/filtros';
import { 
  obtenerEstadisticasPorHorario,
  obtenerEstadisticasPorSeccional,
  obtenerEstadisticasPorBarrio,
  EstadisticaPorHora,
  EstadisticasPorSeccional,
  EstadisticasPorBarrio
} from './services/estadisticas.service';

const EstadisticaPage = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [datosHorario, setDatosHorario] = useState<EstadisticaPorHora[]>([]);
  const [datosSeccional, setDatosSeccional] = useState<EstadisticasPorSeccional[]>([]);
  const [datosBarrio, setDatosBarrio] = useState<EstadisticasPorBarrio[]>([]);
  const [horaSeleccionada, setHoraSeleccionada] = useState<number | null>(null);
  const [filtros, setFiltros] = useState<EstadisticasFiltros>({
    zona: [],
    unidad: [],
    tiempoOperativo: [],
    mostrarSeccionales: false,
    mostrarBarrios: false
  });

  const totales = useMemo(() => {
    if (horaSeleccionada !== null) {
      const datoHora = datosHorario.find(d => d.hora === horaSeleccionada);
      return datoHora ? {
        totalPpss: datoHora.totalPpss,
        totalMoviles: datoHora.totalMoviles,
        totalMotos: datoHora.totalMotos,
        totalHipos: datoHora.totalHipos
      } : {
        totalPpss: 0,
        totalMoviles: 0,
        totalMotos: 0,
        totalHipos: 0
      };
    }

    return datosHorario.reduce((acc, dato) => ({
      totalPpss: acc.totalPpss + dato.totalPpss,
      totalMoviles: acc.totalMoviles + dato.totalMoviles,
      totalMotos: acc.totalMotos + dato.totalMotos,
      totalHipos: acc.totalHipos + dato.totalHipos
    }), {
      totalPpss: 0,
      totalMoviles: 0,
      totalMotos: 0,
      totalHipos: 0
    });
  }, [datosHorario, horaSeleccionada]);

  const cargarDatos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [horario, seccional, barrio] = await Promise.all([
        obtenerEstadisticasPorHorario(filtros),
        filtros.mostrarSeccionales ? obtenerEstadisticasPorSeccional(filtros) : Promise.resolve([]),
        filtros.mostrarBarrios ? obtenerEstadisticasPorBarrio(filtros) : Promise.resolve([])
      ]);

      setDatosHorario(horario);
      setDatosSeccional(seccional);
      setDatosBarrio(barrio);
      setHoraSeleccionada(null);
    } catch (error) {
      console.error('Error al cargar datos:', error);
      setError('Error al cargar los datos. Por favor, intente nuevamente.');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    cargarDatos();
  }, [cargarDatos]);

  return (
    <Container maxWidth="xl" className="py-4">
      <EstadisticaHeader 
        {...totales}
        horaSeleccionada={horaSeleccionada}
      />
      
      <Paper 
        elevation={0}
        sx={{ 
          p: 2, 
          mb: 4,
          backgroundColor: alpha(theme.palette.primary.main, 0.05)
        }}
      >
        <FiltrosEstadistica
          filtros={filtros}
          onChange={setFiltros}
        />
      </Paper>

      {error && (
        <Alert severity="error" sx={{ mb: 4 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <GraficaEstadistica
                datos={datosHorario}
                horaSeleccionada={horaSeleccionada}
                onHoraChange={setHoraSeleccionada}
              />
            </Grid>
            
            {(filtros.mostrarSeccionales || filtros.mostrarBarrios) && (
              <Grid item xs={12}>
                <GraficasDistribucion
                  datosSeccionales={datosSeccional}
                  datosBarrios={datosBarrio}
                  mostrarSeccionales={filtros.mostrarSeccionales}
                  mostrarBarrios={filtros.mostrarBarrios}
                />
              </Grid>
            )}
          </Grid>

          <TablaEstadisticasAccordion
            datosHorarios={datosHorario}
            datosSeccionales={datosSeccional}
            datosBarrios={datosBarrio}
            horaSeleccionada={horaSeleccionada}
          />
        </>
      )}
    </Container>
  );
};

export default EstadisticaPage;
