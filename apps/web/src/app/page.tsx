import { LoginForm } from '@/components/features/auth/LoginForm';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SIPROD - Iniciar Sesión',
  description: 'Sistema de Gestión de Resultados Policiales y Recursos',
};

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <LoginForm />
      </div>
    </main>
  );
}
