import { SvgIconComponent } from '@mui/icons-material';

export interface ServiceCategory {
  label: string;
  abbreviation: string;
  value: number;
  type: 'licencia' | 'cursos' | 'jefeDia' | 'opEspeciales' | 'control222' | 'otros';
}

export interface ServiceCategoryWithIcon extends ServiceCategory {
  icon: SvgIconComponent;
}

export interface License {
  id: string;
  type: 'medical' | 'personal' | 'annual' | 'other';
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  description?: string;
}

export interface Course {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  location: string;
  type: 'mandatory' | 'optional';
}

export type DutyStatus = 'pending' | 'approved' | 'rejected';

export interface DutyDay {
  id: string;
  date: string;
  status: DutyStatus;
  rejectionReason?: string;
  location: string;
  shift: 'mañana' | 'tarde' | 'noche';
  type: 'jefeDia';
}

export interface DutyRequest {
  id: string;
  date: string;
  status: DutyStatus;
}

export interface Control222Duty {
  id: string;
  startDate: string;
  endDate: string;
  status: DutyStatus;
  type: 'control222';
}
