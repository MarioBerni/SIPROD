'use client';

import { FC } from 'react';
import { Box, Typography, useTheme, alpha, Tooltip } from '@mui/material';
import { CalendarEvent } from './types';

interface CalendarEventListProps {
  events: CalendarEvent[];
}

export const CalendarEventList: FC<CalendarEventListProps> = ({ events }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'flex',
        gap: 0.5,
        flexWrap: 'wrap',
        justifyContent: 'center',
        width: '100%',
      }}
    >
      {events.map((event) => {
        const EventIcon = event.icon;
        const bgColor = (() => {
          switch (event.type) {
            case 'licencia':
              return alpha(theme.palette.error.main, 0.1);
            case 'cursos':
              return alpha(theme.palette.info.main, 0.1);
            case 'jefeDia':
              return alpha(theme.palette.warning.main, 0.1);
            case 'control222':
              return alpha(theme.palette.success.main, 0.1);
            default:
              return alpha(theme.palette.primary.main, 0.1);
          }
        })();

        const iconColor = (() => {
          switch (event.type) {
            case 'licencia':
              return theme.palette.error.main;
            case 'cursos':
              return theme.palette.info.main;
            case 'jefeDia':
              return theme.palette.warning.main;
            case 'control222':
              return theme.palette.success.main;
            default:
              return theme.palette.primary.main;
          }
        })();

        return (
          <Tooltip
            key={event.id}
            title={
              <Box sx={{ p: 0.5 }}>
                <Typography variant="subtitle2">{event.title}</Typography>
                {event.description && (
                  <Typography variant="caption" sx={{ display: 'block', mt: 0.5 }}>
                    {event.description}
                  </Typography>
                )}
              </Box>
            }
            arrow
          >
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                p: 0.5,
                borderRadius: 1,
                bgcolor: bgColor,
                color: iconColor,
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'scale(1.1)',
                },
              }}
            >
              <EventIcon sx={{ fontSize: 18 }} />
            </Box>
          </Tooltip>
        );
      })}
    </Box>
  );
};
