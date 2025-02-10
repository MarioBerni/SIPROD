'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField
} from '@mui/material';

interface ServiceRejectDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  reason: string;
  onReasonChange: (reason: string) => void;
}

export const ServiceRejectDialog = ({
  open,
  onClose,
  onConfirm,
  reason,
  onReasonChange
}: ServiceRejectDialogProps) => {
  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>Motivo del Rechazo</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Ingrese el motivo del rechazo"
          fullWidth
          multiline
          rows={3}
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button 
          onClick={() => onConfirm(reason)}
          color="error"
          disabled={!reason.trim()}
        >
          Confirmar Rechazo
        </Button>
      </DialogActions>
    </Dialog>
  );
};
