'use client';

import { Box, useTheme } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Service, ServiceType } from '@/data/__mocks__/servicesMock';
import { getServiceColor } from '@/data/__mocks__/servicesMock';
import { getCalendarStyles } from './ServiceCalendar.styles';
import { addDays } from 'date-fns';
import { EventClickArg } from '@fullcalendar/core';

interface ServiceCalendarProps {
  services: Service[];
  onDateClick?: (date: Date) => void;
  onEventClick?: (service: Service) => void;
  onNewService?: () => void;
}

export const ServiceCalendar = ({
  services,
  onDateClick,
  onEventClick,
  onNewService
}: ServiceCalendarProps) => {
  const theme = useTheme();
  const calendarStyles = getCalendarStyles(theme);

  const handleDateClick = (arg: { date: Date }) => {
    onDateClick?.(arg.date);
  };

  const handleEventClick = (info: EventClickArg) => {
    const service = services.find(s => {
      // Para servicios de Jefe de día, el ID incluye el índice del día
      if (s.type === 'JEFE_DIA') {
        return info.event.id.startsWith(s.id.toString());
      }
      // Para otros servicios, comparamos el ID directamente
      return s.id.toString() === info.event.id;
    });
    
    if (service) {
      onEventClick?.(service);
    }
  };

  const getEventTitle = (service: Service): string => {
    const typeLabels: Record<ServiceType, string> = {
      'JEFE_DIA': '👮 Jefe de Día',
      'LICENCIA': '🌴 Licencia',
      'CURSO': '📚 Curso',
      '222': '🎯 Control 222'
    };
    return `${typeLabels[service.type]} - ${service.title}`;
  };

  const customButtons = {
    newService: {
      text: 'Nuevo Servicio',
      click: onNewService,
      html: `
        <span style="display: flex; align-items: center; justify-content: center; gap: 8px;">
          <svg style="width: 20px; height: 20px; fill: currentColor;" viewBox="0 0 24 24">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
          <span>Nuevo Servicio</span>
        </span>
      `
    }
  };

  const events = services.flatMap(service => {
    const baseEventProps = {
      id: service.id.toString(),
      title: getEventTitle(service),
      backgroundColor: getServiceColor(service),
      borderColor: getServiceColor(service),
      textColor: theme.palette.getContrastText(getServiceColor(service)),
      extendedProps: { service }
    };

    // Para servicios de Jefe de día, cada día es un evento independiente
    if (service.type === 'JEFE_DIA' && service.selectedDates && service.selectedDates.length > 0) {
      return service.selectedDates.map((date: Date, index: number) => ({
        ...baseEventProps,
        id: `${service.id}-${index}`,
        start: date,
        end: addDays(date, 1),
        allDay: true,
        display: 'block',
      }));
    }
    
    // Para Control 222, mostrar como evento puntual
    if (service.type === '222') {
      return [{
        ...baseEventProps,
        start: service.startDate,
        end: service.endDate,
        allDay: false,
        display: 'block',
      }];
    }
    
    // Para Licencias y Cursos, mostrar como período completo
    if (service.type === 'LICENCIA' || service.type === 'CURSO') {
      return [{
        ...baseEventProps,
        start: service.startDate,
        end: addDays(service.endDate, 1),
        allDay: true,
        display: 'block',
      }];
    }

    return [];
  });

  return (
    <Box sx={{ width: '100%', ...calendarStyles }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        locale={esLocale}
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        headerToolbar={{
          left: 'prev,next today newService',
          center: 'title',
          right: 'dayGridMonth'
        }}
        customButtons={customButtons}
        buttonText={{
          today: 'Hoy'
        }}
        dayMaxEventRows={3}
        moreLinkContent={(args) => `+${args.num} más`}
        eventTimeFormat={{
          hour: '2-digit',
          minute: '2-digit',
          meridiem: false,
          hour12: false
        }}
        firstDay={1}
        height="auto"
        expandRows={true}
        handleWindowResize={true}
        stickyHeaderDates={true}
        slotMinTime="00:00:00"
        slotMaxTime="24:00:00"
      />
    </Box>
  );
};
