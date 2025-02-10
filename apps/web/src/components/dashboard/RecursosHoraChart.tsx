import { Box, Card, CardContent, Typography, useTheme } from '@mui/material';
import { Timeline as TimelineIcon } from '@mui/icons-material';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface RecursoData {
  hora: string;
  moviles: number;
  motos: number;
  hipo: number;
  efectivos: number;
}

interface RecursosHoraChartProps {
  data?: RecursoData[];
  error?: string;
}

export const RecursosHoraChart = ({ data = [], error }: RecursosHoraChartProps) => {
  const theme = useTheme();

  if (error) {
    return (
      <Card sx={{ height: '100%', boxShadow: 2 }}>
        <CardContent>
          <Typography color="error">{error}</Typography>
        </CardContent>
      </Card>
    );
  }

  // Datos de ejemplo con número de efectivos entre 0 y 400
  const defaultData = [
    { hora: '00:00', efectivos: 280 },
    { hora: '02:00', efectivos: 350 },
    { hora: '04:00', efectivos: 250 },
    { hora: '06:00', efectivos: 240 },
    { hora: '08:00', efectivos: 320 },
    { hora: '10:00', efectivos: 260 },
    { hora: '12:00', efectivos: 340 },
    { hora: '14:00', efectivos: 290 },
    { hora: '16:00', efectivos: 310 },
    { hora: '18:00', efectivos: 380 },
    { hora: '20:00', efectivos: 270 },
    { hora: '22:00', efectivos: 300 }
  ];

  // Usar datos proporcionados o datos por defecto
  const chartData = data.length > 0 ? data : defaultData;

  const chartDataConfig: ChartData<'line'> = {
    labels: chartData.map(item => item.hora),
    datasets: [
      {
        label: 'Efectivos',
        data: chartData.map(item => item.efectivos),
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
        fill: false,
        borderWidth: 3,
        pointRadius: 5,
        pointHoverRadius: 7,
        pointBackgroundColor: '#fff',
        pointBorderColor: theme.palette.primary.main,
        pointBorderWidth: 2.5,
        tension: 0.35
      }
    ]
  };

  const chartOptions: ChartOptions<'line'> = {
    responsive: true,
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 15,
        right: 25,
        top: 25,
        bottom: 15
      }
    },
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        backgroundColor: '#fff',
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.secondary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        padding: 12,
        displayColors: false,
        titleFont: {
          size: 13,
          weight: 600
        },
        bodyFont: {
          size: 12
        },
        callbacks: {
          title: function(context) {
            return `Hora: ${context[0].label}`;
          },
          label: function(context) {
            return `Efectivos: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          color: theme.palette.divider,
          display: true,
          drawOnChartArea: true
        },
        border: {
          display: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          maxRotation: 45,
          minRotation: 45,
          autoSkip: true,
          maxTicksLimit: 12,
          padding: 8,
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: theme.palette.divider,
          display: true,
          drawOnChartArea: true
        },
        border: {
          display: false
        },
        ticks: {
          color: theme.palette.text.secondary,
          stepSize: 50,
          padding: 8,
          font: {
            size: 11
          }
        },
        min: 0,
        max: 400,
        beginAtZero: true
      }
    },
    elements: {
      line: {
        tension: 0.35,
        borderWidth: 3,
        borderColor: theme.palette.primary.main
      },
      point: {
        radius: 5,
        hoverRadius: 7,
        backgroundColor: '#fff',
        borderWidth: 2.5
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <Card sx={{ height: '100%', minHeight: '400px', boxShadow: 2 }}>
      <CardContent sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        p: 3,
        pb: 3
      }}>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 3 
        }}>
          <TimelineIcon sx={{ mr: 1 }} />
          <Typography variant="h6" component="div">
            Efectivos por Hora
          </Typography>
        </Box>
        <Box sx={{ 
          flexGrow: 1, 
          minHeight: 300,
          width: '100%',
          position: 'relative'
        }}>
          <Line options={chartOptions} data={chartDataConfig} />
        </Box>
      </CardContent>
    </Card>
  );
};
