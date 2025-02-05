'use client';

import { FC } from 'react';
import { Box, Typography, useTheme, alpha, Chip } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarDayProps } from './types';

export const CalendarDay: FC<CalendarDayProps> = ({
  date,
  events,
  isToday,
  isSelected,
  onClick,
}) => {
  const theme = useTheme();

  if (!date) {
    return (
      <Box
        sx={{
          aspectRatio: '1',
          bgcolor: alpha(theme.palette.divider, 0.05),
          borderRadius: 2,
        }}
      />
    );
  }

  const handleClick = () => {
    if (onClick && date) {
      onClick(date);
    }
  };

  // Mostrar el primer evento del día

  return (
    <Box
      onClick={handleClick}
      sx={{
        aspectRatio: '1',
        p: 1,
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 2,
        bgcolor: isSelected ? alpha(theme.palette.primary.main, 0.08) : 'background.default',
        border: '1px solid',
        borderColor: isToday
          ? 'primary.main'
          : isSelected
          ? alpha(theme.palette.primary.main, 0.2)
          : alpha(theme.palette.divider, 0.1),
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
        position: 'relative',
        '&:hover': onClick
          ? {
              bgcolor: alpha(theme.palette.primary.main, 0.04),
              borderColor: alpha(theme.palette.primary.main, 0.2),
            }
          : {},
      }}
    >
      <Typography
        variant="caption"
        sx={{
          fontWeight: isToday ? 600 : 400,
          color: isToday ? 'primary.main' : 'text.primary',
        }}
      >
        {format(date, 'd', { locale: es })}
      </Typography>

      {events.length > 0 && (
        <Box sx={{ mt: 'auto' }}>
          <Chip
            size="small"
            label={`${events.length} asignación${events.length > 1 ? 'es' : ''}`}
            sx={{
              height: 20,
              fontSize: '0.75rem',
              bgcolor: alpha(theme.palette.primary.main, 0.1),
              color: 'primary.main',
              '& .MuiChip-label': {
                px: 1,
              },
            }}
          />
        </Box>
      )}
    </Box>
  );
};
