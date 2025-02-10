'use client';

import {
  Box,
  List,
  ListItem,
  Typography,
  Chip,
  Stack,
  Collapse,
  IconButton,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';
import { ExpandMore as ExpandMoreIcon } from '@mui/icons-material';
import { PendingOfficerAssignment } from '../types';

interface PendingAssignmentsListProps {
  pendingAssignments: PendingOfficerAssignment[];
}

export const PendingAssignmentsList = ({ pendingAssignments }: PendingAssignmentsListProps) => {
  const [expandedOfficer, setExpandedOfficer] = useState<number | null>(null);

  const handleExpandClick = (officerId: number) => {
    setExpandedOfficer(expandedOfficer === officerId ? null : officerId);
  };

  if (pendingAssignments.length === 0) {
    return (
      <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', py: 1, fontStyle: 'italic' }}>
        No hay designaciones
      </Typography>
    );
  }

  return (
    <List sx={{ width: '100%', py: 0 }}>
      {pendingAssignments.map(({ officer, assignments }) => (
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
              <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'info.dark' }}>
                {officer.grado} {officer.apellido}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {assignments.length} {assignments.length === 1 ? 'día' : 'días'} asignados
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{
                ml: 'auto',
                transform: expandedOfficer === officer.id ? 'rotate(180deg)' : 'none',
                transition: 'transform 0.3s',
                color: 'info.dark',
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Stack>

          <Collapse in={expandedOfficer === officer.id} sx={{ width: '100%' }}>
            <Box sx={{ pt: 1 }}>
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                {assignments.map((assignment) => (
                  <Chip
                    key={assignment.id}
                    label={format(assignment.date, 'd MMM', { locale: es })}
                    size="small"
                    color="info"
                    variant="outlined"
                    sx={{ mb: 0.5 }}
                  />
                ))}
              </Stack>
            </Box>
          </Collapse>
        </ListItem>
      ))}
    </List>
  );
};
