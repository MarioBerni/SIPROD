import { Inter } from 'next/font/google';
import './globals.css';
import ClientLayout from '@/components/layouts/ClientLayout';
import { AuthProvider } from '@/contexts/AuthContext';
import { LoadingProvider } from '@/providers/LoadingProvider';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <ClientLayout>
          <AuthProvider>
            <LoadingProvider>
              {children}
            </LoadingProvider>
          </AuthProvider>
        </ClientLayout>
      </body>
    </html>
  );
}
