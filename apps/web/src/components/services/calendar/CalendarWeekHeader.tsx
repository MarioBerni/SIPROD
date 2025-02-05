'use client';

import { FC } from 'react';
import { TableCell, TableRow, Typography, useTheme, alpha } from '@mui/material';

interface CalendarWeekHeaderProps {
  daysOfWeek: string[];
}

export const CalendarWeekHeader: FC<CalendarWeekHeaderProps> = ({ daysOfWeek }) => {
  const theme = useTheme();

  return (
    <TableRow>
      {daysOfWeek.map((day) => (
        <TableCell
          key={day}
          align="center"
          sx={{
            py: 1.5,
            px: { xs: 0.5, sm: 1 },
            fontWeight: 'bold',
            backgroundColor: alpha(theme.palette.primary.main, 0.1),
            color: theme.palette.primary.main,
            textAlign: 'center',
            width: '14.28%',
            '& .MuiTypography-root': {
              width: '100%',
              display: 'block',
              fontSize: {
                xs: '0.7rem',
                sm: '0.875rem'
              },
              letterSpacing: {
                xs: '-0.02em',
                sm: 'normal'
              }
            }
          }}
        >
          <Typography 
            variant="subtitle2" 
            noWrap
            sx={{
              minWidth: 0,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              fontWeight: 'bold',
            }}
          >
            {day}
          </Typography>
        </TableCell>
      ))}
    </TableRow>
  );
};
