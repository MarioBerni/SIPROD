import { useMemo } from 'react';
import {
  Assignment as LicenciaIcon,
  School as CursosIcon,
  SupervisorAccount as JefeDiaIcon,
  LocalPolice as ControlIcon,
} from '@mui/icons-material';
import { CalendarEvent, ServiceType } from '../calendar/types';

type EventsMap = {
  [key: string]: CalendarEvent[];
};

export function useCalendarEvents() {
  // Datos de ejemplo para el calendario
  const mockEvents = useMemo<EventsMap>(() => {
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    return {
      // Licencias
      [`${year}-${month + 1}-5`]: [{
        id: '1',
        type: 'licencia' as ServiceType,
        title: 'Licencia Anual',
        description: 'Licencia por vacaciones',
        icon: LicenciaIcon,
      }],
      // Cursos
      [`${year}-${month + 1}-10`]: [{
        id: '2',
        type: 'cursos' as ServiceType,
        title: 'Curso Táctico',
        description: 'Entrenamiento especial',
        icon: CursosIcon,
      }],
      // Jefe de Día
      [`${year}-${month + 1}-15`]: [{
        id: '3',
        type: 'jefeDia' as ServiceType,
        title: 'Jefe de Día',
        description: 'Turno como jefe de día',
        icon: JefeDiaIcon,
      }],
      // Control 222
      [`${year}-${month + 1}-20`]: [{
        id: '4',
        type: 'control222' as ServiceType,
        title: 'Control 222',
        description: 'Servicio de control',
        icon: ControlIcon,
      }],
      // Día con múltiples eventos
      [`${year}-${month + 1}-25`]: [
        {
          id: '5',
          type: 'licencia' as ServiceType,
          title: 'Licencia Médica',
          description: 'Control médico programado',
          icon: LicenciaIcon,
        },
        {
          id: '6',
          type: 'cursos' as ServiceType,
          title: 'Capacitación',
          description: 'Actualización procedimientos',
          icon: CursosIcon,
        },
      ],
    };
  }, []);

  const getEventsForDate = (date: Date): CalendarEvent[] => {
    const key = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    return mockEvents[key] || [];
  };

  return {
    getEventsForDate,
  };
}
