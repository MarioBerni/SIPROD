import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

export function useMapInstance({
  container,
  center,
  zoom,
  style,
  onClick,
}: {
  container: React.RefObject<HTMLDivElement>;
  center: [number, number];
  zoom: number;
  style: mapboxgl.Style | string;
  onClick?: (e: mapboxgl.MapMouseEvent) => void;
}) {
  const map = useRef<mapboxgl.Map | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    if (!container.current || map.current) return;

    map.current = new mapboxgl.Map({
      container: container.current,
      style: style,
      center: center,
      zoom: zoom,
      attributionControl: false,
      preserveDrawingBuffer: true,
      antialias: true,
    });

    // Agregar controles de navegación
    map.current.addControl(
      new mapboxgl.NavigationControl({
        showCompass: true,
        showZoom: true,
        visualizePitch: true,
      }),
      'top-right'
    );

    // Agregar control de escala
    map.current.addControl(
      new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric',
      }),
      'bottom-right'
    );

    // Evento cuando el mapa termina de cargar
    map.current.on('load', () => {
      setIsLoaded(true);
      map.current?.resize();
    });

    // Evento de clic en el mapa
    if (onClick) {
      map.current.on('click', onClick);
    }

    // Cleanup al desmontar el componente
    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [container, center, zoom, style, onClick]);

  // Efecto para manejar el resize del mapa
  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return { map, isLoaded };
}
