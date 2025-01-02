import { Metadata } from 'next';
import dynamic from 'next/dynamic';

// Importar el formulario de login como componente de cliente
const LoginForm = dynamic(
  () => import('@/components/features/auth/login-form').then(mod => mod.LoginForm),
  { ssr: false } // Deshabilitar SSR para este componente
);

export const metadata: Metadata = {
  title: 'SIPROD - Iniciar Sesión',
  description: 'Sistema de Gestión de Resultados Policiales y Recursos',
};

export default function Home() {
  return (
    <main>
      <LoginForm />
    </main>
  );
}
