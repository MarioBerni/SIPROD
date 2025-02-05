'use client';

import { FC, useMemo, useState, useCallback } from 'react';
import { Box, Typography, Grid } from '@mui/material';
import { ServiceDayDialog } from './dialog/ServiceDayDialog';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SchoolIcon from '@mui/icons-material/School';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import SecurityIcon from '@mui/icons-material/Security';
import LocalPoliceIcon from '@mui/icons-material/LocalPolice';
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { ServiceCategoryWithIcon } from './types';
import { useServiceCounts } from './hooks/useServiceCounts';

type CategoryType = 'licencia' | 'cursos' | 'jefeDia' | 'opEspeciales' | 'control222' | 'otros';

const createCategory = (
  label: string,
  abbreviation: string,
  value: number,
  type: CategoryType,
  icon: ServiceCategoryWithIcon['icon']
): ServiceCategoryWithIcon => ({
  label,
  abbreviation,
  value,
  type,
  icon,
});

export const ActiveServicesCard: FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<ServiceCategoryWithIcon | undefined>(undefined);
  const [dialogOpen, setDialogOpen] = useState(false);
  const serviceCounts = useServiceCounts();

  const handleCategoryClick = useCallback((category: ServiceCategoryWithIcon) => {
    setSelectedCategory(category);
    setDialogOpen(true);
  }, []);

  const handleCloseDialog = useCallback(() => {
    setDialogOpen(false);
    setSelectedCategory(undefined);
  }, []);

  const categories = useMemo(() => [
    createCategory('Licencia', 'Licencia', serviceCounts.licencia, 'licencia', AssignmentIcon),
    createCategory('Cursos', 'Cursos', serviceCounts.cursos, 'cursos', SchoolIcon),
    createCategory('Jefe Día', 'Jefe Día', serviceCounts.jefeDia, 'jefeDia', SupervisorAccountIcon),
    createCategory('Op. Especiales', 'Op. Esp.', serviceCounts.opEspeciales, 'opEspeciales', SecurityIcon),
    createCategory('Control 222', 'Control', serviceCounts.control222, 'control222', LocalPoliceIcon),
    createCategory('Otros', 'Otros', serviceCounts.otros, 'otros', MoreHorizIcon),
  ], [serviceCounts]);

  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {categories.map((category) => {
          const Icon = category.icon;
          return (
            <Grid item xs={6} key={category.type}>
              <Box
                onClick={() => handleCategoryClick(category)}
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'background.default',
                  cursor: 'pointer',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 1,
                  transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                  },
                }}
              >
                <Icon sx={{ fontSize: 28, color: 'primary.main', opacity: 0.8 }} />
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      color: 'text.primary',
                      fontSize: '1.25rem',
                      mb: 0.5,
                    }}
                  >
                    {category.value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      color: 'text.secondary',
                      fontWeight: 500,
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {category.label}
                  </Typography>
                </Box>
              </Box>
            </Grid>
          );
        })}
      </Grid>

      <ServiceDayDialog
        open={dialogOpen}
        onClose={handleCloseDialog}
        date={new Date()}
        category={selectedCategory}
        events={[]} // No hay eventos específicos para mostrar en este contexto
      />
    </Box>
  );
};
