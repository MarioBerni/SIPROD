'use client';

import { FC } from 'react';
import { TableCell, Box, Typography, useTheme, Stack } from '@mui/material';
import { CalendarEvent } from './types';

interface CalendarDayProps {
  day: Date | null;
  isToday: boolean;
  events?: CalendarEvent[];
  onClick: (date: Date) => void;
}

export const CalendarDay: FC<CalendarDayProps> = ({ 
  day, 
  isToday, 
  events = [], 
  onClick 
}) => {
  const theme = useTheme();

  if (!day) {
    return (
      <TableCell
        sx={{
          height: '5rem',
          backgroundColor: 'transparent',
          position: 'relative',
          p: 0.5,
          border: `1px solid ${theme.palette.divider}`,
        }}
      />
    );
  }

  const dayNumber = day.getDate();

  return (
    <TableCell
      align="center"
      onClick={() => onClick(day)}
      sx={{
        height: '5rem',
        cursor: 'pointer',
        backgroundColor: 'transparent',
        position: 'relative',
        border: `1px solid ${theme.palette.divider}`,
        '&:hover': {
          backgroundColor: theme.palette.action.hover,
        },
        ...(isToday && {
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '4px',
            right: '4px',
            width: '4px',
            height: '4px',
            borderRadius: '50%',
            backgroundColor: theme.palette.primary.main,
          },
        }),
      }}
    >
      <Box 
        sx={{ 
          height: '100%', 
          display: 'flex', 
          flexDirection: 'column',
          alignItems: 'center',
          p: 0.5,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            fontWeight: isToday ? 600 : 400,
            color: isToday ? theme.palette.primary.main : theme.palette.text.primary,
            mb: events.length > 0 ? 0.5 : 0,
          }}
        >
          {dayNumber}
        </Typography>
        {events.length > 0 && (
          <Stack
            direction="row"
            spacing={0.5}
            flexWrap="wrap"
            justifyContent="center"
            alignItems="center"
            sx={{ 
              mt: 'auto',
              gap: 0.5,
              maxWidth: '100%',
            }}
          >
            {events.map((event, index) => {
              const Icon = event.icon;
              return (
                <Icon
                  key={`${event.type}-${index}`}
                  sx={{
                    fontSize: '1rem',
                    color: theme.palette.primary.main,
                  }}
                />
              );
            })}
          </Stack>
        )}
      </Box>
    </TableCell>
  );
};
