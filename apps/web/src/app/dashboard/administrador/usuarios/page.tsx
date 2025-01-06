'use client';

import { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Alert,
  Card,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  SelectChangeEvent,
  Checkbox,
  FormControlLabel,
  Grid,
  CircularProgress,
  Paper
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { api } from '@/lib/api';

// Componentes estilizados
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: '100%',
  margin: '0 auto',
}));


const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
  '& .MuiTableContainer-root': {
    maxHeight: 'calc(100vh - 300px)',
    overflow: 'auto',
  },
}));

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
  position: 'sticky',
  top: 0,
  zIndex: 1,
}));


const StatusChip = styled(Box)<{ status: 'active' | 'inactive' }>(({ theme, status }) => ({
  padding: '4px 12px',
  borderRadius: '12px',
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '0.875rem',
  fontWeight: 500,
  backgroundColor: status === 'active' ? theme.palette.success.light : theme.palette.error.light,
  color: status === 'active' ? theme.palette.success.dark : theme.palette.error.dark,
}));

enum Grado {
  CTE_GENERAL = 'CTE_GENERAL',
  CTE_MAYOR = 'CTE_MAYOR',
  CAPITAN = 'CAPITAN',
  TENIENTE_PRIMERO = 'TENIENTE_PRIMERO',
  TENIENTE = 'TENIENTE',
  ALFEREZ = 'ALFEREZ',
  SUB_OFICIAL = 'SUB_OFICIAL',
  SARGENTO = 'SARGENTO',
  CABO = 'CABO',
  GUARDIA = 'GUARDIA'
}

enum Rol {
  ADMINISTRADOR = 'ADMINISTRADOR',
  OFICIAL = 'OFICIAL',
  COMANDO_DIRECCION_I = 'COMANDO_DIRECCION_I',
  COMANDO_DIRECCION_II = 'COMANDO_DIRECCION_II',
  COMANDO_GEO = 'COMANDO_GEO',
  COMANDO_DNGR = 'COMANDO_DNGR',
  JEFEDIA_DIRECCION_I = 'JEFEDIA_DIRECCION_I',
  JEFEDIA_DIRECCION_II_Y_GEO = 'JEFEDIA_DIRECCION_II_Y_GEO'
}

interface User {
  id: string;
  fechaCreacion: string;
  ultimaFechaAcceso: string | null;
  contrasenaActual: string;
  nuevaContrasena?: string;
  grado: Grado;
  nombre: string;
  rol: Rol;
  cargo: string;
  correo: string;
  terminosCondiciones: boolean;
  desplieguesCargados: number;
  activo: boolean;
  updatedAt: string;
}

interface UserFormData {
  nombre: string;
  correo: string;
  contrasenaActual: string;
  nuevaContrasena?: string;
  grado: Grado;
  rol: Rol;
  cargo: string;
  terminosCondiciones?: boolean;
  activo?: boolean;
}

const initialFormData: UserFormData = {
  nombre: '',
  correo: '',
  contrasenaActual: '',
  grado: Grado.GUARDIA,
  rol: Rol.OFICIAL,
  cargo: '',
  terminosCondiciones: false,
  activo: true
};

const formatGrado = (grado: Grado): string => {
  const formatMap: Record<Grado, string> = {
    CTE_GENERAL: 'Comandante General',
    CTE_MAYOR: 'Comandante Mayor',
    CAPITAN: 'Capitán',
    TENIENTE_PRIMERO: 'Teniente 1°',
    TENIENTE: 'Teniente',
    ALFEREZ: 'Alférez',
    SUB_OFICIAL: 'Sub Oficial',
    SARGENTO: 'Sargento',
    CABO: 'Cabo',
    GUARDIA: 'Guardia'
  };
  return formatMap[grado] || grado;
};

const rolLabels: Record<Rol, string> = {
  ADMINISTRADOR: 'Administrador',
  OFICIAL: 'Oficial',
  COMANDO_DIRECCION_I: 'Comando Dirección I',
  COMANDO_DIRECCION_II: 'Comando Dirección II',
  COMANDO_GEO: 'Comando GEO',
  COMANDO_DNGR: 'Comando DNGR',
  JEFEDIA_DIRECCION_I: 'Jefe dia Dirección I',
  JEFEDIA_DIRECCION_II_Y_GEO: 'Jefe dia Dirección II y GEO'
};

const formatRol = (rol: Rol): string => {
  return rolLabels[rol] || rol;
};

// Estilos adicionales para el formulario
const FormSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const FormTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  fontWeight: 600,
  marginBottom: theme.spacing(2),
}));

const FormGrid = styled(Grid)(({ theme }) => ({
  gap: theme.spacing(2),
}));

const FormActions = styled(DialogActions)(({ theme }) => ({
  padding: theme.spacing(2, 3),
  borderTop: `1px solid ${theme.palette.divider}`,
  gap: theme.spacing(1),
  '& .MuiButton-root': {
    minWidth: 120,
  },
}));

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

const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Error desconocido';
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Función para cargar usuarios
  const loadUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/user');
      setUsers(response.data);
    } catch (error) {
      console.error('Error al cargar usuarios:', error);
      setError(handleError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleOpenCreateDialog = () => {
    setFormData(initialFormData);
    setEditingId(null);
    setError(null);
    setOpenDialog(true);
  };

  const handleOpenEditDialog = (user: User) => {
    setFormData({
      nombre: user.nombre,
      correo: user.correo,
      contrasenaActual: '',
      grado: user.grado,
      rol: user.rol,
      cargo: user.cargo,
      terminosCondiciones: user.terminosCondiciones,
      activo: user.activo
    });
    setEditingId(user.id);
    setError(null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormData);
    setEditingId(null);
    setError(null);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> | SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCheckboxChange = (name: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [name]: event.target.checked
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (editingId) {
        // Actualizar usuario existente
        await api.put(`/user/${editingId}`, formData);
      } else {
        // Crear nuevo usuario
        await api.post('/user', formData);
      }

      await loadUsers();
      handleCloseDialog();
    } catch (error: unknown) {
      console.error('Error al guardar usuario:', error);
      setError(handleError(error));
    }
  };

  const handleDelete = async (userId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este usuario?')) {
      try {
        await api.delete(`/user/${userId}`);
        loadUsers();
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    }
  };

  return (
    <PageContainer>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          Gestión de Usuarios
        </Typography>
        <Button
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={handleOpenCreateDialog}
          disabled={loading}
        >
          Nuevo Usuario
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <StyledCard>
          <TableContainer component={Paper}>
            <Table stickyHeader>
              <TableHead>
                <TableRow>
                  <TableHeaderCell>Nombre</TableHeaderCell>
                  <TableHeaderCell>Correo</TableHeaderCell>
                  <TableHeaderCell>Grado</TableHeaderCell>
                  <TableHeaderCell>Rol</TableHeaderCell>
                  <TableHeaderCell>Cargo</TableHeaderCell>
                  <TableHeaderCell>Última Conexión</TableHeaderCell>
                  <TableHeaderCell>Despliegues</TableHeaderCell>
                  <TableHeaderCell>Estado</TableHeaderCell>
                  <TableHeaderCell>Términos</TableHeaderCell>
                  <TableHeaderCell align="center">Acciones</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id} hover>
                    <TableCell>{user.nombre}</TableCell>
                    <TableCell>{user.correo}</TableCell>
                    <TableCell>{formatGrado(user.grado)}</TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{
                          color: user.rol === Rol.ADMINISTRADOR ? 'primary.main' : 'text.secondary',
                          fontWeight: user.rol === Rol.ADMINISTRADOR ? 600 : 400,
                        }}
                      >
                        {formatRol(user.rol)}
                      </Typography>
                    </TableCell>
                    <TableCell>{user.cargo}</TableCell>
                    <TableCell>
                      {user.ultimaFechaAcceso 
                        ? new Date(user.ultimaFechaAcceso).toLocaleString('es-AR')
                        : 'Nunca'}
                    </TableCell>
                    <TableCell>{user.desplieguesCargados}</TableCell>
                    <TableCell>
                      <StatusChip status={user.activo ? 'active' : 'inactive'}>
                        {user.activo ? 'Activo' : 'Inactivo'}
                      </StatusChip>
                    </TableCell>
                    <TableCell>
                      {user.terminosCondiciones ? '✓' : '✗'}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenEditDialog(user)}
                        size="small"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(user.id)}
                        size="small"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </StyledCard>
      )}

      <StyledDialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <StyledDialogTitle>
          <Box display="flex" alignItems="center" justifyContent="space-between">
            <Typography variant="h6">
              {editingId ? 'Editar Usuario' : 'Crear Nuevo Usuario'}
            </Typography>
            <IconButton
              aria-label="close"
              onClick={handleCloseDialog}
              size="small"
            >
              <CloseIcon />
            </IconButton>
          </Box>
        </StyledDialogTitle>

        <form onSubmit={handleSubmit}>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <FormSection>
              <FormTitle variant="subtitle1">
                Información Personal
              </FormTitle>
              <FormGrid container>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Nombre Completo"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                    helperText="Ingrese el nombre completo del usuario"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required>
                    <InputLabel>Grado</InputLabel>
                    <Select
                      name="grado"
                      value={formData.grado}
                      onChange={handleInputChange}
                      label="Grado"
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
                  <TextField
                    fullWidth
                    label="Cargo"
                    name="cargo"
                    value={formData.cargo}
                    onChange={handleInputChange}
                    required
                  />
                </Grid>
              </FormGrid>
            </FormSection>

            <FormSection>
              <FormTitle variant="subtitle1">
                Información de Cuenta
              </FormTitle>
              <FormGrid container>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Correo Electrónico"
                    name="correo"
                    type="email"
                    value={formData.correo}
                    onChange={handleInputChange}
                    required
                    helperText="Este será el usuario para iniciar sesión"
                  />
                </Grid>
                {!editingId && (
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Contraseña"
                      name="contrasenaActual"
                      type="password"
                      value={formData.contrasenaActual}
                      onChange={handleInputChange}
                      required={!editingId}
                      helperText="Mínimo 8 caracteres"
                    />
                  </Grid>
                )}
              </FormGrid>
            </FormSection>

            <FormSection>
              <FormTitle variant="subtitle1">
                Permisos y Estado
              </FormTitle>
              <FormGrid container>
                <Grid item xs={12}>
                  <FormControl fullWidth required>
                    <InputLabel>Rol</InputLabel>
                    <Select
                      name="rol"
                      value={formData.rol}
                      onChange={handleInputChange}
                      label="Rol"
                    >
                      {Object.values(Rol).map((rol) => (
                        <MenuItem key={rol} value={rol}>
                          {formatRol(rol)}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.activo || false}
                        onChange={handleCheckboxChange('activo')}
                        name="activo"
                      />
                    }
                    label="Usuario Activo"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={formData.terminosCondiciones || false}
                        onChange={handleCheckboxChange('terminosCondiciones')}
                        name="terminosCondiciones"
                      />
                    }
                    label="Aceptar términos y condiciones"
                  />
                </Grid>
              </FormGrid>
            </FormSection>
          </DialogContent>

          <FormActions>
            <Button
              onClick={handleCloseDialog}
              color="inherit"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              variant="contained"
              color="primary"
            >
              {editingId ? 'Guardar Cambios' : 'Crear Usuario'}
            </Button>
          </FormActions>
        </form>
      </StyledDialog>
    </PageContainer>
  );
}
