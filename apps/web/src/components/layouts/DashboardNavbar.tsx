'use client';

import { useState } from 'react';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Box,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material';
import {
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  ExitToApp as ExitToAppIcon,
  Person as PersonIcon,
  Help as HelpIcon,
} from '@mui/icons-material';
import { useAuth } from '@/contexts/AuthContext';
import { usePageTitle } from '@/contexts/PageTitleContext';
import { HelpDialog } from '../dialogs/HelpDialog';

interface DashboardNavbarProps {
  onSidebarToggle: () => void;
}

const NavbarRoot = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  boxShadow: theme.shadows[3],
  color: theme.palette.primary.contrastText,
  left: 0,
  right: 0,
  top: 0,
  zIndex: 1200 // Menor que el z-index del drawer (1300)
}));

const NavbarToolbar = styled(Toolbar)({
  minHeight: 64,
  width: '100%',
  position: 'relative'
});

const MenuButton = styled(IconButton)(({ theme }) => ({
  marginRight: theme.spacing(2),
  color: theme.palette.primary.contrastText,
  position: 'absolute',
  left: theme.spacing(2)
}));


const ActionIcons = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(2),
  position: 'absolute',
  right: theme.spacing(2)
}));

export function DashboardNavbar({ onSidebarToggle }: DashboardNavbarProps) {
  const { logout } = useAuth();
  const { title, icon: Icon } = usePageTitle();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [helpDialogOpen, setHelpDialogOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleHelpClick = () => {
    handleClose();
    setHelpDialogOpen(true);
  };

  const handleHelpDialogClose = () => {
    setHelpDialogOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
      handleClose();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <NavbarRoot>
      <NavbarToolbar>
        <MenuButton
          onClick={onSidebarToggle}
          size="large"
          edge="start"
        >
          <MenuIcon />
        </MenuButton>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
          }}
        >
          {Icon && (
            <Icon
              sx={{
                fontSize: '1.75rem',
                color: 'inherit',
              }}
            />
          )}
          <Typography
            variant="h6"
            sx={{
              fontSize: '1.25rem',
              fontWeight: 600,
              color: 'inherit',
            }}
          >
            {title || 'SIPROD'}
          </Typography>
        </Box>
        <ActionIcons>
          <Tooltip title="Cuenta">
            <IconButton
              onClick={handleMenu}
            >
              <AccountCircleIcon />
            </IconButton>
          </Tooltip>
          <Menu
            id="menu-appbar"
            anchorEl={anchorEl}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            keepMounted
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <MenuItem onClick={handleClose}>
              <ListItemIcon>
                <PersonIcon fontSize="small" />
              </ListItemIcon>
              Mi Perfil
            </MenuItem>
            <MenuItem onClick={handleHelpClick}>
              <ListItemIcon>
                <HelpIcon fontSize="small" />
              </ListItemIcon>
              Ayuda
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <ExitToAppIcon fontSize="small" />
              </ListItemIcon>
              Cerrar Sesión
            </MenuItem>
          </Menu>
          <HelpDialog 
            open={helpDialogOpen}
            onClose={handleHelpDialogClose}
          />
        </ActionIcons>
      </NavbarToolbar>
    </NavbarRoot>
  );
}
