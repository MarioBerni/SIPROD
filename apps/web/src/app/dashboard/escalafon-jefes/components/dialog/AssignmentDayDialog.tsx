'use client';

import { FC } from 'react';
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
  Typography,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AssignmentFormSchema, Officer } from '../../types';
import { useAssignmentForm } from './hooks/useAssignmentForm';

interface AssignmentDayDialogProps {
  open: boolean;
  onClose: () => void;
  selectedDate: Date;
  onCreateAssignment: (data: AssignmentFormSchema) => void;
  officers: Officer[];
}

export const AssignmentDayDialog: FC<AssignmentDayDialogProps> = ({
  open,
  onClose,
  selectedDate,
  onCreateAssignment,
  officers,
}) => {
  const form = useAssignmentForm({
    type: 'direccionI',
  });

  const handleSubmit = (data: AssignmentFormSchema) => {
    onCreateAssignment(data);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6" component="div">
          Nueva Asignación
        </Typography>
        <Typography variant="subtitle2" color="text.secondary">
          {format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
        </Typography>
      </DialogTitle>

      <form onSubmit={form.handleSubmit(handleSubmit)}>
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Tipo de Asignación</InputLabel>
                <Select
                  {...form.register('type')}
                  label="Tipo de Asignación"
                  error={!!form.formState.errors.type}
                >
                  <MenuItem value="direccionI">Jefe de Día</MenuItem>
                  <MenuItem value="direccionII_GEO">Servicio 222</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Oficial</InputLabel>
                <Select
                  {...form.register('officerId')}
                  label="Oficial"
                  error={!!form.formState.errors.officerId}
                >
                  {officers
                    .filter((officer) => officer.estado === 'activo')
                    .map((officer) => (
                      <MenuItem key={officer.id} value={officer.id.toString()}>
                        {officer.grado} {officer.apellido} ({officer.legajo})
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...form.register('description')}
                label="Descripción"
                multiline
                rows={3}
                fullWidth
                error={!!form.formState.errors.description}
                helperText={form.formState.errors.description?.message}
              />
            </Grid>
          </Grid>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={onClose} color="inherit">
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Crear Asignación
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
