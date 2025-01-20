import {
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { Officer } from '../types/officer.types';

const GRADOS = ['Tte.', 'Tte.1°', 'Capitan'] as const;

interface OfficerFormProps {
  officer: Officer;
  onSave: () => void;
  onCancel: () => void;
  onChange: (updatedOfficer: Officer) => void;
  isEditing?: boolean;
}

export const OfficerForm = ({ 
  officer, 
  onSave, 
  onCancel, 
  onChange,
  isEditing = false 
}: OfficerFormProps) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <FormControl fullWidth size="small">
        <InputLabel>Grado</InputLabel>
        <Select
          value={officer.grado}
          onChange={(e) =>
            onChange({ ...officer, grado: e.target.value })
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
        value={officer.nombreCompleto}
        onChange={(e) =>
          onChange({ ...officer, nombreCompleto: e.target.value })
        }
        size="small"
        required
      />
      <TextField
        fullWidth
        label="Apellido"
        value={officer.apellido}
        onChange={(e) =>
          onChange({ ...officer, apellido: e.target.value })
        }
        size="small"
        required
      />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 1 }}>
        <Button
          onClick={onCancel}
          color="inherit"
          variant="outlined"
          size="small"
        >
          Cancelar
        </Button>
        <Button
          onClick={onSave}
          color="primary"
          variant="contained"
          size="small"
        >
          {isEditing ? 'Actualizar' : 'Agregar'}
        </Button>
      </Box>
    </Box>
  );
};
