'use client';

import { Box, Card, Typography, List, ListItem, ListItemText, ListItemIcon, Avatar, Chip, alpha } from '@mui/material';
import { Lightbulb as LightbulbIcon } from '@mui/icons-material';
import { Officer } from '../../types';
import { getOfficerStatusIcon, getOfficerStatusColor } from '../../data/mockData';

interface OfficerSuggestionsProps {
  availableOfficers: Officer[];
  onSelectOfficer: (officer: Officer) => void;
}

export function OfficerSuggestions({ availableOfficers, onSelectOfficer }: OfficerSuggestionsProps) {
  // Filtrar oficiales activos y ordenar por última asignación
  const suggestedOfficers = availableOfficers
    .filter(officer => officer.estado === 'activo')
    .slice(0, 5); // Mostrar solo los 5 primeros sugeridos

  return (
    <Card
      sx={{
        p: 2,
        height: '100%',
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
            bgcolor: theme => alpha(theme.palette.warning.main, 0.12),
            color: 'warning.main',
          }}
        >
          <LightbulbIcon />
        </Box>
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Sugerencias
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Oficiales recomendados para asignación
          </Typography>
        </Box>
      </Box>

      <List sx={{ width: '100%' }}>
        {suggestedOfficers.map((officer) => {
          const StatusIcon = getOfficerStatusIcon(officer.estado);
          const statusColor = getOfficerStatusColor(officer.estado);

          return (
            <ListItem
              key={officer.id}
              sx={{
                mb: 1,
                borderRadius: 1,
                cursor: 'pointer',
                '&:hover': {
                  bgcolor: alpha('#1565C0', 0.04),
                },
              }}
              onClick={() => onSelectOfficer(officer)}
            >
              <ListItemIcon>
                <Avatar
                  sx={{
                    bgcolor: alpha(statusColor, 0.12),
                    color: statusColor,
                  }}
                >
                  <StatusIcon />
                </Avatar>
              </ListItemIcon>
              <ListItemText
                primary={
                  <Box component="span" sx={{ fontWeight: 600 }}>
                    {`${officer.grado} ${officer.apellido}, ${officer.nombre}`}
                  </Box>
                }
                secondary={
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                    <Chip
                      label={officer.legajo}
                      size="small"
                      sx={{
                        bgcolor: alpha('#1565C0', 0.08),
                        color: '#1565C0',
                      }}
                    />
                    <Typography variant="caption" color="text.secondary">
                      Última asignación: {officer.ultimaAsignacion || 'Sin asignaciones'}
                    </Typography>
                  </Box>
                }
              />
            </ListItem>
          );
        })}
      </List>
    </Card>
  );
}
