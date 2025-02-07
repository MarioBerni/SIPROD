'use client';

import { FC, useState, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { isToday as dateFnsIsToday } from 'date-fns';
import { useCalendarEvents } from './dialog/hooks/useCalendarEvents';
import { CalendarHeader } from './calendar/CalendarHeader';
import { CalendarDay } from './calendar/CalendarDay';
import { ServiceDayDialog } from './dialog/ServiceDayDialog';
import { CalendarEvent as CalendarEventType } from './calendar/types';

interface ServiceCalendarProps {
  initialMonth?: number;
  initialYear?: number;
}

const monthNames = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
];

export const ServiceCalendar: FC<ServiceCalendarProps> = ({
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear(),
}) => {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  
  const { events: rawEvents } = useCalendarEvents();
  
  const events = useMemo<CalendarEventType[]>(() => 
    rawEvents.map(event => ({
      id: `${event.type}-${event.startDate.getTime()}`,
      type: event.type,
      title: event.type,
      startDate: event.startDate,
      icon: event.icon
    }))
  , [rawEvents]);

  const handleNavigate = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    } else {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    }
  };

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayIndex = firstDay.getDay();
    const daysInMonth = lastDay.getDate();

    const calendar: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    // Días vacíos antes del primer día del mes
    for (let i = 0; i < startingDayIndex; i++) {
      currentWeek.push(null);
    }

    // Días del mes
    for (let day = 1; day <= daysInMonth; day++) {
      if (currentWeek.length === 7) {
        calendar.push(currentWeek);
        currentWeek = [];
      }
      currentWeek.push(new Date(currentYear, currentMonth, day));
    }

    // Días vacíos después del último día del mes
    while (currentWeek.length < 7) {
      currentWeek.push(null);
    }
    calendar.push(currentWeek);

    return calendar;
  };

  return (
    <Box sx={{ width: '100%', p: 2 }}>
      <CalendarHeader
        currentMonth={currentMonth}
        currentYear={currentYear}
        onNavigate={handleNavigate}
        monthNames={monthNames}
      />
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
          mt: 2,
        }}
      >
        {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
          <Typography
            key={day}
            variant="subtitle2"
            sx={{
              textAlign: 'center',
              fontWeight: 600,
              color: 'text.secondary',
              py: 1,
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
        }}
      >
        {generateCalendar().flat().map((date, index) => {
          const eventsForDate = date 
            ? events.filter(event => 
                event.startDate.getFullYear() === date.getFullYear() &&
                event.startDate.getMonth() === date.getMonth() &&
                event.startDate.getDate() === date.getDate()
              )
            : [];
            
          return (
            <CalendarDay
              key={index}
              day={date}
              isToday={date ? dateFnsIsToday(date) : false}
              events={eventsForDate}
              onClick={date ? handleDateClick : () => {}}
            />
          );
        })}
      </Box>
      
      {selectedDate && (
        <ServiceDayDialog
          open={Boolean(selectedDate)}
          onClose={() => setSelectedDate(null)}
          date={selectedDate}
        />
      )}
    </Box>
  );
};
