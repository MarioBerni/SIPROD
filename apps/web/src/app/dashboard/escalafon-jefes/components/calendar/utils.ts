import { startOfMonth, endOfMonth, eachDayOfInterval, format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarEvent } from './types';

export const getMonthDays = (date: Date): (Date | null)[] => {
  const start = startOfMonth(date);
  const end = endOfMonth(date);
  const days = eachDayOfInterval({ start, end });

  const firstDayOfWeek = start.getDay();
  const lastDayOfWeek = end.getDay();

  // Agregar días nulos al principio para alinear con el día de la semana correcto
  const prefixDays = Array(firstDayOfWeek).fill(null);
  
  // Agregar días nulos al final para completar la última semana
  const suffixDays = Array(6 - lastDayOfWeek).fill(null);

  return [...prefixDays, ...days, ...suffixDays];
};

export const getMonthName = (month: number): string => {
  const date = new Date(2000, month, 1);
  return format(date, 'MMMM', { locale: es });
};

export const getEventsForDay = (date: Date | null, events: CalendarEvent[] = []): CalendarEvent[] => {
  if (!date || !events) return [];
  return events.filter(event => isSameDay(new Date(event.id), date));
};
