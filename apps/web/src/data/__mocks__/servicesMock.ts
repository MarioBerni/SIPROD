export type ServiceType = 'JEFE_DIA' | 'CURSO' | 'LICENCIA' | '222';
export type ServiceStatus = 'pending' | 'approved' | 'rejected';
export type LicenseType = 'ANUAL' | 'MEDICA' | 'OTRA';

export interface Service {
  id: number;
  type: ServiceType;
  title: string;
  description: string;
  startDate: Date;
  endDate: Date;
  location?: string;
  assignedBy?: string;
  rejectionReason?: string;
  notificationSent?: boolean;
  status?: ServiceStatus;
  isAssigned?: boolean;
  selectedDates?: Date[];
  licenseType?: LicenseType;
}

// Iniciar con un array vacío
export const mockServices: Service[] = [];

// Función para generar un nuevo ID único
let nextId = 1;
export const getNextId = () => nextId++;

// Función para crear un nuevo servicio
export const createService = (
  type: ServiceType,
  title: string,
  description: string,
  startDate: Date,
  endDate: Date,
  location?: string,
  assignedBy?: string
): Service => {
  return {
    id: getNextId(),
    type,
    title,
    description,
    startDate,
    endDate,
    location,
    assignedBy,
    status: 'pending',
    isAssigned: false,
    notificationSent: false
  };
};

// Colores para los tipos de servicio
export const getServiceColor = (service: Service): string => {
  switch (service.type) {
    case '222':
      return '#4CAF50';
    case 'JEFE_DIA':
      return '#2196F3';
    case 'CURSO':
      return '#FF9800';
    case 'LICENCIA':
      return '#9C27B0';
    default:
      return '#757575';
  }
};

// Colores para los estados
export const getStatusColor = (status: ServiceStatus): string => {
  switch (status) {
    case 'pending':
      return '#FFC107';
    case 'approved':
      return '#4CAF50';
    case 'rejected':
      return '#F44336';
    default:
      return '#757575';
  }
};

// Textos para los estados
export const getStatusText = (status: ServiceStatus): string => {
  switch (status) {
    case 'pending':
      return 'Pendiente';
    case 'approved':
      return 'Aprobado';
    case 'rejected':
      return 'Rechazado';
    default:
      return 'Desconocido';
  }
};
