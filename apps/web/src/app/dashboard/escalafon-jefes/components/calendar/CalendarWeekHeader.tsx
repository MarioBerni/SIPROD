'use client';

import { Box, Typography } from '@mui/material';

const weekDays = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

export function CalendarWeekHeader() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'repeat(7, 1fr)',
        gap: 1,
        mb: 1,
        px: 1,
      }}
    >
      {weekDays.map((day) => (
        <Typography
          key={day}
          variant="subtitle2"
          sx={{
            textAlign: 'center',
            color: 'text.secondary',
            fontWeight: 600,
            fontSize: '0.75rem',
          }}
        >
          {day}
        </Typography>
      ))}
    </Box>
  );
}
