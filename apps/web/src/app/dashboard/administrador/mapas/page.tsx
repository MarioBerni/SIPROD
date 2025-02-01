'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Box, 
  IconButton,
  Fade,
  useTheme,
  useMediaQuery,
  Typography
} from '@mui/material';
import { usePageTitle } from '@/contexts/PageTitleContext';
import { 
  Map as MapIcon,
  Layers as LayersIcon,
  Place as PlaceIcon
} from '@mui/icons-material';
import 'mapbox-gl/dist/mapbox-gl.css';
import { getPolygonGroups, getUniqueCompromisos } from '@/data/polygonData';
import { mapStyles } from '@/styles/MapStyles';
import { MapControls } from '@/components/maps/MapControls';
import { useMapControls } from '@/hooks/useMapControls';
import { useMapInstance } from '@/hooks/useMapInstance';
import { useMapDrawing } from '@/hooks/useMapDrawing';

export default function MapasPage() {
  const { setPageTitle } = usePageTitle();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const mapContainer = useRef<HTMLDivElement>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [selectedPolygonName, setSelectedPolygonName] = useState<string>('');
  const [isDrawingMode, setIsDrawingMode] = useState(false);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    // Verificar el token de Mapbox al cargar el componente
    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      setMapError('No se pudo cargar el mapa: Token de Mapbox no configurado');
    }
  }, []);

  const polygonGroups = getPolygonGroups();
  const compromisos = getUniqueCompromisos();

  const {
    selectedCompromisos,
    selectedOrdenes,
    selectedPolygons,
    handleCompromisoChange,
    handleOrdenChange,
    handlePolygonChange,
    isOrdenPartiallySelected
  } = useMapControls();

  const handlePolygonClick = useCallback((name: string) => {
    if (!isDrawingMode) {
      setSelectedPolygonName(name);
      setShowInfo(true);
    }
  }, [isDrawingMode]);

  const mapInstance = useMapInstance({
    mapContainer,
    selectedCompromisos,
    selectedOrdenes,
    selectedPolygons,
    onPolygonClick: handlePolygonClick
  });

  const { renderContextMenu } = useMapDrawing({
    map: mapInstance,
    isDrawingMode
  });

  useEffect(() => {
    setPageTitle('Administración de Mapas', MapIcon);
  }, [setPageTitle]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleDrawingMode = () => {
    setIsDrawingMode(!isDrawingMode);
  };

  return (
    <Box sx={{ display: 'flex', height: '100%', position: 'relative' }}>
      {mapError ? (
        <Box sx={{ 
          width: '100%', 
          height: '100%', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 2,
          p: 3,
          backgroundColor: 'background.paper'
        }}>
          <Typography variant="h6" color="error">
            {mapError}
          </Typography>
          <Typography variant="body2" color="text.secondary" align="center">
            Por favor, verifica la configuración del token de Mapbox en las variables de entorno.
          </Typography>
        </Box>
      ) : (
        <>
          {/* Contenedor del mapa */}
          <Box ref={mapContainer} sx={mapStyles.mapContainer} />
          
          {/* Botón para mostrar/ocultar sidebar */}
          <IconButton
            onClick={toggleSidebar}
            sx={{
              position: 'absolute',
              right: '16px',
              top: '16px',
              zIndex: 1000,
              backgroundColor: 'white',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.8)',
              },
            }}
          >
            <LayersIcon />
          </IconButton>

          {/* Sidebar con controles */}
          <MapControls
            isMobile={isMobile}
            isSidebarOpen={isSidebarOpen}
            compromisos={compromisos}
            polygonGroups={polygonGroups}
            selectedCompromisos={selectedCompromisos}
            selectedOrdenes={selectedOrdenes}
            selectedPolygons={selectedPolygons}
            isDrawingMode={isDrawingMode}
            onSidebarClose={toggleSidebar}
            onCompromisoChange={handleCompromisoChange}
            onOrdenChange={handleOrdenChange}
            onPolygonChange={handlePolygonChange}
            onDrawingModeChange={toggleDrawingMode}
            isOrdenPartiallySelected={isOrdenPartiallySelected}
          />

          {/* Info Box */}
          <Fade in={showInfo}>
            <Box 
              sx={mapStyles.infoBox}
              onClick={() => setShowInfo(false)}
            >
              <PlaceIcon fontSize={isMobile ? "small" : "medium"} /> {selectedPolygonName}
            </Box>
          </Fade>

          {/* Menú contextual */}
          {renderContextMenu()}
        </>
      )}
    </Box>
  );
}
