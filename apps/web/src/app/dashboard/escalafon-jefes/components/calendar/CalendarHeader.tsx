'use client';

import { FC } from 'react';
import { Box, Typography, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface CalendarHeaderProps {
  currentMonth: number;
  currentYear: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const CalendarHeader: FC<CalendarHeaderProps> = ({
  currentMonth,
  currentYear,
  onNavigate,
}) => {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        mb: 2,
      }}
    >
      <IconButton
        onClick={() => onNavigate('prev')}
        size="small"
        sx={{ 
          color: 'primary.main',
          '&:hover': {
            bgcolor: 'rgba(21, 101, 192, 0.04)',
          },
          p: 1,
        }}
      >
        <ChevronLeft />
      </IconButton>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          letterSpacing: 0.5,
        }}
      >
        {`${MONTH_NAMES[currentMonth]} ${currentYear}`}
      </Typography>
      <IconButton
        onClick={() => onNavigate('next')}
        size="small"
        sx={{ 
          color: 'primary.main',
          '&:hover': {
            bgcolor: 'rgba(21, 101, 192, 0.04)',
          },
          p: 1,
        }}
      >
        <ChevronRight />
      </IconButton>
    </Box>
  );
};
