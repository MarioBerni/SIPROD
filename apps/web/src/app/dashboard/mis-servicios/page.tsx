'use client';

import { Box } from '@mui/material';
import { ServiceManager } from '@/components/services/ServiceManager';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';

export default function MisServiciosPage() {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          width: '100%',
          height: '100%',
          bgcolor: 'background.paper',
          borderRadius: '12px',
          p: 3,
          boxShadow: 1
        }}
      >
        <ServiceManager />
      </Box>
    </LocalizationProvider>
  );
}
