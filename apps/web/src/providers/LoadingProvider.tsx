'use client';

import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Spinner } from '@/components/ui/Spinner';
import { useLoading } from '@/hooks/useLoading';

export function LoadingProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { isLoading, setLoading } = useLoading();

  // Manejar cambios de ruta
  useEffect(() => {
    const handleStop = () => setLoading(false);

    // Next.js 14 no tiene eventos de navegación directos,
    // por lo que usamos los cambios en pathname y searchParams
    handleStop();
  }, [pathname, searchParams, setLoading]);

  return (
    <>
      {isLoading && <Spinner />}
      {children}
    </>
  );
}
