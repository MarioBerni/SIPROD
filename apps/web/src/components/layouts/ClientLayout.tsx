'use client';

import { ThemeProvider } from '@mui/material';
import { CssBaseline } from '@mui/material';
import theme from '@/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { PageTitleProvider } from '@/contexts/PageTitleContext';
import { env } from '@/lib/env.validator';
import { useEffect, useState } from 'react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    console.log('Frontend - API Base URL:', env.NEXT_PUBLIC_API_URL);
  }, []);

  // Prevenir el flash de contenido no hidratado
  if (!mounted) {
    return null;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <PageTitleProvider>
          {children}
        </PageTitleProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}
