import { SvgIconTypeMap } from '@mui/material';
import { OverridableComponent } from '@mui/material/OverridableComponent';

export type ServiceType = 'licencia' | 'cursos' | 'jefeDia' | 'control222';

export interface CalendarEvent {
  id: string;
  type: ServiceType;
  title: string;
  description?: string;
  startDate: Date;
  icon: OverridableComponent<SvgIconTypeMap<Record<string, unknown>, "svg">> & { muiName: string };
}

export interface CalendarHeaderProps {
  currentMonth: number;
  currentYear: number;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export interface CalendarDayProps {
  date: Date | null;
  events: CalendarEvent[];
  onClick?: (date: Date) => void;
  isToday?: boolean;
}
