import { SvgIconComponent } from '@mui/icons-material';

export type ChiefRankStatus = 'propuesto' | 'solicitado' | 'pendiente' | 'confirmado' | 'rechazado' | 'completado';
export type AssignmentType = 'direccionI' | 'direccionII_GEO';

export interface Officer {
  id: number;
  nombre: string;
  apellido: string;
  grado: string;
  legajo: string;
  score: number;
  lastShift?: Date;
  shiftsThisMonth: number;
  complianceHistory: number;
  estado: 'activo' | 'licencia' | 'curso';
  requestedDates?: Date[];
  approvedDates?: Date[];
  publicEventsCount: number;
  unidad: AssignmentType;
  ultimaAsignacion?: string;
}

export interface Assignment {
  id: number;
  date: Date;
  officerId: number;
  isSpecialService222: boolean;
  type: AssignmentType;
  status: ChiefRankStatus;
  description?: string;
}

export interface AssignmentFormData {
  officerId: number;
  type: AssignmentType;
  date: Date;
  description?: string;
  isSpecialService222?: boolean;
}

export interface AssignmentWithOfficer extends Assignment {
  officer: Officer;
}

export interface DirectionCategory {
  label: string;
  value: AssignmentType;
  icon: SvgIconComponent;
}

export interface TransitoryService {
  id: number;
  title: string;
  startTime: string;
  endTime: string;
  date: Date;
}

// Tipos para el formulario
export interface AssignmentFormSchema {
  officerId: string;
  type: AssignmentType;
  description?: string;
}
