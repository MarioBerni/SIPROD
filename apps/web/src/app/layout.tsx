import { Metadata } from 'next';
import ThemeRegistry from '@/components/providers/ThemeRegistry';

export const metadata: Metadata = {
  title: 'SIPROD',
  description: 'Sistema de Gestión de Resultados Policiales y Recursos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>
        <ThemeRegistry>
          {children}
        </ThemeRegistry>
      </body>
    </html>
  );
}
