'use client';

import { forwardRef, ReactNode } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Slide,
  IconButton,
  Typography,
  useTheme,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { Close as CloseIcon } from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<unknown>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface BaseDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  fullWidth?: boolean;
  disableBackdropClick?: boolean;
  showCloseButton?: boolean;
  headerBackground?: 'primary' | 'secondary' | 'default';
}

export function BaseDialog({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'sm',
  fullWidth = true,
  disableBackdropClick = false,
  showCloseButton = true,
  headerBackground = 'primary',
}: BaseDialogProps) {
  const theme = useTheme();

  const handleBackdropClick = (event: React.MouseEvent) => {
    if (disableBackdropClick) {
      event.stopPropagation();
      return;
    }
    onClose();
  };

  const getHeaderStyles = () => {
    switch (headerBackground) {
      case 'primary':
        return {
          background: `linear-gradient(145deg, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: theme.palette.primary.contrastText,
        };
      case 'secondary':
        return {
          background: `linear-gradient(145deg, ${theme.palette.secondary.main}, ${theme.palette.secondary.dark})`,
          color: theme.palette.secondary.contrastText,
        };
      default:
        return {
          background: theme.palette.background.paper,
          color: theme.palette.text.primary,
          borderBottom: `1px solid ${theme.palette.divider}`,
        };
    }
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleBackdropClick}
      maxWidth={maxWidth}
      fullWidth={fullWidth}
      PaperProps={{
        elevation: 24,
        sx: {
          borderRadius: { xs: '12px 12px 0 0', sm: 2 },
          overflow: 'hidden',
          background: theme.palette.background.paper,
          backgroundImage: 'none',
          boxShadow: `0 0 40px ${alpha(theme.palette.primary.main, 0.2)}`,
          '&:hover': {
            boxShadow: `0 0 50px ${alpha(theme.palette.primary.main, 0.25)}`,
          },
          transition: theme.transitions.create(['box-shadow'], {
            duration: theme.transitions.duration.shorter,
          }),
          margin: { xs: 0, sm: 2 },
          position: { xs: 'absolute', sm: 'relative' },
          bottom: { xs: 0, sm: 'auto' },
          width: { xs: '100%', sm: 'auto' },
          maxHeight: { xs: '90vh', sm: '90vh' },
        },
      }}
      BackdropProps={{
        sx: {
          backgroundColor: alpha(theme.palette.background.default, 0.8),
          backdropFilter: 'blur(8px)',
        },
      }}
      sx={{
        '& .MuiDialog-container': {
          alignItems: { xs: 'flex-end', sm: 'center' },
        },
        '& .MuiDialog-paper': {
          transform: 'translateY(0px)',
          transition: theme.transitions.create(['transform', 'box-shadow'], {
            duration: theme.transitions.duration.shortest,
          }),
          '&:hover': {
            transform: { xs: 'translateY(0)', sm: 'translateY(-2px)' },
          },
        },
      }}
    >
      <DialogTitle 
        sx={{ 
          m: 0, 
          p: { xs: 2, sm: 2.5 },
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          ...getHeaderStyles(),
        }}
      >
        <Typography 
          variant="h6" 
          component="div"
          sx={{ 
            fontWeight: 600,
            fontSize: { xs: '1.1rem', sm: '1.25rem' },
            textShadow: headerBackground !== 'default' ? '0 2px 4px rgba(0,0,0,0.2)' : 'none',
          }}
        >
          {title}
        </Typography>
        {showCloseButton && (
          <IconButton
            aria-label="close"
            onClick={onClose}
            size="small"
            sx={{
              color: headerBackground !== 'default' 
                ? 'rgba(255,255,255,0.8)'
                : theme.palette.grey[500],
              '&:hover': {
                color: headerBackground !== 'default'
                  ? 'rgba(255,255,255,1)'
                  : theme.palette.grey[700],
                transform: 'rotate(90deg)',
              },
              transition: theme.transitions.create(['color', 'transform'], {
                duration: theme.transitions.duration.shortest,
              }),
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        )}
      </DialogTitle>
      <DialogContent 
        sx={{ 
          p: { xs: 2, sm: 3 },
          '&:first-of-type': {
            pt: { xs: 2, sm: 3 },
          },
          background: alpha(theme.palette.background.paper, 0.8),
          overflowY: 'auto',
          maxHeight: { xs: 'calc(90vh - 120px)', sm: '70vh' },
        }}
      >
        {children}
      </DialogContent>
      {actions && (
        <DialogActions 
          sx={{ 
            px: { xs: 2, sm: 3 }, 
            py: { xs: 2, sm: 2.5 },
            borderTop: `1px solid ${theme.palette.divider}`,
            background: alpha(theme.palette.background.paper, 0.8),
            gap: 1,
            position: 'sticky',
            bottom: 0,
            width: '100%',
            justifyContent: 'flex-end',
            flexWrap: 'wrap',
          }}
        >
          {actions}
        </DialogActions>
      )}
    </Dialog>
  );
}
