'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
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
  Link as MuiLink,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';

interface LoginFormData {
  correo: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const theme = useTheme();
  const [formData, setFormData] = useState<LoginFormData>({
    correo: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData.correo, formData.password);
      console.log('Login - Redirigiendo a dashboard');
      router.push('/dashboard');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Error al iniciar sesión');
      }
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
            top: '50%',
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
              <Typography 
                variant="body1" 
                sx={{ 
                  color: theme.palette.text.secondary,
                  maxWidth: '85%',
                  mx: 'auto',
                  fontWeight: 500,
                  lineHeight: 1.4,
                  fontSize: '0.95rem',
                }}
              >
                Sistema de Información de Patrullajes y Recursos Operativos Digitales
              </Typography>
            </Box>
          
            <form onSubmit={handleSubmit}>
              {error && (
                <Alert 
                  severity="error" 
                  sx={{ 
                    mb: 3,
                    '& .MuiAlert-message': {
                      width: '100%'
                    }
                  }}
                >
                  {error}
                </Alert>
              )}
              
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

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={loading}
                sx={{ 
                  py: 1.2,
                  bgcolor: theme.palette.primary.main,
                  '&:hover': {
                    bgcolor: theme.palette.primary.dark,
                    boxShadow: theme.shadows[8],
                  },
                  fontWeight: 600,
                  boxShadow: theme.shadows[4],
                  mb: 2,
                }}
              >
                {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
              </Button>

              <Box sx={{ textAlign: 'center' }}>
                <MuiLink
                  component={Link}
                  href="/recuperar-password"
                  variant="body2"
                  sx={{
                    color: theme.palette.primary.main,
                    textDecoration: 'none',
                    '&:hover': {
                      textDecoration: 'underline',
                    },
                  }}
                >
                  ¿Olvidaste la contraseña?
                </MuiLink>
              </Box>
            </form>
          </Box>
        </CardContent>
      </Card>
    </Container>
  );
}
