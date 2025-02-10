import { List, ListItem, Typography, Box, IconButton, Collapse, Chip, Stack } from '@mui/material';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Service } from '@/types/service';

interface ServiceListProps {
  services: Service[];
  expandedService: number | null;
  onExpandClick: (serviceId: number) => void;
  color: 'warning' | 'success' | 'info';
}

export const ServiceList = ({ services, expandedService, onExpandClick, color }: ServiceListProps) => {
  if (services.length === 0) {
    return (
      <Typography sx={{ textAlign: 'center', py: 1, color: 'text.secondary', fontStyle: 'italic' }}>
        No hay servicios en esta categoría
      </Typography>
    );
  }

  return (
    <List disablePadding>
      {services.map((service) => (
        <ListItem key={service.id} sx={{ flexDirection: 'column', alignItems: 'flex-start', py: 1, px: 1 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ width: '100%', cursor: 'pointer' }}
            onClick={() => onExpandClick(service.id)}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: `${color}.dark` }}>
                {service.type === 'CURSO' ? 'Curso' : 
                 service.type === 'LICENCIA' ? 'Licencia' : 
                 'Jefe de día'}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {service.title || format(new Date(service.startDate), 'd MMM yyyy', { locale: es })}
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{
                ml: 'auto',
                transform: expandedService === service.id ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s',
                color: `${color}.dark`,
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Stack>

          <Collapse in={expandedService === service.id} sx={{ width: '100%' }}>
            <Box sx={{ pt: 1 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {service.selectedDates?.map((date) => (
                  <Chip
                    key={date.toString()}
                    label={format(new Date(date), 'd MMM yyyy', { locale: es })}
                    size="small"
                    color={color}
                    variant="outlined"
                    sx={{ mb: 0.5 }}
                  />
                ))}
                {!service.selectedDates && (
                  <>
                    <Chip
                      label={format(new Date(service.startDate), 'd MMM yyyy', { locale: es })}
                      size="small"
                      color={color}
                      variant="outlined"
                      sx={{ mb: 0.5 }}
                    />
                    {service.endDate && service.endDate !== service.startDate && (
                      <Chip
                        label={format(new Date(service.endDate), 'd MMM yyyy', { locale: es })}
                        size="small"
                        color={color}
                        variant="outlined"
                        sx={{ mb: 0.5 }}
                      />
                    )}
                  </>
                )}
              </Stack>
            </Box>
          </Collapse>
        </ListItem>
      ))}
    </List>
  );
};
