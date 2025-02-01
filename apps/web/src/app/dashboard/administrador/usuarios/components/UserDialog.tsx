import React from 'react';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Grid,
  IconButton,
  Alert,
} from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { Grado, Rol, UserFormData } from '../types';
import { formatGrado, formatRol } from '../utils';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    width: '600px',
    maxWidth: '90vw',
  },
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  '& .MuiIconButton-root': {
    color: theme.palette.primary.contrastText,
  },
}));

interface UserDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  formData: UserFormData;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | { target: { name: string; value: string | boolean | Grado | Rol } }) => void;
  onCheckboxChange: (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | null;
  isEditing: boolean;
  loading?: boolean;
}

export function UserDialog({
  open,
  onClose,
  onSubmit,
  formData,
  onChange,
  onCheckboxChange,
  error,
  isEditing,
  loading = false
}: UserDialogProps) {
  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md">
      <StyledDialogTitle>
        {isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{ position: 'absolute', right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </StyledDialogTitle>
      <DialogContent>
        <form onSubmit={onSubmit}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Nombre"
                name="nombre"
                value={formData.nombre}
                onChange={onChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Correo"
                name="correo"
                type="email"
                value={formData.correo}
                onChange={onChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label={isEditing ? "Nueva Contraseña" : "Contraseña"}
                name="contrasenaActual"
                type="password"
                value={formData.contrasenaActual}
                onChange={onChange}
                required={!isEditing}
                margin="normal"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Grado</InputLabel>
                <Select
                  name="grado"
                  value={formData.grado}
                  onChange={onChange}
                  required
                >
                  {Object.values(Grado).map((grado) => (
                    <MenuItem key={grado} value={grado}>
                      {formatGrado(grado)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth margin="normal">
                <InputLabel>Rol</InputLabel>
                <Select
                  name="rol"
                  value={formData.rol}
                  onChange={onChange}
                  required
                >
                  {Object.values(Rol).map((rol) => (
                    <MenuItem key={rol} value={rol}>
                      {formatRol(rol)}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Cargo"
                name="cargo"
                value={formData.cargo}
                onChange={onChange}
                required
                margin="normal"
              />
            </Grid>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.terminosCondiciones}
                    onChange={onCheckboxChange('terminosCondiciones')}
                    name="terminosCondiciones"
                  />
                }
                label="Acepta términos y condiciones"
              />
            </Grid>
            {isEditing && (
              <Grid item xs={12}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={formData.activo}
                      onChange={onCheckboxChange('activo')}
                      name="activo"
                    />
                  }
                  label="Usuario activo"
                />
              </Grid>
            )}
          </Grid>
        </form>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit">
          Cancelar
        </Button>
        <Button
          onClick={onSubmit}
          variant="contained"
          color="primary"
          disabled={loading}
        >
          {loading ? 'Guardando...' : isEditing ? 'Actualizar' : 'Crear'}
        </Button>
      </DialogActions>
    </StyledDialog>
  );
}
