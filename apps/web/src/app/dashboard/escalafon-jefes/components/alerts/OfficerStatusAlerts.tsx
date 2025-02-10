'use client';

import { Box, Card, Typography, Alert, Stack, alpha } from '@mui/material';
import { Warning as WarningIcon } from '@mui/icons-material';
import { Officer } from '../../types';
import { getOfficerStatusLabel } from '../../data/mockData';

interface OfficerStatusAlertsProps {
  officers: Officer[];
}

export function OfficerStatusAlerts({ officers }: OfficerStatusAlertsProps) {
  const unavailableOfficers = officers.filter(
    (officer) => officer.estado !== 'activo'
  );

  if (unavailableOfficers.length === 0) {
    return null;
  }

  const getSeverity = (estado: Officer['estado']) => {
    switch (estado) {
      case 'licencia':
        return 'error';
      case 'curso':
        return 'warning';
      default:
        return 'info';
    }
  };

  return (
    <Card
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 40,
            height: 40,
            borderRadius: 1.5,
            bgcolor: theme => alpha(theme.palette.error.main, 0.12),
            color: 'error.main',
          }}
        >
          <WarningIcon />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Alertas de Personal
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Oficiales no disponibles para asignación
          </Typography>
        </Box>
      </Box>

      <Stack spacing={1}>
        {unavailableOfficers.map((officer) => (
          <Alert
            key={officer.id}
            severity={getSeverity(officer.estado)}
            sx={{
              borderRadius: 1,
              '& .MuiAlert-message': {
                width: '100%',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                {`${officer.grado} ${officer.apellido}, ${officer.nombre}`}
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  px: 1,
                  py: 0.5,
                  borderRadius: 1,
                  bgcolor: alpha('#000', 0.04),
                  fontWeight: 500,
                }}
              >
                {getOfficerStatusLabel(officer.estado)}
              </Typography>
            </Box>
          </Alert>
        ))}
      </Stack>
    </Card>
  );
}
