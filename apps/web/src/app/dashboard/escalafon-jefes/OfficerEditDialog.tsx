import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  TextField,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { Officer } from './types/officer.types';

const GRADOS = ['Tte.', 'Tte.1°', 'Capitan'] as const;

interface OfficerEditDialogProps {
  open: boolean;
  onClose: () => void;
  officers: Officer[];
  onSave: (officers: Officer[]) => void;
  title: string;
}

const OfficerEditDialog = ({
  open,
  onClose,
  officers: initialOfficers,
  onSave,
  title,
}: OfficerEditDialogProps) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [officers, setOfficers] = useState<Officer[]>(initialOfficers);
  const [editingOfficer, setEditingOfficer] = useState<Officer | null>(null);

  useEffect(() => {
    setOfficers(initialOfficers);
  }, [initialOfficers]);

  const handleAdd = () => {
    const newOfficer: Officer = {
      id: Date.now().toString(),
      grado: '',
      nombre: '',
      nombreCompleto: '',
      apellido: '',
    };
    setEditingOfficer(newOfficer);
  };

  const handleEdit = (officer: Officer) => {
    setEditingOfficer({ 
      ...officer,
      nombreCompleto: officer.nombre
    });
  };

  const handleDelete = (id: string) => {
    setOfficers(officers.filter((officer) => officer.id !== id));
  };

  const handleSave = () => {
    if (editingOfficer) {
      if (!editingOfficer.grado || !editingOfficer.nombreCompleto || !editingOfficer.apellido) {
        return;
      }

      const officerToSave = {
        ...editingOfficer,
        nombre: editingOfficer.nombreCompleto.charAt(0).toUpperCase() + '.',
        nombreCompleto: editingOfficer.nombreCompleto
      };

      const index = officers.findIndex((o) => o.id === editingOfficer.id);
      if (index === -1) {
        setOfficers([...officers, officerToSave]);
      } else {
        const newOfficers = [...officers];
        newOfficers[index] = officerToSave;
        setOfficers(newOfficers);
      }
      setEditingOfficer(null);
    }
  };

  const handleCancel = () => {
    setEditingOfficer(null);
  };

  const handleConfirm = () => {
    onSave(officers);
    onClose();
  };

  const renderDesktopContent = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAdd}
          variant="contained"
          color="primary"
          sx={{ fontWeight: 'bold' }}
        >
          Agregar Oficial
        </Button>
      </Box>
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
                <TableCell>
                  <FormControl fullWidth size="small">
                    <Select
                      value={editingOfficer.grado}
                      onChange={(e) =>
                        setEditingOfficer({ ...editingOfficer, grado: e.target.value })
                      }
                      displayEmpty
                    >
                      <MenuItem value="" disabled>
                        Seleccione un grado
                      </MenuItem>
                      {GRADOS.map((grado) => (
                        <MenuItem key={grado} value={grado}>
                          {grado}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={editingOfficer.nombreCompleto}
                    onChange={(e) =>
                      setEditingOfficer({ ...editingOfficer, nombreCompleto: e.target.value })
                    }
                    size="small"
                    placeholder="Ingrese el nombre"
                    required
                  />
                </TableCell>
                <TableCell>
                  <TextField
                    fullWidth
                    value={editingOfficer.apellido}
                    onChange={(e) =>
                      setEditingOfficer({ ...editingOfficer, apellido: e.target.value })
                    }
                    size="small"
                    placeholder="Ingrese el apellido"
                    required
                  />
                </TableCell>
                <TableCell align="right">
                  <IconButton onClick={handleSave} color="primary" size="small">
                    <AddIcon />
                  </IconButton>
                  <IconButton onClick={handleCancel} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            )}
            {officers.map((officer) => (
              <TableRow key={officer.id} hover>
                <TableCell>{officer.grado}</TableCell>
                <TableCell>{officer.nombreCompleto}</TableCell>
                <TableCell>{officer.apellido}</TableCell>
                <TableCell align="right">
                  <IconButton onClick={() => handleEdit(officer)} color="primary" size="small">
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(officer.id)} color="error" size="small">
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );

  const renderMobileContent = () => (
    <>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAdd}
          variant="contained"
          color="primary"
          sx={{ fontWeight: 'bold' }}
        >
          Agregar Oficial
        </Button>
      </Box>
      {editingOfficer && (
        <Paper 
          variant="outlined" 
          sx={{ 
            p: 2, 
            mb: 3, 
            bgcolor: 'grey.50',
            borderRadius: 1
          }}
        >
          <Typography variant="subtitle2" sx={{ mb: 2, color: 'text.secondary' }}>
            {editingOfficer.id ? 'Editar Oficial' : 'Nuevo Oficial'}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Grado</InputLabel>
              <Select
                value={editingOfficer.grado}
                onChange={(e) =>
                  setEditingOfficer({ ...editingOfficer, grado: e.target.value })
                }
                label="Grado"
              >
                {GRADOS.map((grado) => (
                  <MenuItem key={grado} value={grado}>
                    {grado}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Nombre"
              value={editingOfficer.nombreCompleto}
              onChange={(e) =>
                setEditingOfficer({ ...editingOfficer, nombreCompleto: e.target.value })
              }
              size="small"
              required
            />
            <TextField
              fullWidth
              label="Apellido"
              value={editingOfficer.apellido}
              onChange={(e) =>
                setEditingOfficer({ ...editingOfficer, apellido: e.target.value })
              }
              size="small"
              required
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
              <Button
                onClick={handleCancel}
                color="inherit"
                variant="outlined"
                size="small"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSave}
                color="primary"
                variant="contained"
                size="small"
              >
                {editingOfficer.id ? 'Actualizar' : 'Agregar'}
              </Button>
            </Box>
          </Box>
        </Paper>
      )}
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
                  <IconButton onClick={() => handleEdit(officer)} color="primary" size="small">
                    <EditIcon fontSize="small" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(officer.id)} color="error" size="small">
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
    </>
  );

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth={isMobile ? "sm" : "md"}
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: '90vh'
        }
      }}
    >
      <DialogTitle 
        sx={{ 
          bgcolor: 'primary.main', 
          color: 'primary.contrastText',
          p: 2,
          display: 'flex',
          alignItems: 'center',
          gap: 1
        }}
      >
        <PersonAddIcon />
        <Typography variant="h6" component="span" sx={{ fontWeight: 'bold' }}>
          {title}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ mt: 2, p: 3 }}>
        <Box sx={{ mb: 1 }}>
        </Box>
        {isMobile ? renderMobileContent() : renderDesktopContent()}
      </DialogContent>
      <DialogActions sx={{ p: 2, bgcolor: 'grey.50' }}>
        <Button 
          onClick={onClose} 
          color="inherit"
          variant="outlined"
          sx={{ 
            borderWidth: 2,
            '&:hover': { borderWidth: 2 }
          }}
        >
          Cancelar
        </Button>
        <Button 
          onClick={handleConfirm} 
          color="primary" 
          variant="contained"
          sx={{ fontWeight: 'bold' }}
        >
          Guardar Cambios
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export { OfficerEditDialog };
export type { Officer };
