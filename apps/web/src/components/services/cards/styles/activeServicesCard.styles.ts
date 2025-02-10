import { Theme } from '@mui/material/styles';

export const getActiveServicesCardStyles = (theme: Theme) => ({
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    background: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
    borderRadius: '16px',
    overflow: 'hidden',
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
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(2),
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
  approvedSection: {
    background: theme.palette.success.light + '20',
    '& .MuiTypography-subtitle1': {
      color: theme.palette.success.dark,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.success.dark,
    },
  },
  rejectedSection: {
    background: theme.palette.error.light + '20',
    '& .MuiTypography-subtitle1': {
      color: theme.palette.error.dark,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.error.dark,
    },
  },
  listItem: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    py: 1,
    px: 1,
    '&:not(:last-child)': {
      borderBottom: '1px solid',
      borderColor: 'divider',
    },
  },
  itemHeader: {
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    cursor: 'pointer',
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontWeight: 600,
    fontSize: '0.875rem',
  },
  itemDate: {
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
  },
  expandIcon: {
    ml: 'auto',
    transform: 'rotate(0deg)',
    transition: 'transform 0.3s',
  },
  expandIconOpen: {
    transform: 'rotate(180deg)',
  },
  chipContainer: {
    pt: 1,
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: 0.5,
  },
  noContent: {
    textAlign: 'center',
    py: 1,
    color: theme.palette.text.secondary,
    fontStyle: 'italic',
    fontSize: '0.875rem',
  },
});
