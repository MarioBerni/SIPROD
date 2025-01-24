import { Box, Chip, Paper, Typography } from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DireccionOption } from './options';

interface MobileAssignmentCardProps {
  selectedDate: Date;
  direccionI?: DireccionOption | null;
  direccionII?: DireccionOption | null;
}

export const MobileAssignmentCard = ({
  selectedDate,
  direccionI,
  direccionII,
}: MobileAssignmentCardProps) => {
  return (
    <Paper
      elevation={3}
      sx={{
        p: 2,
        border: '1px solid',
        borderColor: 'divider',
        display: { xs: 'flex', md: 'none' },
        flexDirection: 'column',
        gap: 1.5,
        width: '100%',
        mb: 2
      }}
    >
      <Typography variant="subtitle1" sx={{ 
        color: 'text.secondary',
        fontStyle: 'italic',
        fontSize: '0.9rem'
      }}>
        {format(selectedDate, 'EEEE d MMMM yyyy', { locale: es })}
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography color="primary.main" sx={{ fontSize: '0.9rem' }}>
            Dirección I:
          </Typography>
          {direccionI ? (
            <Chip
              label={direccionI.label}
              size="small"
              variant="outlined"
              sx={{ 
                color: 'primary.main',
                borderColor: 'primary.main',
                fontSize: '0.75rem'
              }}
            />
          ) : (
            <Typography color="text.secondary" sx={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
              No seleccionada
            </Typography>
          )}
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography color="primary.main" sx={{ fontSize: '0.9rem' }}>
            Dirección II:
          </Typography>
          {direccionII ? (
            <Chip
              label={direccionII.label}
              size="small"
              variant="outlined"
              sx={{ 
                color: 'primary.main',
                borderColor: 'primary.main',
                fontSize: '0.75rem'
              }}
            />
          ) : (
            <Typography color="text.secondary" sx={{ fontSize: '0.85rem', fontStyle: 'italic' }}>
              No seleccionada
            </Typography>
          )}
        </Box>
      </Box>
    </Paper>
  );
};
