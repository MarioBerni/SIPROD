import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Box,
  Typography,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Officer } from '../types/officer.types';
import { OfficerForm } from './OfficerForm';

interface OfficerListProps {
  officers: Officer[];
  editingOfficer: Officer | null;
  onEdit: (officer: Officer) => void;
  onDelete: (id: string) => void;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updatedOfficer: Officer) => void;
  isMobile?: boolean;
}

export const OfficerList = ({
  officers,
  editingOfficer,
  onEdit,
  onDelete,
  onSave,
  onCancel,
  onChange,
  isMobile = false,
}: OfficerListProps) => {
  if (isMobile) {
    return (
      <Paper 
        variant="outlined" 
        sx={{ 
          maxHeight: editingOfficer ? '30vh' : '50vh',
          overflow: 'auto',
          borderRadius: 1
        }}
      >
        {officers.length > 0 ? (
          officers.map((officer) => (
            <Box
              key={officer.id}
              sx={{
                p: 2,
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': {
                  borderBottom: 'none'
                },
                '&:hover': {
                  bgcolor: 'action.hover'
                }
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                    {officer.grado}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {officer.nombreCompleto} {officer.apellido}
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => onEdit(officer)} color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => onDelete(officer.id)} color="error" size="small">
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>
            </Box>
          ))
        ) : (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography color="text.secondary">
              No hay oficiales agregados
            </Typography>
          </Box>
        )}
      </Paper>
    );
  }

  return (
    <TableContainer 
      component={Paper} 
      variant="outlined"
      sx={{ 
        borderRadius: 1,
        mb: 2,
        maxHeight: '50vh',
        overflow: 'auto'
      }}
    >
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Grado</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Nombre</TableCell>
            <TableCell sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Apellido</TableCell>
            <TableCell align="right" sx={{ fontWeight: 'bold', bgcolor: 'grey.50' }}>Acciones</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {editingOfficer && (
            <TableRow>
              <TableCell colSpan={4}>
                <OfficerForm
                  officer={editingOfficer}
                  onSave={onSave}
                  onCancel={onCancel}
                  onChange={onChange}
                  isEditing={!!editingOfficer.id}
                />
              </TableCell>
            </TableRow>
          )}
          {officers.map((officer) => (
            <TableRow key={officer.id} hover>
              <TableCell>{officer.grado}</TableCell>
              <TableCell>{officer.nombreCompleto}</TableCell>
              <TableCell>{officer.apellido}</TableCell>
              <TableCell align="right">
                <IconButton onClick={() => onEdit(officer)} color="primary" size="small">
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => onDelete(officer.id)} color="error" size="small">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
