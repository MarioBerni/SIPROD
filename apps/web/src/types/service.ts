export type ServiceType = 'JEFE_DIA' | 'CURSO' | 'LICENCIA' | 'TRANSITORIO';
export type ServiceStatus = 'pending' | 'approved' | 'rejected' | 'confirmed' | 'change_requested';
export type ServiceCategory = 'AUF' | 'FUBB' | 'DGRTID' | 'OTROS';

export interface ServiceTime {
  startTime: string;
  endTime: string | 'fin';
}

export interface Service {
  id: number;
  type: ServiceType;
  status: ServiceStatus;
  category?: ServiceCategory;
  title: string;
  description?: string;
  startDate: Date;
  endDate: Date;
  selectedDates?: Date[];
  time?: ServiceTime;
}
