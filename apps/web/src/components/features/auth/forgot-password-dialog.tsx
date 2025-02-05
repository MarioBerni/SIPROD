'use client';

import { forwardRef, ReactElement } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useTheme,
  alpha,
  Box,
  Typography,
} from '@mui/material';
import { WhatsApp, Email } from '@mui/icons-material';
import Slide from '@mui/material/Slide';
import { TransitionProps } from '@mui/material/transitions';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: ReactElement;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface ForgotPasswordDialogProps {
  open: boolean;
  onClose: () => void;
}

export function ForgotPasswordDialog({ open, onClose }: ForgotPasswordDialogProps) {
  const theme = useTheme();

  const handleWhatsAppClick = () => {
    window.open('https://wa.me/59899929478', '_blank');
  };

  const handleEmailClick = () => {
    window.open('mailto:gr-depto.infoygc@minterior.gub.uy', '_blank');
  };

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 2,
          backdropFilter: 'blur(10px)',
          background: `linear-gradient(135deg, 
            ${alpha(theme.palette.background.paper, 0.95)} 0%, 
            ${alpha(theme.palette.background.paper, 0.9)} 100%
          )`,
          boxShadow: theme.shadows[24],
          maxWidth: 400,
          width: '90%',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          },
        },
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(4px)',
          backgroundColor: alpha(theme.palette.background.default, 0.8),
        },
      }}
    >
      <DialogTitle sx={{ 
        textAlign: 'center',
        pb: 1,
        pt: 3,
      }}>
        <Typography variant="h5" component="div" fontWeight={600}>
          Recuperar Contraseña
        </Typography>
      </DialogTitle>

      <DialogContent>
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <Typography variant="body1" color="text.secondary">
            Contacta con nosotros a través de cualquiera de estas opciones:
          </Typography>
        </Box>

        <List sx={{ pt: 0 }}>
          <Box
            component={ListItem}
            onClick={handleWhatsAppClick}
            sx={{
              cursor: 'pointer',
              borderRadius: 1,
              mb: 1,
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <ListItemIcon>
              <WhatsApp sx={{ color: '#25D366' }} />
            </ListItemIcon>
            <ListItemText 
              primary="WhatsApp"
              secondary="+598 99 929 478"
              primaryTypographyProps={{
                fontWeight: 500,
              }}
            />
          </Box>

          <Box
            component={ListItem}
            onClick={handleEmailClick}
            sx={{
              cursor: 'pointer',
              borderRadius: 1,
              transition: 'background-color 0.2s',
              '&:hover': {
                backgroundColor: alpha(theme.palette.primary.main, 0.08),
              },
            }}
          >
            <ListItemIcon>
              <Email sx={{ color: theme.palette.primary.main }} />
            </ListItemIcon>
            <ListItemText 
              primary="Correo Electrónico"
              secondary="gr-depto.infoygc@minterior.gub.uy"
              primaryTypographyProps={{
                fontWeight: 500,
              }}
            />
          </Box>
        </List>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          fullWidth
          sx={{
            py: 1,
            bgcolor: theme.palette.primary.main,
            '&:hover': {
              bgcolor: theme.palette.primary.dark,
              boxShadow: theme.shadows[8],
            },
            fontWeight: 600,
            boxShadow: theme.shadows[4],
          }}
        >
          Cerrar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
