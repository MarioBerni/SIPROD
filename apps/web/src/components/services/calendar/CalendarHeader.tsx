'use client';

import { FC } from 'react';
import { Box, Typography, IconButton, useTheme, alpha } from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
} from '@mui/icons-material';

interface CalendarHeaderProps {
  currentMonth: number;
  currentYear: number;
  onNavigate: (direction: 'prev' | 'next') => void;
  monthNames: string[];
}

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  currentMonth,
  currentYear,
  onNavigate,
  monthNames,
}) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1,
        }}
      >
        <CalendarIcon color="primary" />
        {monthNames[currentMonth]} {currentYear}
      </Typography>
      <Box sx={{ display: 'flex', gap: 1 }}>
        <IconButton
          onClick={() => onNavigate('prev')}
          size="small"
          sx={{
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          <ChevronLeftIcon />
        </IconButton>
        <IconButton
          onClick={() => onNavigate('next')}
          size="small"
          sx={{
            color: theme.palette.primary.main,
            '&:hover': {
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
            }
          }}
        >
          <ChevronRightIcon />
        </IconButton>
      </Box>
    </Box>
  );
};
