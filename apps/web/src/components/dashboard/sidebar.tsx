'use client';

import { useState } from 'react';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  Typography,
  Avatar,
  Collapse,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Security as SecurityIcon,
  Settings as SettingsIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  BarChart as BarChartIcon,
  LocationOn as LocationOnIcon,
  ExpandLess,
  ExpandMore,
} from '@mui/icons-material';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';

const drawerWidth = 280;

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path?: string;
  children?: MenuItem[];
  badge?: number;
}

const menuItems: MenuItem[] = [
  { 
    text: 'Inicio', 
    icon: <DashboardIcon />, 
    path: '/dashboard' 
  },
  { 
    text: 'Dirección I',
    icon: <SecurityIcon />,
    path: '/dashboard/direccion-1'
  },
  { 
    text: 'Dirección II',
    icon: <SecurityIcon />,
    path: '/dashboard/direccion-2'
  },
  { 
    text: 'Dirección III',
    icon: <SecurityIcon />,
    children: [
      { 
        text: 'Regional Norte', 
        icon: <LocationOnIcon />, 
        path: '/dashboard/direccion-3/norte' 
      },
      { 
        text: 'Regional Este', 
        icon: <LocationOnIcon />, 
        path: '/dashboard/direccion-3/este' 
      },
    ]
  },
  { 
    text: 'GEO',
    icon: <SecurityIcon />,
    path: '/dashboard/geo'
  },
  { 
    text: 'Estadística',
    icon: <BarChartIcon />,
    path: '/dashboard/statistics'
  },
  { 
    text: 'Reportes', 
    icon: <AssessmentIcon />, 
    path: '/dashboard/reports' 
  },
  { 
    text: 'Administrador',
    icon: <SettingsIcon />,
    children: [
      { 
        text: 'Usuarios', 
        icon: <PeopleIcon />, 
        path: '/dashboard/admin/users' 
      },
    ]
  },
];

export function Sidebar() {
  const [open, setOpen] = useState(false);
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const pathname = usePathname();
  const theme = useTheme();

  const toggleDrawer = () => {
    setOpen(!open);
  };

  const handleExpand = (text: string) => {
    setExpandedItems((prev) =>
      prev.includes(text)
        ? prev.filter((item) => item !== text)
        : [...prev, text]
    );
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const isSelected = item.path === pathname;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems.includes(item.text);

    const menuItem = (
      <>
        <ListItemIcon 
          sx={{ 
            color: isSelected ? 'primary.contrastText' : 'inherit',
            minWidth: 40,
          }}
        >
          {item.badge ? (
            <Badge badgeContent={item.badge} color="error">
              {item.icon}
            </Badge>
          ) : (
            item.icon
          )}
        </ListItemIcon>
        <ListItemText
          primary={item.text}
          primaryTypographyProps={{
            fontSize: '0.9rem',
            fontWeight: isSelected ? 'bold' : 'normal',
          }}
        />
        {hasChildren && (
          isExpanded ? <ExpandLess /> : <ExpandMore />
        )}
      </>
    );

    return (
      <Box key={item.text}>
        <ListItem 
          disablePadding 
          sx={{ 
            display: 'block',
            pl: level * 2,
          }}
        >
          {item.path ? (
            <Link
              href={item.path}
              style={{ textDecoration: 'none', color: 'inherit' }}
              onClick={toggleDrawer}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  px: 2.5,
                  backgroundColor: isSelected
                    ? 'primary.main'
                    : 'transparent',
                  color: isSelected ? 'primary.contrastText' : 'inherit',
                  '&:hover': {
                    backgroundColor: isSelected
                      ? 'primary.dark'
                      : 'rgba(255, 255, 255, 0.1)',
                  },
                }}
              >
                {menuItem}
              </ListItemButton>
            </Link>
          ) : (
            <ListItemButton
              onClick={() => handleExpand(item.text)}
              sx={{
                minHeight: 48,
                px: 2.5,
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
              }}
            >
              {menuItem}
            </ListItemButton>
          )}
        </ListItem>
        {hasChildren && (
          <Collapse in={isExpanded} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="toggle drawer"
        onClick={toggleDrawer}
        sx={{
          position: 'fixed',
          left: theme.spacing(2),
          top: '15px',
          zIndex: open ? theme.zIndex.drawer - 1 : theme.zIndex.drawer + 1,
          color: 'primary.contrastText',
          width: 40,
          height: 40,
          borderRadius: '12px',
          transition: theme.transitions.create(['opacity', 'visibility']),
          opacity: open ? 0 : 1,
          visibility: open ? 'hidden' : 'visible',
          '&:hover': {
            bgcolor: 'rgba(255, 255, 255, 0.1)',
          },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Drawer
        variant="temporary"
        anchor="left"
        open={open}
        onClose={toggleDrawer}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            boxSizing: 'border-box',
            bgcolor: 'background.default',
            borderRight: 'none',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            boxShadow: theme.shadows[8],
          },
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        {/* Header del Drawer con gradiente y patrón */}
        <Box
          sx={{
            position: 'relative',
            bgcolor: 'primary.dark',
            color: 'primary.contrastText',
            backgroundImage: `linear-gradient(135deg, primary.dark 0%, primary.main 100%)`,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              opacity: 0.1,
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            },
          }}
        >
          {/* Contenedor del Logo y Título */}
          <Box sx={{ p: 3, position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <Image
                src="/images/logo-siprod.svg"
                alt="SIPROD Logo"
                width={48}
                height={48}
                style={{
                  filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.2))'
                }}
              />
              <Box>
                <Typography
                  variant="h5"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: 1,
                    textShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                    mb: 0.5,
                  }}
                >
                  SIPROD
                </Typography>
                <Typography 
                  variant="caption"
                  sx={{ 
                    opacity: 0.9,
                    display: 'block',
                    fontSize: '0.7rem',
                    letterSpacing: 0.5,
                    lineHeight: 1.4,
                    maxWidth: '200px',
                  }}
                >
                  Sistema de Información de Patrullajes y Resultados Operativos Digitales
                </Typography>
              </Box>
            </Box>

            {/* Perfil de Usuario */}
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 2,
                p: 2,
                borderRadius: 2,
                background: 'linear-gradient(135deg, primary.main 0%, primary.light 100%)',
                boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.1)',
                backdropFilter: 'blur(8px)',
              }}
            >
              <Avatar
                sx={{
                  width: 45,
                  height: 45,
                  bgcolor: 'primary.dark',
                  border: '2px solid',
                  borderColor: 'primary.contrastText',
                  boxShadow: '0px 2px 4px rgba(0,0,0,0.2)',
                }}
              >
                JP
              </Avatar>
              <Box sx={{ flex: 1 }}>
                <Typography 
                  variant="subtitle1"
                  sx={{ 
                    fontWeight: 600,
                    color: 'primary.contrastText',
                    lineHeight: 1.2,
                  }}
                >
                  Juan Pérez
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  gap: 1,
                }}>
                  <Typography 
                    variant="caption"
                    sx={{ 
                      color: 'primary.contrastText',
                      opacity: 0.9,
                      fontWeight: 500,
                    }}
                  >
                    Comisario
                  </Typography>
                  <Box 
                    sx={{ 
                      width: 6, 
                      height: 6, 
                      borderRadius: '50%', 
                      bgcolor: 'success.main',
                      boxShadow: '0 0 0 2px rgba(255,255,255,0.2)'
                    }} 
                  />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>

        {/* Lista de Menú con nuevo diseño */}
        <List 
          sx={{ 
            flex: 1,
            px: 2,
            py: 2,
            '& .MuiListItemButton-root': {
              borderRadius: '12px',
              mb: 0.5,
              transition: 'all 0.2s',
              '&:hover': {
                bgcolor: 'action.hover',
                transform: 'translateX(4px)',
              },
              '&.Mui-selected': {
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
                '& .MuiListItemIcon-root': {
                  color: 'primary.contrastText',
                },
              },
            },
            '& .MuiListItemIcon-root': {
              minWidth: 40,
            },
          }}
        >
          {menuItems.map((item) => renderMenuItem(item))}
        </List>

        {/* Footer del Drawer */}
        <Box
          sx={{
            p: 2,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              SIPROD v1.0.0
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'text.secondary',
                fontWeight: 500,
                letterSpacing: 0.5,
              }}
            >
              &copy; Estado Mayor Policial, 2025
            </Typography>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}
