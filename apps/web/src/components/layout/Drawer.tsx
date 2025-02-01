import { Box, Collapse, Drawer as MuiDrawer, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography, alpha, styled, SxProps, Theme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DirectionsIcon from '@mui/icons-material/Directions';
import GroupsIcon from '@mui/icons-material/Groups';
import BarChartIcon from '@mui/icons-material/BarChart';
import PersonIcon from '@mui/icons-material/Person';
import MapIcon from '@mui/icons-material/Map';
import TableChartIcon from '@mui/icons-material/TableChart';
import PeopleIcon from '@mui/icons-material/People';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import Link from 'next/link';

interface MenuItem {
  text: string;
  icon: JSX.Element;
  path?: string;
  children?: MenuItem[];
}

interface DrawerProps {
  open: boolean;
  onClose: () => void;
  variant?: 'permanent' | 'persistent' | 'temporary';
  collapsed?: boolean;
  onCollapse?: () => void;
  isCollapsed?: boolean;
  sx?: SxProps<Theme>;
}

const menuItems: MenuItem[] = [
  {
    text: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/dashboard',
  },
  {
    text: 'Administración',
    icon: <AdminPanelSettingsIcon />,
    children: [
      {
        text: 'Mapas',
        icon: <MapIcon />,
        path: '/dashboard/administrador/mapas',
      },
      {
        text: 'Tabla Principal',
        icon: <TableChartIcon />,
        path: '/dashboard/administrador/tabla-principal',
      },
      {
        text: 'Usuarios',
        icon: <PeopleIcon />,
        path: '/dashboard/administrador/usuarios',
      },
    ],
  },
  {
    text: 'Despliegues PDF',
    icon: <PictureAsPdfIcon />,
    path: '/dashboard/despliegues-pdf',
  },
  {
    text: 'Dirección',
    icon: <DirectionsIcon />,
    path: '/dashboard/direccion-1',
  },
  {
    text: 'Escalafón Jefes',
    icon: <GroupsIcon />,
    path: '/dashboard/escalafon-jefes',
  },
  {
    text: 'Estadística',
    icon: <BarChartIcon />,
    path: '/dashboard/estadistica',
  },
  {
    text: 'Perfil',
    icon: <PersonIcon />,
    path: '/dashboard/perfil',
  },
];

const StyledDrawer = styled(MuiDrawer)(({ }) => ({
  width: 280,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  '& .MuiDrawer-paper': {
    width: 280,
    boxSizing: 'border-box',
    paddingTop: 64,
    overflowX: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
}));

export const Drawer = ({ 
  open, 
  onClose, 
  variant = 'temporary', 
  collapsed = false,
  onCollapse,
  isCollapsed = false,
  sx 
}: DrawerProps) => {
  const pathname = usePathname();
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);

  const handleSubmenuClick = (text: string) => {
    if (!collapsed) {
      setOpenSubmenu(openSubmenu === text ? null : text);
    }
  };

  const renderMenuItem = (item: MenuItem, level = 0) => {
    const isSelected = pathname === item.path;
    const hasChildren = item.children && item.children.length > 0;
    const isSubmenuOpen = openSubmenu === item.text;

    const menuItem = (
      <ListItemButton
        component={hasChildren ? 'div' : Link}
        href={hasChildren ? undefined : item.path}
        selected={isSelected}
        onClick={hasChildren 
          ? () => handleSubmenuClick(item.text) 
          : () => {
              if (variant === 'temporary') {
                onClose();
              }
            }
        }
        sx={{
          pl: collapsed ? 2 : level * 3 + 2,
          py: 1.5,
          minHeight: 48,
          justifyContent: collapsed ? 'center' : 'flex-start',
          '&.Mui-selected': {
            color: '#fff',
            '& .MuiListItemIcon-root': {
              color: '#fff',
            },
          },
        }}
      >
        <ListItemIcon
          sx={{
            minWidth: collapsed ? 0 : 40,
            mr: collapsed ? 0 : 2,
            justifyContent: 'center',
            color: alpha('#fff', 0.7),
          }}
        >
          {item.icon}
        </ListItemIcon>
        {!collapsed && (
          <>
            <ListItemText
              primary={item.text}
              primaryTypographyProps={{
                fontSize: 14,
                fontWeight: isSelected ? 600 : 400,
              }}
            />
            {hasChildren && (isSubmenuOpen ? <ExpandLess /> : <ExpandMore />)}
          </>
        )}
      </ListItemButton>
    );

    return (
      <Box key={item.text}>
        {collapsed ? (
          <Tooltip title={item.text} placement="right">
            {menuItem}
          </Tooltip>
        ) : (
          menuItem
        )}

        {!collapsed && hasChildren && item.children && (
          <Collapse in={isSubmenuOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {item.children.map((child) => renderMenuItem(child, level + 1))}
            </List>
          </Collapse>
        )}
      </Box>
    );
  };

  return (
    <StyledDrawer
      variant={variant}
      anchor="left"
      open={open}
      onClose={onClose}
      sx={sx}
      ModalProps={{
        keepMounted: true,
      }}
    >
      <Box sx={{ flexGrow: 1 }}>
        <List
          sx={{
            px: collapsed ? 1 : 2,
            '& .MuiListItemButton-root': {
              borderRadius: 2,
              mb: 0.5,
            },
          }}
        >
          {menuItems.map((item) => renderMenuItem(item))}
        </List>
      </Box>

      {/* Footer con copyright y versión */}
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid',
          borderColor: 'rgba(255, 255, 255, 0.1)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {!collapsed && (
          <>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: alpha('#fff', 0.7),
                mb: 0.5,
              }}
            >
              ESMAPO, 2025
            </Typography>
            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                color: alpha('#fff', 0.5),
                mb: 2,
              }}
            >
              Versión 1.0.0
            </Typography>
          </>
        )}
        
        {/* Botón de colapso */}
        <IconButton
          onClick={onCollapse}
          sx={{
            color: 'white',
            bgcolor: 'primary.main',
            '&:hover': {
              bgcolor: 'primary.dark',
            },
            width: 32,
            height: 32,
            transform: isCollapsed ? 'rotate(180deg)' : 'none',
            transition: (theme) =>
              theme.transitions.create('transform', {
                duration: theme.transitions.duration.enteringScreen,
              }),
          }}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
      </Box>
    </StyledDrawer>
  );
};
