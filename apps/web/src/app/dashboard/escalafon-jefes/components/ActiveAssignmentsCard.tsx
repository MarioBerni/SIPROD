'use client';

import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  IconButton,
  Tooltip,
  Chip,
  alpha,
  CardHeader,
  Card,
  LinearProgress,
} from '@mui/material';
import {
  Assignment as AssignmentIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  LocalPolice as JefeDiaIcon,
  Security as Control222Icon,
  DirectionsRun as OpEspecialesIcon,
} from '@mui/icons-material';
import { AssignmentWithOfficer } from '../types';

interface ActiveAssignmentsCardProps {
  assignments: AssignmentWithOfficer[];
}

const getAssignmentTypeInfo = (type: string) => {
  switch (type) {
    case 'jefeDia':
      return { 
        label: 'Jefe de Día', 
        color: 'primary',
        icon: JefeDiaIcon,
        gradient: 'linear-gradient(135deg, #3f51b5 0%, #2196f3 100%)',
      };
    case 'control222':
      return { 
        label: 'Servicio 222', 
        color: 'success',
        icon: Control222Icon,
        gradient: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
      };
    case 'opEspeciales':
      return { 
        label: 'Operativo Especial', 
        color: 'warning',
        icon: OpEspecialesIcon,
        gradient: 'linear-gradient(135deg, #ed6c02 0%, #ffa726 100%)',
      };
    default:
      return { 
        label: type, 
        color: 'default',
        icon: AssignmentIcon,
        gradient: 'linear-gradient(135deg, #757575 0%, #9e9e9e 100%)',
      };
  }
};

export function ActiveAssignmentsCard({ assignments }: ActiveAssignmentsCardProps) {
  const totalAssignments = assignments.length;
  const progress = totalAssignments > 0 ? (totalAssignments / 10) * 100 : 0; // Asumiendo un máximo de 10 asignaciones por día

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardHeader
        title="Asignaciones Activas"
        subheader={`${totalAssignments} asignaciones para hoy`}
        sx={{
          p: 2,
          '& .MuiCardHeader-title': {
            fontSize: '1.125rem',
            fontWeight: 600,
            color: 'text.primary',
          },
          '& .MuiCardHeader-subheader': {
            fontSize: '0.875rem',
            color: 'text.secondary',
          },
        }}
      />

      <LinearProgress 
        variant="determinate" 
        value={progress}
        sx={{
          height: 6,
          bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
          '& .MuiLinearProgress-bar': {
            bgcolor: 'primary.main',
          },
        }}
      />

      {/* Content */}
      <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {assignments.length === 0 ? (
          <Box
            sx={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 2,
              p: 3,
            }}
          >
            <Box
              sx={{
                width: 60,
                height: 60,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 2,
                bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                color: 'text.secondary',
              }}
            >
              <AssignmentIcon sx={{ fontSize: 30 }} />
            </Box>
            <Typography color="text.secondary" align="center">
              No hay asignaciones activas para este día
            </Typography>
          </Box>
        ) : (
          <List disablePadding>
            {assignments.map((assignment) => {
              const typeInfo = getAssignmentTypeInfo(assignment.type);
              const Icon = typeInfo.icon;
              return (
                <ListItem
                  key={assignment.id}
                  sx={{
                    mb: 2,
                    borderRadius: 2,
                    background: typeInfo.gradient,
                    color: 'white',
                    '&:last-child': { mb: 0 },
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <Box
                      sx={{
                        width: 40,
                        height: 40,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: 1,
                        bgcolor: 'rgba(255, 255, 255, 0.12)',
                        color: 'white',
                      }}
                    >
                      <Icon />
                    </Box>
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'inherit' }}>
                          {typeInfo.label}
                        </Typography>
                        <Chip
                          label={assignment.officer.legajo}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(255, 255, 255, 0.12)',
                            color: 'inherit',
                            fontWeight: 500,
                          }}
                        />
                      </Box>
                    }
                    secondary={
                      <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                        {`${assignment.officer.grado} ${assignment.officer.apellido}, ${assignment.officer.nombre}`}
                      </Typography>
                    }
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="Editar">
                      <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                        <EditIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Eliminar">
                      <IconButton size="small" sx={{ color: 'rgba(255, 255, 255, 0.7)', '&:hover': { color: 'white' } }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </ListItem>
              );
            })}
          </List>
        )}
      </Box>
    </Card>
  );
}
