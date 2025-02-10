import { Box, Grid } from '@mui/material';
import { useState } from 'react';
import { Assignment } from '@/app/dashboard/escalafon-jefes/types';
import { ChiefRankCalendar } from './calendar/ChiefRankCalendar';
import { ChiefRankDialog } from './dialog/ChiefRankDialog';
import { ChiefRankStatsCard } from './cards/ChiefRankStatsCard';
import { mockChiefs } from '@/data/__mocks__/chiefsRankMock';

export const ChiefRankManager = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [, setSelectedShift] = useState<Assignment | undefined>();
  const [shifts, setShifts] = useState<Assignment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [existingAssignments, setExistingAssignments] = useState<Assignment[]>([]);

  // Usar los datos mock importados
  const mockOfficers = mockChiefs;

  const handleDateClick = (date: Date, assignments: Assignment[]) => {
    setSelectedDate(date);
    setExistingAssignments(assignments);
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setSelectedShift(undefined);
    setSelectedDate(undefined);
    setExistingAssignments([]);
    setIsDialogOpen(false);
  };

  const handleSaveShift = async (shiftData: Omit<Assignment, 'id'>) => {
    try {
      const newShift: Assignment = {
        ...shiftData,
        id: shifts.length + 1,
        status: 'pendiente',
      };

      setShifts((prevShifts) => [...prevShifts, newShift]);
      handleCloseDialog();
    } catch (error) {
      console.error('Error al guardar el turno:', error);
    }
  };

  const handleShiftSelect = (shift: Assignment) => {
    setSelectedShift(shift);
    setIsDialogOpen(true);
  };

  return (
    <Box 
      sx={{ 
        p: 3,
        bgcolor: 'background.default',
        minHeight: 'calc(100vh - 64px)',
      }}
    >
      <Grid container spacing={3}>
        {/* Sección Principal - Calendario */}
        <Grid item xs={12} lg={8}>
          <Box
            sx={{
              bgcolor: 'background.paper',
              borderRadius: 2,
              overflow: 'hidden',
              boxShadow: '0 0 2px rgba(0,0,0,0.1)',
            }}
          >
            <ChiefRankCalendar 
              onAddShift={handleDateClick}
              shifts={shifts}
              officers={mockOfficers}
              onShiftSelect={handleShiftSelect}
            />
          </Box>
        </Grid>

        {/* Panel Lateral */}
        <Grid item xs={12} lg={4}>
          <ChiefRankStatsCard 
            assignments={shifts}
            officers={mockOfficers}
          />
        </Grid>
      </Grid>
      <ChiefRankDialog
        open={isDialogOpen}
        onClose={handleCloseDialog}
        onSave={handleSaveShift}
        selectedDate={selectedDate}
        existingAssignments={existingAssignments}
        officers={mockOfficers}
      />
    </Box>
  );
};
