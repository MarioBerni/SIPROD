import { Box, Typography, alpha } from '@mui/material';
import { DashboardOutlined as DashboardIcon } from '@mui/icons-material';

export const DashboardHeader = () => {
  return (
    <Box
      sx={{
        width: '100%',
        p: 2.5,
        mb: 3,
        borderRadius: 2,
        bgcolor: 'background.paper',
        boxShadow: 1,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: `0 4px 20px ${alpha('#1565C0', 0.15)}`,
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 48,
            height: 48,
            borderRadius: 1.5,
            bgcolor: alpha('#1565C0', 0.12),
            color: '#1565C0',
          }}
        >
          <DashboardIcon sx={{ fontSize: 24 }} />
        </Box>
        <Box>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 600,
              mb: 0.5,
              color: 'text.primary',
            }}
          >
            Panel de Control
          </Typography>
          <Typography 
            variant="body2" 
            sx={{
              color: 'text.secondary',
              fontWeight: 500,
            }}
          >
            Gestión y monitoreo de despliegues
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};
