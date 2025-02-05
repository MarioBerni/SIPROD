'use client';

import { FC } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  Chip,
  useTheme,
} from '@mui/material';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useState } from 'react';
import { Control222Duty, DutyStatus } from '../types';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import PendingIcon from '@mui/icons-material/Pending';
import DateRangeIcon from '@mui/icons-material/DateRange';

interface Control222ItemProps {
  duty: Control222Duty;
  onUpdateStatus: (id: string, status: DutyStatus) => void;
  formatDateForDisplay: (date: string) => string;
}

export const Control222Item: FC<Control222ItemProps> = ({
  duty,
  onUpdateStatus,
  formatDateForDisplay,
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleStatusUpdate = (status: DutyStatus) => {
    onUpdateStatus(duty.id, status);
    handleClose();
  };

  const getStatusIcon = () => {
    switch (duty.status) {
      case 'approved':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'rejected':
        return <CancelIcon sx={{ color: theme.palette.error.main }} />;
      default:
        return <PendingIcon sx={{ color: theme.palette.warning.main }} />;
    }
  };

  const getStatusColor = () => {
    switch (duty.status) {
      case 'approved':
        return theme.palette.success.main;
      case 'rejected':
        return theme.palette.error.main;
      default:
        return theme.palette.warning.main;
    }
  };

  const getStatusText = () => {
    switch (duty.status) {
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      default:
        return 'Pendiente';
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        mb: 1,
        border: 1,
        borderColor: 'divider',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateX(4px)',
          borderColor: getStatusColor(),
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {getStatusIcon()}
          <Box>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
              <DateRangeIcon sx={{ color: theme.palette.primary.main, fontSize: '1rem' }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
                {formatDateForDisplay(duty.startDate)} - {formatDateForDisplay(duty.endDate)}
              </Typography>
            </Box>
            <Chip
              label={getStatusText()}
              size="small"
              sx={{
                backgroundColor: `${getStatusColor()}20`,
                color: getStatusColor(),
                fontWeight: 'medium',
              }}
            />
          </Box>
        </Box>

        <IconButton
          size="small"
          onClick={handleClick}
          sx={{
            '&:hover': {
              backgroundColor: `${theme.palette.primary.main}10`,
            },
          }}
        >
          <MoreVertIcon />
        </IconButton>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={() => handleStatusUpdate('approved' as DutyStatus)}>
            <CheckCircleIcon sx={{ mr: 1, color: theme.palette.success.main }} />
            Aprobar
          </MenuItem>
          <MenuItem onClick={() => handleStatusUpdate('rejected' as DutyStatus)}>
            <CancelIcon sx={{ mr: 1, color: theme.palette.error.main }} />
            Rechazar
          </MenuItem>
          <MenuItem onClick={() => handleStatusUpdate('pending' as DutyStatus)}>
            <PendingIcon sx={{ mr: 1, color: theme.palette.warning.main }} />
            Pendiente
          </MenuItem>
        </Menu>
      </Box>
    </Paper>
  );
};
