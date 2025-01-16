'use client';

import { Box, Typography, Paper } from '@mui/material';

export default function EscalafonJefesPage() {
  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Escalafón Jefes día
      </Typography>
      
      <Paper sx={{ p: 3, mt: 3 }}>
        <Typography variant="body1">
          Contenido del Escalafón de Jefes día
        </Typography>
        {/* Aquí irá el contenido específico de la página */}
      </Paper>
    </Box>
  );
}
