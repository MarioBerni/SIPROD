import { 
  FormControl, 
  InputLabel, 
  Select, 
  MenuItem, 
  Box, 
  Chip,
  Typography,
  Avatar
} from '@mui/material';
import { Officer } from '@/app/dashboard/escalafon-jefes/types';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { getUnitLabel } from '@/app/dashboard/escalafon-jefes/data/mockData';
import { UNIT_COLORS } from '@/constants/colors';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import StarIcon from '@mui/icons-material/Star';
import EventIcon from '@mui/icons-material/Event';
import PublicIcon from '@mui/icons-material/Public';

interface SuggestedOfficersProps {
  officers: Officer[];
  selectedOfficerId: number;
  onOfficerSelect: (id: number) => void;
  selectedDate: Date;
}

export function SuggestedOfficers({
  officers,
  selectedOfficerId,
  onOfficerSelect,
  selectedDate,
}: SuggestedOfficersProps) {
  return (
    <FormControl fullWidth>
      <InputLabel>Seleccionar Oficial</InputLabel>
      <Select
        value={selectedOfficerId || ''}
        label="Seleccionar Oficial"
        onChange={(e) => onOfficerSelect(Number(e.target.value))}
        MenuProps={{
          PaperProps: {
            sx: {
              maxHeight: 400,
              '& .MuiMenuItem-root': {
                padding: 1.5,
                '&:hover': {
                  backgroundColor: 'action.hover',
                },
                '&.Mui-selected': {
                  backgroundColor: 'primary.light',
                  color: 'primary.contrastText',
                  '&:hover': {
                    backgroundColor: 'primary.main',
                  },
                },
              },
            },
          },
        }}
      >
        {officers.map((officer) => (
          <MenuItem 
            key={officer.id} 
            value={officer.id}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              '&:last-child': {
                borderBottom: 'none',
              },
            }}
          >
            <Box sx={{ width: '100%' }}>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                mb: 1
              }}>
                <Avatar 
                  sx={{ 
                    bgcolor: UNIT_COLORS[officer.unidad].bg,
                    width: 48,
                    height: 48,
                    mr: 2,
                    fontSize: '0.7rem',
                    lineHeight: 1,
                    display: 'flex',
                    alignItems: 'center',
                    textAlign: 'center',
                    padding: '4px',
                    whiteSpace: 'pre-line'
                  }}
                >
                  {getUnitLabel(officer.unidad)}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'medium', mb: 0.5 }}>
                    {`${officer.grado} ${officer.apellido}, ${officer.nombre}`}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'primary.main' }}>
                      <StarIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{officer.score}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'secondary.main' }}>
                      <EventIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{officer.shiftsThisMonth} turnos</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', color: 'info.main' }}>
                      <PublicIcon sx={{ fontSize: 16, mr: 0.5 }} />
                      <Typography variant="body2">{officer.publicEventsCount} Espec. públicos</Typography>
                    </Box>
                  </Box>
                </Box>
              </Box>

              {officer.requestedDates && officer.requestedDates.length > 0 && (
                <Box sx={{ 
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: 0.5,
                  pl: 7
                }}>
                  {officer.requestedDates.map((date, index) => {
                    const isSelectedDate = isSameDay(date, selectedDate);
                    const isApproved = officer.approvedDates?.some(
                      approvedDate => isSameDay(approvedDate, date)
                    );

                    return (
                      <Chip
                        key={index}
                        size="small"
                        label={format(date, 'dd/MM', { locale: es })}
                        sx={{
                          bgcolor: isSelectedDate ? 'primary.main' : 'grey.100',
                          color: isSelectedDate ? 'primary.contrastText' : 'text.primary',
                          fontWeight: isSelectedDate ? 'medium' : 'regular',
                          '& .MuiChip-icon': {
                            color: 'success.main',
                            marginLeft: '4px',
                            order: 1
                          }
                        }}
                        icon={isApproved ? <CheckCircleIcon /> : undefined}
                      />
                    );
                  })}
                </Box>
              )}
            </Box>
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
