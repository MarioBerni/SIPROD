'use client';

import { FC } from 'react';
import { Box, Typography, useTheme, alpha } from '@mui/material';
import { CalendarDayProps } from './types';
import { CalendarEventList } from './CalendarEventList';

export const CalendarDay: FC<CalendarDayProps> = ({
  date,
  events,
  isToday,
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

  return (
    <Box
      onClick={handleClick}
      sx={{
        aspectRatio: '1',
        p: 1,
        cursor: onClick ? 'pointer' : 'default',
        borderRadius: 2,
        bgcolor: 'background.default',
        border: '1px solid',
        borderColor: isToday ? 'primary.main' : alpha(theme.palette.divider, 0.1),
        transition: 'all 0.2s ease-in-out',
        '&:hover': onClick ? {
          bgcolor: alpha(theme.palette.primary.main, 0.04),
          borderColor: alpha(theme.palette.primary.main, 0.2),
          transform: 'translateY(-2px)',
        } : {},
      }}
    >
      <Typography
        variant="body2"
        sx={{
          fontWeight: isToday ? 600 : 400,
          color: isToday ? 'primary.main' : 'text.primary',
          textAlign: 'center',
          mb: 1,
        }}
      >
        {date.getDate()}
      </Typography>
      {events.length > 0 && (
        <CalendarEventList events={events} />
      )}
    </Box>
  );
};
