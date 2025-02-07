'use client';

import { useState } from 'react';
import { Box, Grid } from '@mui/material';
import { ServiceDialog } from './dialog/ServiceDialog';
import { Service, ServiceStatus, mockServices, getNextId } from '@/data/__mocks__/servicesMock';
import { ServiceCalendar } from './calendar/ServiceCalendar';
import { ActiveServicesCard } from './cards/ActiveServicesCard';

export const ServiceManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | undefined>();
  const [services, setServices] = useState<Service[]>(mockServices);

  const handleOpenDialog = () => {
    setSelectedService(undefined);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setSelectedService(undefined);
  };

  const addService = (serviceData: Omit<Service, 'id'>) => {
    const newService: Service = {
      ...serviceData,
      id: getNextId(),
      status: 'pending' as ServiceStatus,
      isAssigned: false,
      notificationSent: false,
      // Si es una licencia, aseguramos que tenga el título correcto
      ...(serviceData.type === 'LICENCIA' && {
        title: `Licencia ${serviceData.licenseType?.toLowerCase()}`
      })
    };
    setServices([...services, newService]);
  };

  const updateService = (id: number, serviceData: Omit<Service, 'id'>) => {
    setServices(services.map(service => 
      service.id === id 
        ? { 
            ...service, 
            ...serviceData,
            // Si es una licencia, aseguramos que tenga el título correcto
            ...(serviceData.type === 'LICENCIA' && {
              title: `Licencia ${serviceData.licenseType?.toLowerCase()}`
            })
          } as Service
        : service
    ));
  };

  const handleSaveService = (serviceData: Omit<Service, 'id'>) => {
    if (selectedService) {
      updateService(selectedService.id, serviceData);
    } else {
      addService(serviceData);
    }
    handleCloseDialog();
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setIsDialogOpen(true);
  };

  const handleServiceStatusChange = (serviceId: number, status: ServiceStatus, rejectReason?: string) => {
    setServices(services.map(service => 
      service.id === serviceId
        ? {
            ...service,
            status,
            ...(status === 'rejected' && { rejectionReason: rejectReason }),
            ...(status === 'approved' && { rejectionReason: undefined })
          }
        : service
    ));
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <ServiceCalendar
            services={services}
            onEventClick={(service) => handleServiceSelect(service)}
            onNewService={handleOpenDialog}
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <ActiveServicesCard
            services={services}
            onServiceSelect={handleServiceSelect}
            onServiceStatusChange={handleServiceStatusChange}
          />
        </Grid>
      </Grid>
      <ServiceDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveService}
        service={selectedService}
      />
    </Box>
  );
};
