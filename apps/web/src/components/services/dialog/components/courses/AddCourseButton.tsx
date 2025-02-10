'use client';

import { FC } from 'react';
import { Button } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';

interface AddCourseButtonProps {
  onClick: () => void;
}

export const AddCourseButton: FC<AddCourseButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="outlined"
      startIcon={<AddIcon />}
      onClick={onClick}
      sx={{ mt: 2 }}
      fullWidth
    >
      Agregar Curso
    </Button>
  );
};
