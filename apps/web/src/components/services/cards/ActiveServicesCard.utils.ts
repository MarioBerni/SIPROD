import { Service } from '@/data/__mocks__/servicesMock';

let expandedServiceId = 100000; // ID base para servicios expandidos

const expandJefeDiaService = (service: Service): Service[] => {
  if (service.type === 'JEFE_DIA' && service.selectedDates && service.selectedDates.length > 0) {
    return service.selectedDates.map((date: Date) => ({
      ...service,
      id: ++expandedServiceId, // Usar un ID numérico único
      startDate: date,
      endDate: date
    }));
  }
  return [service];
};


export const categorizeServices = (services: Service[]): ServiceCategories => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);

  // Primero expandimos los servicios de Jefe de Día
  const expandedServices = services.flatMap(expandJefeDiaService);

  return expandedServices.reduce(
    (acc: ServiceCategories, service: Service) => {
      const startDate = new Date(service.startDate);
      startDate.setHours(0, 0, 0, 0);
      
      const endDate = service.endDate ? new Date(service.endDate) : new Date(service.startDate);
      endDate.setHours(23, 59, 59, 999);

      // Para cursos y licencias
      if (['CURSO', 'LICENCIA'].includes(service.type)) {
        // Si está pendiente o aprobado, va a current o upcoming según la fecha
        if (service.status !== 'rejected') {
          if (endDate >= now && startDate <= now) {
            acc.current.push(service);
          } else if (startDate > now) {
            acc.upcoming.push(service);
          }
        }
        return acc;
      }

      // Para otros tipos de servicios
      if (service.status === 'pending') {
        acc.pending.push(service);
      } else if (service.status === 'approved') {
        if (endDate >= now && startDate <= now) {
          acc.current.push(service);
        } else if (startDate > now) {
          acc.upcoming.push(service);
        }
      }

      return acc;
    },
    { pending: [], current: [], upcoming: [] }
  );
};

export const sortServicesByDate = (services: Service[]): Service[] => {
  return [...services].sort((a, b) => {
    const dateA = new Date(a.startDate);
    const dateB = new Date(b.startDate);
    return dateA.getTime() - dateB.getTime();
  });
};

interface ServiceCategories {
  pending: Service[];
  current: Service[];
  upcoming: Service[];
}
