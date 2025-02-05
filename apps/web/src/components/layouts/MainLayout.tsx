'use client';
import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Toolbar } from '@mui/material';
import { Navbar } from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  width: '100%',
  background: `linear-gradient(135deg, 
    ${theme.palette.background.default} 0%,
    ${theme.palette.primary.light}10 25%,
    ${theme.palette.background.default} 50%,
    ${theme.palette.primary.light}05 75%,
    ${theme.palette.background.default} 100%
  )`,
  backgroundAttachment: 'fixed',
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
  maxWidth: theme.breakpoints.values.lg,
  margin: '0 auto',
  padding: theme.spacing(3),
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(2),
  },
}));

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <MainContainer>
      <Navbar />
      <Toolbar /> {/* Espaciador para el navbar fijo */}
      <StyledContainer>
        {children}
      </StyledContainer>
    </MainContainer>
  );
}
