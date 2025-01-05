import { ReactNode } from 'react';
import { styled } from '@mui/material/styles';
import { Box, Container, Toolbar } from '@mui/material';
import { Navbar } from './Navbar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
  backgroundColor: theme.palette.background.default,
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  flexGrow: 1,
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  [theme.breakpoints.up('lg')]: {
    maxWidth: theme.breakpoints.values.lg,
  },
}));

export function MainLayout({ children }: MainLayoutProps) {
  return (
    <MainContainer>
      <Navbar />
      <Toolbar /> {/* Espaciador para el navbar fijo */}
      <StyledContainer maxWidth="lg">
        {children}
      </StyledContainer>
    </MainContainer>
  );
}
