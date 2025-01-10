import { SxProps, Theme } from '@mui/material';

export const mapStyles = {
  mapContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
    borderRadius: 1,
    overflow: 'hidden'
  } as SxProps<Theme>,

  sidebar: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: {
      xs: '100%',
      sm: '320px',
      md: '400px'
    },
    height: '100%',
    backgroundColor: 'background.paper',
    transition: 'transform 0.3s ease-in-out',
    boxShadow: 3,
    zIndex: 1000,
    display: 'flex',
    flexDirection: 'column',
    visibility: (open: boolean) => open ? 'visible' : 'hidden',
    transform: (open: boolean) => open ? 'translateX(0)' : 'translateX(100%)',
    opacity: (open: boolean) => open ? 1 : 0
  } as SxProps<Theme>,

  sidebarHeader: {
    p: {
      xs: 1.5,
      sm: 2
    },
    borderBottom: 1,
    borderColor: 'divider',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  } as SxProps<Theme>,

  sidebarContent: {
    flex: 1,
    overflowY: 'auto',
    p: {
      xs: 1.5,
      sm: 2
    },
    '& .MuiAccordion-root': {
      '&:before': {
        display: 'none',
      },
      boxShadow: 'none',
      '&.Mui-expanded': {
        margin: '8px 0',
      }
    },
    '& .MuiAccordionSummary-root': {
      minHeight: {
        xs: 40,
        sm: 48
      },
      '&.Mui-expanded': {
        minHeight: {
          xs: 40,
          sm: 48
        },
      }
    },
    '& .MuiAccordionSummary-content': {
      margin: '8px 0',
      '&.Mui-expanded': {
        margin: '8px 0',
      }
    },
    '& .MuiAccordionDetails-root': {
      padding: {
        xs: '0 12px 12px',
        sm: '0 16px 16px'
      },
      display: 'flex',
      flexDirection: 'column',
      gap: 1
    },
    '& .MuiFormControlLabel-root': {
      marginLeft: -1,
      marginRight: 0,
      '& .MuiTypography-root': {
        fontSize: {
          xs: '0.813rem',
          sm: '0.875rem'
        },
      }
    }
  } as SxProps<Theme>,

  toggleButton: {
    position: 'absolute',
    right: {
      xs: '10px',
      sm: '20px'
    },
    top: {
      xs: '10px',
      sm: '20px'
    },
    zIndex: 999,
    backgroundColor: 'background.paper',
    boxShadow: 2,
    '&:hover': {
      backgroundColor: 'action.hover'
    }
  } as SxProps<Theme>,

  infoBox: {
    position: 'absolute',
    top: {
      xs: '10px',
      sm: '20px'
    },
    left: {
      xs: '10px',
      sm: '20px'
    },
    backgroundColor: 'primary.main',
    color: 'primary.contrastText',
    padding: {
      xs: 1,
      sm: 1.5
    },
    borderRadius: 1,
    boxShadow: 2,
    zIndex: 2,
    fontFamily: 'Arial, sans-serif',
    fontSize: {
      xs: '1rem',
      sm: '1.2rem'
    },
    display: 'flex',
    alignItems: 'center',
    gap: 1,
    transition: 'all 0.3s ease-in-out',
    cursor: 'pointer',
    '&:hover': {
      backgroundColor: 'primary.dark'
    }
  } as SxProps<Theme>,

  polygonTable: {
    width: '100%',
    backgroundColor: 'background.paper',
    borderRadius: 1,
    overflow: 'hidden',
    '& th, & td': {
      padding: 1,
      borderBottom: '1px solid',
      borderColor: 'divider',
      fontSize: '0.875rem'
    },
    '& th': {
      backgroundColor: 'primary.main',
      color: 'primary.contrastText',
      fontWeight: 500
    },
    '& tr:last-child td': {
      borderBottom: 'none'
    },
    '& tr:hover': {
      backgroundColor: 'action.hover',
      cursor: 'pointer'
    }
  } as SxProps<Theme>
} as const;
