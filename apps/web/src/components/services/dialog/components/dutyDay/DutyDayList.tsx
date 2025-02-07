'use client';

import { FC } from 'react';
import { Box, Typography } from '@mui/material';
import { DutyDay } from '../types';
import { DutyDayItem } from './DutyDayItem';
import dayjs from 'dayjs';

interface DutyDayListProps {
  duties: DutyDay[];
  onUpdateStatus: (id: string, status: 'pending' | 'approved' | 'rejected') => void;
  formatDateForDisplay: (date: string) => string;
}

export const DutyDayList: FC<DutyDayListProps> = ({
  duties,
  onUpdateStatus,
  formatDateForDisplay,
}) => {
  // Ordenar por fecha
  const sortedDuties = [...duties].sort((a, b) => 
    dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1
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
          No hay designaciones disponibles
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ px: 2, py: 2 }}>
      {sortedDuties.map((duty) => (
        <DutyDayItem
          key={duty.id}
          duty={duty}
          onUpdateStatus={onUpdateStatus}
          formatDateForDisplay={formatDateForDisplay}
        />
      ))}
    </Box>
  );
};
