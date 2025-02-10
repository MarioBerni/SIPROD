'use client';

import { Box, useTheme } from '@mui/material';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin, { DateClickArg } from '@fullcalendar/interaction';
import esLocale from '@fullcalendar/core/locales/es';
import { Assignment, Officer } from '@/app/dashboard/escalafon-jefes/types';
import { getCalendarStyles } from './ChiefRankCalendar.styles';
import { addDays } from 'date-fns';
import { EventClickArg, EventContentArg } from '@fullcalendar/core';
import { UNIT_COLORS } from '@/constants/colors';
import { formatOfficerName } from '@/utils/gradeUtils';

interface ChiefRankCalendarProps {
  shifts: Assignment[];
  officers: Officer[];
  onEventClick?: (shift: Assignment) => void;
  onAddShift: (date: Date, existingAssignments: Assignment[]) => void;
  onShiftSelect: (shift: Assignment) => void;
}

export const ChiefRankCalendar = ({
  shifts,
  officers,
  onEventClick,
  onAddShift,
  onShiftSelect
}: ChiefRankCalendarProps) => {
  const theme = useTheme();
  const calendarStyles = getCalendarStyles(theme);

  const handleEventClick = (info: EventClickArg) => {
    const shift = shifts.find(s => s.id.toString() === info.event.id);
    if (shift && onEventClick) {
      onEventClick(shift);
    }
    if (shift) {
      onShiftSelect(shift);
    }
  };

  const handleDateClick = (arg: DateClickArg) => {
    // Obtener las asignaciones existentes para la fecha seleccionada
    const dateAssignments = shifts.filter(
      shift => shift.date.toISOString().split('T')[0] === arg.date.toISOString().split('T')[0]
    );
    
    // Llamamos a onAddShift con la fecha y las asignaciones existentes
    onAddShift(arg.date, dateAssignments);
  };

  const getEventTitle = (shift: Assignment): string => {
    const officer = officers.find(o => o.id === shift.officerId);
    if (!officer) return 'Sin asignar';
    
    return formatOfficerName(officer.grado, officer.nombre, officer.apellido);
  };

  const getEventStyle = (assignment: Assignment) => {
    const unitColor = UNIT_COLORS[assignment.type] || { bg: '#e0e0e0', text: '#000000' };
    return {
      backgroundColor: unitColor.bg,
      borderColor: unitColor.bg,
      color: unitColor.text,
      padding: '4px 8px',
      margin: '2px 0',
      borderRadius: '4px',
      cursor: 'pointer',
      '&:hover': {
        filter: 'brightness(0.9)'
      }
    };
  };

  const events = shifts.map(shift => ({
    id: shift.id.toString(),
    title: getEventTitle(shift),
    start: shift.date,
    end: addDays(new Date(shift.date), 1),
    allDay: true,
    display: 'block',
    backgroundColor: UNIT_COLORS[shift.type]?.bg || '#e0e0e0',
    borderColor: UNIT_COLORS[shift.type]?.bg || '#e0e0e0',
    textColor: UNIT_COLORS[shift.type]?.text || '#000000',
    extendedProps: { 
      shift,
      style: getEventStyle(shift)
    }
  }));

  return (
    <Box sx={{ width: '100%', ...calendarStyles }}>
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        eventClick={handleEventClick}
        dateClick={handleDateClick}
        eventContent={(eventInfo: EventContentArg) => (
          <Box sx={eventInfo.event.extendedProps.style}>
            {eventInfo.event.title}
          </Box>
        )}
        headerToolbar={{
          left: 'prev,next today',
          center: 'title',
          right: '',
        }}
        locale={esLocale}
        dayMaxEventRows={3}
        moreLinkContent={(args) => `+${args.num} más`}
        height="auto"
        expandRows={true}
        handleWindowResize={true}
        stickyHeaderDates={true}
      />
    </Box>
  );
};
