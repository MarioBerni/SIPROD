'use client';

import { FC, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { ServiceDayDialog } from './dialog/ServiceDayDialog';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { CalendarHeader } from './calendar/CalendarHeaderNew';
import { CalendarDay } from './calendar/CalendarDayNew';

interface ServiceCalendarProps {
  initialMonth?: number;
  initialYear?: number;
}

export const ServiceCalendar: FC<ServiceCalendarProps> = ({
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear()
}) => {
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [currentYear, setCurrentYear] = useState(initialYear);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const { getEventsForDate } = useCalendarEvents();

  const handleNavigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'next') {
      if (currentMonth === 11) {
        setCurrentMonth(0);
        setCurrentYear(currentYear + 1);
      } else {
        setCurrentMonth(currentMonth + 1);
      }
    } else {
      if (currentMonth === 0) {
        setCurrentMonth(11);
        setCurrentYear(currentYear - 1);
      } else {
        setCurrentMonth(currentMonth - 1);
      }
    }
  };

  const generateCalendar = () => {
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const totalDays = lastDay.getDate();
    const weeks: (Date | null)[][] = [];
    let currentWeek: (Date | null)[] = [];

    // Agregar días vacíos al principio
    for (let i = 0; i < startingDayOfWeek; i++) {
      currentWeek.push(null);
    }

    // Agregar los días del mes
    for (let day = 1; day <= totalDays; day++) {
      currentWeek.push(new Date(currentYear, currentMonth, day));
      if (currentWeek.length === 7) {
        weeks.push(currentWeek);
        currentWeek = [];
      }
    }

    // Completar la última semana si es necesario
    if (currentWeek.length > 0) {
      while (currentWeek.length < 7) {
        currentWeek.push(null);
      }
      weeks.push(currentWeek);
    }

    return weeks;
  };

  const handleDayClick = (date: Date) => {
    setSelectedDate(date);
    setDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setDialogOpen(false);
    setSelectedDate(undefined);
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Box sx={{ mb: 2 }}>
        <CalendarHeader
          currentMonth={currentMonth}
          currentYear={currentYear}
          onNavigate={handleNavigateMonth}
        />
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
          mb: 1,
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
          const events = date ? getEventsForDate(date) : [];
          return (
            <CalendarDay
              key={index}
              date={date}
              events={events}
              onClick={date ? (clickedDate: Date) => handleDayClick(clickedDate) : undefined}
            />
          );
        })}
      </Box>

      {selectedDate && (
        <ServiceDayDialog
          open={dialogOpen}
          onClose={handleCloseDialog}
          date={selectedDate}
          events={getEventsForDate(selectedDate)}
        />
      )}
    </Box>
  );
};
