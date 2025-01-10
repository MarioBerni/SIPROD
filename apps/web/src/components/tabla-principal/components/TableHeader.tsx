import { Box, Typography } from '@mui/material';
import { UseResponsiveColumnsReturn } from '../hooks/useResponsiveColumns';

interface TableHeaderProps {
  responsive: UseResponsiveColumnsReturn;
}

export const TableHeader = ({ responsive }: TableHeaderProps) => {
  const { isMobile } = responsive;

  return (
    <Box
      sx={{
        p: { xs: 1, sm: 2, md: 3 },
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: 2,
        flexWrap: 'wrap',
      }}
    >
      <Typography
        variant={isMobile ? 'h6' : 'h5'}
        component="h1"
        color="primary"
        fontWeight="bold"
        sx={{
          fontSize: {
            xs: '1.1rem',
            sm: '1.3rem',
            md: '1.5rem',
          },
        }}
      >
        Tabla Principal
      </Typography>
    </Box>
  );
};
