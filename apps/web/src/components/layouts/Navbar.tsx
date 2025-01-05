'use client';

import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { styled } from '@mui/material/styles';
import {
  AppBar,
  Toolbar,
  Button,
  Typography,
  Box,
  useTheme
} from '@mui/material';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  color: theme.palette.text.primary,
  boxShadow: theme.shadows[3],
}));

const StyledToolbar = styled(Toolbar)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
});

const LogoContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
});

const LogoutButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.error.main,
  color: theme.palette.common.white,
  '&:hover': {
    backgroundColor: theme.palette.error.dark,
  },
  '&:disabled': {
    backgroundColor: theme.palette.action.disabledBackground,
    color: theme.palette.action.disabled,
  },
}));

export function Navbar() {
  const { logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const theme = useTheme();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <StyledAppBar 
      position="fixed" 
      sx={{ 
        zIndex: theme.zIndex.drawer + 1,
        width: '100%',
      }}
    >
      <StyledToolbar>
        <LogoContainer>
          <Typography variant="h6" component="div">
            SIPROD
          </Typography>
        </LogoContainer>
        <LogoutButton
          variant="contained"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          {isLoggingOut ? 'Cerrando sesión...' : 'Cerrar Sesión'}
        </LogoutButton>
      </StyledToolbar>
    </StyledAppBar>
  );
}
