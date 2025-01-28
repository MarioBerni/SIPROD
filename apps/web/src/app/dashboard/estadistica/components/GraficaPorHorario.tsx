'use client';

import { useMemo } from 'react';
import dynamic from 'next/dynamic';
import { Box, useTheme, useMediaQuery, Typography } from '@mui/material';
import type { EChartsOption, TooltipComponentOption } from 'echarts';
import { EstadisticaPorHora } from '../services/estadisticas.service';

const ReactECharts = dynamic(() => import('echarts-for-react'), { ssr: false });

interface Props {
  datos: EstadisticaPorHora[];
  onHoraClick?: (hora: number) => void;
}

interface SeriesData {
  ppss: number[];
  moviles: number[];
  motos: number[];
  hipos: number[];
}

interface TooltipParams {
  dataIndex: number;
  seriesName: string;
  value: number;
  color: string;
}

const generateHourLabels = (): string[] => {
  const labels: string[] = [];
  // Empezar desde las 8:00 hasta las 7:00
  for (let i = 8; i < 32; i++) {
    const hora = i % 24;
    labels.push(`${hora.toString().padStart(2, '0')}:00`);
  }
  return labels;
};

const GraficaPorHorario: React.FC<Props> = ({ datos, onHoraClick }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Reordenar los datos para que empiecen desde las 8:00
  const datosOrdenados = useMemo(() => {
    // Crear un array de 24 horas con valores iniciales
    const horasOrdenadas = new Array(24).fill(null).map((_, i) => {
      const horaReal = i < 16 ? i + 8 : i - 16;
      return datos.find(d => d.hora === horaReal) || {
        hora: horaReal,
        totalPpss: 0,
        totalMoviles: 0,
        totalMotos: 0,
        totalHipos: 0,
        detalles: [],
        unidades: [],
        departamentos: [],
        tiemposOperativos: []
      };
    });
    return horasOrdenadas;
  }, [datos]);

  // Memoizar las etiquetas de horas
  const hourLabels = useMemo(() => generateHourLabels(), []);

  // Memoizar las series de datos
  const series = useMemo((): SeriesData => ({
    ppss: datosOrdenados.map(d => d.totalPpss),
    moviles: datosOrdenados.map(d => d.totalMoviles),
    motos: datosOrdenados.map(d => d.totalMotos),
    hipos: datosOrdenados.map(d => d.totalHipos),
  }), [datosOrdenados]);

  // Memoizar las opciones del gráfico
  const options = useMemo((): EChartsOption => ({
    grid: {
      left: '5%',
      right: '5%',
      bottom: '10%',
      top: '15%',
      containLabel: true,
    },
    tooltip: {
      trigger: 'axis',
      backgroundColor: '#fff',
      borderColor: theme.palette.primary.main,
      formatter: (params: TooltipParams | TooltipParams[]) => {
        if (!Array.isArray(params)) return '';
        
        const hora = hourLabels[params[0].dataIndex];
        let result = `<div style="padding: 3px;"><b>${hora}</b></div>`;
        
        params.forEach((param) => {
          const color = param.color;
          const value = param.value;
          const name = param.seriesName;
          result += `<div style="padding: 3px;">
            <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background-color:${color};margin-right:5px;"></span>
            <span>${name}: ${value}</span>
          </div>`;
        });
        
        return result;
      }
    } as TooltipComponentOption,
    legend: {
      data: ['Total Efectivos', 'Móviles', 'Motos', 'Hipos'],
      top: 0,
    },
    xAxis: {
      type: 'category',
      data: hourLabels,
      axisLabel: {
        rotate: isMobile ? 45 : 0,
      },
    },
    yAxis: {
      type: 'value',
      name: 'Cantidad',
    },
    series: [
      {
        name: 'Total Efectivos',
        type: 'line',
        data: series.ppss,
        smooth: true,
        color: theme.palette.primary.main,
      },
      {
        name: 'Móviles',
        type: 'line',
        data: series.moviles,
        smooth: true,
        color: theme.palette.secondary.main,
      },
      {
        name: 'Motos',
        type: 'line',
        data: series.motos,
        smooth: true,
        color: theme.palette.success.main,
      },
      {
        name: 'Hipos',
        type: 'line',
        data: series.hipos,
        smooth: true,
        color: theme.palette.warning.main,
      },
    ],
  }), [hourLabels, series, theme.palette, isMobile]);

  const handleChartClick = (params: { dataIndex: number }) => {
    if (onHoraClick) {
      const horaReal = params.dataIndex < 16 ? params.dataIndex + 8 : params.dataIndex - 16;
      onHoraClick(horaReal);
    }
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Distribución por Horario
      </Typography>
      <Box sx={{ height: 400 }}>
        <ReactECharts
          option={options}
          style={{ height: '100%', width: '100%' }}
          notMerge={true}
          lazyUpdate={false}
          onEvents={{
            click: handleChartClick
          }}
        />
      </Box>
    </Box>
  );
};

export default GraficaPorHorario;
