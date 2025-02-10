import { Box, Typography, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { Officer } from '@/app/dashboard/escalafon-jefes/types';

interface ManualOfficerSelectProps {
  officers: Officer[];
  selectedOfficerId: number;
  onOfficerSelect: (officerId: number) => void;
}

export function ManualOfficerSelect({ officers, selectedOfficerId, onOfficerSelect }: ManualOfficerSelectProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
      <Typography variant="subtitle1" gutterBottom sx={{ fontWeight: 500 }}>
        Selección de Oficial
      </Typography>
      <FormControl fullWidth>
        <InputLabel>Oficial</InputLabel>
        <Select
          value={selectedOfficerId}
          label="Oficial"
          onChange={(e) => onOfficerSelect(Number(e.target.value))}
        >
          <MenuItem value={0}>
            <em>Seleccione un oficial</em>
          </MenuItem>
          {officers.map((officer) => (
            <MenuItem key={officer.id} value={officer.id}>
              <Box>
                <Typography variant="body1">
                  {officer.grado} {officer.apellido}, {officer.nombre}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Score: {officer.score} | Turnos: {officer.shiftsThisMonth}
                </Typography>
              </Box>
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Paper>
  );
}
