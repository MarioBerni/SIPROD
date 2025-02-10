'use client';

import {
  Box,
  List,
  ListItem,
  Typography,
  Stack,
  Collapse,
  IconButton,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { UnavailableOfficer } from '../types';

interface UnavailableOfficersListProps {
  unavailableOfficers: UnavailableOfficer[];
}

export const UnavailableOfficersList = ({ unavailableOfficers }: UnavailableOfficersListProps) => {
  const [expandedOfficer, setExpandedOfficer] = useState<number | null>(null);

  const handleExpandClick = (officerId: number) => {
    setExpandedOfficer(expandedOfficer === officerId ? null : officerId);
  };

  if (unavailableOfficers.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1, fontStyle: 'italic' }}>
        No hay oficiales no disponibles
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', py: 0 }}>
      {unavailableOfficers.map(({ officer, reason, startDate, endDate }) => (
        <ListItem
          key={officer.id}
          sx={{
            flexDirection: 'column',
            alignItems: 'flex-start',
            py: 1,
            px: 1,
            '&:not(:last-child)': {
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
          }}
        >
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            sx={{ width: '100%', cursor: 'pointer' }}
            onClick={() => handleExpandClick(officer.id)}
          >
            <Box>
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'warning.dark' }}>
                {officer.grado} {officer.apellido}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {reason}
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{
                ml: 'auto',
                transform: expandedOfficer === officer.id ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s',
                color: 'warning.dark',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Stack>

          <Collapse in={expandedOfficer === officer.id} sx={{ width: '100%' }}>
            <Box sx={{ pt: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Desde: {format(startDate, 'd MMM yyyy', { locale: es })}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Hasta: {format(endDate, 'd MMM yyyy', { locale: es })}
              </Typography>
            </Box>
          </Collapse>
        </ListItem>
      ))}
    </List>
  );
};
