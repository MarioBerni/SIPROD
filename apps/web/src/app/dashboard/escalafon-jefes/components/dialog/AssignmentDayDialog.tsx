'use client';

import { FC, useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  alpha,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Add as AddIcon } from '@mui/icons-material';
import { AssignmentFormData } from './types';
import { Officer } from '../../types';

interface AssignmentDayDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  onCreateAssignment: (data: AssignmentFormData) => void;
  officers: Officer[];
}

export const AssignmentDayDialog: FC<AssignmentDayDialogProps> = ({
  open,
  onClose,
  selectedDate,
  onCreateAssignment,
  officers,
}) => {
  const [formData, setFormData] = useState<AssignmentFormData>({
    officerId: '',
    startDate: format(selectedDate, 'yyyy-MM-dd'),
    endDate: format(selectedDate, 'yyyy-MM-dd'),
    type: 'direccionI',
    description: '',
  });

  const handleSubmit = () => {
    onCreateAssignment(formData);
  };

  const handleTypeChange = (value: string) => {
    if (value === 'direccionI' || value === 'direccionII' || value === 'geo') {
      setFormData({ ...formData, type: value });
    }
  };

  const availableOfficers = officers.filter(officer => officer.estado === 'activo');

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="md" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: (theme) => `0 8px 24px ${alpha(theme.palette.primary.dark, 0.12)}`,
        }
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Nueva Asignación - {format(selectedDate, 'EEEE d \'de\' MMMM', { locale: es })}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pt: 2 }}>
        <Grid container spacing={3}>
          {/* Formulario de Asignación */}
          <Grid item xs={12} md={7}>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Detalles de la Asignación
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>Tipo de Servicio</InputLabel>
                    <Select
                      value={formData.type}
                      label="Tipo de Servicio"
                      onChange={(e) => handleTypeChange(e.target.value)}
                    >
                      <MenuItem value="direccionI">Dirección I</MenuItem>
                      <MenuItem value="direccionII">Dirección II</MenuItem>
                      <MenuItem value="geo">GEO</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Descripción"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Lista de Oficiales Disponibles */}
          <Grid item xs={12} md={5}>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 2 }}>
                Oficiales Disponibles ({availableOfficers.length})
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <List sx={{ maxHeight: 300, overflow: 'auto' }}>
                {availableOfficers.map((officer) => (
                  <ListItem
                    key={officer.id}
                    sx={{
                      borderRadius: 1,
                      mb: 1,
                      '&:hover': {
                        bgcolor: 'action.hover',
                      },
                    }}
                  >
                    <ListItemText
                      primary={officer.nombre}
                      secondary={`ID: ${officer.id}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        onClick={() => setFormData({ ...formData, officerId: officer.id })}
                        color={formData.officerId === officer.id ? 'primary' : 'default'}
                      >
                        <AddIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={handleSubmit}
          variant="contained"
          disabled={!formData.officerId}
        >
          Crear Asignación
        </Button>
      </DialogActions>
    </Dialog>
  );
};
