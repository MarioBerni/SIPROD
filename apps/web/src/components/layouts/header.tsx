'use client';

import { useRouter } from 'next/navigation';
import { Button } from '../ui/button';
import { authApi } from '@/lib/api';

export function Header() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  return (
    <header className="bg-white shadow">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-gray-900">SIPROD</h1>
          <Button variant="outline" onClick={handleLogout}>
            Cerrar sesión
          </Button>
        </div>
      </div>
    </header>
  );
}
