'use client';

import { Dialog, useTheme } from '@mui/material';
import { Service } from '@/data/__mocks__/servicesMock';
import { ServiceDialogContent } from './components/ServiceDialogContent';

interface ServiceDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (service: Omit<Service, 'id'>) => void;
  service?: Service;
}

export const ServiceDialog = ({
  open,
  onClose,
  onSave,
  service
}: ServiceDialogProps) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: 2,
          overflow: 'hidden',
          backgroundImage: 'none',
          '& .MuiDialogTitle-root': {
            p: 2,
            background: `linear-gradient(45deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
            color: 'white',
            '& .MuiTypography-root': {
              color: 'inherit'
            }
          },
          '& .MuiDialogContent-root': {
            p: 0,
            bgcolor: theme.palette.background.paper
          },
          '& .MuiDialogActions-root': {
            px: 3,
            py: 2,
            bgcolor: theme.palette.background.default,
            borderTop: `1px solid ${theme.palette.divider}`
          },
          '& .MuiTab-root': {
            minHeight: 56,
            fontSize: '0.95rem',
            fontWeight: theme.typography.fontWeightMedium,
            textTransform: 'none',
            '&.Mui-selected': {
              color: theme.palette.primary.main,
              fontWeight: theme.typography.fontWeightBold
            }
          },
          '& .MuiTabs-indicator': {
            height: 3,
            borderRadius: '3px 3px 0 0'
          }
        }
      }}
    >
      <ServiceDialogContent
        onClose={onClose}
        onSave={onSave}
        service={service}
      />
    </Dialog>
  );
};
