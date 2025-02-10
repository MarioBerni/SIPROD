import { List, ListItem, Typography, Box, Stack, Button, Chip } from '@mui/material';
import { Check as CheckIcon, SwapHoriz as SwapHorizIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export interface DesignatedService {
  date: Date;
  confirmed?: boolean;
  changeRequested?: boolean;
  changeReason?: string;
}

interface DesignatedServiceListProps {
  services: DesignatedService[];
  onConfirm: (date: Date) => void;
  onRequestChange: (date: Date) => void;
  color: 'warning' | 'success' | 'info';
}

export const DesignatedServiceList = ({ services, onConfirm, onRequestChange, color }: DesignatedServiceListProps) => {
  return (
    <List disablePadding>
      {services.map((service) => (
        <ListItem 
          key={service.date.toString()} 
          sx={{ 
            flexDirection: 'column', 
            alignItems: 'flex-start', 
            py: 1, 
            px: 1,
            bgcolor: service.confirmed ? 'success.lighter' : 
                    service.changeRequested ? 'warning.lighter' : 
                    'transparent',
            borderRadius: 1,
          }}
        >
          <Stack direction="row" alignItems="center" spacing={2} sx={{ width: '100%' }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: `${color}.dark` }}>
              {format(service.date, 'EEEE d MMM yyyy', { locale: es })}
            </Typography>
            <Box sx={{ ml: 'auto', display: 'flex', gap: 1 }}>
              {!service.confirmed && !service.changeRequested && (
                <>
                  <Button
                    size="small"
                    variant="outlined"
                    color="success"
                    onClick={() => onConfirm(service.date)}
                    startIcon={<CheckIcon />}
                  >
                    Confirmar
                  </Button>
                  <Button
                    size="small"
                    variant="outlined"
                    color="warning"
                    onClick={() => onRequestChange(service.date)}
                    startIcon={<SwapHorizIcon />}
                  >
                    Solicitar otro
                  </Button>
                </>
              )}
              {service.confirmed && (
                <Chip
                  label="Confirmado"
                  size="small"
                  color="success"
                  icon={<CheckIcon />}
                />
              )}
              {service.changeRequested && (
                <Chip
                  label="Cambio solicitado"
                  size="small"
                  color="warning"
                  icon={<SwapHorizIcon />}
                />
              )}
            </Box>
          </Stack>
          {service.changeRequested && service.changeReason && (
            <Typography variant="caption" color="text.secondary" sx={{ mt: 1, ml: 2 }}>
              Motivo: {service.changeReason}
            </Typography>
          )}
        </ListItem>
      ))}
    </List>
  );
};
