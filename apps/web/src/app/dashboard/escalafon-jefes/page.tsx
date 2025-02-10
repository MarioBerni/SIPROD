'use client';

import { useEffect } from 'react';
import { Box } from '@mui/material';
import { Groups as GroupsIcon } from '@mui/icons-material';
import { usePageTitle } from '@/contexts/PageTitleContext';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { ChiefRankManager } from '@/components/chiefs/ChiefRankManager';

export default function EscalafonPage() {
  const { setPageTitle } = usePageTitle();

  useEffect(() => {
    setPageTitle('Escalafón Jefes', GroupsIcon);
  }, [setPageTitle]);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <ChiefRankManager />
      </Box>
    </LocalizationProvider>
  );
}