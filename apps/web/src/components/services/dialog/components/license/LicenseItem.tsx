'use client';

import { FC } from 'react';
import { ListItem, ListItemText, Stack, IconButton, useTheme, useMediaQuery } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { DateInputs } from '../common/DateInputs';
import { License } from '../types';

interface LicenseItemProps {
  license: License;
  editingId: string | null;
  editLicense: License | null;
  onEdit: (license: License) => void;
  onDelete: (id: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  setEditLicense: (license: License | null) => void;
  formatDateForDisplay: (dateString: string) => string;
}

export const LicenseItem: FC<LicenseItemProps> = ({
  license,
  editingId,
  editLicense,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  setEditLicense,
  formatDateForDisplay,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleFieldChange = (field: string, value: string | Date) =>
    setEditLicense(
      editLicense
        ? { ...editLicense, [field]: value }
        : null
    );

  return (
    <ListItem
      sx={{
        flexDirection: isMobile ? 'column' : 'row',
        alignItems: isMobile ? 'stretch' : 'center',
        gap: 2,
        py: 2,
      }}
    >
      {editingId === license.id ? (
        <DateInputs
          startDate={editLicense?.startDate || ''}
          endDate={editLicense?.endDate || ''}
          onChange={handleFieldChange}
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
      ) : (
        <>
          <ListItemText
            primary={`${formatDateForDisplay(license.startDate)} - ${formatDateForDisplay(license.endDate)}`}
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
              onClick={() => onEdit(license)}
              className="edit-button"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={() => onDelete(license.id)}
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
