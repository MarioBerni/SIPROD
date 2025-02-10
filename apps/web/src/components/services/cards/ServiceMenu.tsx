'use client';

import { Menu, MenuItem, Chip, styled, useTheme } from '@mui/material';
import { getActiveServicesCardStyles } from './ActiveServicesCard.styles';

// Crear un Chip estilizado
const StyledChip = styled(Chip)(({ theme }) => ({
  width: '100%',
  justifyContent: 'center',
  borderRadius: '6px',
  fontWeight: 500,
  padding: theme.spacing(0.5),
}));

export interface ServiceMenuProps {
  anchorEl: null | HTMLElement;
  onClose: () => void;
  onStatusChange: (status: 'approved' | 'rejected', rejectReason?: string) => void;
  styles: ReturnType<typeof getActiveServicesCardStyles>;
}

export const ServiceMenu = ({ anchorEl, onClose, onStatusChange, styles }: ServiceMenuProps) => {
  const theme = useTheme();
  const defaultStyles = getActiveServicesCardStyles(theme);
  const menuStyles = styles || defaultStyles;

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
    >
      <MenuItem 
        onClick={() => {
          onStatusChange('approved');
          onClose();
        }}
        sx={menuStyles.menuItem}
      >
        <StyledChip 
          label="Aprobar" 
          size="small"
          variant="filled"
          color="success"
        />
      </MenuItem>
      <MenuItem 
        onClick={() => {
          onClose();
        }}
        sx={menuStyles.menuItem}
      >
        <StyledChip 
          label="Rechazar" 
          size="small"
          variant="filled"
          color="error"
        />
      </MenuItem>
    </Menu>
  );
};
