'use client';

import { 
  Box,
  Typography,
  IconButton,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  Tooltip,
} from '@mui/material';
import {
  Close as CloseIcon,
  Layers as LayersIcon,
  ExpandMore as ExpandMoreIcon,
  Edit as EditIcon,
} from '@mui/icons-material';
import { mapStyles } from '@/styles/MapStyles';
import { PolygonGroup } from '@/types/map';

interface MapControlsProps {
  isMobile: boolean;
  isSidebarOpen: boolean;
  compromisos: string[];
  polygonGroups: PolygonGroup[];
  selectedCompromisos: string[];
  selectedOrdenes: string[];
  selectedPolygons: string[];
  isDrawingMode: boolean;
  onSidebarClose: () => void;
  onCompromisoChange: (compromiso: string) => void;
  onOrdenChange: (orden: string) => void;
  onPolygonChange: (polygonName: string, orden: string) => void;
  onDrawingModeChange: () => void;
  isOrdenPartiallySelected: (orden: string) => boolean;
}

export function MapControls({
  isMobile,
  isSidebarOpen,
  compromisos,
  polygonGroups,
  selectedCompromisos,
  selectedOrdenes,
  selectedPolygons,
  isDrawingMode,
  onSidebarClose,
  onCompromisoChange,
  onOrdenChange,
  onPolygonChange,
  onDrawingModeChange,
  isOrdenPartiallySelected
}: MapControlsProps) {
  return (
    <Box sx={mapStyles.sidebar} style={{ visibility: isSidebarOpen ? 'visible' : 'hidden' }}>
      <Box sx={mapStyles.sidebarHeader}>
        <Typography variant={isMobile ? "subtitle1" : "h6"} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <LayersIcon /> Controles del Mapa
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Tooltip title={isDrawingMode ? "Desactivar modo dibujo" : "Activar modo dibujo"}>
            <IconButton 
              onClick={onDrawingModeChange}
              size="small"
              sx={{
                backgroundColor: isDrawingMode ? 'success.main' : 'grey.200',
                color: isDrawingMode ? 'white' : 'grey.700',
                borderRadius: '50%',
                width: 36,
                height: 36,
                '&:hover': {
                  backgroundColor: isDrawingMode ? 'success.dark' : 'grey.300',
                },
                transition: 'all 0.2s ease-in-out',
              }}
            >
              <EditIcon />
            </IconButton>
          </Tooltip>
          <IconButton onClick={onSidebarClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </Box>

      <Box sx={mapStyles.sidebarContent}>
        {/* Sección de Compromisos de Gestión */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography variant={isMobile ? "subtitle2" : "subtitle1"}>
              Compromisos de Gestión
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            {compromisos.map((compromiso) => (
              <FormControlLabel
                key={compromiso}
                control={
                  <Checkbox
                    checked={selectedCompromisos.includes(compromiso)}
                    onChange={() => onCompromisoChange(compromiso)}
                    size={isMobile ? "small" : "medium"}
                  />
                }
                label={compromiso}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        <Divider sx={{ my: { xs: 1, sm: 2 } }} />

        {/* Sección de Grupos y Polígonos */}
        {polygonGroups.map((group) => (
          <Accordion key={group.orden}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <FormControlLabel
                onClick={(e) => e.stopPropagation()}
                onFocus={(e) => e.stopPropagation()}
                control={
                  <Checkbox
                    checked={selectedOrdenes.includes(group.orden)}
                    indeterminate={!selectedOrdenes.includes(group.orden) && isOrdenPartiallySelected(group.orden)}
                    onChange={() => onOrdenChange(group.orden)}
                    size={isMobile ? "small" : "medium"}
                  />
                }
                label={group.orden}
              />
            </AccordionSummary>
            <AccordionDetails>
              {group.polygons.map((polygon) => (
                <FormControlLabel
                  key={polygon.name}
                  control={
                    <Checkbox
                      checked={selectedPolygons.includes(polygon.name)}
                      onChange={() => onPolygonChange(polygon.name, group.orden)}
                      size="small"
                    />
                  }
                  label={polygon.name}
                />
              ))}
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </Box>
  );
}
