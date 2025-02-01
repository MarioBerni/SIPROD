import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import { polygons } from '@/data/polygonData';

// Token de Mapbox
if (typeof window !== 'undefined' && !mapboxgl.accessToken) {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || '';
  
  if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
    console.error('Error: NEXT_PUBLIC_MAPBOX_TOKEN no está definido en las variables de entorno');
  }
}

// Colores para los polígonos según el tipo de compromiso
const POLYGON_STYLES = {
  'Meta  N.º 7 Patrullajes en puntos críticos': {
    fillColor: '#ff6b6b',
    borderColor: '#e03131',
    fillOpacity: 0.5
  },
  'Meta  N.º 4 Violencia Doméstica': {
    fillColor: '#4dabf7',
    borderColor: '#1971c2',
    fillOpacity: 0.5
  },
  'Meta  N.º 2 Hurtos y Rapiñas': {
    fillColor: '#51cf66',
    borderColor: '#2f9e44',
    fillOpacity: 0.5
  },
  default: {
    fillColor: '#868e96',
    borderColor: '#495057',
    fillOpacity: 0.5
  }
};

const getPolygonStyle = (compromiso: string) => {
  return POLYGON_STYLES[compromiso as keyof typeof POLYGON_STYLES] || POLYGON_STYLES.default;
};

// Función para actualizar el estilo de un polígono
const updatePolygonStyle = (
  mapInstance: mapboxgl.Map,
  polygonId: string,
  isSelected: boolean,
  style: typeof POLYGON_STYLES[keyof typeof POLYGON_STYLES]
) => {
  const opacity = isSelected ? 0.8 : style.fillOpacity;
  const fillColor = isSelected ? style.fillColor : style.fillColor;
  
  if (mapInstance.getLayer(`polygon-fill-${polygonId}`)) {
    mapInstance.setPaintProperty(`polygon-fill-${polygonId}`, 'fill-opacity', opacity);
    mapInstance.setPaintProperty(`polygon-fill-${polygonId}`, 'fill-color', fillColor);
  }
  
  if (mapInstance.getLayer(`polygon-border-${polygonId}`)) {
    mapInstance.setPaintProperty(`polygon-border-${polygonId}`, 'line-color', style.borderColor);
  }
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
        id: `polygon-fill-${index}`,
        type: 'fill',
        source: `polygon-${index}`,
        paint: {
          'fill-color': getPolygonStyle(polygon.compromiso).fillColor,
          'fill-opacity': getPolygonStyle(polygon.compromiso).fillOpacity
        }
      });

      mapInstance.addLayer({
        id: `polygon-border-${index}`,
        type: 'line',
        source: `polygon-${index}`,
        paint: {
          'line-color': getPolygonStyle(polygon.compromiso).borderColor,
          'line-width': 2
        }
      });

      mapInstance.on('click', `polygon-fill-${index}`, () => {
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

  // Inicializar mapa - solo una vez
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [-56.1645, -34.9011], // Montevideo, Uruguay
      zoom: 11,
      minZoom: 9,
      maxZoom: 18,
      dragRotate: false,
      attributionControl: true,
    });

    // Agregar controles de navegación
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-left');
    map.current.addControl(new mapboxgl.ScaleControl(), 'bottom-left');

    // Manejar errores del mapa
    map.current.on('error', (e) => {
      console.error('Error en el mapa:', e.error);
    });

    // Crear la función de inicialización con el callback
    const initLayers = createInitializeLayers(onPolygonClick);

    // Esperar a que el mapa cargue antes de inicializar las capas
    map.current.on('load', () => {
      // Llamar a la función con los parámetros correctos
      initLayers(map.current!, layersInitialized);
      
      // Ajustar el mapa cuando cambie el tamaño de la ventana
      window.addEventListener('resize', () => {
        map.current?.resize();
      });
    });

    return () => {
      if (map.current) {
        mapLoaded.current = false;
        layersInitialized.current = false;
        map.current.remove();
        map.current = null;
      }
    };
  }, [mapContainer, onPolygonClick]);

  // Actualizar visibilidad de los polígonos cuando cambien los filtros
  useEffect(() => {
    const mapInstance = map.current;
    if (!mapInstance || !mapLoaded.current) return;

    polygons.forEach((polygon, index) => {
      const isSelected = selectedCompromisos.includes(polygon.compromiso) &&
        (selectedOrdenes.length === 0 || selectedOrdenes.includes(polygon.orden)) &&
        (selectedPolygons.length === 0 || selectedPolygons.includes(polygon.name));

      const style = getPolygonStyle(polygon.compromiso);
      updatePolygonStyle(mapInstance, `${index}`, isSelected, style);
    });
  }, [selectedCompromisos, selectedOrdenes, selectedPolygons]);

  return map;
}
