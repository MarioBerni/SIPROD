'use client';

import { useState } from 'react';
import { List, ListItem, ListItemText, IconButton, Typography, Stack } from '@mui/material';
import { Service } from '@/data/__mocks__/servicesMock';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { ServiceMenu } from './ServiceMenu';
import { ServiceRejectDialog } from './ServiceRejectDialog';
import { getActiveServicesCardStyles } from './ActiveServicesCard.styles';

interface ServiceListProps {
  services: Service[];
  onServiceSelect: (service: Service) => void;
  onServiceStatusChange: (serviceId: number, status: 'approved' | 'rejected', rejectReason?: string) => void;
  styles: ReturnType<typeof getActiveServicesCardStyles>;
}

export const ServiceList = ({ 
  services, 
  onServiceSelect, 
  onServiceStatusChange,
  styles
}: ServiceListProps) => {
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>, service: Service) => {
    event.stopPropagation();
    setSelectedService(service);
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setSelectedService(null);
  };

  const handleStatusChange = (status: 'approved' | 'rejected', rejectReason?: string) => {
    if (status === 'rejected') {
      setRejectDialogOpen(true);
    } else if (selectedService) {
      onServiceStatusChange(selectedService.id, status, rejectReason);
      handleMenuClose();
    }
  };

  const handleRejectConfirm = (reason: string) => {
    if (selectedService && reason.trim()) {
      onServiceStatusChange(selectedService.id, 'rejected', reason.trim());
      setRejectDialogOpen(false);
      handleMenuClose();
      setRejectReason('');
    }
  };

  return (
    <>
      <List disablePadding>
        {services.map((service) => (
          <ListItem
            key={service.id}
            onClick={() => onServiceSelect(service)}
            sx={styles.listItem}
            secondaryAction={
              <IconButton
                edge="end"
                size="small"
                onClick={(e) => handleMenuClick(e, service)}
                sx={styles.iconButton}
              >
                <MoreVertIcon />
              </IconButton>
            }
          >
            <ListItemText
              primary={
                service.type === 'JEFE_DIA' ? 'Jefe de día' :
                service.type === 'CURSO' ? `Curso - ${service.title}` :
                service.title
              }
              secondaryTypographyProps={{
                component: 'div'
              }}
              secondary={
                <Stack 
                  direction="row" 
                  spacing={1} 
                  alignItems="center" 
                  component="div"
                >
                  <Typography 
                    variant="body2" 
                    sx={styles.dateChip}
                    component="div"
                  >
                    {new Date(service.startDate).toLocaleDateString('es-ES', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    })}
                    {service.endDate && service.startDate !== service.endDate && (
                      <>
                        {' - '}
                        {new Date(service.endDate).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </>
                    )}
                  </Typography>
                </Stack>
              }
            />
          </ListItem>
        ))}
      </List>

      {menuAnchorEl && (
        <ServiceMenu
          anchorEl={menuAnchorEl}
          onClose={handleMenuClose}
          onStatusChange={handleStatusChange}
          styles={styles}
        />
      )}

      <ServiceRejectDialog
        open={rejectDialogOpen}
        onClose={() => setRejectDialogOpen(false)}
        onConfirm={handleRejectConfirm}
        reason={rejectReason}
        onReasonChange={setRejectReason}
      />
    </>
  );
};
