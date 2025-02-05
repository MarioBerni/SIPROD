import { useCallback, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import { useTheme } from '@mui/material';

interface UseMapDrawingProps {
  map: React.RefObject<mapboxgl.Map | null>;
  isDrawingMode: boolean;
}

interface VertexMarker {
  marker: mapboxgl.Marker;
  index: number;
}

interface ContextMenuState {
  show: boolean;
  x: number;
  y: number;
  vertexIndex: number;
}

export function useMapDrawing({ map, isDrawingMode }: UseMapDrawingProps) {
  const theme = useTheme();
  const vertices = useRef<[number, number][]>([]);
  const vertexMarkers = useRef<VertexMarker[]>([]);
  const midpointMarkers = useRef<mapboxgl.Marker[]>([]);
  const polylineSource = useRef<string | null>(null);
  const polylineLayer = useRef<string | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    vertexIndex: -1,
  });

  // Actualizar la línea del polígono
  const updatePolyline = useCallback((mapInstance: mapboxgl.Map) => {
    if (!polylineSource.current) {
      const sourceId = `polyline-${Date.now()}`;
      const layerId = `${sourceId}-layer`;
      
      mapInstance.addSource(sourceId, {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: vertices.current
          }
        }
      });

      mapInstance.addLayer({
        id: layerId,
        type: 'line',
        source: sourceId,
        layout: {
          'line-join': 'round',
          'line-cap': 'round'
        },
        paint: {
          'line-color': theme.palette.primary.main,
          'line-width': 3
        }
      });

      polylineSource.current = sourceId;
      polylineLayer.current = layerId;
    } else {
      const source = mapInstance.getSource(polylineSource.current);
      if (source) {
        (source as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: vertices.current
          }
        });
      }
    }
  }, [theme.palette.primary.main, vertices]);

  // Agregar nuevo vértice
  const handleAddVertex = useCallback((point: [number, number], index: number) => {
    if (!map.current) return;

    vertices.current.splice(index, 0, point);
    updatePolyline(map.current);

    // Actualizar marcadores después de agregar el vértice
    vertexMarkers.current.forEach(({ marker }) => marker.remove());
    vertexMarkers.current = [];
    midpointMarkers.current.forEach(marker => marker.remove());
    midpointMarkers.current = [];

    vertices.current.forEach((vertex, idx) => {
      const markerEl = document.createElement('div');
      markerEl.className = 'vertex-marker';
      markerEl.style.width = '14px';
      markerEl.style.height = '14px';
      markerEl.style.backgroundColor = theme.palette.error.main;
      markerEl.style.border = '2px solid white';
      markerEl.style.borderRadius = '50%';
      markerEl.style.cursor = 'move';

      markerEl.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        if (vertices.current.length <= 2) return;

        setContextMenu({
          show: true,
          x: e.clientX,
          y: e.clientY,
          vertexIndex: idx
        });
      });

      const marker = new mapboxgl.Marker({
        element: markerEl,
        draggable: true
      })
        .setLngLat(vertex)
        .addTo(map.current!);

      marker.on('drag', () => {
        const pos = marker.getLngLat();
        vertices.current[idx] = [pos.lng, pos.lat];
        updatePolyline(map.current!);
      });

      marker.on('dragend', () => {
        // Actualizar puntos medios después de arrastrar
        if (vertices.current.length >= 2) {
          midpointMarkers.current.forEach(m => m.remove());
          midpointMarkers.current = [];

          for (let i = 0; i < vertices.current.length; i++) {
            const nextIndex = (i + 1) % vertices.current.length;
            const currentVertex = vertices.current[i];
            const nextVertex = vertices.current[nextIndex];

            const midpoint: [number, number] = [
              (currentVertex[0] + nextVertex[0]) / 2,
              (currentVertex[1] + nextVertex[1]) / 2
            ];

            const midMarkerEl = document.createElement('div');
            midMarkerEl.style.width = '10px';
            midMarkerEl.style.height = '10px';
            midMarkerEl.style.backgroundColor = theme.palette.warning.main;
            midMarkerEl.style.border = '2px solid white';
            midMarkerEl.style.borderRadius = '50%';
            midMarkerEl.style.cursor = 'pointer';

            const midMarker = new mapboxgl.Marker({
              element: midMarkerEl,
              draggable: false
            })
              .setLngLat(midpoint)
              .addTo(map.current!);

            midMarker.getElement().addEventListener('click', () => {
              handleAddVertex(midpoint, nextIndex);
            });

            midpointMarkers.current.push(midMarker);
          }
        }
      });

      vertexMarkers.current.push({ marker, index: idx });
    });

    // Crear puntos medios iniciales
    if (vertices.current.length >= 2) {
      for (let i = 0; i < vertices.current.length; i++) {
        const nextIndex = (i + 1) % vertices.current.length;
        const currentVertex = vertices.current[i];
        const nextVertex = vertices.current[nextIndex];

        const midpoint: [number, number] = [
          (currentVertex[0] + nextVertex[0]) / 2,
          (currentVertex[1] + nextVertex[1]) / 2
        ];

        const midMarkerEl = document.createElement('div');
        midMarkerEl.style.width = '10px';
        midMarkerEl.style.height = '10px';
        midMarkerEl.style.backgroundColor = theme.palette.warning.main;
        midMarkerEl.style.border = '2px solid white';
        midMarkerEl.style.borderRadius = '50%';
        midMarkerEl.style.cursor = 'pointer';

        const midMarker = new mapboxgl.Marker({
          element: midMarkerEl,
          draggable: false
        })
          .setLngLat(midpoint)
          .addTo(map.current);

        midMarker.getElement().addEventListener('click', () => {
          handleAddVertex(midpoint, nextIndex);
        });

        midpointMarkers.current.push(midMarker);
      }
    }
  }, [map, updatePolyline, theme.palette.error.main, theme.palette.warning.main, vertices]);

  // Manejar clic en el mapa
  const handleMapClick = useCallback((e: mapboxgl.MapMouseEvent) => {
    if (!isDrawingMode || !map.current) return;

    const newVertex: [number, number] = [e.lngLat.lng, e.lngLat.lat];
    vertices.current.push(newVertex);
    updatePolyline(map.current);
    handleAddVertex(newVertex, vertices.current.length - 1);
  }, [isDrawingMode, map, updatePolyline, handleAddVertex, vertices]);

  // Eliminar vértice
  const handleDeleteVertex = useCallback(() => {
    if (!map.current || contextMenu.vertexIndex === -1) return;

    vertices.current.splice(contextMenu.vertexIndex, 1);
    updatePolyline(map.current);
    
    // Actualizar marcadores después de eliminar
    vertexMarkers.current.forEach(({ marker }) => marker.remove());
    vertexMarkers.current = [];
    midpointMarkers.current.forEach(marker => marker.remove());
    midpointMarkers.current = [];

    // Recrear marcadores con el nuevo conjunto de vértices
    const lastVertex = vertices.current[vertices.current.length - 1];
    if (lastVertex) {
      handleAddVertex(lastVertex, vertices.current.length - 1);
    }

    setContextMenu(prev => ({ ...prev, show: false }));
  }, [contextMenu.vertexIndex, map, updatePolyline, handleAddVertex, vertices]);

  // Limpiar dibujo
  const handleClearDrawing = useCallback(() => {
    if (!map.current) return;

    vertices.current = [];
    vertexMarkers.current.forEach(({ marker }) => marker.remove());
    vertexMarkers.current = [];
    midpointMarkers.current.forEach(marker => marker.remove());
    midpointMarkers.current = [];

    if (polylineSource.current) {
      const source = map.current.getSource(polylineSource.current);
      if (source) {
        (source as mapboxgl.GeoJSONSource).setData({
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: []
          }
        });
      }
    }
  }, [map]);

  return {
    vertices,
    contextMenu,
    handleMapClick,
    handleDeleteVertex,
    handleClearDrawing,
    setContextMenu,
  };
}
