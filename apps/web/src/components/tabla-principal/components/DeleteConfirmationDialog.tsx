import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  useTheme
} from '@mui/material';

interface DeleteConfirmationDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading?: boolean;
}

export const DeleteConfirmationDialog = ({
  open,
  onClose,
  onConfirm,
  loading = false
}: DeleteConfirmationDialogProps) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title" sx={{ bgcolor: theme.palette.error.main, color: 'white' }}>
        Confirmar Eliminación
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description" sx={{ mt: 2 }}>
          ¿Está seguro que desea eliminar este registro? Esta acción no se puede deshacer.
        </DialogContentText>
      </DialogContent>
      <DialogActions sx={{ p: 2 }}>
        <Button
          onClick={onClose}
          color="primary"
          variant="outlined"
          disabled={loading}
        >
          Cancelar
        </Button>
        <Button
          onClick={onConfirm}
          color="error"
          variant="contained"
          autoFocus
          disabled={loading}
        >
          Eliminar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
