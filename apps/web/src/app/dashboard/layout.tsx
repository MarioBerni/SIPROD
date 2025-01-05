'use client';

import { Box, Container, Typography } from '@mui/material';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar />
      <Box 
        sx={{ 
          flexGrow: 1, 
          display: 'flex', 
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Header />
        <Box 
          component="main" 
          sx={{ 
            flexGrow: 1,
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          <Box sx={{ p: 3, flex: 1 }}>
            <Container maxWidth="xl" sx={{ flexGrow: 1 }}>
              {children}
            </Container>
          </Box>
          <Box
            component="footer"
            sx={{
              py: 2,
              px: 3,
              mt: 'auto',
              backgroundColor: 'primary.main',
              color: 'primary.contrastText',
              borderTop: '1px solid',
              borderColor: 'primary.dark',
            }}
          >
            <Typography
              variant="body2"
              sx={{
                textAlign: 'center',
                fontWeight: 500,
                letterSpacing: 0.5,
                opacity: 0.9,
                '& a': {
                  color: 'inherit',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                },
              }}
            >
              {new Date().getFullYear()} Estado Mayor Policial. Todos los derechos reservados.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
