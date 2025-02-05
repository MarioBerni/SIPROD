'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  Box,
  Container,
  useTheme,
  Typography,
  Alert,
  Snackbar,
  alpha,
} from '@mui/material';
import { LoginHeader } from './LoginHeader';
import { LoginForm } from './LoginForm';
import { ForgotPasswordDialog } from '../forgot-password-dialog';

export function LoginContainer() {
  const theme = useTheme();
  const [forgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: 'success' | 'error';
  }>({
    open: false,
    message: '',
    severity: 'success',
  });

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  const handleLoginSuccess = () => {
    setSnackbar({
      open: true,
      message: '¡Inicio de sesión exitoso! Redirigiendo...',
      severity: 'success',
    });
  };

  const handleLoginError = (errorMessage: string) => {
    setSnackbar({
      open: true,
      message: errorMessage,
      severity: 'error',
    });
  };

  return (
    <Container 
      component="main" 
      maxWidth={false} 
      disableGutters 
      sx={{ 
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: 'url(/images/dngr.jpeg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          filter: 'brightness(0.3)',
          zIndex: -1,
        }
      }}
    >
      <Card 
        elevation={24}
        sx={{ 
          width: { xs: '90%', sm: 450 },
          backdropFilter: 'blur(10px)',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.background.paper, 0.9)} 0%, 
            ${alpha(theme.palette.background.paper, 0.7)} 100%
          )`,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: '65%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '100%',
            height: '100%',
            backgroundImage: 'url(/images/logo-gr.svg)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center',
            backgroundSize: '200px',
            opacity: 0.06,
            zIndex: 0,
            pointerEvents: 'none',
            filter: 'contrast(0.8) brightness(1.2)',
          }
        }}
      >
        <CardContent 
          sx={{ 
            p: { xs: 3, sm: 4 },
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ textAlign: 'center' }}>
            <LoginHeader />
            <LoginForm onSuccess={handleLoginSuccess} onError={handleLoginError} />

            <Box sx={{ 
              textAlign: 'center',
              mt: 1
            }}>
              <Typography
                variant="body2"
                component="div"
                onClick={() => setForgotPasswordOpen(true)}
                sx={{
                  color: theme => theme.palette.primary.main,
                  cursor: 'pointer',
                  display: 'inline-block',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                ¿Olvidaste la contraseña?
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ 
            width: '100%',
            backgroundColor: theme => snackbar.severity === 'success' 
              ? theme.palette.success.main 
              : theme.palette.error.main,
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white'
            }
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <ForgotPasswordDialog
        open={forgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </Container>
  );
}
