'use client';

import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Typography,
} from '@mui/material';
import {
  WhatsApp as WhatsAppIcon,
  Email as EmailIcon,
} from '@mui/icons-material';
import { BaseDialog } from '../common/BaseDialog';
import { alpha } from '@mui/material/styles';

interface HelpDialogProps {
  open: boolean;
  onClose: () => void;
}

export function HelpDialog({ open, onClose }: HelpDialogProps) {
  return (
    <BaseDialog
      open={open}
      onClose={onClose}
      title="Centro de Ayuda"
      maxWidth="sm"
      headerBackground="primary"
    >
      <Typography 
        variant="body1" 
        paragraph
        sx={{ 
          fontSize: { xs: '1rem', sm: '1.1rem' },
          color: theme => theme.palette.text.secondary,
          textAlign: 'center',
          mb: { xs: 3, sm: 4 },
          px: { xs: 1, sm: 0 },
        }}
      >
        Si necesitas ayuda, puedes contactarnos a través de los siguientes medios:
      </Typography>
      <List sx={{ px: { xs: 0, sm: 2 } }}>
        <ListItem 
          disablePadding 
          sx={{ 
            mb: { xs: 2, sm: 3 },
            p: { xs: 1.5, sm: 2 },
            bgcolor: theme => alpha(theme.palette.success.main, 0.08),
            borderRadius: 2,
            transition: theme => theme.transitions.create(['background-color', 'transform']),
            '&:hover': {
              bgcolor: theme => alpha(theme.palette.success.main, 0.12),
              transform: { xs: 'scale(0.98)', sm: 'translateX(8px)' },
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: { xs: 45, sm: 56 } }}>
            <WhatsAppIcon 
              color="success" 
              sx={{ 
                fontSize: { xs: 24, sm: 28 },
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Link
                href="https://wa.me/59899929478"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  display: 'block',
                  wordBreak: 'break-word',
                }}
              >
                +598 99 929 478
              </Link>
            }
            secondary="WhatsApp - Soporte Técnico"
            secondaryTypographyProps={{
              sx: { 
                mt: 0.5,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }
            }}
          />
        </ListItem>
        <ListItem 
          disablePadding
          sx={{ 
            p: { xs: 1.5, sm: 2 },
            bgcolor: theme => alpha(theme.palette.primary.main, 0.08),
            borderRadius: 2,
            transition: theme => theme.transitions.create(['background-color', 'transform']),
            '&:hover': {
              bgcolor: theme => alpha(theme.palette.primary.main, 0.12),
              transform: { xs: 'scale(0.98)', sm: 'translateX(8px)' },
            },
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <ListItemIcon sx={{ minWidth: { xs: 45, sm: 56 } }}>
            <EmailIcon 
              color="primary"
              sx={{ 
                fontSize: { xs: 24, sm: 28 },
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))',
              }}
            />
          </ListItemIcon>
          <ListItemText
            primary={
              <Link
                href="mailto:gr-depto.infoygc@minterior.gub.uy"
                target="_blank"
                rel="noopener noreferrer"
                underline="hover"
                color="inherit"
                sx={{ 
                  fontWeight: 500,
                  fontSize: { xs: '1rem', sm: '1.1rem' },
                  display: 'block',
                  wordBreak: 'break-word',
                }}
              >
                gr-depto.infoygc@minterior.gub.uy
              </Link>
            }
            secondary="Correo Electrónico - Soporte Técnico"
            secondaryTypographyProps={{
              sx: { 
                mt: 0.5,
                fontSize: { xs: '0.875rem', sm: '1rem' },
              }
            }}
          />
        </ListItem>
      </List>
    </BaseDialog>
  );
}
