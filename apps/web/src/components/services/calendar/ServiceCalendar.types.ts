import { SxProps, Theme } from '@mui/material';
import { Property } from 'csstype';

export interface CalendarStyles {
  '.fc': {
    fontFamily: Property.FontFamily;
    background: string;
    borderRadius: string;
    boxShadow: string;
    overflow: string;
    filter: Property.Filter;
    whiteSpace: Property.WhiteSpace;
    textOverflow: Property.TextOverflow;
    '.fc-toolbar': {
      padding: string;
      marginBottom: string;
      background: string;
      color: string;
      '.fc-toolbar-title': SxProps<Theme>;
      '.fc-button': {
        backgroundColor: string;
        borderColor: string;
        color: string;
        textTransform: Property.TextTransform;
        padding: string;
        '&:hover': {
          backgroundColor: string;
          borderColor: string;
        };
        '&:focus': {
          boxShadow: string;
        };
      };
      '.fc-button-active': {
        backgroundColor: string;
        borderColor: string;
      };
    };
    '.fc-col-header': {
      th: {
        padding: string;
        borderColor: string;
        backgroundColor: string;
        '.fc-col-header-cell-cushion': {
          color: string;
          padding: string;
          textTransform: Property.TextTransform;
          fontWeight: Property.FontWeight;
        };
      };
    };
    '.fc-daygrid-day': {
      padding: string;
      backgroundColor: string;
      '&:hover': {
        backgroundColor: string;
      };
      '.fc-daygrid-day-top': {
        padding: string;
        '.fc-daygrid-day-number': {
          color: string;
          textDecoration: Property.TextDecoration;
          fontWeight: Property.FontWeight;
        };
      };
      '&.fc-day-today': {
        backgroundColor: string;
        '.fc-daygrid-day-number': {
          color: string;
          fontWeight: Property.FontWeight;
        };
      };
    };
    '.fc-event': {
      borderRadius: string;
      padding: string;
      margin: string;
      border: string;
      cursor: Property.Cursor;
      transition: string;
      minHeight: string;
      '&:hover': {
        transform: string;
        filter: string;
      };
      '.fc-event-title': {
        padding: string;
        fontWeight: Property.FontWeight;
        fontSize: string;
        whiteSpace: Property.WhiteSpace;
        overflow: string;
        textOverflow: Property.TextOverflow;
      };
    };
    '.fc-event-main-frame': {
      display: Property.Display;
      alignItems: Property.AlignItems;
      minHeight: Property.MinHeight;
    };
    '.fc-daygrid-block-event': {
      margin: string;
      '.fc-event-time': {
        display: Property.Display;
      };
    };
    '.fc-daygrid-more-link': {
      color: string;
      backgroundColor: string;
      padding: string;
      borderRadius: string;
      margin: string;
      fontWeight: Property.FontWeight;
      '&:hover': {
        backgroundColor: string;
        textDecoration: Property.TextDecoration;
      };
    };
    '.fc-view': {
      borderRadius: string;
      overflow: string;
    };
    '.fc-scrollgrid': {
      borderColor: string;
    };
    '.fc-day-disabled': {
      backgroundColor: string;
    };
    '.fc-daygrid-event-harness': {
      '.fc-event': {
        borderRadius: string;
        padding: string;
        margin: string;
        border: string;
        backgroundColor: string;
        cursor: Property.Cursor;
        transition: string;
        minHeight: string;
        '&:hover': {
          transform: string;
          filter: string;
        };
        '.fc-event-title': {
          padding: string;
          fontWeight: Property.FontWeight;
          fontSize: string;
          whiteSpace: Property.WhiteSpace;
          overflow: string;
          textOverflow: Property.TextOverflow;
          backgroundColor: string;
        };
        '.fc-event-main': {
          backgroundColor: string;
          padding: string;
        };
      };
    };
  };
}
