import React, { useMemo } from 'react';
import {
  Paper,
  Typography,
  Grid,
  useTheme
} from '@mui/material';
import ReactECharts from 'echarts-for-react';
import { EstadisticasPorSeccional, EstadisticasPorBarrio, DetalleRegistro } from '../services/estadisticas.service';

interface Props {
  datosSeccionales: EstadisticasPorSeccional[];
  datosBarrios: EstadisticasPorBarrio[];
  mostrarSeccionales: boolean;
  mostrarBarrios: boolean;
}

interface DatoFormateado {
  nombre: string;
  valor: number | string;
  totalPpss: number;
  detalles: DetalleRegistro[];
}

interface TooltipParams {
  name: string;
  value: number;
  data: {
    name: string;
    value: number;
    detalles: DetalleRegistro[];
  };
}

const GraficasDistribucion: React.FC<Props> = ({
  datosSeccionales,
  datosBarrios,
  mostrarSeccionales,
  mostrarBarrios,
}) => {
  const theme = useTheme();

  const datosSeccionalesFormateados = useMemo<DatoFormateado[]>(() => {
    return datosSeccionales.map(d => ({
      nombre: `Seccional ${d.resumen.valor}`,
      valor: d.resumen.valor,
      totalPpss: d.resumen.totalPpss,
      detalles: d.detalles
    }));
  }, [datosSeccionales]);

  const datosBarriosFormateados = useMemo<DatoFormateado[]>(() => {
    return datosBarrios.map(d => ({
      nombre: d.resumen.valor,
      valor: d.resumen.valor,
      totalPpss: d.resumen.totalPpss,
      detalles: d.detalles
    }));
  }, [datosBarrios]);

  const opcionesGraficaSeccionales = useMemo(() => {
    if (!datosSeccionalesFormateados || datosSeccionalesFormateados.length === 0) return {};

    const valores = datosSeccionalesFormateados.map(d => ({
      value: d.totalPpss,
      name: d.nombre,
      detalles: d.detalles
    }));

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: TooltipParams[]) {
          const data = params[0];
          let html = `<strong>${data.name}</strong><br/>`;
          html += `Total PPSS: ${data.value}<br/><br/>`;
          
          data.data.detalles.forEach((detalle) => {
            html += `<div style="margin-bottom: 8px;">`;
            html += `<strong>${detalle.nombreOperativo || 'Sin nombre'}</strong><br/>`;
            html += `Móviles: ${detalle.moviles || 0}<br/>`;
            html += `Motos: ${detalle.motos || 0}<br/>`;
            html += `Hipos: ${detalle.hipos || 0}<br/>`;
            html += `Total PPSS: ${detalle.totalPpss || 0}<br/>`;
            html += `</div>`;
          });
          
          return html;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: valores.map(v => v.name),
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'Total PPSS'
      },
      series: [{
        name: 'Total PPSS',
        type: 'bar',
        data: valores,
        itemStyle: {
          color: theme.palette.primary.main
        },
        emphasis: {
          itemStyle: {
            color: theme.palette.primary.dark
          }
        }
      }]
    };
  }, [datosSeccionalesFormateados, theme]);

  const opcionesGraficaBarrios = useMemo(() => {
    if (!datosBarriosFormateados || datosBarriosFormateados.length === 0) return {};

    const valores = datosBarriosFormateados.map(d => ({
      value: d.totalPpss,
      name: d.nombre,
      detalles: d.detalles
    }));

    return {
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'shadow'
        },
        formatter: function(params: TooltipParams[]) {
          const data = params[0];
          let html = `<strong>${data.name}</strong><br/>`;
          html += `Total PPSS: ${data.value}<br/><br/>`;
          
          data.data.detalles.forEach((detalle) => {
            html += `<div style="margin-bottom: 8px;">`;
            html += `<strong>${detalle.nombreOperativo || 'Sin nombre'}</strong><br/>`;
            html += `Móviles: ${detalle.moviles || 0}<br/>`;
            html += `Motos: ${detalle.motos || 0}<br/>`;
            html += `Hipos: ${detalle.hipos || 0}<br/>`;
            html += `Total PPSS: ${detalle.totalPpss || 0}<br/>`;
            html += `</div>`;
          });
          
          return html;
        }
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        data: valores.map(v => v.name),
        axisLabel: {
          rotate: 45,
          interval: 0
        }
      },
      yAxis: {
        type: 'value',
        name: 'Total PPSS'
      },
      series: [{
        name: 'Total PPSS',
        type: 'bar',
        data: valores,
        itemStyle: {
          color: theme.palette.secondary.main
        },
        emphasis: {
          itemStyle: {
            color: theme.palette.secondary.dark
          }
        }
      }]
    };
  }, [datosBarriosFormateados, theme]);

  return (
    <Grid container spacing={4}>
      {mostrarSeccionales && datosSeccionalesFormateados.length > 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribución por Seccional
            </Typography>
            <ReactECharts 
              option={opcionesGraficaSeccionales} 
              style={{ height: '400px' }}
            />
          </Paper>
        </Grid>
      )}

      {mostrarBarrios && datosBarriosFormateados.length > 0 && (
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Distribución por Barrio
            </Typography>
            <ReactECharts 
              option={opcionesGraficaBarrios} 
              style={{ height: '400px' }}
            />
          </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default GraficasDistribucion;
