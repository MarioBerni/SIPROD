import { Box, TextField, Typography, Alert } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ServiceFormData } from '../../hooks/useServiceForm';

interface ServiceDetailsStepProps {
  formData: ServiceFormData;
  onChange: (field: keyof ServiceFormData, value: string | number | Date | null) => void;
  errors: Record<string, string>;
}

export const ServiceDetailsStep = ({
  formData,
  onChange,
  errors
}: ServiceDetailsStepProps) => {
  const isLicenciaOrCurso = formData.type === 'LICENCIA' || formData.type === 'CURSO';

  return (
    <Box sx={{ py: 2 }}>
      <Typography variant="h6" gutterBottom>
        {formData.type === 'JEFE_DIA'
          ? 'Detalles del Servicio de Jefe de Día'
          : formData.type === 'LICENCIA'
          ? 'Detalles de la Licencia'
          : 'Detalles del Curso'}
      </Typography>

      <Box sx={{ 
        display: 'flex',
        flexDirection: 'column',
        gap: 3,
        mt: 3
      }}>
        <TextField
          label="Título"
          value={formData.title}
          onChange={(e) => onChange('title', e.target.value)}
          error={!!errors.title}
          helperText={errors.title}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px'
            }
          }}
        />

        <TextField
          label="Descripción"
          value={formData.description}
          onChange={(e) => onChange('description', e.target.value)}
          error={!!errors.description}
          helperText={errors.description}
          multiline
          rows={4}
          fullWidth
          sx={{
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px'
            }
          }}
        />

        {formData.type === 'CURSO' && (
          <TextField
            label="Nombre del Curso"
            value={formData.courseName || ''}
            onChange={(e) => onChange('courseName', e.target.value)}
            error={!!errors.courseName}
            helperText={errors.courseName}
            fullWidth
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px'
              }
            }}
          />
        )}

        {isLicenciaOrCurso && (
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: '1fr 1fr',
            gap: 2
          }}>
            <DatePicker
              label="Fecha de Inicio"
              value={formData.startDate}
              onChange={(date) => onChange('startDate', date)}
              slotProps={{
                textField: {
                  error: !!errors.startDate,
                  helperText: errors.startDate,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }
                }
              }}
            />
            <DatePicker
              label="Fecha de Fin"
              value={formData.endDate}
              onChange={(date) => onChange('endDate', date)}
              slotProps={{
                textField: {
                  error: !!errors.endDate,
                  helperText: errors.endDate,
                  sx: {
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '8px'
                    }
                  }
                }
              }}
            />
          </Box>
        )}

        {formData.type === 'LICENCIA' && (
          <Alert severity="info" sx={{ borderRadius: '8px' }}>
            Las licencias no pueden exceder los 30 días consecutivos.
          </Alert>
        )}
      </Box>
    </Box>
  );
};
