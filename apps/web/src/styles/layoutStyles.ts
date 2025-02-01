import { Theme } from '@mui/material/styles';

export const getLayoutStyles = (theme: Theme) => ({
  container: {
    padding: 0,
    [theme.breakpoints.up('sm')]: {
      padding: 0,
    },
    // Aumentar la especificidad para el contenedor
    '&.MuiContainer-root': {
      padding: 0,
      [theme.breakpoints.up('sm')]: {
        padding: 0,
      },
    },
  },
  gridContainer: {
    // Ajustar el espaciado del grid
    '&.MuiGrid-container': {
      margin: -theme.spacing(0.5), // Compensar el padding en móviles
      width: `calc(100% + ${theme.spacing(1)})`,
      [theme.breakpoints.up('sm')]: {
        margin: -theme.spacing(1), // Compensar el padding en desktop
        width: `calc(100% + ${theme.spacing(2)})`,
      },
      '& > .MuiGrid-item': {
        padding: theme.spacing(0.5),
        [theme.breakpoints.up('sm')]: {
          padding: theme.spacing(1),
        },
      },
    },
  },
  // Estilos comunes para cards y secciones
  card: {
    height: '100%',
    '& .MuiCardContent-root': {
      padding: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
      },
      '&:last-child': {
        paddingBottom: theme.spacing(1),
        [theme.breakpoints.up('sm')]: {
          paddingBottom: theme.spacing(2),
        },
      },
    },
  },
  // Estilos para listas
  list: {
    '& .MuiListItem-root': {
      padding: theme.spacing(0.5),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(1),
      },
    },
  },
  // Estilos para diálogos
  dialog: {
    '& .MuiDialogContent-root': {
      padding: theme.spacing(1),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(2),
      },
    },
    '& .MuiDialogActions-root': {
      padding: theme.spacing(0.5, 1),
      [theme.breakpoints.up('sm')]: {
        padding: theme.spacing(1, 2),
      },
    },
  },
});
