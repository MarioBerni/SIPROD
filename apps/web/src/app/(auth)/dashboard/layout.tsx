import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIPROD - Dashboard',
  description: 'Panel de Control - Sistema de Gestión de Resultados Policiales y Recursos',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
