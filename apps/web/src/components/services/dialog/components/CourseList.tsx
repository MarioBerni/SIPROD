'use client';

import { FC } from 'react';
import { List, Box, IconButton, TextField, Stack } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { CourseItem } from './CourseItem';
import { DateInputs } from './DateInputs';
import { AddLicenseButton } from './AddLicenseButton';
import { Course } from '../types';

interface CourseListProps {
  courses: Course[];
  editingId: string | null;
  editCourse: Course | null;
  isAdding: boolean;
  newCourse: Partial<Course>;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  setEditCourse: (course: Course | null) => void;
  onAdd: () => void;
  onSaveNew: () => void;
  onCancelAdd: () => void;
  setNewCourse: (course: Partial<Course>) => void;
  formatDateForDisplay: (dateString: string) => string;
}

export const CourseList: FC<CourseListProps> = ({
  courses,
  editingId,
  editCourse,
  isAdding,
  newCourse,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  setEditCourse,
  onAdd,
  onSaveNew,
  onCancelAdd,
  setNewCourse,
  formatDateForDisplay,
}) => {
  return (
    <>
      <List sx={{ width: '100%', p: 0 }}>
        {courses.map((course) => (
          <CourseItem
            key={course.id}
            course={course}
            editingId={editingId}
            editCourse={editCourse}
            onEdit={onEdit}
            onDelete={onDelete}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            setEditCourse={setEditCourse}
            formatDateForDisplay={formatDateForDisplay}
          />
        ))}
      </List>

      {isAdding ? (
        <Box sx={{ mt: 3 }}>
          <Stack spacing={2}>
            <TextField
              label="Nombre del curso"
              value={newCourse.name || ''}
              onChange={(e) =>
                setNewCourse({ ...newCourse, name: e.target.value })
              }
              fullWidth
            />
            <DateInputs
              startDate={newCourse.startDate || ''}
              endDate={newCourse.endDate || ''}
              onChange={(field, value) =>
                setNewCourse({ ...newCourse, [field]: value })
              }
              actions={
                <>
                  <IconButton onClick={onSaveNew} className="edit-button">
                    <SaveIcon />
                  </IconButton>
                  <IconButton onClick={onCancelAdd}>
                    <CancelIcon />
                  </IconButton>
                </>
              }
            />
          </Stack>
        </Box>
      ) : (
        <AddLicenseButton onClick={onAdd} />
      )}
    </>
  );
};
