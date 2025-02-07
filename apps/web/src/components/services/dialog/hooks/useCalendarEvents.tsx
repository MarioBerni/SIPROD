'use client';

import { useMemo } from 'react';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import { SvgIconComponent } from '@mui/icons-material';

export interface CalendarEvent {
  startDate: Date;
  endDate: Date;
  type: 'licencia' | 'cursos' | 'jefeDia' | 'control222';
  icon: SvgIconComponent;
}

export const useCalendarEvents = () => {
  const events = useMemo<CalendarEvent[]>(() => {
    const createEvent = (start: string, end: string, type: CalendarEvent['type']): CalendarEvent => ({
      startDate: new Date(start),
      endDate: new Date(end),
      type,
      icon: {
        licencia: AssignmentIcon,
        cursos: SchoolIcon,
        jefeDia: SupervisorAccountIcon,
        control222: LocalPoliceIcon,
      }[type],
    });

    return [
      // Licencia
      createEvent('2025-02-21', '2025-02-25', 'licencia'),
      // Cursos
      createEvent('2025-02-07', '2025-02-12', 'cursos'),
      // Jefe Día (eventos individuales)
      createEvent('2025-02-07', '2025-02-07', 'jefeDia'),
      createEvent('2025-02-10', '2025-02-10', 'jefeDia'),
      createEvent('2025-02-20', '2025-02-20', 'jefeDia'),
      // Control
      createEvent('2025-02-17', '2025-02-27', 'control222'),
    ];
  }, []);

  const getEventsForDate = (date: Date) => {
    return events.filter(event => {
      const eventStart = new Date(event.startDate);
      const eventEnd = new Date(event.endDate);
      eventStart.setHours(0, 0, 0, 0);
      eventEnd.setHours(23, 59, 59, 999);
      date.setHours(12, 0, 0, 0);
      
      return date >= eventStart && date <= eventEnd;
    });
  };

  return {
    events,
    getEventsForDate,
  };
};
