'use client';

import { Box, Typography, Divider, alpha } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarEvent } from './types';
import { Assignment as AssignmentIcon } from '@mui/icons-material';

interface CalendarEventListProps {
  date: Date;
  events: CalendarEvent[];
}

export function CalendarEventList({ date, events }: CalendarEventListProps) {
  return (
    <Box>
      <Typography
        variant="subtitle1"
        sx={{
          fontWeight: 600,
          color: 'text.primary',
          mb: 2,
        }}
      >
        {format(date, "EEEE d 'de' MMMM", { locale: es })}
      </Typography>
      {events.length === 0 ? (
        <Typography
          variant="body2"
          sx={{
            color: 'text.secondary',
            textAlign: 'center',
            py: 2,
          }}
        >
          No hay asignaciones para este día
        </Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {events.map((event) => {
            const EventIcon = event.icon || AssignmentIcon;
            return (
              <Box key={event.id}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                  }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: 32,
                      height: 32,
                      borderRadius: 1,
                      bgcolor: alpha('#1565C0', 0.08),
                    }}
                  >
                    <EventIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                  </Box>
                  <Box>
                    <Typography
                      variant="subtitle2"
                      sx={{ fontWeight: 600, color: 'text.primary' }}
                    >
                      {event.title}
                    </Typography>
                    {event.officerName && (
                      <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                        {event.officerName}
                      </Typography>
                    )}
                  </Box>
                </Box>
                {event.description && (
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      pl: 5,
                      mb: 1,
                    }}
                  >
                    {event.description}
                  </Typography>
                )}
                <Divider sx={{ mt: 1 }} />
              </Box>
            );
          })}
        </Box>
      )}
    </Box>
  );
}
