'use client';

import { Box, Card, Typography, Grid } from '@mui/material';
import { ServiceFormData } from '../../hooks/useServiceForm';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';

interface ServiceTypeStepProps {
  formData: ServiceFormData;
  onChange: (field: keyof ServiceFormData, value: string | number) => void;
  errors: Record<string, string>;
  onNext: () => void;
}

const serviceTypes = [
  {
    type: 'JEFE_DIA',
    title: 'Jefe de Día',
    description: 'Gestiona los turnos de jefe de día',
    icon: AssignmentIcon
  },
  {
    type: 'CURSO',
    title: 'Curso',
    description: 'Registra cursos y capacitaciones',
    icon: SchoolIcon
  },
  {
    type: 'LICENCIA',
    title: 'Licencia',
    description: 'Gestiona licencias y permisos',
    icon: BeachAccessIcon
  }
];

export const ServiceTypeStep = ({
  formData,
  onChange,
  errors,
  onNext
}: ServiceTypeStepProps) => {
  const handleSelect = (type: string) => {
    onChange('type', type);
    setTimeout(onNext, 300);
  };

  return (
    <Box>
      {errors.type && (
        <Typography color="error" sx={{ mb: 2 }}>
          {errors.type}
        </Typography>
      )}
      
      <Grid container spacing={2}>
        {serviceTypes.map(({ type, title, description, icon: Icon }) => (
          <Grid item xs={12} sm={6} md={4} key={type}>
            <Card
              onClick={() => handleSelect(type)}
              sx={{
                p: 2,
                cursor: 'pointer',
                bgcolor: formData.type === type ? 'primary.light' : 'background.paper',
                color: formData.type === type ? 'primary.contrastText' : 'text.primary',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  bgcolor: formData.type === type ? 'primary.light' : 'action.hover',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Icon sx={{ mr: 1 }} />
                <Typography variant="subtitle1">
                  {title}
                </Typography>
              </Box>
              <Typography variant="body2" color={formData.type === type ? 'inherit' : 'text.secondary'}>
                {description}
              </Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};
