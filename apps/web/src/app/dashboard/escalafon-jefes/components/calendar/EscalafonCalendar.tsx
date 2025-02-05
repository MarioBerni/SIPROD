'use client';

import { FC, useState } from 'react';
import { Box, Grid, IconButton } from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { CalendarHeader } from './CalendarHeader';
import { CalendarDay } from './CalendarDay';
import { CalendarEvent } from './types';
import { addMonths, getDaysInMonth, startOfMonth } from 'date-fns';

interface EscalafonCalendarProps {
  events: CalendarEvent[];
  selectedDate: Date | null;
  onDateSelect?: (date: Date) => void;
  initialMonth?: number;
  initialYear?: number;
}

export const EscalafonCalendar: FC<EscalafonCalendarProps> = ({
  events = [],
  selectedDate = null,
  onDateSelect,
  initialMonth = new Date().getMonth(),
  initialYear = new Date().getFullYear(),
}) => {
  const [currentDate, setCurrentDate] = useState(new Date(initialYear, initialMonth));

  const handlePrevMonth = () => {
    setCurrentDate(prev => addMonths(prev, -1));
  };

  const handleNextMonth = () => {
    setCurrentDate(prev => addMonths(prev, 1));
  };

  const firstDayOfMonth = startOfMonth(currentDate);
  const startingDayIndex = firstDayOfMonth.getDay();
  const daysInMonth = getDaysInMonth(currentDate);
  const totalDays = startingDayIndex + daysInMonth;
  const totalWeeks = Math.ceil(totalDays / 7);

  const days = Array.from({ length: totalWeeks * 7 }, (_, index) => {
    const dayNumber = index - startingDayIndex + 1;
    if (dayNumber < 1 || dayNumber > daysInMonth) return null;
    return new Date(currentDate.getFullYear(), currentDate.getMonth(), dayNumber);
  });

  const getEventsForDate = (date: Date | null) => {
    if (!date) return [];
    return events.filter(event => {
      const eventDate = new Date(event.start);
      return (
        eventDate.getDate() === date.getDate() &&
        eventDate.getMonth() === date.getMonth() &&
        eventDate.getFullYear() === date.getFullYear()
      );
    });
  };

  return (
    <Box 
      sx={{ 
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: '100%',
        overflow: 'hidden'
      }}
    >
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        mb: 2,
        px: 1
      }}>
        <IconButton onClick={handlePrevMonth} size="small">
          <ChevronLeft />
        </IconButton>
        <CalendarHeader 
          currentMonth={currentDate.getMonth()}
          currentYear={currentDate.getFullYear()}
          onNavigate={direction => direction === 'next' ? handleNextMonth() : handlePrevMonth()}
        />
        <IconButton onClick={handleNextMonth} size="small">
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{ 
        flex: 1,
        minHeight: 0,
        overflow: 'hidden'
      }}>
        <Grid 
          container 
          spacing={1} 
          columns={7}
          sx={{
            height: '100%',
            width: '100%',
            margin: 0,
            '& > .MuiGrid-item': {
              padding: 0.5,
              height: `${100 / totalWeeks}%`,
            }
          }}
        >
          {days.map((date, index) => (
            <Grid 
              item 
              xs={1} 
              key={index}
              sx={{
                aspectRatio: '1',
                '@media (max-width: 600px)': {
                  aspectRatio: 'auto',
                  height: `${100 / totalWeeks}%`,
                }
              }}
            >
              <CalendarDay
                date={date}
                events={getEventsForDate(date)}
                isToday={Boolean(date?.toDateString() === new Date().toDateString())}
                isSelected={Boolean(date && selectedDate && date.toDateString() === selectedDate.toDateString())}
                onClick={onDateSelect}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
