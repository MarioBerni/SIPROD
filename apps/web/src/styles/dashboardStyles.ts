import { Theme } from '@mui/material/styles';

export const getDashboardStyles = (theme: Theme) => ({
  container: {
    display: 'flex',
    flexDirection: 'column' as const,
    gap: theme.spacing(1),
    [theme.breakpoints.up('sm')]: {
      gap: theme.spacing(2),
    },
    alignItems: 'stretch',
    width: '100%',
    margin: '0 auto',
  },
  statCard: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column' as const,
    '& .MuiCardContent-root': {
      padding: theme.spacing(0.5),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
      },
      display: 'flex',
      flexDirection: 'column',
      gap: theme.spacing(0.25),
      [theme.breakpoints.up('sm')]: {
        gap: theme.spacing(1),
      },
    },
  },
  progressSection: {
    height: '100%',
    '& .MuiLinearProgress-root': {
      height: 4,
      borderRadius: 2,
      [theme.breakpoints.up('sm')]: {
        height: 8,
        borderRadius: 4,
      },
    },
    '& .MuiCardContent-root': {
      padding: theme.spacing(0.5),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
      },
    },
  },
  weeklyChart: {
    height: '100%',
    minHeight: 200,
    [theme.breakpoints.up('sm')]: {
      minHeight: 350,
    },
    '& .MuiCardContent-root': {
      padding: theme.spacing(0.5),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
      },
    },
  },
  gridItem: {
    width: '100%',
    [theme.breakpoints.down('sm')]: {
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },
  },
});
