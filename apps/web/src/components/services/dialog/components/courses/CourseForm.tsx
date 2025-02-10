import { Box, TextField, Grid } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Service } from '@/data/__mocks__/servicesMock';

interface CourseFormProps {
  data: Partial<Service>;
  onChange: (data: Partial<Service>) => void;
}

type ServiceFieldValue = string | Date | null;

export const CourseForm = ({ data, onChange }: CourseFormProps) => {
  const handleChange = (field: keyof Service, value: ServiceFieldValue) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            fullWidth
            label="Nombre del Curso"
            value={data.title || ''}
            onChange={(e) => handleChange('title', e.target.value)}
            placeholder="Ej: Curso de Actualización en Procedimientos"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Fecha de inicio"
            value={data.startDate || null}
            onChange={(date) => handleChange('startDate', date)}
            slotProps={{ 
              textField: { 
                fullWidth: true,
                required: true
              } 
            }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Fecha de fin"
            value={data.endDate || null}
            onChange={(date) => handleChange('endDate', date)}
            slotProps={{ 
              textField: { 
                fullWidth: true,
                required: true
              } 
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
