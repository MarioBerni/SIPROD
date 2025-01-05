'use client';

import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  useTheme, 
  alpha 
} from '@mui/material';
import { 
  CheckCircle as CheckCircleIcon, 
  Warning as WarningIcon, 
  Block as BlockIcon 
} from '@mui/icons-material';

interface ProgressData {
  label: string;
  value: number;
  total: number;
  color: string;
  icon: typeof CheckCircleIcon | typeof WarningIcon | typeof BlockIcon;
}

interface ProgressSectionProps {
  data: {
    cargados: ProgressData;
    sinEfecto: ProgressData;
    libres: ProgressData;
  };
}

export function ProgressSection({ data }: ProgressSectionProps) {
  const theme = useTheme();

  const renderProgressBar = (progressData: ProgressData) => {
    const percentage = (progressData.value / progressData.total) * 100;
    const Icon = progressData.icon;

    return (
      <Box sx={{ mb: 3, '&:last-child': { mb: 0 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              flex: 1,
            }}
          >
            <Icon
              sx={{
                color: progressData.color,
                fontSize: '1.25rem',
              }}
            />
            <Typography
              variant="body1"
              sx={{
                fontWeight: 500,
                color: theme.palette.text.primary,
              }}
            >
              {progressData.label}
            </Typography>
          </Box>
          <Typography
            variant="body2"
            sx={{
              color: theme.palette.text.secondary,
              ml: 2,
            }}
          >
            {progressData.value} de {progressData.total}
          </Typography>
        </Box>
        <Box sx={{ position: 'relative' }}>
          <Box 
            sx={{ 
              height: 24, 
              backgroundColor: alpha(progressData.color, 0.12), 
              borderRadius: 2,
              overflow: 'hidden',
              position: 'relative',
            }}
          >
            <Box
              sx={{
                height: '100%',
                width: `${percentage}%`,
                backgroundColor: progressData.color,
                borderRadius: 2,
                transition: 'width 0.5s ease-in-out',
              }}
            />
            <Typography
              variant="body2"
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
                color: progressData.label === 'Despliegues Cargados' ? 'white' : progressData.color,
                fontWeight: 600,
                width: '100%',
                textAlign: 'center',
                textShadow: progressData.label === 'Despliegues Cargados' 
                  ? '0 0 4px rgba(0,0,0,0.2)'
                  : '0 0 4px rgba(255,255,255,0.7)',
              }}
            >
              {Math.round(percentage)}%
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Card
      sx={{
        height: '100%',
        backgroundColor: alpha(theme.palette.background.paper, 0.9),
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Typography
          variant="h6"
          sx={{
            fontSize: { xs: '1rem', sm: '1.1rem' },
            fontWeight: 600,
            mb: 4,
          }}
        >
          Progreso de Despliegues
        </Typography>
        {renderProgressBar(data.cargados)}
        {renderProgressBar(data.sinEfecto)}
        {renderProgressBar(data.libres)}
      </CardContent>
    </Card>
  );
}
