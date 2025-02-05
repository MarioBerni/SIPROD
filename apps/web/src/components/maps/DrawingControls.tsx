'use client';

import { Box, IconButton, Tooltip } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import SaveIcon from '@mui/icons-material/Save';

interface DrawingControlsProps {
  isDrawingMode: boolean;
  onToggleDrawing: () => void;
  onClear: () => void;
  onSave: () => void;
  hasVertices: boolean;
}

export function DrawingControls({
  isDrawingMode,
  onToggleDrawing,
  onClear,
  onSave,
  hasVertices
}: DrawingControlsProps) {
  return (
    <Box
      sx={{
        position: 'absolute',
        top: 16,
        left: 16,
        zIndex: 1000,
        backgroundColor: 'background.paper',
        borderRadius: 1,
        boxShadow: 2,
        p: 0.5,
        display: 'flex',
        flexDirection: 'column',
        gap: 0.5,
      }}
    >
      <Tooltip title={isDrawingMode ? "Detener dibujo" : "Iniciar dibujo"} placement="right">
        <IconButton
          onClick={onToggleDrawing}
          color={isDrawingMode ? "primary" : "default"}
          size="small"
        >
          <EditIcon />
        </IconButton>
      </Tooltip>

      {hasVertices && (
        <>
          <Tooltip title="Limpiar dibujo" placement="right">
            <IconButton
              onClick={onClear}
              size="small"
              color="error"
            >
              <ClearIcon />
            </IconButton>
          </Tooltip>

          <Tooltip title="Guardar polígono" placement="right">
            <IconButton
              onClick={onSave}
              size="small"
              color="success"
            >
              <SaveIcon />
            </IconButton>
          </Tooltip>
        </>
      )}
    </Box>
  );
}
