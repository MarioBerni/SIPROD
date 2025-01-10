import { useRef, useEffect, useState, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { createPortal } from 'react-dom';
import { VertexContextMenu } from '@/components/maps/VertexContextMenu';

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
  const vertices = useRef<[number, number][]>([]);
  const vertexMarkers = useRef<VertexMarker[]>([]);
  const midpointMarkers = useRef<mapboxgl.Marker[]>([]);
  const polylineSource = useRef<string | null>(null);
  const polylineLayer = useRef<string | null>(null);
  const menuPortalContainer = useRef<HTMLDivElement | null>(null);
  const [contextMenu, setContextMenu] = useState<ContextMenuState>({
    show: false,
    x: 0,
    y: 0,
    vertexIndex: -1
  });

  // Crear el contenedor del portal si no existe
  useEffect(() => {
    if (!menuPortalContainer.current) {
      const container = document.createElement('div');
      container.id = 'vertex-context-menu-portal';
      document.body.appendChild(container);
      menuPortalContainer.current = container;
    }

    return () => {
      if (menuPortalContainer.current) {
        document.body.removeChild(menuPortalContainer.current);
        menuPortalContainer.current = null;
      }
    };
  }, []);

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
          'line-color': '#0000ff',
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
  }, []);

  // Función auxiliar para actualizar vértices y línea
  const updateVerticesAndLine = useCallback((mapInstance: mapboxgl.Map, newVertices?: [number, number][]) => {
    if (newVertices) {
      vertices.current = newVertices;
    }
    updatePolyline(mapInstance);
  }, [updatePolyline]);

  // Crear marcador de vértice individual
  const createVertexMarker = useCallback((
    mapInstance: mapboxgl.Map,
    vertex: [number, number],
    index: number,
    onMidpointUpdate: () => void
  ) => {
    const markerEl = document.createElement('div');
    markerEl.className = 'vertex-marker';
    markerEl.style.width = '14px';
    markerEl.style.height = '14px';
    markerEl.style.backgroundColor = '#FF0000';
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
        vertexIndex: index
      });
    });

    const marker = new mapboxgl.Marker({
      element: markerEl,
      draggable: true
    })
      .setLngLat(vertex)
      .addTo(mapInstance);

    marker.on('drag', () => {
      const pos = marker.getLngLat();
      vertices.current[index] = [pos.lng, pos.lat];
      updateVerticesAndLine(mapInstance);
    });

    marker.on('dragend', onMidpointUpdate);

    return { marker, index };
  }, [updateVerticesAndLine]);

  // Crear marcadores de punto medio
  const createMidpointMarkers = useCallback((
    mapInstance: mapboxgl.Map,
    onNewPoint: (point: [number, number], index: number) => void
  ) => {
    midpointMarkers.current.forEach(marker => marker.remove());
    midpointMarkers.current = [];

    if (vertices.current.length < 2) return;

    for (let i = 0; i < vertices.current.length; i++) {
      const nextIndex = (i + 1) % vertices.current.length;
      const currentVertex = vertices.current[i];
      const nextVertex = vertices.current[nextIndex];

      const midpoint: [number, number] = [
        (currentVertex[0] + nextVertex[0]) / 2,
        (currentVertex[1] + nextVertex[1]) / 2
      ];

      const markerEl = document.createElement('div');
      markerEl.style.width = '10px';
      markerEl.style.height = '10px';
      markerEl.style.backgroundColor = '#FFA500';
      markerEl.style.border = '2px solid white';
      markerEl.style.borderRadius = '50%';
      markerEl.style.cursor = 'pointer';

      const marker = new mapboxgl.Marker({
        element: markerEl,
        draggable: false
      })
        .setLngLat(midpoint)
        .addTo(mapInstance);

      marker.getElement().addEventListener('click', () => {
        onNewPoint(midpoint, nextIndex);
      });

      midpointMarkers.current.push(marker);
    }
  }, []);

  // Actualizar todos los marcadores
  const updateAllMarkers = useCallback((mapInstance: mapboxgl.Map) => {
    // Limpiar marcadores existentes
    vertexMarkers.current.forEach(({ marker }) => marker.remove());
    vertexMarkers.current = [];

    // Crear nuevos marcadores
    vertices.current.forEach((vertex, index) => {
      const vertexMarker = createVertexMarker(
        mapInstance,
        vertex,
        index,
        () => createMidpointMarkers(mapInstance, (point, insertIndex) => {
          vertices.current.splice(insertIndex, 0, point);
          updateAllMarkers(mapInstance);
        })
      );
      vertexMarkers.current.push(vertexMarker);
    });

    createMidpointMarkers(mapInstance, (point, insertIndex) => {
      vertices.current.splice(insertIndex, 0, point);
      updateAllMarkers(mapInstance);
    });
    updateVerticesAndLine(mapInstance);
  }, [createVertexMarker, createMidpointMarkers, updateVerticesAndLine]);

  // Limpiar el dibujo actual
  const clearCurrentDrawing = useCallback(() => {
    setContextMenu({ show: false, x: 0, y: 0, vertexIndex: -1 });
    vertexMarkers.current.forEach(({ marker }) => marker.remove());
    vertexMarkers.current = [];
    midpointMarkers.current.forEach(marker => marker.remove());
    midpointMarkers.current = [];
    vertices.current = [];

    const mapInstance = map.current;
    if (!mapInstance) return;

    if (polylineSource.current) {
      const source = mapInstance.getSource(polylineSource.current);
      if (source) {
        mapInstance.removeLayer(polylineLayer.current!);
        mapInstance.removeSource(polylineSource.current);
      }
      polylineSource.current = null;
      polylineLayer.current = null;
    }
  }, [map]);

  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance) return;

    if (isDrawingMode) {
      mapInstance.getCanvas().style.cursor = 'crosshair';

      const handleClick = (e: mapboxgl.MapMouseEvent) => {
        const coordinates: [number, number] = [e.lngLat.lng, e.lngLat.lat];
        vertices.current.push(coordinates);
        updateAllMarkers(mapInstance);
      };

      mapInstance.on('click', handleClick);

      return () => {
        mapInstance.off('click', handleClick);
        mapInstance.getCanvas().style.cursor = '';
      };
    } else {
      clearCurrentDrawing();
    }
  }, [map, isDrawingMode, updateAllMarkers, clearCurrentDrawing]);

  // Renderizar el menú contextual
  const renderContextMenu = () => {
    if (!contextMenu.show || !menuPortalContainer.current) return null;

    return createPortal(
      <VertexContextMenu
        x={contextMenu.x}
        y={contextMenu.y}
        onDelete={() => {
          if (vertices.current.length > 2) {
            vertices.current.splice(contextMenu.vertexIndex, 1);
            const mapInstance = map.current;
            if (mapInstance) {
              updateAllMarkers(mapInstance);
            }
          }
          setContextMenu({ show: false, x: 0, y: 0, vertexIndex: -1 });
        }}
        onClose={() => {
          setContextMenu({ show: false, x: 0, y: 0, vertexIndex: -1 });
        }}
      />,
      menuPortalContainer.current
    );
  };

  return { clearCurrentDrawing, renderContextMenu };
}
