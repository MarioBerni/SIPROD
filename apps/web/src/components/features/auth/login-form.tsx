'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Container,
  useTheme,
  alpha,
  InputAdornment,
  IconButton,
  Snackbar,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Typewriter } from '@/components/ui/typewriter';
import { styled } from '@mui/material/styles';
import { ForgotPasswordDialog } from './forgot-password-dialog';
import { useLoading } from '@/hooks/useLoading';

interface LoginFormData {
  correo: string;
  password: string;
}

const StyledTypewriter = styled(Typewriter)`
  background: ${({ theme }) => `linear-gradient(135deg, 
    ${theme.palette.text.secondary} 0%,
    ${alpha(theme.palette.text.primary, 0.8)} 50%,
    ${theme.palette.text.secondary} 100%
  )`};
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  font-weight: 500;
`;

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const theme = useTheme();
  const { withLoading } = useLoading();
  const [formData, setFormData] = useState<LoginFormData>({
    correo: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await withLoading(login(formData.correo, formData.password));
      setSnackbar({
        open: true,
        message: '¡Inicio de sesión exitoso! Redirigiendo...',
        severity: 'success',
      });
      
      // Esperar 1.5 segundos antes de redirigir para mostrar el mensaje de éxito
      setTimeout(() => {
        router.push('/dashboard');
      }, 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error al iniciar sesión';
      setSnackbar({
        open: true,
        message: errorMessage,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
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
            {/* Logo SIPROD y título */}
            <Box sx={{ mb: 4 }}>
              {/* Logo y SIPROD */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                mb: 2
              }}>
                <Image
                  src="/images/logo-siprod.svg"
                  alt="Logo SIPROD"
                  width={50}
                  height={50}
                  style={{ objectFit: 'contain' }}
                />
                <Typography 
                  variant="h4" 
                  component="h1"
                  sx={{ 
                    color: theme.palette.primary.main,
                    fontWeight: 700,
                    letterSpacing: 1,
                    display: 'flex',
                    alignItems: 'center',
                  }}
                >
                  SIPROD
                </Typography>
              </Box>
              
              {/* Descripción */}
              <Box sx={{ 
                height: 48, 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center',
                mb: 2,
              }}>
                <StyledTypewriter
                  text="Sistema de Información de Patrullajes y Recursos Operativos Digitales"
                  delay={40}
                  className="text-sm text-center leading-tight max-w-[85%] mx-auto opacity-0 transition-opacity duration-500"
                  onComplete={() => {}}
                />
              </Box>
            </Box>
          
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 2.5 }}>
                <TextField
                  fullWidth
                  id="correo"
                  name="correo"
                  label="Correo electrónico"
                  variant="outlined"
                  value={formData.correo}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  size="small"
                  type="email"
                  autoComplete="email"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    }
                  }}
                />
              </Box>

              <Box sx={{ mb: 3 }}>
                <TextField
                  fullWidth
                  id="password"
                  name="password"
                  label="Contraseña"
                  type={showPassword ? 'text' : 'password'}
                  variant="outlined"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                  size="small"
                  autoComplete="current-password"
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      backgroundColor: alpha(theme.palette.background.paper, 0.8),
                    }
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>

              <Box sx={{ width: '100%', mt: 2 }}>
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  disabled={loading}
                  sx={{
                    mt: 1,
                    mb: 2,
                    height: '48px',
                    backgroundColor: theme => theme.palette.primary.main,
                    '&:hover': {
                      backgroundColor: theme => theme.palette.primary.dark,
                    },
                  }}
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </Button>

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
            </form>
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
