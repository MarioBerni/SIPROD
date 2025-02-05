import { SvgIconComponent } from '@mui/icons-material';

export interface Officer {
  id: string;
  nombre: string;
  apellido: string;
  grado: string;
  legajo: string;
  estado: 'activo' | 'licencia' | 'comision' | 'otros' | 'curso';
  ultimaAsignacion?: string;
}

export interface Assignment {
  id: string;
  officerId: string;
  startDate: string;
  endDate: string;
  type: 'direccionI' | 'direccionII' | 'geo';
  status: 'asignado' | 'pendiente' | 'finalizado';
  description?: string;
}

export interface AssignmentWithOfficer extends Assignment {
  officer: Officer;
}

export interface DirectionCategory {
  label: string;
  value: 'direccionI' | 'direccionII' | 'geo';
  icon: SvgIconComponent;
}
