import { useEffect, useRef, useCallback } from 'react';
import mapboxgl from 'mapbox-gl';
import { polygons } from '@/data/polygonData';

// Token de Mapbox
const MAPBOX_TOKEN = 'pk.eyJ1IjoibWFyaW9pbmdlMjM1IiwiYSI6ImNtMWtxbDg0MjAweGIybm9ndGdubTJha3MifQ.4pfkpdiAmmwNLhdNBIzuJA';

// Colores para los polígonos
const getPolygonStyle = (compromiso: string) => {
  if (compromiso === 'Meta  N.º 7 Patrullajes en puntos críticos') {
    return {
      fillColor: '#ff6b6b',  // Rojo claro
      borderColor: '#e03131' // Rojo oscuro
    };
  }
  return {
    fillColor: '#088',    // Color por defecto
    borderColor: '#000000' // Borde por defecto
  };
};

interface UseMapInstanceProps {
  mapContainer: React.RefObject<HTMLDivElement>;
  selectedCompromisos: string[];
  selectedOrdenes: string[];
  selectedPolygons: string[];
  onPolygonClick: (name: string) => void;
}

// Función para inicializar las capas del mapa
const createInitializeLayers = (onPolygonClick: (name: string) => void) => 
  (mapInstance: mapboxgl.Map, layersInitialized: React.MutableRefObject<boolean>) => {
    if (layersInitialized.current) return;

    polygons.forEach((polygon, index) => {
      const geojsonPolygon = {
        type: 'Feature',
        properties: { 
          name: polygon.name,
          orden: polygon.orden,
          compromiso: polygon.compromiso
        },
        geometry: {
          type: 'Polygon',
          coordinates: [polygon.coordinates]
        }
      } as GeoJSON.Feature;

      mapInstance.addSource(`polygon-${index}`, {
        type: 'geojson',
        data: geojsonPolygon
      });

      mapInstance.addLayer({
        id: `polygon-layer-${index}`,
        type: 'fill',
        source: `polygon-${index}`,
        paint: {
          'fill-color': getPolygonStyle(polygon.compromiso).fillColor,
          'fill-opacity': 0.5
        }
      });

      mapInstance.addLayer({
        id: `polygon-border-layer-${index}`,
        type: 'line',
        source: `polygon-${index}`,
        paint: {
          'line-color': getPolygonStyle(polygon.compromiso).borderColor,
          'line-width': 2
        }
      });

      mapInstance.on('click', `polygon-layer-${index}`, () => {
        onPolygonClick(polygon.name);
      });
    });

    layersInitialized.current = true;
  };

export function useMapInstance({
  mapContainer,
  selectedCompromisos,
  selectedOrdenes,
  selectedPolygons,
  onPolygonClick
}: UseMapInstanceProps) {
  const map = useRef<mapboxgl.Map | null>(null);
  const mapLoaded = useRef(false);
  const layersInitialized = useRef(false);

  // Crear la función de inicialización de capas
  const initializeLayers = useCallback(
    (mapInstance: mapboxgl.Map) => {
      createInitializeLayers(onPolygonClick)(mapInstance, layersInitialized);
    },
    [onPolygonClick]
  );

  // Inicializar mapa - solo una vez
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    // Establecer el token de Mapbox
    mapboxgl.accessToken = MAPBOX_TOKEN;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-56.1950, -34.8500],
      zoom: 12.5
    });

    const mapInstance = map.current;

    mapInstance.on('load', () => {
      mapLoaded.current = true;
      initializeLayers(mapInstance);
    });

    return () => {
      if (map.current) {
        mapLoaded.current = false;
        layersInitialized.current = false;
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapContainer, initializeLayers]);

  // Actualizar visibilidad de los polígonos cuando cambien los filtros
  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance || !mapLoaded.current) return;

    polygons.forEach((polygon, index) => {
      const isVisible = selectedCompromisos.includes(polygon.compromiso) &&
        (selectedOrdenes.length === 0 || selectedOrdenes.includes(polygon.orden)) &&
        (selectedPolygons.length === 0 || selectedPolygons.includes(polygon.name));

      if (mapInstance.getLayer(`polygon-layer-${index}`)) {
        mapInstance.setLayoutProperty(
          `polygon-layer-${index}`,
          'visibility',
          isVisible ? 'visible' : 'none'
        );
        mapInstance.setLayoutProperty(
          `polygon-border-layer-${index}`,
          'visibility',
          isVisible ? 'visible' : 'none'
        );
      }
    });
  }, [selectedCompromisos, selectedOrdenes, selectedPolygons]);

  return map;
}
