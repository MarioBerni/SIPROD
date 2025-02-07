import { Service } from '@/data/__mocks__/servicesMock';
import { areIntervalsOverlapping } from 'date-fns';

export interface ConflictInfo {
  hasConflict: boolean;
  conflictingServices: Service[];
  type: 'OVERLAP' | 'PRIORITY' | 'NONE';
  message: string;
}

export const checkServiceConflicts = (
  service: Service,
  existingServices: Service[]
): ConflictInfo => {
  const conflictingServices: Service[] = [];
  
  // Verificar superposición con otros servicios
  existingServices.forEach(existingService => {
    if (existingService.id === service.id) return;

    const isOverlapping = areIntervalsOverlapping(
      { start: service.startDate, end: service.endDate },
      { start: existingService.startDate, end: existingService.endDate }
    );

    if (isOverlapping) {
      conflictingServices.push(existingService);
    }
  });

  // Si hay conflictos, determinar el tipo
  if (conflictingServices.length > 0) {
    // Verificar si hay licencias (tienen prioridad)
    const hasLicenseConflict = conflictingServices.some(s => s.type === 'LICENCIA');
    
    if (hasLicenseConflict) {
      return {
        hasConflict: true,
        conflictingServices,
        type: 'PRIORITY',
        message: 'Conflicto con licencia existente'
      };
    }

    return {
      hasConflict: true,
      conflictingServices,
      type: 'OVERLAP',
      message: `Conflicto con ${conflictingServices.length} servicio(s) existente(s)`
    };
  }

  return {
    hasConflict: false,
    conflictingServices: [],
    type: 'NONE',
    message: ''
  };
};

export const validateServiceDates = (service: Partial<Service>): string[] => {
  const errors: string[] = [];
  const now = new Date();

  if (!service.startDate || !service.endDate) {
    errors.push('Las fechas de inicio y fin son requeridas');
    return errors;
  }

  // Validar que la fecha de inicio sea posterior a la actual
  if (service.startDate < now) {
    errors.push('La fecha de inicio debe ser posterior a la fecha actual');
  }

  // Validar que la fecha de fin sea posterior a la de inicio
  if (service.endDate < service.startDate) {
    errors.push('La fecha de fin debe ser posterior a la fecha de inicio');
  }

  // Validaciones específicas por tipo de servicio
  if (service.type === 'JEFE_DIA') {
    // Verificar que sea un turno de 24 horas
    const hours = (service.endDate.getTime() - service.startDate.getTime()) / (1000 * 60 * 60);
    if (hours !== 24) {
      errors.push('Los turnos de Jefe de Día deben ser de exactamente 24 horas');
    }

    // Verificar que comience a las 8:00
    if (service.startDate.getHours() !== 8 || service.startDate.getMinutes() !== 0) {
      errors.push('Los turnos de Jefe de Día deben comenzar a las 08:00');
    }
  }

  // Validar anticipación mínima para Jefe de Día (2+ días)
  if (service.type === 'JEFE_DIA') {
    const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
    if (service.startDate < twoDaysFromNow) {
      errors.push('Los turnos de Jefe de Día requieren al menos 2 días de anticipación');
    }
  }

  return errors;
};
