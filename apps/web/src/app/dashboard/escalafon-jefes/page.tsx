'use client';

import { useState, useCallback } from 'react';
import { Box, Typography, Grid, Card, CardContent, useMediaQuery, useTheme, Button, IconButton } from '@mui/material';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { es } from 'date-fns/locale';
import { format } from 'date-fns';
import { DireccionOption, direccionOptions, direccionGeoOptions } from './options';
import { DirectionAutocomplete } from './DirectionAutocomplete';
import { CalendarTable } from './CalendarTable';
import { CalendarAssignment } from './types';
import { MobileAssignmentCard } from './MobileAssignmentCard';
import { ExportDialog } from './ExportDialog';
import { exportToImage } from './exportUtils';
import { OfficerEditDialog, Officer } from './OfficerEditDialog';
import EditIcon from '@mui/icons-material/Edit';

export default function EscalafonJefesPage() {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md'));
  
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [direccionI, setDireccionI] = useState<DireccionOption | null>(null);
  const [direccionII, setDireccionII] = useState<DireccionOption | null>(null);
  const [assignments, setAssignments] = useState<Record<string, CalendarAssignment>>({});
  const [isExportDialogOpen, setIsExportDialogOpen] = useState(false);
  const [isOfficerDialogOpen, setIsOfficerDialogOpen] = useState(false);
  const [officerType, setOfficerType] = useState<'direccionI' | 'direccionII'>('direccionI');
  const [officers, setOfficers] = useState<Record<'direccionI' | 'direccionII', Officer[]>>({
    direccionI: [],
    direccionII: []
  });

  const handleConfirm = useCallback(() => {
    if (direccionI && direccionII) {
      const dateKey = format(selectedDate, 'yyyy-MM-dd');
      setAssignments(prev => ({
        ...prev,
        [dateKey]: {
          date: selectedDate,
          direccionI,
          direccionII,
        },
      }));
      setDireccionI(null);
      setDireccionII(null);
    }
  }, [selectedDate, direccionI, direccionII]);

  const handleCancel = () => {
    setDireccionI(null);
    setDireccionII(null);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateKey = format(date, 'yyyy-MM-dd');
    const assignment = assignments[dateKey];
    if (assignment) {
      setDireccionI(assignment.direccionI);
      setDireccionII(assignment.direccionII);
    } else {
      setDireccionI(null);
      setDireccionII(null);
    }
  };

  const handleExport = async (month: number, year: number) => {
    try {
      await exportToImage('calendar-table', { month, year });
    } catch (error) {
      console.error('Error al exportar:', error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  const handleSaveOfficers = (updatedOfficers: Officer[]) => {
    setOfficers(prev => ({
      ...prev,
      [officerType]: updatedOfficers
    }));

    // Actualizar las opciones de dirección
    const updatedOptions = updatedOfficers.map(officer => ({
      id: parseInt(officer.id),
      label: `${officer.grado} ${officer.nombre} ${officer.apellido}`
    }));

    if (officerType === 'direccionI') {
      direccionOptions.length = 0;
      direccionOptions.push(...updatedOptions);
    } else {
      direccionGeoOptions.length = 0;
      direccionGeoOptions.push(...updatedOptions);
    }
  };

  const handleEditOfficers = (type: 'direccionI' | 'direccionII') => {
    setOfficerType(type);
    setIsOfficerDialogOpen(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            mb: 2 
          }}>
            <Typography variant="h4" color="primary" sx={{ fontWeight: 'bold' }}>
              Escalafón Jefes día
            </Typography>
            <Button
              variant="contained"
              onClick={() => setIsExportDialogOpen(true)}
              sx={{ 
                bgcolor: 'primary.main',
                color: 'background.paper',
                fontWeight: 'bold',
                display: { xs: 'none', md: 'flex' },
                '&:hover': {
                  bgcolor: 'primary.dark'
                }
              }}
            >
              Exportar
            </Button>
          </Box>
        </Grid>

        {/* Calendario y Selección */}
        <Grid item xs={12} md={4}>
          {/* Calendario */}
          <Card sx={{ mb: 3, display: { xs: 'block', md: 'block' } }}>
            <CardContent>
              <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
                <DateCalendar
                  value={selectedDate}
                  onChange={(newValue: Date | null) => {
                    if (newValue) {
                      handleDateSelect(newValue);
                      setCurrentMonth(newValue);
                    }
                  }}
                  onMonthChange={(newMonth: Date) => {
                    setCurrentMonth(newMonth);
                  }}
                  sx={{ width: '100%' }}
                />
              </LocalizationProvider>
            </CardContent>
          </Card>

          {/* Selección de Direcciones */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Box sx={{ position: 'relative', mb: 2 }}>
                <IconButton 
                  sx={{ 
                    position: 'absolute', 
                    right: -8, 
                    top: -8,
                    color: 'primary.main'
                  }}
                  onClick={() => handleEditOfficers(direccionI ? 'direccionI' : 'direccionII')}
                >
                  <EditIcon />
                </IconButton>
              </Box>
              <DirectionAutocomplete
                title="Dirección I"
                color="primary"
                value={direccionI}
                onChange={setDireccionI}
                options={direccionOptions}
              />
              <Box sx={{ mt: 2 }}>
                <DirectionAutocomplete
                  title="Dirección II y GEO"
                  color="primary"
                  value={direccionII}
                  onChange={setDireccionII}
                  options={direccionGeoOptions}
                />
              </Box>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 3 }}>
                <Button 
                  onClick={handleCancel} 
                  color="primary" 
                  variant="outlined"
                  sx={{ 
                    borderWidth: 2,
                    '&:hover': { borderWidth: 2 },
                    color: 'primary.main',
                    borderColor: 'primary.main'
                  }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirm}
                  color="primary"
                  variant="contained"
                  disabled={!direccionI || !direccionII}
                  sx={{ 
                    fontWeight: 'bold',
                    px: 3,
                    bgcolor: 'primary.main',
                    color: 'background.paper'
                  }}
                >
                  Confirmar
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Tabla de Calendario (Solo en Desktop) */}
        {isDesktop && (
          <Grid item md={8}>
            <CalendarTable
              currentMonth={currentMonth}
              assignments={assignments}
              selectedDate={selectedDate}
              onDateSelect={handleDateSelect}
            />
          </Grid>
        )}
        
        {/* Mobile Assignment Card */}
        {!isDesktop && (
          <Grid item xs={12}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              <MobileAssignmentCard
                selectedDate={selectedDate}
                direccionI={assignments[format(selectedDate, 'yyyy-MM-dd')]?.direccionI}
                direccionII={assignments[format(selectedDate, 'yyyy-MM-dd')]?.direccionII}
              />
              <Button
                variant="contained"
                fullWidth
                onClick={() => setIsExportDialogOpen(true)}
                sx={{ 
                  bgcolor: 'primary.main',
                  color: 'background.paper',
                  fontWeight: 'bold',
                  display: { xs: 'flex', md: 'none' },
                  mt: 2,
                  mb: 4,
                  py: 1.5,
                  '&:hover': {
                    bgcolor: 'primary.dark'
                  }
                }}
              >
                Exportar
              </Button>
            </Box>
          </Grid>
        )}
      </Grid>

      <ExportDialog
        open={isExportDialogOpen}
        onClose={() => setIsExportDialogOpen(false)}
        onExport={handleExport}
      />
      <OfficerEditDialog
        open={isOfficerDialogOpen}
        onClose={() => setIsOfficerDialogOpen(false)}
        officers={officers[officerType]}
        onSave={handleSaveOfficers}
        title={officerType === 'direccionI' ? 'Editar Dirección I' : 'Editar Dirección II y GEO'}
      />
    </Box>
  );
}
