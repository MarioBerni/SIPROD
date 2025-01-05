'use client';

import {
  AppBar,
  Box,
  IconButton,
  Toolbar,
  Typography,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  useTheme,
  Tooltip,
} from '@mui/material';
import {
  Settings as SettingsIcon,
  HelpOutline as HelpIcon,
} from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import Image from 'next/image';

export function Header() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const router = useRouter();
  const theme = useTheme();

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleProfile = () => {
    handleClose();
    router.push('/profile');
  };

  const handleSettings = () => {
    handleClose();
    router.push('/dashboard/settings');
  };

  const handleHelp = () => {
    handleClose();
    window.open('/docs/manual-usuario.pdf', '_blank');
  };

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      router.push('/');
    }
  };

  return (
    <AppBar 
      position="sticky" 
      sx={{ 
        backgroundColor: 'primary.main',
        color: 'primary.contrastText',
        boxShadow: 'none',
        borderBottom: '1px solid',
        borderColor: 'primary.dark',
      }}
    >
      <Toolbar 
        sx={{ 
          height: 70,
          px: { xs: 2, sm: 4 },
        }}
      >
        {/* Logo y Título */}
        <Box 
          sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            flex: 1,
          }}
        >
          <Box sx={{ width: 48 }} /> {/* Espacio para el botón de menú */}
          <Box 
            sx={{ 
              display: 'flex',
              alignItems: 'center',
              gap: 2,
              flex: 1,
              justifyContent: 'center',
            }}
          >
            <Image
              src="/images/logo-siprod.svg"
              alt="SIPROD Logo"
              width={32}
              height={32}
            />
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                color: 'primary.contrastText',
                letterSpacing: '0.5px',
              }}
            >
              S.I.P.R.O.D.
            </Typography>
          </Box>
        </Box>

        {/* Perfil de Usuario */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 2,
            ml: 2,
            minWidth: { xs: 'auto', sm: 200 },
            justifyContent: 'flex-end',
          }}
        >
          <Box 
            sx={{ 
              textAlign: 'right',
              display: { xs: 'none', sm: 'block' },
            }}
          >
            <Typography 
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: 'primary.contrastText',
              }}
            >
              Juan Pérez
            </Typography>
            <Typography 
              variant="caption" 
              sx={{
                color: 'primary.light',
                fontWeight: 500,
              }}
            >
              Comisario
            </Typography>
          </Box>
          
          <Tooltip title="Perfil">
            <IconButton
              onClick={handleMenu}
              sx={{ 
                p: 0.5,
                border: '2px solid',
                borderColor: 'primary.light',
                '&:hover': {
                  borderColor: 'primary.contrastText',
                },
              }}
            >
              <Avatar 
                sx={{ 
                  width: 36, 
                  height: 36,
                  bgcolor: 'primary.light',
                  fontSize: '0.9rem',
                  fontWeight: 600,
                }}
              >
                JP
              </Avatar>
            </IconButton>
          </Tooltip>
        </Box>

        {/* Menú de Usuario */}
        <Menu
          id="menu-appbar"
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleClose}
          PaperProps={{
            elevation: 3,
            sx: { 
              width: 220,
              mt: 1,
              '& .MuiMenuItem-root': {
                py: 1.5,
              },
            },
          }}
          transformOrigin={{ horizontal: 'right', vertical: 'top' }}
          anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        >
          <MenuItem onClick={handleProfile}>
            <Avatar 
              sx={{ 
                width: 32, 
                height: 32, 
                mr: 2,
                bgcolor: 'primary.light',
              }}
            >
              JP
            </Avatar>
            Mi Perfil
          </MenuItem>
          <Divider />
          <MenuItem onClick={handleSettings}>
            <SettingsIcon sx={{ mr: 2, color: 'text.secondary' }} fontSize="small" />
            Configuración
          </MenuItem>
          <MenuItem onClick={handleHelp}>
            <HelpIcon sx={{ mr: 2, color: 'text.secondary' }} fontSize="small" />
            Ayuda
          </MenuItem>
          <Divider />
          <MenuItem 
            onClick={handleLogout}
            sx={{ 
              color: theme.palette.error.main,
              '&:hover': {
                bgcolor: theme.palette.error.light,
              },
            }}
          >
            Cerrar Sesión
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}
