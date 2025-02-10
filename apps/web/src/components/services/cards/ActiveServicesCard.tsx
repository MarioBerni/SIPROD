import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Box,
  Stack,
} from '@mui/material';
import {
  AccessTime as AccessTimeIcon,
  Assignment as AssignmentIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { Service, ServiceStatus } from '@/types/service';
import { getActiveServicesCardStyles } from './styles/activeServicesCard.styles';
import { useTheme } from '@mui/material/styles';
import { ServiceReasonDialog } from '../dialog/ServiceReasonDialog';
import { ServiceList } from './components/ServiceList';
import { DesignatedServiceList, DesignatedService } from './components/DesignatedServiceList';

interface ActiveServicesCardProps {
  services: Service[];
  onServiceSelect: (service: Service) => void;
  onServiceStatusChange: (serviceId: number, status: ServiceStatus, rejectReason?: string) => void;
}

interface SortedCategories {
  pending: Service[];
  approved: Service[];
  rejected: Service[];
}

const MOCK_DESIGNATED_SERVICES: DesignatedService[] = [
  { date: new Date(2025, 1, 11) },
  { date: new Date(2025, 1, 12) },
  { date: new Date(2025, 1, 13) },
  { date: new Date(2025, 1, 14) },
  { date: new Date(2025, 1, 15) },
];

const sortServicesByCategory = (services: Service[]): SortedCategories => {
  return services.reduce(
    (acc, service) => {
      if (service.type === 'CURSO' || service.type === 'LICENCIA') {
        acc.rejected.push(service);
      } else if (service.status === 'approved') {
        acc.approved.push(service);
      } else if (service.status === 'pending') {
        acc.pending.push(service);
      }
      return acc;
    },
    { pending: [], approved: [], rejected: [] } as SortedCategories
  );
};

export const ActiveServicesCard = ({ services }: ActiveServicesCardProps) => {
  const [expandedService, setExpandedService] = useState<number | null>(null);
  const [designatedServices, setDesignatedServices] = useState<DesignatedService[]>(MOCK_DESIGNATED_SERVICES);
  const [reasonDialogOpen, setReasonDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const theme = useTheme();
  const styles = getActiveServicesCardStyles(theme);
  const sortedCategories = sortServicesByCategory(services);

  const handleExpandClick = (serviceId: number) => {
    setExpandedService(expandedService === serviceId ? null : serviceId);
  };

  const handleConfirmService = (date: Date) => {
    setDesignatedServices(prev => prev.map(service => 
      service.date.getTime() === date.getTime() 
        ? { ...service, confirmed: true, changeRequested: false, changeReason: undefined }
        : service
    ));
  };

  const handleRequestChange = (date: Date) => {
    setSelectedDate(date);
    setReasonDialogOpen(true);
  };

  const handleReasonConfirm = (reason: string) => {
    if (selectedDate) {
      setDesignatedServices(prev => prev.map(service =>
        service.date.getTime() === selectedDate.getTime()
          ? { ...service, changeRequested: true, changeReason: reason, confirmed: false }
          : service
      ));
    }
    setSelectedDate(null);
  };

  return (
    <>
      <Card sx={styles.card}>
        <CardHeader
          title="Mis servicios"
          subheader="Resumen de turnos"
          sx={styles.cardHeader}
        />
        <CardContent sx={styles.cardContent}>
          <Box sx={{ ...styles.section, ...styles.pendingSection }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AccessTimeIcon />
                <Typography variant="subtitle1">
                  Turnos solicitados
                </Typography>
                <Typography variant="caption" sx={{ ml: 'auto' }}>
                  ({sortedCategories.pending.length})
                </Typography>
              </Stack>
              <ServiceList
                services={sortedCategories.pending}
                expandedService={expandedService}
                onExpandClick={handleExpandClick}
                color="warning"
              />
            </Stack>
          </Box>

          <Box sx={{ ...styles.section, ...styles.approvedSection }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <AssignmentIcon />
                <Typography variant="subtitle1">
                  Servicios designados
                </Typography>
                <Typography variant="caption" sx={{ ml: 'auto' }}>
                  ({designatedServices.length})
                </Typography>
              </Stack>
              <DesignatedServiceList
                services={designatedServices}
                onConfirm={handleConfirmService}
                onRequestChange={handleRequestChange}
                color="success"
              />
            </Stack>
          </Box>

          <Box sx={{ ...styles.section, ...styles.rejectedSection }}>
            <Stack spacing={2}>
              <Stack direction="row" spacing={1} alignItems="center">
                <SchoolIcon />
                <Typography variant="subtitle1">
                  Cursos y Licencias
                </Typography>
                <Typography variant="caption" sx={{ ml: 'auto' }}>
                  ({sortedCategories.rejected.length})
                </Typography>
              </Stack>
              <ServiceList
                services={sortedCategories.rejected}
                expandedService={expandedService}
                onExpandClick={handleExpandClick}
                color="info"
              />
            </Stack>
          </Box>
        </CardContent>
      </Card>
      <ServiceReasonDialog
        open={reasonDialogOpen}
        onClose={() => setReasonDialogOpen(false)}
        onConfirm={handleReasonConfirm}
        date={selectedDate || new Date()}
      />
    </>
  );
};
