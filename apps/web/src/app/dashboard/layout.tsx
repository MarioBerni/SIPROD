'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { PageTitleProvider, usePageTitle } from '@/contexts/PageTitleContext';
import { navigationConfig } from '@/config/navigation';
import { Box } from '@mui/material';
import { useAuth } from '@/contexts/AuthContext';
import { redirect } from 'next/navigation';

function findNavItem(pathname: string | null) {
  if (!pathname) {
    return navigationConfig[0];
  }

  const exactMatch = navigationConfig.find(item => item.href === pathname);
  if (exactMatch) {
    return exactMatch;
  }

  for (const item of navigationConfig) {
    if (item.subItems) {
      const subItem = item.subItems.find(sub => sub.href === pathname);
      if (subItem) {
        return subItem;
      }
    }
  }

  return navigationConfig[0];
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setPageTitle } = usePageTitle();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    const navItem = findNavItem(pathname);
    setPageTitle(navItem.title, navItem.icon);
  }, [pathname, setPageTitle]);

  // Redirigir a la página de inicio de sesión si no está autenticado
  if (!isLoading && !isAuthenticated) {
    redirect('/');
  }

  if (isLoading) {
    return <div>Cargando...</div>;
  }

  return (
    <DashboardLayout>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        {children}
      </Box>
    </DashboardLayout>
  );
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTitleProvider>
      <DashboardLayoutContent>{children}</DashboardLayoutContent>
    </PageTitleProvider>
  );
}
