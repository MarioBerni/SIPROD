'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import {
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Box,
  Container,
} from '@mui/material';

interface LoginFormData {
  username: string;
  password: string;
}

export function LoginForm() {
  const router = useRouter();
  const { login } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    username: '',
    password: '',
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      await login(formData.username, formData.password);
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

  return (
    <Container component="main" maxWidth={false} disableGutters sx={{ 
      height: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      bgcolor: 'grey.100'
    }}>
      <Card sx={{ width: 350, p: 2 }}>
        <CardContent>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h5" component="h1" gutterBottom>
              SIPROD
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Sistema de Gestión de Resultados Policiales y Recursos
            </Typography>
          </Box>
          
          <form onSubmit={handleSubmit}>
            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                id="username"
                name="username"
                label="Usuario"
                variant="outlined"
                value={formData.username}
                onChange={handleChange}
                required
                disabled={loading}
                size="small"
              />
            </Box>

            <Box sx={{ mb: 2 }}>
              <TextField
                fullWidth
                id="password"
                name="password"
                label="Contraseña"
                type="password"
                variant="outlined"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={loading}
                size="small"
              />
            </Box>

            {error && (
              <Box sx={{ mb: 2 }}>
                <Alert severity="error">
                  {error}
                </Alert>
              </Box>
            )}

            <Button
              type="submit"
              variant="contained"
              fullWidth
              disabled={loading}
              sx={{ mt: 2 }}
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </Container>
  );
}
