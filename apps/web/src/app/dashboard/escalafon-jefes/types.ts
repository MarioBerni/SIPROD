import { DireccionOption } from './options';

export interface DayScheduleCardProps {
  selectedDate: Date;
  direccionI: DireccionOption | null;
  direccionII: DireccionOption | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export interface DirectionAutocompleteProps {
  title: string;
  color: 'primary' | 'secondary';
  value: DireccionOption | null;
  onChange: (value: DireccionOption | null) => void;
  options: DireccionOption[];
}

export interface CalendarAssignment {
  date: Date;
  direccionI: DireccionOption;
  direccionII: DireccionOption;
}

export interface CalendarTableProps {
  currentMonth: Date;
  assignments: Record<string, CalendarAssignment>;
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
}
