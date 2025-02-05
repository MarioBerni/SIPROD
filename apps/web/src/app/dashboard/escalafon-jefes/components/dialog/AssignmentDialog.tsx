'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  IconButton,
  Typography,
  Box,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AssignmentForm } from './components/AssignmentForm';
import { AssignmentDialogProps } from './types';
import { dialogContentStyle } from './styles/dialogStyles';

export function AssignmentDialog({
  open,
  onClose,
  selectedDate,
  onSubmit,
  officers,
  initialData,
}: AssignmentDialogProps) {
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
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
        }}
      >
        <Box>
          <Typography variant="h6" component="span" sx={{ fontWeight: 600 }}>
            {initialData ? 'Editar' : 'Nueva'} Asignación
          </Typography>
          <Typography
            variant="subtitle2"
            sx={{ display: 'block', color: 'text.secondary', mt: 0.5 }}
          >
            {format(selectedDate, "EEEE d 'de' MMMM, yyyy", { locale: es })}
          </Typography>
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={dialogContentStyle} dividers>
        <AssignmentForm
          onSubmit={onSubmit}
          officers={officers}
          selectedDate={selectedDate}
          initialData={initialData}
          onCancel={onClose}
        />
      </DialogContent>
    </Dialog>
  );
}
