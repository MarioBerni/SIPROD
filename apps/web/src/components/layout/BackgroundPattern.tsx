import { Box } from '@mui/material';

export const BackgroundPattern = () => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: -1,
        background: (theme) => theme.gradients.background,
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: `
            radial-gradient(circle at 100% 0%, rgba(13, 71, 161, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 0% 100%, rgba(25, 118, 210, 0.1) 0%, transparent 50%),
            linear-gradient(45deg, rgba(13, 71, 161, 0.02) 25%, transparent 25%),
            linear-gradient(-45deg, rgba(25, 118, 210, 0.02) 25%, transparent 25%),
            linear-gradient(45deg, transparent 75%, rgba(13, 71, 161, 0.02) 75%),
            linear-gradient(-45deg, transparent 75%, rgba(25, 118, 210, 0.02) 75%)
          `,
          backgroundSize: '100% 100%, 100% 100%, 20px 20px, 20px 20px, 20px 20px, 20px 20px',
          backgroundPosition: '0 0, 0 0, 0 0, 0 10px, 10px -10px, -10px 0px',
          opacity: 0.5,
        },
        '&::after': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(13, 71, 161, 0.03) 0%, rgba(25, 118, 210, 0) 100%)',
          backdropFilter: 'blur(100px)',
        },
      }}
    />
  );
};
