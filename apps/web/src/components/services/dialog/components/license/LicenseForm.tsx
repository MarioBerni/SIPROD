import { Box, TextField, Grid, MenuItem } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { Service, LicenseType } from '@/data/__mocks__/servicesMock';

interface LicenseFormProps {
  data: Partial<Service>;
  onChange: (data: Partial<Service>) => void;
}

const licenseTypes: Array<{ value: LicenseType; label: string }> = [
  { value: 'ANUAL', label: 'Anual' },
  { value: 'MEDICA', label: 'Médica' },
  { value: 'OTRA', label: 'Otra' },
];

type ServiceFieldValue = string | Date | LicenseType | null;

export const LicenseForm = ({ data, onChange }: LicenseFormProps) => {
  const handleChange = (field: keyof Service, value: ServiceFieldValue) => {
    const updatedData = { ...data, [field]: value };
    
    // Si es una licencia, establecemos el título basado en el tipo
    if (field === 'licenseType') {
      const licenseType = licenseTypes.find(type => type.value === value);
      if (licenseType) {
        updatedData.title = `Licencia ${licenseType.label.toLowerCase()}`;
      }
    }
    
    onChange(updatedData);
  };

  return (
    <Box sx={{ p: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            select
            fullWidth
            label="Tipo de Licencia"
            value={data.licenseType || ''}
            onChange={(e) => handleChange('licenseType', e.target.value as LicenseType)}
          >
            {licenseTypes.map((type) => (
              <MenuItem key={type.value} value={type.value}>
                {type.label}
              </MenuItem>
            ))}
          </TextField>
        </Grid>
        <Grid item xs={12}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Descripción"
            value={data.description || ''}
            onChange={(e) => handleChange('description', e.target.value)}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Fecha de Inicio"
            value={data.startDate || null}
            onChange={(date) => handleChange('startDate', date)}
            sx={{ width: '100%' }}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <DatePicker
            label="Fecha de Fin"
            value={data.endDate || null}
            onChange={(date) => handleChange('endDate', date)}
            sx={{ width: '100%' }}
          />
        </Grid>
      </Grid>
    </Box>
  );
};
