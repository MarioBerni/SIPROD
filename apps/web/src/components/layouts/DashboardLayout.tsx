'use client';

import { ReactNode, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Typography } from '@mui/material';
import { DashboardNavbar } from './DashboardNavbar';
import { DashboardSidebar } from './DashboardSidebar';

interface DashboardLayoutProps {
  children: ReactNode;
}

const LayoutRoot = styled('div')({
  display: 'flex',
  minHeight: '100vh',
  width: '100%'
});

const LayoutWrapper = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
  paddingTop: 64
});

const LayoutContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  flex: 1,
  minHeight: 'calc(100vh - 64px)'
});

const MainContent = styled(Box)({
  flex: 1,
  padding: 24,
  paddingTop: 16
});

const Footer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
  textAlign: 'center',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  height: 48,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}));

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <LayoutRoot>
      <DashboardNavbar 
        onSidebarToggle={handleSidebarToggle}
      />
      <DashboardSidebar
        onClose={() => setIsSidebarOpen(false)}
        open={isSidebarOpen}
        variant="temporary"
      />
      <LayoutWrapper>
        <LayoutContent>
          <MainContent>
            {children}
          </MainContent>
          <Footer>
            <Typography variant="body2">
              Estado Mayor Policial, 2025
            </Typography>
          </Footer>
        </LayoutContent>
      </LayoutWrapper>
    </LayoutRoot>
  );
}
