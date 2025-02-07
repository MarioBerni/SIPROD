import { Box, Button, DialogTitle, DialogContent, DialogActions, Tab, Tabs, Typography, useTheme } from '@mui/material';
import { Service, ServiceType, ServiceStatus } from '@/data/__mocks__/servicesMock';
import { useState } from 'react';
import { DaySelectionCalendar } from '../../calendar/DaySelectionCalendar';
import { CourseForm } from './courses/CourseForm';
import { LicenseForm } from './license/LicenseForm';
import { Close as CloseIcon, Save as SaveIcon } from '@mui/icons-material';

interface ServiceDialogContentProps {
  onClose: () => void;
  onSave: (service: Omit<Service, 'id'>) => void;
  service?: Service;
}

const serviceTabs = [
  { value: 'JEFE_DIA' as ServiceType, label: 'Jefe de Día', icon: '👮‍♂️' },
  { value: 'CURSO' as ServiceType, label: 'Curso', icon: '📚' },
  { value: 'LICENCIA' as ServiceType, label: 'Licencia', icon: '🌴' }
];

export const ServiceDialogContent = ({
  onClose,
  onSave,
  service
}: ServiceDialogContentProps) => {
  const theme = useTheme();
  const [selectedTab, setSelectedTab] = useState<ServiceType>(service?.type || 'JEFE_DIA');
  const [selectedDates, setSelectedDates] = useState<Date[]>(service?.selectedDates || []);
  const [formData, setFormData] = useState<Partial<Service>>(service || {
    type: 'JEFE_DIA' as ServiceType,
    status: 'pending' as ServiceStatus
  });

  const handleTabChange = (_: React.SyntheticEvent, newValue: ServiceType) => {
    setSelectedTab(newValue);
    setFormData(prev => ({ ...prev, type: newValue }));
  };

  const handleSave = () => {
    const serviceData: Omit<Service, 'id'> = {
      ...formData,
      type: selectedTab,
      selectedDates: selectedTab === 'JEFE_DIA' ? selectedDates : undefined,
      status: 'pending' as ServiceStatus,
      title: formData.title || '',
      description: formData.description || '',
      startDate: formData.startDate || new Date(),
      endDate: formData.endDate || new Date()
    };

    onSave(serviceData);
  };

  const renderContent = () => {
    switch (selectedTab) {
      case 'CURSO':
        return (
          <Box sx={{ p: 3 }}>
            <CourseForm
              data={formData}
              onChange={setFormData}
            />
          </Box>
        );
      case 'LICENCIA':
        return (
          <Box sx={{ p: 3 }}>
            <LicenseForm
              data={formData}
              onChange={setFormData}
            />
          </Box>
        );
      default:
        return (
          <Box sx={{ p: 2 }}>
            <DaySelectionCalendar
              selectedDates={selectedDates}
              onDateSelect={setSelectedDates}
            />
          </Box>
        );
    }
  };

  const isFormValid = () => {
    if (selectedTab === 'JEFE_DIA') {
      return selectedDates.length > 0;
    }
    return formData.title && formData.startDate && formData.endDate;
  };

  return (
    <>
      <DialogTitle>
        <Typography variant="h6" sx={{ 
          fontWeight: 600,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}>
          {service ? 'Editar Servicio' : 'Solicitar Nuevo Servicio'}
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            bgcolor: theme.palette.background.default,
          }}
        >
          {serviceTabs.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1
                }}>
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                </Box>
              }
            />
          ))}
        </Tabs>
        <Box sx={{ 
          height: selectedTab === 'JEFE_DIA' ? 400 : 'auto',
          overflow: 'auto'
        }}>
          {renderContent()}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={onClose}
          startIcon={<CloseIcon />}
          color="inherit"
        >
          Cancelar
        </Button>
        <Button
          variant="contained"
          onClick={handleSave}
          startIcon={<SaveIcon />}
          sx={{
            px: 3,
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
            }
          }}
          disabled={!isFormValid()}
        >
          Guardar
        </Button>
      </DialogActions>
    </>
  );
};
