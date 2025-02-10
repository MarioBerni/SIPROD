'use client';

import { Box, Grid } from '@mui/material';
import { RecursosActualesCard } from '@/components/dashboard/RecursosActualesCard';
import { ResultadosOperativosCard } from '@/components/dashboard/ResultadosOperativosCard';
import { NivelPatrullajeCard } from '@/components/dashboard/NivelPatrullajeCard';
import { MapaPatrullaje } from '@/components/dashboard/MapaPatrullaje';
import { TablaOperativosCard } from '@/components/dashboard/TablaOperativosCard';
import { useEffect, useState } from 'react';
import { RecursosActuales, ResultadoOperativo } from '@/types/dashboard';

// Tipos de datos
interface BarrioInfo {
  nombre: string;
  porcentaje: number;
}

interface RecursoData {
  hora: string;
  moviles: number;
  motos: number;
  hipo: number;
  efectivos: number;
}

interface OperativoData {
  operativo: string;
  moviles: number;
  ssoo: number;
  motos: number;
  hipos: number;
  pieTierra: number;
  totalFFPP: number;
  horaInicio: string;
  horaFin: string;
  seccional: string;
}

export default function DashboardPage() {
  // Estados para los datos de cada componente
  const [recursosActuales] = useState<RecursosActuales>({
    moviles: { cantidad: 45, icono: 'car' },
    motos: { cantidad: 30, icono: 'motorcycle' },
    hipos: { cantidad: 8, icono: 'horse' },
    pieTierra: { cantidad: 120, icono: 'walk' },
    choqueApostado: { cantidad: 15, icono: 'police' },
    choqueAlerta: { cantidad: 10, icono: 'alert' },
    totalEfectivos: 228
  });

  const [resultadosOperativos] = useState<ResultadoOperativo>({
    puntosControl: 25,
    registros: {
      personas: 150,
      autos: 80,
      motos: 45
    },
    incautaciones: {
      autos: 3,
      motos: 5
    },
    incautacionArmas: {
      fuego: 2,
      blanca: 8,
      cartucho: 15
    },
    incautacionSustancias: {
      cocaina: 0.5,
      pastaBase: 1.2,
      vegetal: 3.5
    }
  });

  const [nivelPatrullaje, setNivelPatrullaje] = useState<BarrioInfo[]>([]);
  const [recursosHora, setRecursosHora] = useState<RecursoData[]>([]);
  
  const [operativosActuales] = useState<OperativoData[]>([
    {
      operativo: "Operativo - II ZONA - BOIX Y MERINO",
      moviles: 2,
      ssoo: 1,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 5,
      horaInicio: "10:00",
      horaFin: "22:00",
      seccional: "15"
    },
    {
      operativo: "Operativo - II ZONA - CERRO Y CERRO NORTE",
      moviles: 4,
      ssoo: 1,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 11,
      horaInicio: "10:00",
      horaFin: "22:00",
      seccional: "24"
    },
    {
      operativo: "Operativo - II ZONA - MARCONI",
      moviles: 2,
      ssoo: 1,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 6,
      horaInicio: "09:00",
      horaFin: "21:00",
      seccional: "17"
    },
    {
      operativo: "Operativo - II ZONA - VILLA ESPAÑOLA Y PEREZ CASTELLANOS",
      moviles: 1,
      ssoo: 1,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 3,
      horaInicio: "23:00",
      horaFin: "10:00",
      seccional: "13"
    },
    {
      operativo: "Operativo - II ZONA - MARCONI",
      moviles: 2,
      ssoo: 1,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 6,
      horaInicio: "22:00",
      horaFin: "10:00",
      seccional: "17"
    },
    {
      operativo: "Operativo - II ZONA - BOIX Y MERINO",
      moviles: 2,
      ssoo: 0,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 5,
      horaInicio: "23:00",
      horaFin: "10:00",
      seccional: "15"
    },
    {
      operativo: "Operativo - CEIBO III CARRASCO (HIPO)",
      moviles: 0,
      ssoo: 0,
      motos: 0,
      hipos: 2,
      pieTierra: 0,
      totalFFPP: 4,
      horaInicio: "18:00",
      horaFin: "03:00",
      seccional: "14"
    },
    {
      operativo: "Operativo - CEIBO III- AROCENA",
      moviles: 0,
      ssoo: 0,
      motos: 2,
      hipos: 0,
      pieTierra: 4,
      totalFFPP: 16,
      horaInicio: "16:00",
      horaFin: "24:00",
      seccional: "14"
    },
    {
      operativo: "Operativo - CEIBO III-PARQUE BATLLE",
      moviles: 1,
      ssoo: 1,
      motos: 2,
      hipos: 0,
      pieTierra: 8,
      totalFFPP: 14,
      horaInicio: "21:00",
      horaFin: "05:00",
      seccional: "9"
    },
    {
      operativo: "Operativo - CEIBO III-PARQUE BATLLE",
      moviles: 1,
      ssoo: 0,
      motos: 0,
      hipos: 0,
      pieTierra: 8,
      totalFFPP: 18,
      horaInicio: "16:00",
      horaFin: "24:00",
      seccional: "9"
    },
    {
      operativo: "Patrullaje - HIPO CLUB DE GOLF",
      moviles: 0,
      ssoo: 0,
      motos: 0,
      hipos: 2,
      pieTierra: 0,
      totalFFPP: 2,
      horaInicio: "11:00",
      horaFin: "14:00",
      seccional: "5"
    },
    {
      operativo: "Patrullaje - HIPO POR RAMBLA",
      moviles: 0,
      ssoo: 0,
      motos: 0,
      hipos: 4,
      pieTierra: 0,
      totalFFPP: 4,
      horaInicio: "17:00",
      horaFin: "24:00",
      seccional: "11"
    },
    {
      operativo: "Patrullaje - ANTEL ARENA, DNGR Y HP",
      moviles: 1,
      ssoo: 0,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 3,
      horaInicio: "02:00",
      horaFin: "10:00",
      seccional: "13"
    },
    {
      operativo: "Patrullaje - ACOSTA Y LARA",
      moviles: 1,
      ssoo: 0,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 4,
      horaInicio: "19:00",
      horaFin: "05:00",
      seccional: "14"
    },
    {
      operativo: "Patrullaje - BARRIO LA CHANCHA",
      moviles: 1,
      ssoo: 0,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 3,
      horaInicio: "23:00",
      horaFin: "05:00",
      seccional: "18"
    },
    {
      operativo: "Operativo - PREVENCION PICADAS (INTERCAMBIADOR BELLONI E INSTRUCCIONES)",
      moviles: 1,
      ssoo: 0,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 2,
      horaInicio: "01:00",
      horaFin: "06:00",
      seccional: "16"
    },
    {
      operativo: "Operativo - CIUDAD DEL PLATA",
      moviles: 2,
      ssoo: 1,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 5,
      horaInicio: "23:00",
      horaFin: "10:00",
      seccional: ""
    },
    {
      operativo: "Patrullaje - EN PASO DE CARASCO",
      moviles: 1,
      ssoo: 0,
      motos: 0,
      hipos: 0,
      pieTierra: 0,
      totalFFPP: 4,
      horaInicio: "19:00",
      horaFin: "03:00",
      seccional: "14"
    },
    {
      operativo: "Patrullaje - AVENIDA VARELA",
      moviles: 0,
      ssoo: 0,
      motos: 0,
      hipos: 0,
      pieTierra: 1,
      totalFFPP: 1,
      horaInicio: "10:00",
      horaFin: "22:00",
      seccional: "13"
    },
    {
      operativo: "Operativo - PLAZAS (Vie, Sab, Dom)",
      moviles: 0,
      ssoo: 0,
      motos: 0,
      hipos: 4,
      pieTierra: 0,
      totalFFPP: 4,
      horaInicio: "17:00",
      horaFin: "24:00",
      seccional: "5, 9, 10"
    },
    {
      operativo: "Operativo - ANDRÓMEDA VII DNGR",
      moviles: 1,
      ssoo: 0,
      motos: 0,
      hipos: 2,
      pieTierra: 0,
      totalFFPP: 8,
      horaInicio: "18:00",
      horaFin: "01:00",
      seccional: "14"
    }
  ]);
  // Estados de carga y error
  const [loading, setLoading] = useState({
    recursos: true,
    patrullaje: true
  });

  const [error, setError] = useState({
    recursos: '',
    patrullaje: ''
  });

  const handleDetalleRecursoClick = (tipo: string) => {
    console.log(`Mostrar detalle de: ${tipo}`);
    // Implementar lógica de detalle
  };

  // Efecto para cargar los datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simular tiempo de carga
        setTimeout(() => {
          setNivelPatrullaje([
            { nombre: 'Cerro', porcentaje: 15 },
            { nombre: 'Villa Española', porcentaje: 12 },
            { nombre: 'Pérez Castellanos', porcentaje: 10 },
            { nombre: 'Centro', porcentaje: 18 },
            { nombre: 'Pocitos', porcentaje: 15 },
            { nombre: 'Prado', porcentaje: 10 },
            { nombre: 'Tres Cruces', porcentaje: 12 },
            { nombre: 'Parque Batlle', porcentaje: 8 }
          ]);
          
          // Generar datos de recursos por hora
          const horasData = Array.from({ length: 24 }, (_, i) => ({
            hora: `${i.toString().padStart(2, '0')}:00`,
            moviles: Math.floor(Math.random() * 20) + 10,
            motos: Math.floor(Math.random() * 15) + 5,
            hipo: Math.floor(Math.random() * 5) + 1,
            efectivos: Math.floor(Math.random() * 50) + 30,
          }));
          setRecursosHora(horasData);

          setLoading({
            recursos: false,
            patrullaje: false
          });
        }, 1000);
      } catch (err) {
        setError({
          recursos: 'Error al cargar datos',
          patrullaje: 'Error al cargar datos'
        });
        setLoading({
          recursos: false,
          patrullaje: false
        });
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <RecursosActualesCard 
            datos={recursosActuales}
            onDetalleClick={handleDetalleRecursoClick}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <ResultadosOperativosCard 
            datos={resultadosOperativos}
          />
        </Grid>
      </Grid>

      {/* Mapa y Nivel de Patrullaje */}
      <Grid container spacing={3} sx={{ mt: 3, mb: 3 }}>
        <Grid item xs={12} md={8}>
          <MapaPatrullaje />
        </Grid>
        <Grid item xs={12} md={4}>
          <NivelPatrullajeCard 
            barrios={nivelPatrullaje}
            loading={loading.patrullaje}
            error={error.patrullaje}
          />
        </Grid>
      </Grid>

      {/* Tabla de Operativos */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <TablaOperativosCard datos={operativosActuales} />
        </Grid>
      </Grid>
    </Box>
  );
}
