export interface Officer {
  id: string;
  nombre: string;
  apellido: string;
  grado: string;
  estado: 'activo' | 'licencia' | 'curso';
  ultimaAsignacion?: string;
  legajo?: string;
}

export interface Assignment {
  id?: string;
  type: string;
  officerId: string;
  description: string;
  startDate: string;
  endDate: string;
}

export interface AssignmentFormData {
  type: string;
  officerId: string;
  description?: string;
  date: Date;
  isSpecialService222?: boolean;
}
