import { Theme } from '@mui/material/styles';

// Constantes para medidas comunes
const NAVBAR_HEIGHT = {
  mobile: 56,
  desktop: 64,
};

const FOOTER_HEIGHT = {
  mobile: 40,
  desktop: 48,
};

export const getBaseLayoutStyles = (theme: Theme) => ({
  root: {
    display: 'flex',
    minHeight: '100vh',
    width: '100%',
    margin: 0,
    padding: 0,
    overflow: 'hidden',
  },
  wrapper: {
    display: 'flex',
    flex: '1 1 auto',
    flexDirection: 'column',
    width: '100%',
    paddingTop: NAVBAR_HEIGHT.desktop,
    [theme.breakpoints.down('sm')]: {
      paddingTop: NAVBAR_HEIGHT.mobile,
    },
  },
  content: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    minHeight: `calc(100vh - ${NAVBAR_HEIGHT.desktop}px)`,
    [theme.breakpoints.down('sm')]: {
      minHeight: `calc(100vh - ${NAVBAR_HEIGHT.mobile}px)`,
    },
    overflow: 'auto',
    background: 'linear-gradient(135deg, #F5F7FA 0%, #ffffff 100%)',
  },
  main: {
    flex: 1,
    width: '100%',
    maxWidth: '100%',
    margin: '0 auto',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
  },
  footer: {
    padding: theme.spacing(1),
    textAlign: 'center',
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    height: FOOTER_HEIGHT.desktop,
    [theme.breakpoints.down('sm')]: {
      height: FOOTER_HEIGHT.mobile,
      padding: theme.spacing(0.5),
    },
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  pageContainer: {
    width: '100%',
    maxWidth: theme.breakpoints.values.lg,
    margin: '0 auto',
    padding: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: theme.spacing(2),
    [theme.breakpoints.down('sm')]: {
      gap: theme.spacing(0.5),
    },
  },
});
