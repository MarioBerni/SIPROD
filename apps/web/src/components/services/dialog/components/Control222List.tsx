'use client';

import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { Control222Duty } from '../types';
import { Control222Item } from './Control222Item';
import dayjs from 'dayjs';

interface Control222ListProps {
  duties: Control222Duty[];
  onUpdateStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  formatDateForDisplay: (date: string) => string;
}

export const Control222List: FC<Control222ListProps> = ({
  duties,
  onUpdateStatus,
  formatDateForDisplay,
}) => {
  // Ordenar por fecha de inicio
  const sortedDuties = [...duties].sort((a, b) => 
    dayjs(a.startDate).isAfter(dayjs(b.startDate)) ? 1 : -1
  );

  if (duties.length === 0) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
          p: 3,
        }}
      >
        <Typography variant="subtitle1" color="text.secondary">
          No hay servicios disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {sortedDuties.map((duty) => (
        <Control222Item
          key={duty.id}
          duty={duty}
          onUpdateStatus={onUpdateStatus}
          formatDateForDisplay={formatDateForDisplay}
        />
      ))}
    </Box>
  );
};
