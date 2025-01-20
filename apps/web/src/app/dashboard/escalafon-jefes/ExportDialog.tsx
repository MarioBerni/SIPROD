import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from '@mui/material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useState } from 'react';

interface ExportDialogProps {
  open: boolean;
  onClose: () => void;
  onExport: (month: number, year: number) => void;
}

export const ExportDialog = ({ open, onClose, onExport }: ExportDialogProps) => {
  const currentDate = new Date();
  const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
  const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());

  // Generar años desde el actual hasta 5 años atrás y 5 años adelante
  const years = Array.from(
    { length: 11 },
    (_, i) => currentDate.getFullYear() - 5 + i
  );

  // Generar todos los meses
  const months = Array.from(
    { length: 12 },
    (_, i) => {
      const date = new Date(2000, i, 1);
      return {
        value: i,
        label: format(date, 'MMMM', { locale: es })
      };
    }
  );

  const handleMonthChange = (event: SelectChangeEvent<number>) => {
    setSelectedMonth(event.target.value as number);
  };

  const handleYearChange = (event: SelectChangeEvent<number>) => {
    setSelectedYear(event.target.value as number);
  };

  const handleExport = () => {
    onExport(selectedMonth, selectedYear);
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2
        }
      }}
    >
      <DialogTitle sx={{ color: 'primary.main', fontWeight: 'bold' }}>
        Exportar Escalafón
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <FormControl fullWidth>
            <InputLabel id="month-select-label">Mes</InputLabel>
            <Select
              labelId="month-select-label"
              id="month-select"
              value={selectedMonth}
              label="Mes"
              onChange={handleMonthChange}
            >
              {months.map((month) => (
                <MenuItem key={month.value} value={month.value}>
                  {month.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel id="year-select-label">Año</InputLabel>
            <Select
              labelId="year-select-label"
              id="year-select"
              value={selectedYear}
              label="Año"
              onChange={handleYearChange}
            >
              {years.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderWidth: 2,
            '&:hover': { borderWidth: 2 },
            color: 'primary.main',
            borderColor: 'primary.main'
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleExport}
          variant="contained"
          sx={{ 
            fontWeight: 'bold',
            px: 3,
            bgcolor: 'primary.main',
            color: 'background.paper'
          }}
        >
          Exportar
        </Button>
      </DialogActions>
    </Dialog>
  );
};
