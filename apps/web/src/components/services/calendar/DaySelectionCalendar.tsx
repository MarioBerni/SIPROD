import { Box } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { Badge } from '@mui/material';
import { PickersDay, PickersDayProps } from '@mui/x-date-pickers/PickersDay';
import { isSameDay } from 'date-fns';

interface DaySelectionCalendarProps {
  selectedDates: Date[];
  onDateSelect: (dates: Date[]) => void;
}

export const DaySelectionCalendar = ({
  selectedDates,
  onDateSelect
}: DaySelectionCalendarProps) => {
  const handleDateClick = (date: Date | null) => {
    if (!date) return;

    const isSelected = selectedDates.some(selectedDate => 
      isSameDay(selectedDate, date)
    );

    if (isSelected) {
      onDateSelect(selectedDates.filter(selectedDate => 
        !isSameDay(selectedDate, date)
      ));
    } else {
      onDateSelect([...selectedDates, date]);
    }
  };

  const CustomDay = (props: PickersDayProps<Date>) => {
    const { day, ...other } = props;
    const isSelected = selectedDates.some(selectedDate => 
      selectedDate && isSameDay(day, selectedDate)
    );

    return (
      <Badge
        key={day.toString()}
        overlap="circular"
        badgeContent={isSelected ? '✓' : undefined}
        color="primary"
      >
        <PickersDay {...other} day={day} />
      </Badge>
    );
  };

  return (
    <Box sx={{ maxWidth: 350, margin: '0 auto' }}>
      <DateCalendar
        value={null}
        onChange={handleDateClick}
        slots={{
          day: CustomDay
        }}
      />
    </Box>
  );
};
