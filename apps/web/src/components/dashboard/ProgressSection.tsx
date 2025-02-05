'use client';

import { FC } from 'react';
import { 
  Box, 
  Typography, 
  LinearProgress, 
  useTheme, 
  alpha 
} from '@mui/material';

interface ProgressData {
  label: string;
  value: number;
}

interface ProgressSectionProps {
  data: ProgressData[];
}

export const ProgressSection: FC<ProgressSectionProps> = ({ data }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: theme.shadows[1],
        height: '100%',
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 3,
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
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
            fontSize: '20px',
          }}
        >
          📊
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          Métricas de Progreso
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
        {data.map((item, index) => (
          <Box key={index}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                mb: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                {item.label}
              </Typography>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                {item.value}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={item.value}
              sx={{
                height: 8,
                borderRadius: 1,
                bgcolor: alpha(theme.palette.primary.main, 0.12),
                '& .MuiLinearProgress-bar': {
                  borderRadius: 1,
                  bgcolor: theme.palette.primary.main,
                },
              }}
            />
          </Box>
        ))}
      </Box>
    </Box>
  );
};
