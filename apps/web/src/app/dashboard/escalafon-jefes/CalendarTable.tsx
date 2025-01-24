import { Box, Paper, Typography, Chip } from '@mui/material';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isToday,
  startOfWeek,
  endOfWeek,
  isSameMonth,
} from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarTableProps } from './types';
import { alpha } from '@mui/material/styles';

export const CalendarTable: React.FC<CalendarTableProps> = ({
  currentMonth,
  assignments,
  selectedDate,
  onDateSelect,
}) => {
  // Obtener el primer y último día del mes
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  
  // Obtener el primer día de la primera semana y el último día de la última semana
  const calendarStart = startOfWeek(monthStart, { locale: es });
  const calendarEnd = endOfWeek(monthEnd, { locale: es });

  // Generar array de días para el calendario
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Generar los días de la semana
  const weekDays = eachDayOfInterval({
    start: startOfWeek(new Date(), { locale: es }),
    end: endOfWeek(new Date(), { locale: es }),
  }).map((day) => format(day, 'EEE', { locale: es }));

  return (
    <Paper
      id="calendar-table"
      elevation={0}
      sx={{
        p: 3,
        height: '100%',
        border: '1px solid',
        borderColor: 'divider',
      }}
    >
      {/* Cabecera con los días de la semana */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
          mb: 1,
        }}
      >
        {weekDays.map((day) => (
          <Typography
            key={day}
            variant="subtitle2"
            sx={{
              textAlign: 'center',
              textTransform: 'capitalize',
              color: 'text.secondary',
            }}
          >
            {day}
          </Typography>
        ))}
      </Box>

      {/* Grilla del calendario */}
      <Box
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7, 1fr)',
          gap: 1,
        }}
      >
        {calendarDays.map((day) => {
          const dateKey = format(day, 'yyyy-MM-dd');
          const assignment = assignments[dateKey];
          const isSelected = selectedDate ? format(selectedDate, 'yyyy-MM-dd') === dateKey : false;
          const isCurrentMonth = isSameMonth(day, currentMonth);

          return (
            <Box
              key={day.toString()}
              onClick={() => onDateSelect(day)}
              sx={{
                position: 'relative',
                aspectRatio: '1',
                p: 0.5,
                cursor: 'pointer',
                borderRadius: 1,
                border: '1px solid',
                borderColor: isSelected ? 'primary.main' : 'transparent',
                bgcolor: isSelected
                  ? (theme) => alpha(theme.palette.primary.main, 0.1)
                  : isToday(day)
                  ? (theme) => alpha(theme.palette.secondary.main, 0.1)
                  : 'background.paper',
                '&:hover': {
                  bgcolor: (theme) =>
                    isSelected
                      ? alpha(theme.palette.primary.main, 0.2)
                      : alpha(theme.palette.action.hover, 0.1),
                },
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  textAlign: 'center',
                  color: !isCurrentMonth
                    ? 'text.disabled'
                    : isToday(day)
                    ? 'secondary.main'
                    : 'text.primary',
                  fontWeight: isToday(day) ? 'bold' : 'regular',
                }}
              >
                {format(day, 'd')}
              </Typography>

              {assignment && (
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '90%',
                  }}
                >
                  <Chip
                    label={`${assignment.direccionI.label} - ${assignment.direccionII.label}`}
                    size="small"
                    sx={{
                      width: '100%',
                      height: 'auto',
                      '& .MuiChip-label': {
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                        whiteSpace: 'normal',
                        textOverflow: 'ellipsis',
                        fontSize: '0.625rem',
                        py: 0.25,
                      },
                    }}
                  />
                </Box>
              )}
            </Box>
          );
        })}
      </Box>
    </Paper>
  );
};
