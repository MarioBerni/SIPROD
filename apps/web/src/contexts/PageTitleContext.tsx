'use client';

import { createContext, useContext, ReactNode, useState } from 'react';
import { SvgIconComponent } from '@mui/icons-material';

interface PageTitleContextType {
  title: string;
  icon: SvgIconComponent | null;
  setPageTitle: (title: string, icon: SvgIconComponent) => void;
}

const PageTitleContext = createContext<PageTitleContextType>({
  title: '',
  icon: null,
  setPageTitle: () => {},
});

export function PageTitleProvider({ children }: { children: ReactNode }) {
  const [title, setTitle] = useState('');
  const [icon, setIcon] = useState<SvgIconComponent | null>(null);

  const setPageTitle = (newTitle: string, newIcon: SvgIconComponent) => {
    setTitle(newTitle);
    setIcon(newIcon);
  };

  return (
    <PageTitleContext.Provider value={{ title, icon, setPageTitle }}>
      {children}
    </PageTitleContext.Provider>
  );
}

export const usePageTitle = () => useContext(PageTitleContext);
