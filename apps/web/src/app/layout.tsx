'use client';

import { Inter } from 'next/font/google';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '@/theme';
import { AuthProvider } from '@/contexts/AuthContext';
import { env } from '@/lib/env.validator';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  console.log('Frontend - API Base URL:', env.NEXT_PUBLIC_API_URL);
  return (
    <html lang="es">
      <body className={inter.className}>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
