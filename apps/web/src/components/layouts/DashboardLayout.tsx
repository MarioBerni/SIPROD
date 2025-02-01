'use client';

import { ReactNode, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { DashboardNavbar } from './DashboardNavbar';
import { DashboardSidebar } from './DashboardSidebar';
import { getBaseLayoutStyles } from '@/styles/baseLayoutStyles';
import { useTheme } from '@mui/material/styles';

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const theme = useTheme();
  const styles = getBaseLayoutStyles(theme);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box sx={styles.root}>
      <DashboardNavbar 
        onSidebarToggle={handleSidebarToggle}
      />
      <DashboardSidebar
        onClose={() => setIsSidebarOpen(false)}
        open={isSidebarOpen}
        variant="temporary"
      />
      <Box sx={styles.wrapper}>
        <Box sx={styles.content}>
          <Box component="main" sx={styles.main}>
            {children}
          </Box>
          <Box component="footer" sx={styles.footer}>
            <Typography variant="body2">
              Estado Mayor Policial, 2025
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
