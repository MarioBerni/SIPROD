import { Theme } from '@mui/material/styles';
import { CalendarStyles } from '@/components/services/calendar/ServiceCalendar.types';

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

    '.fc-event': {
      borderRadius: '4px',
      padding: '4px 8px',
      margin: '2px 0',
      border: 'none',
      cursor: 'pointer',
      transition: 'all 0.2s ease',
      minHeight: '24px',
      '&:hover': {
        transform: 'scale(1.02)',
        filter: 'brightness(1.1)'
      },
      '.fc-event-title': {
        padding: '2px 4px',
        fontWeight: 500,
        fontSize: '0.75rem',
        whiteSpace: 'nowrap',
        overflow: 'hidden',
        textOverflow: 'ellipsis'
      }
    },

    // Cabecera del calendario
    '.fc-toolbar': {
      padding: theme.spacing(2),
      marginBottom: '0',
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
          backgroundColor: theme.palette.primary.dark,
          borderColor: theme.palette.primary.contrastText
        },

        '&:focus': {
          boxShadow: 'none'
        }
      },

      '.fc-button-active': {
        backgroundColor: theme.palette.primary.dark,
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
        backgroundColor: `${theme.palette.primary.light}15`,
        '.fc-daygrid-day-number': {
          color: theme.palette.primary.main,
          fontWeight: 600
        }
      }
    },

    '.fc-daygrid-event-harness': {
      '.fc-event': {
        borderRadius: '4px',
        padding: '2px 4px',
        margin: '2px 0',
        border: 'none',
        backgroundColor: 'transparent',
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
          textOverflow: 'ellipsis',
          backgroundColor: 'transparent'
        },

        '.fc-event-main': {
          backgroundColor: 'transparent',
          padding: '0'
        }
      }
    },

    '.fc-daygrid-more-link': {
      color: theme.palette.primary.main,
      backgroundColor: 'transparent',
      padding: '2px 4px',
      borderRadius: '4px',
      margin: '0',
      fontWeight: 500,
      '&:hover': {
        backgroundColor: `${theme.palette.primary.main}15`,
        textDecoration: 'none'
      }
    },

    '.fc-view': {
      borderRadius: '0 0 16px 16px',
      overflow: 'hidden'
    },

    '.fc-scrollgrid': {
      borderColor: theme.palette.divider
    },

    '.fc-day-disabled': {
      backgroundColor: theme.palette.action.disabledBackground
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
    }
  }
});
