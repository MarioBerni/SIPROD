'use client';

import { FC } from 'react';
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Slide,
  Box,
  Typography,
  styled,
  Stack,
  IconButton,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentIcon from '@mui/icons-material/Assignment';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useState } from 'react';
import { ServiceCategoryWithIcon } from '../types';
import { CalendarEvent } from '../calendar/types';
import { StyledDialog } from './styles/StyledDialog';
import { LicenseList } from './components/LicenseList';
import { CourseList } from './components/CourseList';
import { DutyDayList } from './components/DutyDayList';
import { DutyRequestForm } from './components/DutyRequestForm';
import { Control222List } from './components/Control222List';
import { useLicenseManagement } from './hooks/useLicenseManagement';
import { useCourseManagement } from './hooks/useCourseManagement';
import { useDutyDayManagement } from './hooks/useDutyDayManagement';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import 'dayjs/locale/es';
import { Control222Duty, DutyDay } from './types';

const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  '&.MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
}));

const Transition = forwardRef<
  unknown,
  TransitionProps & { children: React.ReactElement }
>((props, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

Transition.displayName = 'Transition';

interface ServiceDayDialogProps {
  open: boolean;
  onClose: () => void;
  category?: ServiceCategoryWithIcon;
  date: Date;
  events: CalendarEvent[];
}

export const ServiceDayDialog: FC<ServiceDayDialogProps> = ({
  open,
  onClose,
  category,
}) => {
  const licenseManagement = useLicenseManagement();
  const courseManagement = useCourseManagement();
  const { handleUpdateStatus, handleSubmitRequests, getFilteredDuties } = useDutyDayManagement();
  const [activeView, setActiveView] = useState<'duties' | 'request'>('duties');

  const handleViewChange = (view: 'duties' | 'request') => {
    setActiveView(view);
  };

  const formatDateForDisplay = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    const months = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];
    return `${parseInt(day)} de ${months[parseInt(month) - 1]} de ${year}`;
  };

  const renderContent = () => {
    if (category) {
      switch (category.type) {
        case 'licencia':
          return (
            <>
              <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                  {category.icon && <category.icon color="inherit" />}
                  <Typography variant="h6" component="span">
                    {category.label}
                  </Typography>
                </Box>
              </DialogTitle>
              <StyledDialogContent>
                <LicenseList
                  licenses={licenseManagement.licenses}
                  editingId={licenseManagement.editingId}
                  editLicense={licenseManagement.editLicense}
                  isAdding={licenseManagement.isAdding}
                  newLicense={licenseManagement.newLicense}
                  onEdit={licenseManagement.handleEdit}
                  onDelete={licenseManagement.handleDelete}
                  onSaveEdit={licenseManagement.handleSaveEdit}
                  onCancelEdit={licenseManagement.handleCancelEdit}
                  setEditLicense={licenseManagement.setEditLicense}
                  onAdd={licenseManagement.handleAdd}
                  onSaveNew={licenseManagement.handleSaveNew}
                  onCancelAdd={licenseManagement.handleCancelAdd}
                  setNewLicense={licenseManagement.setNewLicense}
                  formatDateForDisplay={formatDateForDisplay}
                />
              </StyledDialogContent>
            </>
          );
        case 'cursos':
          return (
            <>
              <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                  {category.icon && <category.icon color="inherit" />}
                  <Typography variant="h6" component="span">
                    {category.label}
                  </Typography>
                </Box>
              </DialogTitle>
              <StyledDialogContent>
                <CourseList
                  courses={courseManagement.courses}
                  editingId={courseManagement.editingId}
                  editCourse={courseManagement.editCourse}
                  isAdding={courseManagement.isAdding}
                  newCourse={courseManagement.newCourse}
                  onEdit={courseManagement.handleEdit}
                  onDelete={courseManagement.handleDelete}
                  onSaveEdit={courseManagement.handleSaveEdit}
                  onCancelEdit={courseManagement.handleCancelEdit}
                  setEditCourse={courseManagement.setEditCourse}
                  onAdd={courseManagement.handleAdd}
                  onSaveNew={courseManagement.handleSaveNew}
                  onCancelAdd={courseManagement.handleCancelAdd}
                  setNewCourse={courseManagement.setNewCourse}
                  formatDateForDisplay={formatDateForDisplay}
                />
              </StyledDialogContent>
            </>
          );
        case 'jefeDia':
          return (
            <>
              <DialogTitle
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pb: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  {category.icon && (
                    <category.icon
                      sx={{
                        color: 'common.white',
                        fontSize: '1.75rem',
                      }}
                    />
                  )}
                  <Typography variant="h6" component="div">
                    {category.label}
                  </Typography>
                </Box>
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: (theme) => theme.palette.grey[50],
                }}
              >
                <Stack direction="row" spacing={2}>
                  <Button
                    variant={activeView === 'duties' ? 'contained' : 'outlined'}
                    onClick={() => handleViewChange('duties')}
                    startIcon={<AssignmentIcon />}
                    size="large"
                  >
                    Designaciones
                  </Button>
                  <Button
                    variant={activeView === 'request' ? 'contained' : 'outlined'}
                    onClick={() => handleViewChange('request')}
                    startIcon={<CalendarMonthIcon />}
                    size="large"
                  >
                    Solicitar Días
                  </Button>
                </Stack>
              </Box>

              <StyledDialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  {activeView === 'duties' ? (
                    <Box sx={{ 
                      height: '400px', 
                      overflow: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '4px',
                        '&:hover': {
                          background: '#555',
                        },
                      },
                    }}>
                      <DutyDayList
                        duties={getFilteredDuties('jefeDia') as DutyDay[]}
                        onUpdateStatus={handleUpdateStatus}
                        formatDateForDisplay={formatDateForDisplay}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ 
                      height: '400px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <DutyRequestForm onSubmitRequests={handleSubmitRequests} />
                    </Box>
                  )}
                </LocalizationProvider>
              </StyledDialogContent>
            </>
          );
        case 'control222':
          return (
            <>
              <DialogTitle
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  pb: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                }}
              >
                <Box display="flex" alignItems="center" gap={1}>
                  {category.icon && (
                    <category.icon
                      sx={{
                        color: 'common.white',
                        fontSize: '1.75rem',
                      }}
                    />
                  )}
                  <Typography variant="h6" component="div">
                    {category.label}
                  </Typography>
                </Box>
                <IconButton
                  aria-label="close"
                  onClick={onClose}
                  sx={{
                    color: (theme) => theme.palette.grey[500],
                  }}
                >
                  <CloseIcon />
                </IconButton>
              </DialogTitle>

              <Box
                sx={{
                  px: 3,
                  py: 2,
                  borderBottom: 1,
                  borderColor: 'divider',
                  bgcolor: (theme) => theme.palette.grey[50],
                }}
              >
                <Stack direction="row" spacing={2}>
                  <Button
                    variant={activeView === 'duties' ? 'contained' : 'outlined'}
                    onClick={() => handleViewChange('duties')}
                    startIcon={<AssignmentIcon />}
                    size="large"
                  >
                    Designaciones
                  </Button>
                  <Button
                    variant={activeView === 'request' ? 'contained' : 'outlined'}
                    onClick={() => handleViewChange('request')}
                    startIcon={<CalendarMonthIcon />}
                    size="large"
                  >
                    Solicitar Días
                  </Button>
                </Stack>
              </Box>

              <StyledDialogContent>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
                  {activeView === 'duties' ? (
                    <Box sx={{ 
                      height: '400px', 
                      overflow: 'auto',
                      '&::-webkit-scrollbar': {
                        width: '8px',
                      },
                      '&::-webkit-scrollbar-track': {
                        background: '#f1f1f1',
                        borderRadius: '4px',
                      },
                      '&::-webkit-scrollbar-thumb': {
                        background: '#888',
                        borderRadius: '4px',
                        '&:hover': {
                          background: '#555',
                        },
                      },
                    }}>
                      <Control222List
                        duties={getFilteredDuties('control222') as Control222Duty[]}
                        onUpdateStatus={handleUpdateStatus}
                        formatDateForDisplay={formatDateForDisplay}
                      />
                    </Box>
                  ) : (
                    <Box sx={{ 
                      height: '400px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                      <DutyRequestForm onSubmitRequests={handleSubmitRequests} />
                    </Box>
                  )}
                </LocalizationProvider>
              </StyledDialogContent>
            </>
          );
        default:
          return (
            <>
              <DialogTitle>
                <Box display="flex" alignItems="center" gap={1}>
                  {category.icon && <category.icon color="inherit" />}
                  <Typography variant="h6" component="span">
                    {category.label}
                  </Typography>
                </Box>
              </DialogTitle>
              <StyledDialogContent>
                <Typography>Contenido no disponible</Typography>
              </StyledDialogContent>
            </>
          );
      }
    }
    return null;
  };

  return (
    <StyledDialog
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
      maxWidth="sm"
      fullWidth
    >
      {renderContent()}
      <DialogActions>
        <Button onClick={onClose}>Cerrar</Button>
      </DialogActions>
    </StyledDialog>
  );
};
