'use client';

import { Box, Card, CardContent, Typography, List, ListItem, Chip } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Service, getServiceColor, getStatusText } from '@/data/__mocks__/servicesMock';

interface ActiveServicesCardProps {
  services: Service[];
  onServiceSelect: (service: Service) => void;
}

export const ActiveServicesCard = ({ services, onServiceSelect }: ActiveServicesCardProps) => {
  const activeServices = services.filter(service => 
    service.startDate >= new Date() || 
    (service.id === 222 && service.status === 'pending')
  );

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Servicios Activos
        </Typography>
        <List>
          {activeServices.map((service) => (
            <ListItem
              key={service.id}
              sx={{
                cursor: service.id === 222 && service.isAssigned ? 'default' : 'pointer',
                '&:hover': {
                  bgcolor: service.id === 222 && service.isAssigned ? 'transparent' : 'action.hover'
                },
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                borderLeft: `4px solid ${getServiceColor(service)}`,
                mb: 1,
                borderRadius: 1,
                bgcolor: 'background.paper'
              }}
              onClick={() => {
                if (service.id !== 222 || !service.isAssigned) {
                  onServiceSelect(service);
                }
              }}
            >
              <Box sx={{ width: '100%' }}>
                <Typography variant="subtitle1">
                  {service.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                  {format(service.startDate, 'PPP', { locale: es })}
                </Typography>
                {service.status && (
                  <Chip
                    size="small"
                    label={getStatusText(service.status)}
                    sx={{
                      mt: 1,
                      backgroundColor: getServiceColor(service),
                      color: 'white'
                    }}
                  />
                )}
              </Box>
            </ListItem>
          ))}
          {activeServices.length === 0 && (
            <ListItem>
              <Typography variant="body2" color="text.secondary" sx={{ width: '100%', textAlign: 'center' }}>
                No hay servicios activos
              </Typography>
            </ListItem>
          )}
        </List>
      </CardContent>
    </Card>
  );
};
