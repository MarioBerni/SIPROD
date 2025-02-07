import { Theme } from '@mui/material/styles';

export const getActiveServicesCardStyles = (theme: Theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: '16px',
    overflow: 'hidden'
  },
  cardHeader: {
    background: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    padding: theme.spacing(2),
    '& .MuiCardHeader-title': {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    '& .MuiCardHeader-subheader': {
      color: theme.palette.primary.contrastText,
      opacity: 0.8,
    },
  },
  cardContent: {
    padding: theme.spacing(3),
    flexGrow: 1,
    overflow: 'auto',
  },
  section: {
    background: theme.palette.background.default,
    borderRadius: '12px',
    padding: theme.spacing(2),
    '& .MuiTypography-subtitle1': {
      fontSize: '1.1rem',
      fontWeight: 600,
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1),
    },
    '& .MuiSvgIcon-root': {
      fontSize: '1.2rem',
    },
  },
  pendingSection: {
    background: theme.palette.warning.light + '20',
    '& .MuiTypography-subtitle1': {
      color: theme.palette.warning.dark,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.warning.dark,
    },
  },
  currentSection: {
    background: theme.palette.success.light + '20',
    '& .MuiTypography-subtitle1': {
      color: theme.palette.success.dark,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.success.dark,
    },
  },
  upcomingSection: {
    background: theme.palette.info.light + '20',
    '& .MuiTypography-subtitle1': {
      color: theme.palette.info.dark,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.info.dark,
    },
  },
  listItem: {
    background: theme.palette.background.paper,
    borderRadius: '8px',
    marginBottom: theme.spacing(1),
    padding: theme.spacing(1.5),
    transition: theme.transitions.create(['transform', 'box-shadow']),
    border: '1px solid ' + theme.palette.divider,
    cursor: 'pointer',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[2],
    },
    '& .MuiListItemText-primary': {
      fontWeight: 600,
      fontSize: '0.95rem',
      color: theme.palette.text.primary,
    },
    '& .MuiListItemText-secondary': {
      marginTop: theme.spacing(0.5),
    },
  },
  iconButton: {
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.action.hover,
    '&:hover': {
      backgroundColor: theme.palette.action.selected,
    },
  },
  menuItem: {
    margin: theme.spacing(0.5),
    borderRadius: '6px',
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
    '& .MuiListItemIcon-root': {
      minWidth: 36,
      justifyContent: 'center',
    },
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  noServices: {
    padding: theme.spacing(2),
    textAlign: 'center' as const,
    color: theme.palette.text.secondary,
    backgroundColor: theme.palette.background.paper,
    borderRadius: '8px',
    margin: theme.spacing(1),
  },
  chip: {
    '&.MuiChip-root': {
      backgroundColor: theme.palette.primary.light + '20',
      color: theme.palette.primary.dark,
      fontWeight: 500,
      '&.pending': {
        backgroundColor: theme.palette.warning.light + '20',
        color: theme.palette.warning.dark,
      },
      '&.approved': {
        backgroundColor: theme.palette.success.light + '20',
        color: theme.palette.success.dark,
      },
      '&.rejected': {
        backgroundColor: theme.palette.error.light + '20',
        color: theme.palette.error.dark,
      },
    },
  },
  dateChip: {
    backgroundColor: theme.palette.primary.light + '20',
    color: theme.palette.primary.dark,
    borderRadius: '6px',
    padding: theme.spacing(0.5, 1),
    fontSize: '0.85rem',
    fontWeight: 500,
  },
});
