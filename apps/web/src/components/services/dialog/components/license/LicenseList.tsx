'use client';

import { FC } from 'react';
import { List, Box, IconButton } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { LicenseItem } from './LicenseItem';
import { DateInputs } from '../common/DateInputs';
import { AddLicenseButton } from './AddLicenseButton';
import { License } from '../types';

interface LicenseListProps {
  licenses: License[];
  editingId: string | null;
  editLicense: License | null;
  isAdding: boolean;
  newLicense: Partial<License>;
  onEdit: (license: License) => void;
  onDelete: (id: string) => void;
  onSaveEdit: () => void;
  onCancelEdit: () => void;
  setEditLicense: (license: License | null) => void;
  onAdd: () => void;
  onSaveNew: () => void;
  onCancelAdd: () => void;
  setNewLicense: (license: Partial<License>) => void;
  formatDateForDisplay: (dateString: string) => string;
}

export const LicenseList: FC<LicenseListProps> = ({
  licenses,
  editingId,
  editLicense,
  isAdding,
  newLicense,
  onEdit,
  onDelete,
  onSaveEdit,
  onCancelEdit,
  setEditLicense,
  onAdd,
  onSaveNew,
  onCancelAdd,
  setNewLicense,
  formatDateForDisplay,
}) => {
  return (
    <>
      <List sx={{ width: '100%', p: 0 }}>
        {licenses.map((license) => (
          <LicenseItem
            key={license.id}
            license={license}
            editingId={editingId}
            editLicense={editLicense}
            onEdit={onEdit}
            onDelete={onDelete}
            onSaveEdit={onSaveEdit}
            onCancelEdit={onCancelEdit}
            setEditLicense={setEditLicense}
            formatDateForDisplay={formatDateForDisplay}
          />
        ))}
      </List>

      {isAdding ? (
        <Box sx={{ mt: 3 }}>
          <DateInputs
            startDate={newLicense.startDate || ''}
            endDate={newLicense.endDate || ''}
            onChange={(field: string, value: string | Date) =>
              setNewLicense({ ...newLicense, [field]: value })
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
        </Box>
      ) : (
        <AddLicenseButton onClick={onAdd} />
      )}
    </>
  );
};
