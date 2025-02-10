import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import { Edit as EditIcon } from '@mui/icons-material';
import { Assignment, Officer } from '@/app/dashboard/escalafon-jefes/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

type ChipColor = 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';

interface StatusConfig {
  color: ChipColor;
  label: string;
}

interface ActiveShiftsCardProps {
  shifts: Assignment[];
  officers: Officer[];
  onShiftSelect: (shift: Assignment) => void;
}

const getStatusColor = (status: string): StatusConfig => {
  switch (status) {
    case 'propuesto':
      return { color: 'warning', label: 'Propuesto' };
    case 'confirmado':
      return { color: 'success', label: 'Confirmado' };
    case 'rechazado':
      return { color: 'error', label: 'Rechazado' };
    case 'completado':
      return { color: 'default', label: 'Completado' };
    default:
      return { color: 'default', label: status };
  }
};

export const ActiveShiftsCard = ({ shifts, officers, onShiftSelect }: ActiveShiftsCardProps) => {
  const activeShifts = shifts
    .filter(shift => ['propuesto', 'confirmado'].includes(shift.status))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  const getOfficerName = (officerId: number) => {
    const officer = officers.find(o => o.id === officerId);
    return officer ? `${officer.grado} ${officer.apellido}, ${officer.nombre}` : 'Desconocido';
  };

  return (
    <Card sx={{ height: '100%', borderRadius: 2 }}>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Turnos Activos
        </Typography>
        {activeShifts.length > 0 ? (
          <List>
            {activeShifts.map((shift) => {
              const { color, label } = getStatusColor(shift.status);
              return (
                <ListItem
                  key={shift.id}
                  sx={{
                    borderBottom: '1px solid',
                    borderColor: 'divider',
                    '&:last-child': {
                      borderBottom: 'none',
                    },
                  }}
                >
                  <ListItemText
                    primary={getOfficerName(shift.officerId)}
                    secondaryTypographyProps={{ component: 'div' }}
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" component="div">
                          {format(new Date(shift.date), "EEEE d 'de' MMMM", { locale: es })}
                        </Typography>
                        <Box sx={{ mt: 0.5 }}>
                          <Chip
                            size="small"
                            label={label}
                            color={color}
                          />
                          {shift.isSpecialService222 && (
                            <Chip
                              size="small"
                              label="Servicio 222"
                              variant="outlined"
                              sx={{ ml: 1 }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                  <ListItemSecondaryAction>
                    <Tooltip title="Editar turno">
                      <IconButton 
                        edge="end" 
                        size="small"
                        onClick={() => onShiftSelect(shift)}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                  </ListItemSecondaryAction>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Box sx={{ py: 2, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              No hay turnos activos
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
