'use client';

import { Box, Typography } from '@mui/material';

export function DashboardHeader() {
  return (
    <Box sx={{ mb: 4, mt: 2 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Panel de Control
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        Monitoreo en tiempo real de recursos y resultados operativos
      </Typography>
    </Box>
  );
}