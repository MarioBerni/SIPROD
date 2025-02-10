import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  Typography,
  IconButton,
  Paper,
  Grid,
  Box,
  Tabs,
  Tab
} from '@mui/material';
import { Assignment, Officer, AssignmentType, TransitoryService } from '@/app/dashboard/escalafon-jefes/types';
import { useState, useEffect } from 'react';
import { SuggestedOfficers } from './components/SuggestedOfficers';
import CloseIcon from '@mui/icons-material/Close';
import { TransitoryServicesList } from './components/TransitoryServicesList';
import { TabPanel } from './components/TabPanel';

interface ChiefRankDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (assignment: Assignment) => void;
  selectedDate?: Date;
  existingAssignments?: Assignment[];
  officers: Officer[];
}

const DIRECTION_TABS = [
  { label: 'Dirección I', value: 'direccionI' as AssignmentType },
  { label: 'Dirección II GEO', value: 'direccionII_GEO' as AssignmentType }
];

const transitoryServices: TransitoryService[] = [
  {
    id: 1,
    title: 'AUF - NACIONAL vs PEÑAROL',
    startTime: '15:30',
    endTime: '00:30',
    date: new Date(2025, 1, 10)
  },
  {
    id: 2,
    title: 'AUF - WANDERS vs CERRO',
    startTime: '14:00',
    endTime: '20:00',
    date: new Date(2025, 1, 10)
  },
  {
    id: 3,
    title: 'FUBB - AGUADA vs NACIONAL',
    startTime: '18:00',
    endTime: '23:30',
    date: new Date(2025, 1, 10)
  },
  {
    id: 4,
    title: 'Apoyo ALLANAMIENTO DGRTID',
    startTime: '07:00',
    endTime: 'fin',
    date: new Date(2025, 1, 10)
  }
];

export function ChiefRankDialog({
  open: dialogOpen,
  onClose,
  onSave,
  selectedDate,
  existingAssignments = [],
  officers,
}: ChiefRankDialogProps) {
  const [activeTab, setActiveTab] = useState(0);
  const [assignments, setAssignments] = useState<Record<AssignmentType, Assignment | null>>({
    direccionI: null,
    direccionII_GEO: null
  });

  useEffect(() => {
    // Inicializar asignaciones existentes por dirección
    const newAssignments: Record<AssignmentType, Assignment | null> = {
      direccionI: null,
      direccionII_GEO: null
    };

    existingAssignments.forEach(assignment => {
      newAssignments[assignment.type] = assignment;
    });

    setAssignments(newAssignments);
  }, [existingAssignments]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleSave = (type: AssignmentType, data: Partial<Assignment>) => {
    if (!selectedDate || !data.officerId) return;

    const newAssignment: Assignment = {
      id: data.id || Math.random(),
      date: selectedDate,
      officerId: data.officerId,
      isSpecialService222: data.isSpecialService222 || false,
      type: type,
      status: 'propuesto',
      description: data.description
    };

    onSave(newAssignment);
  };

  return (
    <Dialog 
      open={dialogOpen} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
    >
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6">
            Asignación de Turno - {selectedDate?.toLocaleDateString()}
          </Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
          <Tabs value={activeTab} onChange={handleTabChange}>
            {DIRECTION_TABS.map((tab, index) => (
              <Tab key={tab.value} label={tab.label} id={`direction-tab-${index}`} />
            ))}
          </Tabs>
        </Box>

        {DIRECTION_TABS.map((tab, index) => (
          <TabPanel key={tab.value} value={activeTab} index={index}>
            <Paper elevation={0} sx={{ p: 2, mb: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <Typography variant="subtitle1" gutterBottom>
                    {assignments[tab.value] 
                      ? 'Asignación Actual' 
                      : 'Nueva Asignación'}
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <SuggestedOfficers
                    officers={officers}
                    selectedOfficerId={assignments[tab.value]?.officerId || 0}
                    onOfficerSelect={(officerId) => {
                      const updatedAssignment = {
                        ...assignments[tab.value],
                        officerId
                      };
                      setAssignments(prev => ({
                        ...prev,
                        [tab.value]: updatedAssignment
                      }));
                    }}
                    selectedDate={selectedDate || new Date()}
                  />
                </Grid>
              </Grid>
            </Paper>
          </TabPanel>
        ))}

        <TransitoryServicesList services={transitoryServices} />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={() => handleSave(
            DIRECTION_TABS[activeTab].value,
            assignments[DIRECTION_TABS[activeTab].value] || {}
          )} 
          variant="contained"
        >
          Guardar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
