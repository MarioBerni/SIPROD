'use client';

import { Assignment, Officer } from '@/app/dashboard/escalafon-jefes/types';
import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Box,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers';
import { Dispatch, SetStateAction } from 'react';
import { formatOfficerName } from '@/utils/gradeUtils';

interface ChiefRankFormProps {
  formData: Partial<Assignment>;
  onChange: Dispatch<SetStateAction<Partial<Assignment>>>;
  officers: Officer[];
}

export const ChiefRankForm = ({
  formData,
  onChange,
  officers,
}: ChiefRankFormProps) => {
  const handleChange = (field: keyof Assignment, value: Date | number | boolean | string | undefined | null) => {
    onChange(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <DatePicker
        label="Fecha"
        value={formData.date}
        onChange={(newValue) => handleChange('date', newValue)}
      />

      <FormControl fullWidth>
        <InputLabel>Oficial</InputLabel>
        <Select
          value={formData.officerId || ''}
          label="Oficial"
          onChange={(e) => handleChange('officerId', Number(e.target.value))}
        >
          {officers.map((officer) => (
            <MenuItem key={officer.id} value={officer.id}>
              {formatOfficerName(officer.grado, officer.nombre, officer.apellido)}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};
