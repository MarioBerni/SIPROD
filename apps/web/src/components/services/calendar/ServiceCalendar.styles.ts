import { Theme } from '@mui/material/styles';
import { CalendarStyles } from './ServiceCalendar.types';

export const getCalendarStyles = (theme: Theme): CalendarStyles => ({
  '.fc': {
    fontFamily: theme.typography.fontFamily || 'inherit',
    background: theme.palette.background.paper,
    borderRadius: '16px',
    boxShadow: theme.shadows[3],
    overflow: 'hidden',
    filter: 'none',
    whiteSpace: 'normal',
    textOverflow: 'clip',

    // Cabecera del calendario
    '.fc-toolbar': {
      padding: theme.spacing(2),
      marginBottom: '0 !important',
      background: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      
      '.fc-toolbar-title': {
        ...theme.typography.h6,
        color: theme.palette.primary.contrastText,
        fontWeight: 600,
        fontSize: '1.25rem'
      },

      '.fc-button': {
        backgroundColor: 'transparent',
        borderColor: theme.palette.primary.contrastText,
        color: theme.palette.primary.contrastText,
        textTransform: 'capitalize',
        padding: '6px 16px',

        '&:hover': {
          backgroundColor: `${theme.palette.primary.dark} !important`,
          borderColor: theme.palette.primary.contrastText
        },

        '&:focus': {
          boxShadow: 'none'
        }
      },

      '.fc-button-active': {
        backgroundColor: `${theme.palette.primary.dark} !important`,
        borderColor: theme.palette.primary.contrastText
      }
    },

    '.fc-col-header': {
      th: {
        padding: theme.spacing(1),
        borderColor: theme.palette.divider,
        backgroundColor: theme.palette.background.default,
        '.fc-col-header-cell-cushion': {
          color: theme.palette.text.primary,
          padding: '8px',
          textTransform: 'capitalize',
          fontWeight: 600
        }
      }
    },

    '.fc-daygrid-day': {
      padding: theme.spacing(0.5),
      backgroundColor: theme.palette.background.paper,
      '&:hover': {
        backgroundColor: theme.palette.action.hover
      },
      '.fc-daygrid-day-top': {
        padding: '4px 8px',
        '.fc-daygrid-day-number': {
          color: theme.palette.text.primary,
          textDecoration: 'none',
          fontWeight: 500
        }
      },
      '&.fc-day-today': {
        backgroundColor: `${theme.palette.primary.light}15 !important`,
        '.fc-daygrid-day-number': {
          color: theme.palette.primary.main,
          fontWeight: 600
        }
      }
    },

    '.fc-event': {
      borderRadius: '4px',
      padding: '2px 4px',
      margin: '2px 0',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: '24px',
      '&:hover': {
        transform: 'translateY(-1px)',
        filter: 'brightness(0.95)'
      },
      '.fc-event-title': {
        padding: '2px 4px',
        fontWeight: 500,
        fontSize: '0.875rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },

    '.fc-event-main-frame': {
      display: 'flex',
      alignItems: 'center',
      minHeight: '24px'
    },

    '.fc-daygrid-block-event': {
      margin: '2px 0',
      '.fc-event-time': {
        display: 'none'
      }
    },

    // Enlace "más eventos"
    '.fc-daygrid-more-link': {
      color: theme.palette.primary.main,
      backgroundColor: `${theme.palette.primary.main}15`,
      padding: '2px 8px',
      margin: '4px 0',
      borderRadius: '12px',
      fontWeight: 500,
      '&:hover': {
        backgroundColor: `${theme.palette.primary.main}25`,
        textDecoration: 'underline'
      }
    },

    // Vista del calendario
    '.fc-view': {
      borderRadius: '0 0 16px 16px',
      overflow: 'hidden'
    },

    // Grid del calendario
    '.fc-scrollgrid': {
      borderColor: theme.palette.divider
    },

    // Días deshabilitados
    '.fc-day-disabled': {
      backgroundColor: theme.palette.action.disabledBackground
    }
  }
});
