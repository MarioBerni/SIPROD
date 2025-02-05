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
import { DutyRequest } from '../types';
import dayjs, { Dayjs } from 'dayjs';
import 'dayjs/locale/es';

interface DutyRequestFormProps {
  onSubmitRequests: (requests: Omit<DutyRequest, 'id' | 'status'>[]) => void;
}

export const DutyRequestForm: FC<DutyRequestFormProps> = ({ onSubmitRequests }) => {
  const [selectedDates, setSelectedDates] = useState<Dayjs[]>([]);
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
  const theme = useTheme();

  const handleDateClick = (date: Dayjs | null) => {
    if (!date) return;
    
    setSelectedDate(date);
    setSelectedDates((prev) => {
      const dateStr = date.format('YYYY-MM-DD');
      const exists = prev.some((d) => d.format('YYYY-MM-DD') === dateStr);
      
      if (exists) {
        return prev.filter((d) => d.format('YYYY-MM-DD') !== dateStr);
      } else {
        return [...prev, date];
      }
    });
  };

  const handleSubmit = () => {
    const requests = selectedDates.map((date) => ({
      date: date.format('YYYY-MM-DD'),
    }));
    
    onSubmitRequests(requests);
    setSelectedDates([]);
    setSelectedDate(null);
  };

  const isDateSelected = (date: Dayjs) => {
    return selectedDates.some(
      (selectedDate) => selectedDate.format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    );
  };

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Seleccione los días que desea solicitar
      </Typography>

      <Stack spacing={3} alignItems="center">
        <DateCalendar
          value={selectedDate}
          onChange={handleDateClick}
          minDate={dayjs()}
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
