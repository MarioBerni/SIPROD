'use client';

import { Card, CardContent, Typography, useTheme, alpha } from '@mui/material';
import type { EChartsOption } from 'echarts';
import ReactECharts from 'echarts-for-react';

interface WeeklyChartProps {
  data: Array<{
    day: string;
    percentage: number;
  }>;
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const theme = useTheme();

  const option: EChartsOption = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: theme.palette.background.paper,
      borderRadius: 8,
      borderColor: theme.palette.divider,
      padding: [8, 12],
      textStyle: {
        color: theme.palette.text.primary,
      },
      formatter: (params) => {
        const dataPoint = Array.isArray(params) ? params[0] : params;
        return `${dataPoint.name}<br/>Progreso: ${dataPoint.value}%`;
      }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '3%',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: data.map(item => item.day),
      axisLine: {
        lineStyle: {
          color: alpha(theme.palette.text.primary, 0.2)
        }
      },
      axisLabel: {
        color: theme.palette.text.secondary
      }
    },
    yAxis: {
      type: 'value',
      min: 0,
      max: 100,
      axisLine: {
        lineStyle: {
          color: alpha(theme.palette.text.primary, 0.2)
        }
      },
      axisLabel: {
        color: theme.palette.text.secondary,
        formatter: '{value}%'
      },
      splitLine: {
        lineStyle: {
          color: alpha(theme.palette.text.primary, 0.1)
        }
      }
    },
    series: [
      {
        data: data.map(item => item.percentage),
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {
          color: theme.palette.primary.main,
          width: 3
        },
        itemStyle: {
          color: theme.palette.primary.main,
          borderColor: theme.palette.background.paper,
          borderWidth: 2
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
              color: alpha(theme.palette.primary.main, 0.3)
            }, {
              offset: 1,
              color: alpha(theme.palette.primary.main, 0)
            }]
          }
        }
      }
    ]
  };

  return (
    <Card
      sx={{
        height: '100%',
        minHeight: 400,
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <CardContent sx={{ p: 3, height: '100%' }}>
        <Typography
          variant="h6"
          component="div"
          sx={{
            mb: 2,
            fontWeight: 600,
          }}
        >
          Progreso Semanal
        </Typography>
        <ReactECharts
          option={option}
          style={{ height: 350 }}
          notMerge={true}
          lazyUpdate={true}
          theme="theme_name"
        />
      </CardContent>
    </Card>
  );
}
