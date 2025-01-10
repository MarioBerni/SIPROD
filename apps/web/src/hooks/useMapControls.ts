import { useState, useEffect } from 'react';
import { polygons, getUniqueOrdenes, getUniqueCompromisos } from '@/data/polygonData';

export function useMapControls() {
  const [selectedCompromisos, setSelectedCompromisos] = useState<string[]>([]);
  const [selectedOrdenes, setSelectedOrdenes] = useState<string[]>([]);
  const [selectedPolygons, setSelectedPolygons] = useState<string[]>([]);

  // Inicializar con todos los compromisos seleccionados
  useEffect(() => {
    const allCompromisos = getUniqueCompromisos();
    const allOrdenes = getUniqueOrdenes();
    const allPolygons = polygons.map(p => p.name);
    
    setSelectedCompromisos(allCompromisos);
    setSelectedOrdenes(allOrdenes);
    setSelectedPolygons(allPolygons);
  }, []);

  const handleCompromisoChange = (compromiso: string) => {
    setSelectedCompromisos(prev => {
      const isSelected = prev.includes(compromiso);
      let newCompromisos: string[];
      
      if (isSelected) {
        // Si se está deseleccionando
        newCompromisos = prev.filter(c => c !== compromiso);
        
        // Remover órdenes asociadas
        const ordenesDelCompromiso = getUniqueOrdenes().filter(orden => 
          polygons.find(p => p.compromiso === compromiso && p.orden === orden)
        );
        setSelectedOrdenes(prev => prev.filter(o => !ordenesDelCompromiso.includes(o)));
        
        // Remover polígonos asociados
        const polygonsToRemove = polygons
          .filter(p => p.compromiso === compromiso)
          .map(p => p.name);
        setSelectedPolygons(prev => prev.filter(p => !polygonsToRemove.includes(p)));
      } else {
        // Si se está seleccionando
        newCompromisos = [...prev, compromiso];
        
        // Agregar todas las órdenes asociadas
        const ordenesDelCompromiso = getUniqueOrdenes().filter(orden => 
          polygons.find(p => p.compromiso === compromiso && p.orden === orden)
        );
        setSelectedOrdenes(prev => Array.from(new Set([...prev, ...ordenesDelCompromiso])));
        
        // Agregar todos los polígonos asociados
        const polygonsToAdd = polygons
          .filter(p => p.compromiso === compromiso)
          .map(p => p.name);
        setSelectedPolygons(prev => Array.from(new Set([...prev, ...polygonsToAdd])));
      }
      
      return newCompromisos;
    });
  };

  const handleOrdenChange = (orden: string) => {
    setSelectedOrdenes(prev => {
      const isSelected = prev.includes(orden);
      let newOrdenes: string[];
      
      if (isSelected) {
        // Si se está deseleccionando
        newOrdenes = prev.filter(o => o !== orden);
        
        // Remover polígonos asociados
        const polygonsToRemove = polygons
          .filter(p => p.orden === orden)
          .map(p => p.name);
        setSelectedPolygons(prev => prev.filter(p => !polygonsToRemove.includes(p)));
      } else {
        // Si se está seleccionando
        newOrdenes = [...prev, orden];
        
        // Agregar todos los polígonos asociados
        const polygonsToAdd = polygons
          .filter(p => p.orden === orden)
          .map(p => p.name);
        setSelectedPolygons(prev => Array.from(new Set([...prev, ...polygonsToAdd])));
      }
      
      return newOrdenes;
    });
  };

  const handlePolygonChange = (polygonName: string) => {
    setSelectedPolygons(prev => {
      const isSelected = prev.includes(polygonName);
      return isSelected 
        ? prev.filter(p => p !== polygonName)
        : [...prev, polygonName];
    });
  };

  const isOrdenPartiallySelected = (orden: string): boolean => {
    const polygonsInOrden = polygons
      .filter(p => p.orden === orden)
      .map(p => p.name);
    const selectedPolygonsInOrden = selectedPolygons
      .filter(p => polygonsInOrden.includes(p));
    
    return selectedPolygonsInOrden.length > 0 && 
           selectedPolygonsInOrden.length < polygonsInOrden.length;
  };

  return {
    selectedCompromisos,
    selectedOrdenes,
    selectedPolygons,
    handleCompromisoChange,
    handleOrdenChange,
    handlePolygonChange,
    isOrdenPartiallySelected
  };
}
