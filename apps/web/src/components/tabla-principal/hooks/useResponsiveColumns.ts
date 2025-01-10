import { useTheme, useMediaQuery } from '@mui/material';

export const useResponsiveColumns = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));

  const getColumnWidth = (defaultWidth: number) => {
    if (isMobile) return defaultWidth * 0.8;
    if (isTablet) return defaultWidth * 0.9;
    return defaultWidth;
  };

  return {
    isMobile,
    isTablet,
    getColumnWidth,
  };
};

export type UseResponsiveColumnsReturn = ReturnType<typeof useResponsiveColumns>;
