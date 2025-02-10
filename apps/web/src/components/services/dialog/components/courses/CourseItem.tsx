'use client';

import { FC } from 'react';
import { ListItem, ListItemText, Stack, IconButton, useTheme, useMediaQuery, TextField } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { DateInputs } from './DateInputs';
import { Course } from '../types';

interface CourseItemProps {
  course: Course;
  editingId: string | null;
  editCourse: Course | null;
  onEdit: (course: Course) => void;
  onDelete: (id: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  setEditCourse: (course: Course | null) => void;
  formatDateForDisplay: (dateString: string) => string;
}

export const CourseItem: FC<CourseItemProps> = ({
  course,
  editingId,
  editCourse,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  setEditCourse,
  formatDateForDisplay,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  return (
    <ListItem
      sx={{
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: 2,
        py: 2,
      }}
    >
      {editingId === course.id ? (
        <Stack spacing={2} sx={{ width: '100%' }}>
          <TextField
            label="Nombre del curso"
            value={editCourse?.name || ''}
            onChange={(e) =>
              setEditCourse(
                editCourse
                  ? { ...editCourse, name: e.target.value }
                  : null
              )
            }
            fullWidth
          />
          <DateInputs
            startDate={editCourse?.startDate || ''}
            endDate={editCourse?.endDate || ''}
            onChange={(field, value) =>
              setEditCourse(
                editCourse
                  ? { ...editCourse, [field]: value }
                  : null
              )
            }
            actions={
              <>
                <IconButton onClick={onSaveEdit} className="edit-button">
                  <SaveIcon />
                </IconButton>
                <IconButton onClick={onCancelEdit}>
                  <CancelIcon />
                </IconButton>
              </>
            }
          />
        </Stack>
      ) : (
        <>
          <ListItemText
            primary={course.name}
            secondary={`${formatDateForDisplay(course.startDate)} - ${formatDateForDisplay(course.endDate)}`}
            sx={{
              m: 0,
              flex: isMobile ? 'none' : 1,
            }}
          />
          <Stack
            direction="row"
            spacing={1}
            sx={{
              justifyContent: isMobile ? 'flex-end' : 'flex-start',
              width: isMobile ? '100%' : 'auto',
            }}
          >
            <IconButton
              edge="end"
              aria-label="edit"
              onClick={() => onEdit(course)}
              className="edit-button"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDelete(course.id)}
              className="delete-button"
            >
              <DeleteIcon />
            </IconButton>
          </Stack>
        </>
      )}
    </ListItem>
  );
};
