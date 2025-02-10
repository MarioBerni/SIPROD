import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface DateSelectorProps {
  date: Date;
  onDateChange: (date: Date) => void;
}

export function DateSelector({ date, onDateChange }: DateSelectorProps) {
  return (
    <DatePicker
      label="Seleccionar fecha"
      value={date}
      onChange={(newDate) => newDate && onDateChange(newDate)}
      format="dd/MM/yyyy"
      slotProps={{
        textField: { 
          fullWidth: true,
          size: "medium",
          sx: { bgcolor: 'background.paper' }
        },
      }}
    />
  );
}
