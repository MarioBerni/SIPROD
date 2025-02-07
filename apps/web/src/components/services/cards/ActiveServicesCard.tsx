'use client';

import { Card, CardContent, CardHeader, Typography, Stack, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { Service } from '@/data/__mocks__/servicesMock';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TodayIcon from '@mui/icons-material/Today';
import UpdateIcon from '@mui/icons-material/Update';
import { categorizeServices, sortServicesByDate } from './ActiveServicesCard.utils';
import { ServiceList } from './ServiceList';
import { getActiveServicesCardStyles } from './ActiveServicesCard.styles';

export interface ActiveServicesCardProps {
  services: Service[];
  onServiceSelect: (service: Service) => void;
  onServiceStatusChange: (serviceId: number, status: 'approved' | 'rejected', rejectReason?: string) => void;
}

const ServiceSection = ({ 
  title, 
  icon: Icon, 
  services, 
  onServiceSelect, 
  onServiceStatusChange,
  styles,
  sectionStyle
}: {
  title: string;
  icon: React.ElementType;
  services: Service[];
  onServiceSelect: (service: Service) => void;
  onServiceStatusChange: (serviceId: number, status: 'approved' | 'rejected', rejectReason?: string) => void;
  styles: ReturnType<typeof getActiveServicesCardStyles>;
  sectionStyle: 'pendingSection' | 'currentSection' | 'upcomingSection';
}) => (
  <Box sx={{ ...styles.section, ...(styles[sectionStyle] || {}) }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
      <Icon />
      <Typography variant="subtitle1">
        {title}
      </Typography>
      <Typography variant="caption" sx={{ ml: 'auto' }}>
        ({services.length})
      </Typography>
    </Stack>
    {services.length > 0 ? (
      <ServiceList
        services={services}
        onServiceSelect={onServiceSelect}
        onServiceStatusChange={onServiceStatusChange}
        styles={styles}
      />
    ) : (
      <Typography variant="body2" sx={styles.noServices}>
        No hay servicios en esta categoría
      </Typography>
    )}
  </Box>
);

export const ActiveServicesCard = ({ services, onServiceSelect, onServiceStatusChange }: ActiveServicesCardProps) => {
  const theme = useTheme();
  const styles = getActiveServicesCardStyles(theme);
  const categorizedServices = categorizeServices(services);
  const totalServices = services.length;

  // Ordenar los servicios por fecha
  const sortedCategories = {
    pending: sortServicesByDate(categorizedServices.pending),
    current: sortServicesByDate(categorizedServices.current),
    upcoming: sortServicesByDate(categorizedServices.upcoming)
  };

  return (
    <Card sx={styles.card}>
      <CardHeader 
        sx={styles.cardHeader}
        title="Servicios Activos"
        subheader={`Total: ${totalServices} servicios`}
      />
      <CardContent sx={styles.cardContent}>
        <Stack spacing={2}>
          <ServiceSection
            title="Pendientes"
            icon={AccessTimeIcon}
            services={sortedCategories.pending}
            onServiceSelect={onServiceSelect}
            onServiceStatusChange={onServiceStatusChange}
            styles={styles}
            sectionStyle="pendingSection"
          />
          <ServiceSection
            title="Servicios Actuales"
            icon={TodayIcon}
            services={sortedCategories.current}
            onServiceSelect={onServiceSelect}
            onServiceStatusChange={onServiceStatusChange}
            styles={styles}
            sectionStyle="currentSection"
          />
          <ServiceSection
            title="Próximos Servicios"
            icon={UpdateIcon}
            services={sortedCategories.upcoming}
            onServiceSelect={onServiceSelect}
            onServiceStatusChange={onServiceStatusChange}
            styles={styles}
            sectionStyle="upcomingSection"
          />
        </Stack>
      </CardContent>
    </Card>
  );
};
