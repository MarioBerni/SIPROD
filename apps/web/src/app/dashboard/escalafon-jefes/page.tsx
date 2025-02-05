'use client';

import { useState, useEffect } from 'react';
import { Box, Grid, Typography, alpha, Paper } from '@mui/material';
import { Assignment as AssignmentIcon } from '@mui/icons-material';
import { usePageTitle } from '@/contexts/PageTitleContext';
import { AssignmentDayDialog } from './components/dialog/AssignmentDayDialog';
import { EscalafonCalendar } from './components/calendar/EscalafonCalendar';
import { OfficerStatusAlerts } from './components/alerts/OfficerStatusAlerts';
import { mockOfficers } from './data/mockData';
import { Assignment } from './types';
import { AssignmentFormData } from './components/dialog/types';
import { CalendarEvent } from './components/calendar/types';

// Estadísticas del escalafón
const stats = [
  {
    title: 'Total Personal',
    value: mockOfficers.length.toString(),
    icon: '👥',
  },
  {
    title: 'Activos',
    value: mockOfficers.filter(o => o.estado === 'activo').length.toString(),
    icon: '✅',
  },
  {
    title: 'En Servicio',
    value: '12',
    icon: '🔄',
  },
  {
    title: 'Licencias',
    value: mockOfficers.filter(o => o.estado === 'licencia').length.toString(),
    icon: '📋',
  },
];

export default function EscalafonPage() {
  const { setPageTitle } = usePageTitle();
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isAssignmentDialogOpen, setIsAssignmentDialogOpen] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    setPageTitle('Escalafón Jefes', AssignmentIcon);
  }, [setPageTitle]);

  const calendarEvents: CalendarEvent[] = assignments.map((assignment) => ({
    id: assignment.id,
    title: `Asignación: ${assignment.type}`,
    start: new Date(assignment.startDate),
    end: new Date(assignment.endDate),
    type: assignment.type,
    officerId: assignment.officerId,
    description: assignment.description,
  }));

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setIsAssignmentDialogOpen(true);
  };

  const handleDialogClose = () => {
    setIsAssignmentDialogOpen(false);
    setSelectedDate(null);
  };

  const handleAssignmentCreate = (data: AssignmentFormData) => {
    const newAssignment: Assignment = {
      id: Date.now().toString(),
      officerId: data.officerId,
      startDate: data.startDate,
      endDate: data.endDate,
      type: data.type,
      status: 'asignado',
      description: data.description,
    };

    setAssignments((prev) => [...prev, newAssignment]);
    handleDialogClose();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" sx={{ fontWeight: 600, color: 'text.primary', mb: 0.5 }}>
          Escalafón Jefes
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Gestión de asignaciones y servicios del personal
        </Typography>
      </Box>

      {/* Stats Cards */}
      <Grid container spacing={3} sx={{ mb: 3 }}>
        {stats.map((stat, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Paper
              elevation={0}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: 'background.paper',
                boxShadow: (theme) => `0 2px 14px ${alpha(theme.palette.primary.dark, 0.06)}`,
                border: '1px solid',
                borderColor: (theme) => alpha(theme.palette.divider, 0.08),
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <Box
                  sx={{
                    width: 42,
                    height: 42,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1.5,
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.08),
                    color: 'primary.main',
                    fontSize: '1.5rem',
                  }}
                >
                  {stat.icon}
                </Box>
                <Box>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mb: 0.5 }}>
                    {stat.title}
                  </Typography>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    {stat.value}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Calendar Section */}
        <Grid item xs={12} lg={8}>
          <Paper 
            elevation={0}
            sx={{ 
              p: 2,
              height: { xs: 500, sm: 600, md: 680 }, 
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: (theme) => `0 2px 14px ${alpha(theme.palette.primary.dark, 0.06)}`,
              border: '1px solid',
              borderColor: (theme) => alpha(theme.palette.divider, 0.08),
              display: 'flex',
              flexDirection: 'column',
              overflow: 'hidden'
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Calendario de Asignaciones
              </Typography>
            </Box>
            <Box sx={{ flex: 1, minHeight: 0 }}>
              <EscalafonCalendar 
                onDateSelect={handleDateSelect}
                events={calendarEvents}
                selectedDate={selectedDate}
              />
            </Box>
          </Paper>
        </Grid>

        {/* Status Section */}
        <Grid item xs={12} lg={4}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 2,
              bgcolor: 'background.paper',
              boxShadow: (theme) => `0 2px 14px ${alpha(theme.palette.primary.dark, 0.06)}`,
              border: '1px solid',
              borderColor: (theme) => alpha(theme.palette.divider, 0.08),
            }}
          >
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'text.primary' }}>
                Estado del Personal
              </Typography>
            </Box>
            <Box sx={{ maxHeight: 400, overflowY: 'auto' }}>
              <OfficerStatusAlerts officers={mockOfficers} />
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {selectedDate && (
        <AssignmentDayDialog
          open={isAssignmentDialogOpen}
          onClose={handleDialogClose}
          selectedDate={selectedDate}
          onCreateAssignment={handleAssignmentCreate}
          officers={mockOfficers}
        />
      )}
    </Box>
  );
}