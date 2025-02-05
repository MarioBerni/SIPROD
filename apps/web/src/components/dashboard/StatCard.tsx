'use client';

import { FC } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface StatCardProps {
  title: string;
  value: string;
  icon: string;
  trend: string;
  trendLabel: string;
}

export const StatCard: FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  trendLabel,
}) => {
  const theme = useTheme();
  const isTrendUp = trend.startsWith('+');

  return (
    <Box
      sx={{
        p: 2.5,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: theme.shadows[1],
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 4px 20px ${alpha(theme.palette.primary.main, 0.15)}`,
        },
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
        <Box
          sx={{
            width: 48,
            height: 48,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1.5,
            bgcolor: alpha(theme.palette.primary.main, 0.12),
            color: theme.palette.primary.main,
            fontSize: '24px',
          }}
        >
          {icon}
        </Box>
        <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
          {title}
        </Typography>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1, mb: 1 }}>
        <Typography variant="h4" sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1 }}>
          {value}
        </Typography>
      </Box>

      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 0.5,
          color: isTrendUp ? 'success.main' : 'error.main',
        }}
      >
        {isTrendUp ? (
          <TrendingUp sx={{ fontSize: 20 }} />
        ) : (
          <TrendingDown sx={{ fontSize: 20 }} />
        )}
        <Typography
          variant="body2"
          sx={{
            fontWeight: 600,
          }}
        >
          {trend}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            ml: 1,
          }}
        >
          {trendLabel}
        </Typography>
      </Box>
    </Box>
  );
};
