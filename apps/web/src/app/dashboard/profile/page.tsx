'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Alert,
  Grid,
  Avatar,
} from '@mui/material';
import { api } from '@/lib/api';

interface Profile {
  id: string;
  username: string;
  email: string;
  fullName: string;
  role: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    fullName: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data?.data) {
        setProfile(response.data.data);
        setFormData(prev => ({
          ...prev,
          email: response.data.data.email,
          fullName: response.data.data.fullName,
        }));
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      setError('Error al cargar el perfil');
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (formData.newPassword && formData.newPassword !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    try {
      const updateData = {
        email: formData.email,
        fullName: formData.fullName,
        ...(formData.newPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      };

      await api.put('/users/profile', updateData);
      setSuccess('Perfil actualizado correctamente');
      setIsEditing(false);
      loadProfile();
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        const axiosError = error as { response?: { data?: { message?: string } } };
        setError(axiosError.response?.data?.message || 'Error al actualizar el perfil');
      } else {
        setError('Error al actualizar el perfil');
      }
    }
  };

  if (!profile) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando perfil...</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4 }}>
        Mi Perfil
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 120,
                height: 120,
                margin: '0 auto 16px',
                bgcolor: 'primary.main',
                fontSize: '3rem',
              }}
            >
              {profile.fullName?.[0]?.toUpperCase() || profile.username[0].toUpperCase()}
            </Avatar>
            <Typography variant="h6">{profile.fullName}</Typography>
            <Typography color="textSecondary">{profile.role}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}
            {success && (
              <Alert severity="success" sx={{ mb: 2 }}>
                {success}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                fullWidth
                label="Usuario"
                value={profile.username}
                disabled
                margin="normal"
              />
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                disabled={!isEditing}
                margin="normal"
              />
              <TextField
                fullWidth
                label="Nombre Completo"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                disabled={!isEditing}
                margin="normal"
              />

              {isEditing && (
                <>
                  <TextField
                    fullWidth
                    label="Contraseña Actual"
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Nueva Contraseña"
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                  <TextField
                    fullWidth
                    label="Confirmar Nueva Contraseña"
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    margin="normal"
                  />
                </>
              )}

              <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                {!isEditing ? (
                  <Button
                    variant="contained"
                    onClick={() => setIsEditing(true)}
                  >
                    Editar Perfil
                  </Button>
                ) : (
                  <>
                    <Button
                      variant="contained"
                      type="submit"
                    >
                      Guardar Cambios
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => {
                        setIsEditing(false);
                        setError(null);
                        setSuccess(null);
                        loadProfile();
                      }}
                    >
                      Cancelar
                    </Button>
                  </>
                )}
              </Box>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
