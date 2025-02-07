'use client';

import { FC, ReactNode } from 'react';
import { Stack } from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface DateInputsProps {
  startDate: string;
  endDate: string;
  onChange: (field: 'startDate' | 'endDate', value: string) => void;
  actions?: ReactNode;
}

export const DateInputs: FC<DateInputsProps> = ({
  startDate,
  endDate,
  onChange,
  actions
}) => {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
      <DatePicker
        label="Fecha de inicio"
        value={startDate ? new Date(startDate) : null}
        onChange={(date) => onChange('startDate', date ? date.toISOString() : '')}
        sx={{ flex: 1 }}
      />
      <DatePicker
        label="Fecha de fin"
        value={endDate ? new Date(endDate) : null}
        onChange={(date) => onChange('endDate', date ? date.toISOString() : '')}
        sx={{ flex: 1 }}
      />
      {actions && (
        <Stack direction="row" spacing={1}>
          {actions}
        </Stack>
      )}
    </Stack>
  );
};
