import { Box, useMediaQuery, useTheme } from '@mui/material';
import { ReactNode, useState } from 'react';
import { Drawer } from './Drawer';
import { Navbar } from './Navbar';

const DRAWER_WIDTH = 280;
const DRAWER_COLLAPSED_WIDTH = 64;

interface DashboardLayoutProps {
  children: ReactNode;
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isDrawerCollapsed, setIsDrawerCollapsed] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleDrawerCollapse = () => {
    setIsDrawerCollapsed(!isDrawerCollapsed);
  };

  const currentDrawerWidth = isDrawerCollapsed ? DRAWER_COLLAPSED_WIDTH : DRAWER_WIDTH;

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      {/* Drawer móvil */}
      {isMobile && (
        <Drawer
          open={mobileOpen}
          onClose={handleDrawerToggle}
          variant="temporary"
          collapsed={false}
          onCollapse={handleDrawerCollapse}
          isCollapsed={isDrawerCollapsed}
          sx={{
            width: DRAWER_WIDTH,
            '& .MuiDrawer-paper': {
              width: DRAWER_WIDTH,
              boxSizing: 'border-box',
            },
          }}
        />
      )}

      {/* Drawer fijo para desktop */}
      {!isMobile && (
        <Drawer
          open={true}
          onClose={() => {}}
          variant="permanent"
          collapsed={isDrawerCollapsed}
          onCollapse={handleDrawerCollapse}
          isCollapsed={isDrawerCollapsed}
          sx={{
            width: currentDrawerWidth,
            flexShrink: 0,
            '& .MuiDrawer-paper': {
              width: currentDrawerWidth,
              boxSizing: 'border-box',
              borderRight: 'none',
              boxShadow: '4px 0 8px rgba(0, 0, 0, 0.1)',
              overflowX: 'hidden',
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
            },
          }}
        />
      )}

      {/* Contenedor principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100vh',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          bgcolor: 'background.default',
          transition: theme.transitions.create(['margin', 'width'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
          }),
        }}
      >
        {/* Navbar */}
        <Navbar
          onDrawerToggle={handleDrawerToggle}
          sx={{
            width: { md: `calc(100% - ${currentDrawerWidth}px)` },
            ml: { md: `${currentDrawerWidth}px` },
            transition: theme.transitions.create(['margin', 'width'], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
          }}
        />

        {/* Contenido de la página */}
        <Box
          sx={{
            flexGrow: 1,
            p: 3,
            mt: '64px',
            overflow: 'auto',
            bgcolor: 'background.default',
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};
