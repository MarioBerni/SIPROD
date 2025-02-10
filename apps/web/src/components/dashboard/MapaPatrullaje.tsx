'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, Box, CircularProgress } from '@mui/material';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { polygons } from '@/data/polygonData';

const MAPBOX_TOKEN = "pk.eyJ1IjoibWFyaW9pbmdlMjM1IiwiYSI6ImNtMWtxbDg0MjAweGIybm9ndGdubTJha3MifQ.4pfkpdiAmmwNLhdNBIzuJA";

export const MapaPatrullaje = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    try {
      mapboxgl.accessToken = MAPBOX_TOKEN;

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-56.1645, -34.9011],
        zoom: 12,
        attributionControl: true,
        preserveDrawingBuffer: true
      });

      map.current.on('load', () => {
        if (!map.current) return;

        // Agregar fuente de datos para los polígonos
        map.current.addSource('operativos', {
          type: 'geojson',
          data: {
            type: 'FeatureCollection',
            features: polygons.map(polygon => ({
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
            }))
          }
        });

        // Agregar capa de polígonos
        map.current.addLayer({
          id: 'operativos-fill',
          type: 'fill',
          source: 'operativos',
          paint: {
            'fill-color': '#0080ff',
            'fill-opacity': 0.3
          }
        });

        // Agregar capa de bordes
        map.current.addLayer({
          id: 'operativos-line',
          type: 'line',
          source: 'operativos',
          paint: {
            'line-color': '#0080ff',
            'line-width': 2
          }
        });

        // Agregar popup al hacer hover
        const popup = new mapboxgl.Popup({
          closeButton: false,
          closeOnClick: false
        });

        map.current.on('mouseenter', 'operativos-fill', (e) => {
          if (!map.current || !e.features?.[0]) return;
          
          map.current.getCanvas().style.cursor = 'pointer';
          
          const coordinates = e.lngLat;
          const feature = e.features?.[0];
          if (!feature?.properties) return;
          
          const description = `
            <strong>${feature.properties.name || 'Sin nombre'}</strong><br/>
            ${feature.properties.orden || 'Sin orden'}<br/>
            ${feature.properties.compromiso || 'Sin compromiso'}
          `;
          
          popup.setLngLat(coordinates).setHTML(description).addTo(map.current);
        });

        map.current.on('mouseleave', 'operativos-fill', () => {
          if (!map.current) return;
          map.current.getCanvas().style.cursor = '';
          popup.remove();
        });

        setLoading(false);
      });

      map.current.on('error', (e) => {
        setError('Error al cargar el mapa: ' + e.error.message);
        setLoading(false);
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    } catch (err) {
      setError('Error al inicializar el mapa: ' + (err instanceof Error ? err.message : String(err)));
      setLoading(false);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <Card sx={{ height: '400px', boxShadow: 2 }}>
      <CardHeader 
        title="Mapa de Patrullaje" 
        sx={{ 
          p: 2, 
          '& .MuiCardHeader-title': { 
            fontSize: '1rem',
            fontWeight: 500 
          } 
        }} 
      />
      <CardContent 
        sx={{ 
          height: 'calc(100% - 60px)', 
          p: '0 !important',
          position: 'relative'
        }}
      >
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              zIndex: 1
            }}
          >
            <CircularProgress />
          </Box>
        )}
        {error && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              color: 'error.main',
              textAlign: 'center',
              p: 2
            }}
          >
            {error}
          </Box>
        )}
        <Box
          ref={mapContainer}
          sx={{
            height: '100%',
            width: '100%',
            '& .mapboxgl-canvas': {
              borderRadius: 1
            },
            visibility: loading || error ? 'hidden' : 'visible'
          }}
        />
      </CardContent>
    </Card>
  );
};
