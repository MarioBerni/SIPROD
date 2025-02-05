'use client';

import Image from 'next/image';
import { Box, Typography, useTheme, alpha } from '@mui/material';

export function LoginHeader() {
  const theme = useTheme();

  return (
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
        <Typography
          variant="h5"
          align="center"
          sx={{
            background: `linear-gradient(135deg, 
              ${theme.palette.text.secondary} 0%,
              ${alpha(theme.palette.text.primary, 0.8)} 50%,
              ${theme.palette.text.secondary} 100%
            )`,
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            fontWeight: 500,
          }}
        >
          Sistema de Información de Patrullajes y Recursos Operativos Digitales
        </Typography>
      </Box>
    </Box>
  );
}
