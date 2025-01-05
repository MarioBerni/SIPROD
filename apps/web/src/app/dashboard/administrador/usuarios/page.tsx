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
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { AxiosError } from 'axios';
import { api } from '@/lib/api';

// Componentes estilizados
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto',
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
}));

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[2],
  borderRadius: theme.shape.borderRadius,
  overflow: 'hidden',
}));

const TableHeaderCell = styled(TableCell)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  fontWeight: 600,
}));

const ActionButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  boxShadow: 'none',
  '&:hover': {
    boxShadow: theme.shadows[2],
  },
}));

const FormContainer = styled(DialogContent)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  padding: theme.spacing(3),
  minWidth: 400,
}));

interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: 'USER' | 'ADMIN';
}

interface UserFormData {
  username: string;
  email: string;
  fullName: string;
  password?: string;
  role: 'USER' | 'ADMIN';
}

const initialFormData: UserFormData = {
  username: '',
  email: '',
  fullName: '',
  role: 'USER',
};

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState<UserFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const response = await api.get('/users');
      if (response.data) {
        setUsers(response.data);
        setError(null);
      }
    } catch (error) {
      console.error('Error loading users:', error);
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Error al cargar usuarios');
      } else {
        setError('Error inesperado al cargar usuarios');
      }
    }
  };

  const handleOpenDialog = (user?: User) => {
    if (user) {
      setFormData({
        username: user.username,
        email: user.email,
        fullName: user.fullName || '',
        role: user.role,
      });
      setEditingId(user.id);
    } else {
      setFormData(initialFormData);
      setEditingId(null);
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setFormData(initialFormData);
    setEditingId(null);
    setError(null);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/users/${editingId}`, formData);
      } else {
        await api.post('/users', formData);
      }
      handleCloseDialog();
      loadUsers();
    } catch (error) {
      console.error('Error saving user:', error);
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Error al guardar usuario');
      } else {
        setError('Error inesperado al guardar usuario');
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Está seguro de eliminar este usuario?')) {
      return;
    }

    try {
      await api.delete(`/users/${id}`);
      loadUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      if (error instanceof AxiosError) {
        setError(error.response?.data?.message || 'Error al eliminar usuario');
      } else {
        setError('Error inesperado al eliminar usuario');
      }
    }
  };

  return (
    <PageContainer>
      <HeaderContainer>
        <Box>
          <Typography variant="h4" sx={{ fontWeight: 600, color: 'primary.main', mb: 1 }}>
            Gestión de Usuarios
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Administre los usuarios del sistema y sus roles
          </Typography>
        </Box>
        <ActionButton
          variant="contained"
          startIcon={<PersonAddIcon />}
          onClick={() => handleOpenDialog()}
          size="large"
        >
          Nuevo Usuario
        </ActionButton>
      </HeaderContainer>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <StyledCard>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableHeaderCell>Usuario</TableHeaderCell>
                <TableHeaderCell>Nombre Completo</TableHeaderCell>
                <TableHeaderCell>Email</TableHeaderCell>
                <TableHeaderCell>Rol</TableHeaderCell>
                <TableHeaderCell align="right">Acciones</TableHeaderCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id} hover>
                  <TableCell>{user.username}</TableCell>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Typography
                      variant="body2"
                      sx={{
                        color: user.role === 'ADMIN' ? 'primary.main' : 'text.secondary',
                        fontWeight: user.role === 'ADMIN' ? 600 : 400,
                      }}
                    >
                      {user.role}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <IconButton 
                      onClick={() => handleOpenDialog(user)} 
                      color="primary"
                      size="small"
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton 
                      onClick={() => handleDelete(user.id)} 
                      color="error"
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

      <Dialog 
        open={openDialog} 
        onClose={handleCloseDialog}
        PaperProps={{
          sx: {
            borderRadius: 2,
          }
        }}
      >
        <DialogTitle sx={{ 
          borderBottom: 1, 
          borderColor: 'divider',
          px: 3,
          py: 2,
        }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {editingId ? 'Editar Usuario' : 'Nuevo Usuario'}
          </Typography>
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <FormContainer>
            <TextField
              fullWidth
              label="Usuario"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              variant="outlined"
              required
            />
            <TextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              variant="outlined"
              required
            />
            {!editingId && (
              <TextField
                fullWidth
                label="Contraseña"
                name="password"
                type="password"
                value={formData.password || ''}
                onChange={handleInputChange}
                variant="outlined"
                required
              />
            )}
            <TextField
              fullWidth
              label="Nombre Completo"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              variant="outlined"
              required
            />
            <FormControl fullWidth variant="outlined">
              <InputLabel>Rol</InputLabel>
              <Select
                name="role"
                value={formData.role}
                onChange={handleSelectChange}
                label="Rol"
              >
                <MenuItem value="USER">Usuario</MenuItem>
                <MenuItem value="ADMIN">Administrador</MenuItem>
              </Select>
            </FormControl>
          </FormContainer>
          <DialogActions sx={{ 
            borderTop: 1, 
            borderColor: 'divider',
            px: 3,
            py: 2,
          }}>
            <Button 
              onClick={handleCloseDialog}
              sx={{ mr: 1 }}
            >
              Cancelar
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              startIcon={editingId ? <EditIcon /> : <PersonAddIcon />}
            >
              {editingId ? 'Actualizar' : 'Crear Usuario'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </PageContainer>
  );
}
