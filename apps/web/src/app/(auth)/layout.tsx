'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Navbar } from '@/components/layouts/Navbar';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    // Verificar autenticación
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    // Validar token
    api.get('/auth/validate')
      .catch(() => {
        localStorage.removeItem('token');
        router.push('/');
      });
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <header className="bg-white shadow mb-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900">SIPROD</h1>
              <button
                onClick={handleLogout}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                Cerrar sesión
              </button>
            </div>
          </header>

          {/* Sidebar y Contenido */}
          <div className="flex gap-8">
            {/* Sidebar */}
            <nav className="w-64 space-y-1">
              <a
                href="/dashboard"
                className="block px-3 py-2 rounded-md text-base font-medium text-gray-900 hover:bg-gray-50"
              >
                Panel de Control
              </a>
              {/* Agregar más enlaces según sea necesario */}
            </nav>

            {/* Contenido principal */}
            <div className="flex-1 bg-white rounded-lg shadow">
              {children}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
