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

export interface Course {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  status: 'pending' | 'approved' | 'rejected';
  location: string;
  type: 'mandatory' | 'optional';
}
