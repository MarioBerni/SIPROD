'use client';

import { FC } from 'react';
import { TextField, Stack, useTheme, useMediaQuery } from '@mui/material';

interface DateInputsProps {
  startDate: string;
  endDate: string;
  onChange: (field: 'startDate' | 'endDate', value: string) => void;
  actions: React.ReactNode;
}

export const DateInputs: FC<DateInputsProps> = ({
  startDate,
  endDate,
  onChange,
  actions,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDateChange = (field: 'startDate' | 'endDate', value: string) => {
    console.log(`[DateInputs] Fecha seleccionada en ${field}:`, value);
    console.log(`[DateInputs] Tipo de dato:`, typeof value);
    onChange(field, value);
  };

  console.log('[DateInputs] Props recibidas:', { startDate, endDate });

  return (
    <Stack
      direction={isMobile ? 'column' : 'row'}
      spacing={2}
      sx={{
        width: '100%',
        alignItems: isMobile ? 'stretch' : 'center',
      }}
    >
      <TextField
        type="date"
        label="Fecha inicio"
        value={startDate}
        onChange={(e) => handleDateChange('startDate', e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth={isMobile}
        sx={{ flex: isMobile ? 'none' : 1 }}
      />
      <TextField
        type="date"
        label="Fecha fin"
        value={endDate}
        onChange={(e) => handleDateChange('endDate', e.target.value)}
        InputLabelProps={{ shrink: true }}
        fullWidth={isMobile}
        sx={{ flex: isMobile ? 'none' : 1 }}
      />
      <Stack
        direction="row"
        spacing={1}
        sx={{
          justifyContent: isMobile ? 'flex-end' : 'flex-start',
          mt: isMobile ? 1 : 0,
        }}
      >
        {actions}
      </Stack>
    </Stack>
  );
};
