'use client';

import { FC } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import ReactECharts from 'echarts-for-react';
import type { EChartsOption, TooltipComponentOption } from 'echarts';
import { TrendingUp } from '@mui/icons-material';

interface WeeklyChartProps {
  data: Array<{
    day: string;
    percentage: number;
  }>;
}

export const WeeklyChart: FC<WeeklyChartProps> = ({ data }) => {
  const theme = useTheme();

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: alpha(theme.palette.background.paper, 0.9),
      borderRadius: 8,
      padding: 16,
      textStyle: {
        color: theme.palette.text.primary,
        fontFamily: theme.typography.fontFamily,
      },
      formatter: (params) => {
        if (!Array.isArray(params)) return '';
        const dataPoint = params[0];
        if (!dataPoint) return '';
        
        return `
          <div style="font-family: ${theme.typography.fontFamily}">
            <div style="font-weight: 600; margin-bottom: 4px; color: ${theme.palette.primary.main}">
              ${dataPoint.name}
            </div>
            <div style="display: flex; align-items: center;">
              <span style="font-size: 20px; font-weight: 700; color: ${theme.palette.text.primary}">
                ${dataPoint.value}%
              </span>
            </div>
          </div>
        `;
      },
    } as TooltipComponentOption,
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.day),
      axisLine: {
        lineStyle: {
          color: theme.palette.divider,
        },
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontFamily: theme.typography.fontFamily,
        fontSize: 12,
      },
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      interval: 20,
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      splitLine: {
        lineStyle: {
          color: alpha(theme.palette.divider, 0.5),
          type: 'dashed',
        },
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        fontFamily: theme.typography.fontFamily,
        fontSize: 12,
        formatter: '{value}%',
      },
    },
    series: [
      {
        data: data.map(item => item.percentage),
        type: 'line',
        smooth: true,
        symbolSize: 8,
        itemStyle: {
          color: theme.palette.primary.main,
        },
        lineStyle: {
          width: 3,
          color: theme.palette.primary.main,
        },
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [{
              offset: 0,
              color: alpha(theme.palette.primary.main, 0.2),
            }, {
              offset: 1,
              color: alpha(theme.palette.primary.main, 0),
            }],
          },
        },
      },
    ],
  };

  return (
    <Box sx={{ p: 2.5, height: '100%' }}>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 1.5,
            backgroundColor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
          }}
        >
          <TrendingUp sx={{ fontSize: 20 }} />
        </Box>
        <Box>
          <Typography
            variant="subtitle1"
            sx={{
              fontWeight: 600,
              color: theme.palette.text.primary,
              mb: 0.5,
            }}
          >
            Rendimiento Semanal
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              fontWeight: 500,
            }}
          >
            Porcentaje de despliegues completados
          </Typography>
        </Box>
      </Box>

      <Box sx={{ height: 'calc(100% - 76px)', minHeight: 300 }}>
        <ReactECharts
          option={option}
          style={{ height: '100%', width: '100%' }}
        />
      </Box>
    </Box>
  );
};
