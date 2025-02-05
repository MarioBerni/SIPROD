'use client';

import { useRef, useState, useEffect } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Box, useTheme } from '@mui/material';
import { DrawingControls } from './DrawingControls';
import { VertexContextMenu } from './VertexContextMenu';
import { createPortal } from 'react-dom';
import { useMapInstance } from '@/hooks/map/useMapInstance';
import { useMapDrawing } from '@/hooks/map/useMapDrawing';

// Configurar el token de Mapbox
mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';

interface MapViewProps {
  center?: [number, number];
  zoom?: number;
  style?: mapboxgl.Style | string;
  onPolygonSave?: (coordinates: [number, number][]) => void;
}

export function MapView({
  center = [-58.3712, -34.6083], // Buenos Aires por defecto
  zoom = 12,
  style = 'mapbox://styles/mapbox/light-v11', // Estilo claro por defecto
  onPolygonSave
}: MapViewProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const theme = useTheme();
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const mapInstance = useMapInstance({
    container: mapContainer,
    center,
    zoom,
    style,
  });

  const {
    vertices,
    contextMenu,
    handleMapClick,
    handleDeleteVertex,
    handleClearDrawing,
    setContextMenu,
  } = useMapDrawing({
    map: mapInstance.map,
    isDrawingMode
  });

  // Actualizar el evento click del mapa cuando cambie el modo de dibujo
  useEffect(() => {
    const map = mapInstance.map.current;
    if (!map) return;

    // Remover el evento anterior si existe
    map.off('click', handleMapClick);
    
    // Agregar el nuevo evento si estamos en modo dibujo
    if (isDrawingMode) {
      map.on('click', handleMapClick);
    }

    return () => {
      map.off('click', handleMapClick);
    };
  }, [isDrawingMode, handleMapClick, mapInstance.map]);

  const handleSavePolygon = () => {
    if (vertices.current.length < 3) return;
    onPolygonSave?.(vertices.current);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        position: 'relative',
      }}
    >
      <Box
        ref={mapContainer}
        sx={{
          width: '100%',
          height: '100%',
          borderRadius: `${theme.shape.borderRadius}px`,
          overflow: 'hidden',
          '& .mapboxgl-canvas': {
            outline: 'none',
            width: '100% !important',
            height: '100% !important',
          },
          '& .mapboxgl-ctrl-top-right': {
            top: theme.spacing(2),
            right: theme.spacing(2),
            '& .mapboxgl-ctrl': {
              margin: 0,
              boxShadow: theme.shadows[2],
            },
          },
          '& .mapboxgl-ctrl-bottom-right': {
            bottom: theme.spacing(2),
            right: theme.spacing(2),
            '& .mapboxgl-ctrl': {
              margin: 0,
              boxShadow: theme.shadows[2],
            },
          },
          '& .mapboxgl-ctrl button': {
            width: 32,
            height: 32,
            '&:not(:disabled):hover': {
              backgroundColor: theme.palette.action.hover,
            },
          },
        }}
      />

      <DrawingControls
        isDrawingMode={isDrawingMode}
        onToggleDrawing={() => setIsDrawingMode(!isDrawingMode)}
        onClear={handleClearDrawing}
        onSave={handleSavePolygon}
        hasVertices={vertices.current.length > 0}
      />

      {contextMenu.show && createPortal(
        <VertexContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={handleDeleteVertex}
          onClose={() => setContextMenu(prev => ({ ...prev, show: false }))}
        />,
        document.body
      )}
    </Box>
  );
}
