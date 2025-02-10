import { FC, useState } from 'react';
import { Box, Tab, Tabs, Dialog, DialogTitle } from '@mui/material';
import { useServiceCounts } from './hooks/useServiceCounts';
import { useCalendarEvents } from './hooks/useCalendarEvents';
import { LicenseList } from './components/license/LicenseList';
import { CourseList } from './components/courses/CourseList';
import { DutyDayList } from './components/dutyDay/DutyDayList';
import { License, Course } from './components/types';

interface ServiceDayDialogProps {
  open: boolean;
  onClose: () => void;
  date: Date;
}

export const ServiceDayDialog: FC<ServiceDayDialogProps> = ({
  open,
  onClose,
  date,
}) => {
  const serviceCounts = useServiceCounts();
  useCalendarEvents(); // Solo llamamos al hook sin desestructurar
  const [selectedTab, setSelectedTab] = useState(0);

  const formatDateForDisplay = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formattedDate = formatDateForDisplay(date.toISOString());

  const [editingLicense, setEditingLicense] = useState<License | null>(null);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);

  const handleLicenseEdit = (license: License) => {
    setEditingLicense(license);
  };

  const handleLicenseSave = () => {
    // Implementar guardado de licencia
    setEditingLicense(null);
  };

  const handleLicenseDelete = (id: string) => {
    console.log('Eliminar licencia:', id);
    // TODO: Implementar eliminación de licencia
  };

  const handleLicenseCancel = () => {
    setEditingLicense(null);
  };

  const handleCourseEdit = (course: Course) => {
    setEditingCourse(course);
  };

  const handleCourseSave = () => {
    // Implementar guardado de curso
    setEditingCourse(null);
  };

  const handleCourseDelete = (id: string) => {
    console.log('Eliminar curso:', id);
    // TODO: Implementar eliminación de curso
  };

  const handleCourseCancel = () => {
    setEditingCourse(null);
  };

  const handleDutyDayStatusUpdate = (id: string, status: string) => {
    console.log('Actualizar estado de día de guardia:', { id, status });
    // TODO: Implementar actualización de estado de día de guardia
  };

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleClose = () => {
    setEditingLicense(null);
    setEditingCourse(null);
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>Servicios para {formattedDate}</DialogTitle>
      <Box sx={{ p: 2 }}>
        <Tabs value={selectedTab} onChange={handleTabChange}>
          <Tab label={`Licencias (${serviceCounts.licencia})`} />
          <Tab label={`Cursos (${serviceCounts.cursos})`} />
          <Tab label={`Jefe de Día (${serviceCounts.jefeDia})`} />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          {selectedTab === 0 && (
            <LicenseList
              licenses={[]}
              editingId={editingLicense?.id || null}
              editLicense={editingLicense}
              isAdding={false}
              newLicense={{}}
              onEdit={handleLicenseEdit}
              onDelete={handleLicenseDelete}
              onSaveEdit={handleLicenseSave}
              onCancelEdit={handleLicenseCancel}
              setEditLicense={setEditingLicense}
              onAdd={() => {}}
              onSaveNew={() => {}}
              onCancelAdd={() => {}}
              setNewLicense={() => {}}
              formatDateForDisplay={formatDateForDisplay}
            />
          )}

          {selectedTab === 1 && (
            <CourseList
              courses={[]}
              editingId={editingCourse?.id || null}
              editCourse={editingCourse}
              isAdding={false}
              newCourse={{}}
              onEdit={handleCourseEdit}
              onDelete={handleCourseDelete}
              onSaveEdit={handleCourseSave}
              onCancelEdit={handleCourseCancel}
              setEditCourse={setEditingCourse}
              onAdd={() => {}}
              onSaveNew={() => {}}
              onCancelAdd={() => {}}
              setNewCourse={() => {}}
              formatDateForDisplay={formatDateForDisplay}
            />
          )}

          {selectedTab === 2 && (
            <DutyDayList
              duties={[]}
              onUpdateStatus={handleDutyDayStatusUpdate}
              formatDateForDisplay={formatDateForDisplay}
            />
          )}
        </Box>
      </Box>
    </Dialog>
  );
};
