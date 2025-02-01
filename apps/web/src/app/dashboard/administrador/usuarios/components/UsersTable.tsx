import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { User, Rol } from '../types';
import { formatGrado, formatRol } from '../utils';

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

interface UsersTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (userId: string) => void;
}

export function UsersTable({ users, onEdit, onDelete }: UsersTableProps) {
  return (
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
                {user.terminosCondiciones ? 'Aceptados' : 'Pendientes'}
              </TableCell>
              <TableCell align="center">
                <IconButton
                  color="primary"
                  onClick={() => onEdit(user)}
                  size="small"
                >
                  <EditIcon />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(user.id)}
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
  );
}
