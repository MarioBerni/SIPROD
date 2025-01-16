'use client';

import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { PageTitleProvider, usePageTitle } from '@/contexts/PageTitleContext';
import { navigationConfig } from '@/config/navigation';

function findNavItem(pathname: string | null) {
  // Si pathname es null o undefined, devolver el item del dashboard
  if (!pathname) {
    return navigationConfig[0];
  }

  // Primero buscar coincidencia exacta
  const exactMatch = navigationConfig.find(item => item.href === pathname);
  if (exactMatch) {
    return exactMatch;
  }

  // Si no hay coincidencia exacta, buscar en subitems
  for (const item of navigationConfig) {
    if (item.subItems) {
      const subItem = item.subItems.find(sub => sub.href === pathname);
      if (subItem) {
        return subItem;
      }
    }
  }

  // Si no se encuentra, devolver el item del dashboard
  return navigationConfig[0];
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    const navItem = findNavItem(pathname);
    setPageTitle(navItem.title, navItem.icon);
  }, [pathname, setPageTitle]);

  return <DashboardLayout>{children}</DashboardLayout>;
}

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <PageTitleProvider>
      <DashboardLayoutContent>
        {children}
      </DashboardLayoutContent>
    </PageTitleProvider>
  );
}
