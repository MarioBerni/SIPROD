'use client';

import React, { useMemo } from 'react';
import { 
  Paper, 
  Grid,
  useTheme,
  alpha,
} from '@mui/material';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption, LineSeriesOption } from 'echarts';
import ListaDetalles from './ListaDetalles';
import { 
  EstadisticaPorHora, 
  DetalleRegistro,
  Detalle 
} from '../services/estadisticas.service';
import { TiempoOperativo, Unidad, Departamento } from '@prisma/client';

interface Props {
  datos: EstadisticaPorHora[];
  horaSeleccionada: number | null;
  onHoraChange: (hora: number | null) => void;
}

const adaptarDetalle = (detalle: Detalle): DetalleRegistro => ({
  nombreOperativo: detalle.nombreOperativo,
  moviles: detalle.moviles,
  motos: detalle.motos,
  hipos: detalle.hipos,
  totalPpss: detalle.totalPpss,
  tiempoOperativo: TiempoOperativo.PATRULLAJE,
  unidad: Unidad.DIRECCION_I,
  departamento: Departamento.MONTEVIDEO,
});

const GraficaEstadistica: React.FC<Props> = ({ 
  datos,
  horaSeleccionada,
  onHoraChange
}) => {
  const theme = useTheme();

  const detallesActuales = useMemo(() => 
    horaSeleccionada !== null 
      ? datos.find(d => d.hora === horaSeleccionada) 
      : null,
    [datos, horaSeleccionada]
  );

  const detallesAdaptados = useMemo(() => 
    detallesActuales?.detalles.map(adaptarDetalle) || [],
    [detallesActuales]
  );

  const option = useMemo<EChartsOption>(() => ({
    tooltip: {
      trigger: 'axis',
      backgroundColor: theme.palette.background.paper,
      borderColor: theme.palette.divider,
      textStyle: {
        color: theme.palette.text.primary,
      },
      formatter: (params) => {
        if (!Array.isArray(params)) return '';
        
        const hora = datos[params[0].dataIndex].hora;
        let content = `<div style="padding: 3px 6px;"><b>Hora ${hora}:00</b></div>`;
        
        params.forEach((param) => {
          const value = typeof param.value === 'number' ? param.value : 0;
          content += `
            <div style="display: flex; justify-content: space-between; padding: 3px 6px;">
              <span style="color:${param.color}">● ${param.seriesName}</span>
              <span style="margin-left: 12px">${value}</span>
            </div>
          `;
        });
        
        return content;
      }
    },
    legend: {
      data: ['Personal', 'Móviles', 'Motos', 'Hipos'],
      textStyle: {
        color: theme.palette.text.primary,
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
      boundaryGap: false,
      data: datos.map(d => `${d.hora}:00`),
      axisLabel: {
        color: theme.palette.text.secondary,
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: theme.palette.text.secondary,
      }
    },
    series: [
      {
        name: 'Personal',
        type: 'line',
        data: datos.map(d => d.totalPpss),
        smooth: true,
        symbol: 'circle',
        symbolSize: (_, params) => 
          params.dataIndex === datos.findIndex(d => d.hora === horaSeleccionada) ? 12 : 8,
        lineStyle: { width: 3, color: theme.palette.primary.main },
        itemStyle: { 
          color: theme.palette.primary.main,
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: alpha(theme.palette.primary.main, 0.1)
        }
      } as LineSeriesOption,
      {
        name: 'Móviles',
        type: 'line',
        data: datos.map(d => d.totalMoviles),
        smooth: true,
        symbol: 'circle',
        symbolSize: (_, params) => 
          params.dataIndex === datos.findIndex(d => d.hora === horaSeleccionada) ? 12 : 8,
        lineStyle: { width: 3, color: theme.palette.secondary.main },
        itemStyle: { 
          color: theme.palette.secondary.main,
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: alpha(theme.palette.secondary.main, 0.1)
        }
      } as LineSeriesOption,
      {
        name: 'Motos',
        type: 'line',
        data: datos.map(d => d.totalMotos),
        smooth: true,
        symbol: 'circle',
        symbolSize: (_, params) => 
          params.dataIndex === datos.findIndex(d => d.hora === horaSeleccionada) ? 12 : 8,
        lineStyle: { width: 3, color: theme.palette.success.main },
        itemStyle: { 
          color: theme.palette.success.main,
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: alpha(theme.palette.success.main, 0.1)
        }
      } as LineSeriesOption,
      {
        name: 'Hipos',
        type: 'line',
        data: datos.map(d => d.totalHipos),
        smooth: true,
        symbol: 'circle',
        symbolSize: (_, params) => 
          params.dataIndex === datos.findIndex(d => d.hora === horaSeleccionada) ? 12 : 8,
        lineStyle: { width: 3, color: theme.palette.warning.main },
        itemStyle: { 
          color: theme.palette.warning.main,
          borderWidth: 2,
          borderColor: '#fff'
        },
        areaStyle: {
          color: alpha(theme.palette.warning.main, 0.1)
        }
      } as LineSeriesOption
    ]
  }), [datos, theme, horaSeleccionada]);

  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 2,
            backgroundColor: 'background.default'
          }}
        >
          <ReactECharts 
            option={option}
            onEvents={{
              click: (params: { dataIndex: number }) => {
                const hora = datos[params.dataIndex].hora;
                onHoraChange(hora === horaSeleccionada ? null : hora);
              }
            }}
            style={{ 
              height: '400px',
              width: '100%'
            }}
          />
        </Paper>
      </Grid>
      {detallesActuales && (
        <Grid item xs={12}>
          <ListaDetalles 
            datos={[{
              nombre: `Hora ${horaSeleccionada}:00`,
              valor: horaSeleccionada || 0,
              totalPpss: detallesActuales.totalPpss,
              detalles: detallesAdaptados
            }]}
            tipo="seccional"
          />
        </Grid>
      )}
    </Grid>
  );
};

export default GraficaEstadistica;
