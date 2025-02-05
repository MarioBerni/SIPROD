import { SvgIconComponent } from '@mui/icons-material';

export type AssignmentType = 'direccionI' | 'direccionII' | 'geo';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: AssignmentType;
  officerId?: string;
  officerName?: string;
  description?: string;
  icon?: SvgIconComponent;
}

export interface CalendarHeaderProps {
  currentMonth: number;
  currentYear: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export interface CalendarDayProps {
  date: Date | null;
  events: CalendarEvent[];
  isToday: boolean;
  isSelected?: boolean;
  onClick?: (date: Date) => void;
}
