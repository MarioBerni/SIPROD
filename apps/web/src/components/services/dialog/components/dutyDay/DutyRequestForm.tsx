'use client';

import { FC, useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Stack,
  useTheme,
} from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { PickersDay } from '@mui/x-date-pickers/PickersDay';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DutyRequest } from '../types';
import { es } from 'date-fns/locale';

interface DutyRequestFormProps {
  onSubmitRequests: (requests: Omit<DutyRequest, 'id' | 'status'>[]) => void;
}

export const DutyRequestForm: FC<DutyRequestFormProps> = ({ onSubmitRequests }) => {
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const theme = useTheme();

  const handleDateClick = (date: Date | null) => {
    if (!date) return;
    
    setSelectedDate(date);
    setSelectedDates((prev) => {
      const dateStr = date.toISOString().split('T')[0];
      const exists = prev.some((d) => d.toISOString().split('T')[0] === dateStr);
      
      if (exists) {
        return prev.filter((d) => d.toISOString().split('T')[0] !== dateStr);
      } else {
        return [...prev, date];
      }
    });
  };

  const handleSubmit = () => {
    const requests = selectedDates.map((date) => ({
      date: date.toISOString().split('T')[0],
    }));
    
    onSubmitRequests(requests);
    setSelectedDates([]);
    setSelectedDate(null);
  };

  const isDateSelected = (date: Date) => {
    return selectedDates.some(
      (selectedDate) => selectedDate.toISOString().split('T')[0] === date.toISOString().split('T')[0]
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Seleccione los días que desea solicitar
      </Typography>

      <Stack spacing={3} alignItems="center">
        <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
          <DateCalendar
            value={selectedDate}
            onChange={handleDateClick}
            minDate={new Date()}
            slots={{
              day: (props) => {
                const isSelected = isDateSelected(props.day);
                return (
                  <PickersDay
                    {...props}
                    selected={isSelected}
                    sx={{
                      backgroundColor: isSelected ? theme.palette.primary.main : 'transparent',
                      color: isSelected ? theme.palette.primary.contrastText : 'inherit',
                      '&:hover': {
                        backgroundColor: isSelected 
                          ? theme.palette.primary.dark 
                          : theme.palette.primary.light,
                      },
                      '&.Mui-selected': {
                        backgroundColor: `${theme.palette.primary.main} !important`,
                        color: `${theme.palette.primary.contrastText} !important`,
                      },
                    }}
                  />
                );
              },
            }}
            sx={{
              width: '100%',
              maxWidth: 360,
            }}
          />
        </LocalizationProvider>

        <Button
          variant="contained"
          color="primary"
          onClick={handleSubmit}
          disabled={selectedDates.length === 0}
          sx={{ mt: 2 }}
        >
          Enviar Solicitudes ({selectedDates.length})
        </Button>
      </Stack>
    </Box>
  );
};
