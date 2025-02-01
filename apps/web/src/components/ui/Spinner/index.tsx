'use client';

import { Box } from '@mui/material';
import { spinnerStyles } from './styles';

interface SpinnerProps {
  fullScreen?: boolean;
  size?: 'small' | 'medium' | 'large';
  transparent?: boolean;
}

export const Spinner = ({ 
  fullScreen = true, 
  size = 'medium',
  transparent = false 
}: SpinnerProps) => {
  if (!fullScreen) {
    return (
      <Box sx={{
        ...spinnerStyles.inline,
        ...(size === 'small' && { width: '16px', height: '16px', '& $loader': { fontSize: '3px' } }),
        ...(size === 'large' && { width: '24px', height: '24px', '& $loader': { fontSize: '5px' } }),
      }}>
        <Box sx={spinnerStyles.loader} />
      </Box>
    );
  }

  return (
    <Box sx={{
      ...spinnerStyles.wrapper,
      ...(transparent && { backgroundColor: 'rgba(255, 255, 255, 0.4)' }),
    }}>
      <Box sx={spinnerStyles.container}>
        <Box sx={{
          ...spinnerStyles.loader,
          ...(size === 'small' && { fontSize: '8px' }),
          ...(size === 'large' && { fontSize: '14px' }),
        }} />
      </Box>
    </Box>
  );
};
