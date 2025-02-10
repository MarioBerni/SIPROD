import { Theme } from '@mui/material/styles';

export const getChiefRankStatsCardStyles = (theme: Theme) => ({
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
  currentSection: {
    background: theme.palette.info.light + '20',
    '& .MuiTypography-subtitle1': {
      color: theme.palette.info.dark,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.info.dark,
    },
  },
  upcomingSection: {
    background: theme.palette.success.light + '20',
    '& .MuiTypography-subtitle1': {
      color: theme.palette.success.dark,
    },
    '& .MuiSvgIcon-root': {
      color: theme.palette.success.dark,
    },
  },
  emptyMessage: {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    textAlign: 'center' as const,
    marginTop: theme.spacing(1),
    fontStyle: 'italic',
  },
});
