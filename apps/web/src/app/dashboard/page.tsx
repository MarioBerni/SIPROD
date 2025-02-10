'use client';

import { Box, Grid } from '@mui/material';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { JefeDiaCard } from '@/components/dashboard/JefeDiaCard';
import { DatosDespliegueCard } from '@/components/dashboard/DatosDespliegueCard';
import { DesplieguesCard } from '@/components/dashboard/DesplieguesCard';
import { NivelPatrullajeCard } from '@/components/dashboard/NivelPatrullajeCard';
import { RecursosHoraChart } from '@/components/dashboard/RecursosHoraChart';
import { MapaPatrullaje } from '@/components/dashboard/MapaPatrullaje';
import { useEffect, useState } from 'react';

// Tipos de datos
interface JefeInfo {
  nombre: string;
  grado: string;
}

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

interface DespliegueInfo {
  id: string;
  titulo: string;
  estado: 'activo' | 'pendiente' | 'completado';
  tipo: string;
  hora: string;
  ubicacion: string;
  recursos: {
    moviles: number;
    motos: number;
    hipo?: number;
    efectivos: number;
  }
}

export default function DashboardPage() {
  // Estados para los datos de cada componente
  const [jefesActuales, setJefesActuales] = useState<{ jefeDir1?: JefeInfo; jefeDir2?: JefeInfo }>({});
  const [jefesMañana, setJefesMañana] = useState<{ principal?: JefeInfo; secundario?: JefeInfo }>({});
  const [datosDespliegue, setDatosDespliegue] = useState({
    moviles: 0,
    motos: 0,
    hipo: 0,
    efectivos: 0
  });
  const [nivelPatrullaje, setNivelPatrullaje] = useState<BarrioInfo[]>([]);
  const [recursosHora, setRecursosHora] = useState<RecursoData[]>([]);
  const [desplieguesActuales, setDesplieguesActuales] = useState<DespliegueInfo[]>([]);
  const [desplieguesProximos, setDesplieguesProximos] = useState<DespliegueInfo[]>([]);
  
  // Estados de carga y error
  const [loading, setLoading] = useState({
    jefes: true,
    patrullaje: true,
    recursos: true,
    despliegues: true,
  });
  const [error, setError] = useState({
    jefes: '',
    patrullaje: '',
    recursos: '',
    despliegues: '',
  });

  // Efecto para cargar los datos
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Simular tiempo de carga
        setTimeout(() => {
          // Datos de ejemplo
          setJefesActuales({
            jefeDir1: { nombre: 'Juan Pérez', grado: 'Comisario' },
            jefeDir2: { nombre: 'María González', grado: 'Subcomisario' },
          });
          
          setJefesMañana({
            principal: { nombre: 'Carlos Rodríguez', grado: 'Comisario' },
            secundario: { nombre: 'Ana Martínez', grado: 'Subcomisario' },
          });

          setDatosDespliegue({
            moviles: 25,
            motos: 15,
            hipo: 5,
            efectivos: 120
          });
          
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
          
          setDesplieguesActuales([
            { 
              id: '1', 
              titulo: 'Operativo Comercial Centro', 
              estado: 'activo', 
              tipo: 'Patrullaje', 
              hora: '14:30',
              ubicacion: 'Centro',
              recursos: {
                moviles: 3,
                motos: 2,
                efectivos: 12
              }
            },
            { 
              id: '2', 
              titulo: 'Control Vehicular', 
              estado: 'pendiente', 
              tipo: 'Control', 
              hora: '15:00',
              ubicacion: 'Av. Italia',
              recursos: {
                moviles: 2,
                motos: 4,
                efectivos: 8
              }
            },
            { 
              id: '3', 
              titulo: 'Vigilancia Preventiva', 
              estado: 'activo', 
              tipo: 'Patrullaje', 
              hora: '14:00',
              ubicacion: 'Parque Batlle',
              recursos: {
                moviles: 2,
                motos: 2,
                hipo: 2,
                efectivos: 10
              }
            }
          ]);
          
          setDesplieguesProximos([
            { 
              id: '4', 
              titulo: 'Operativo Nocturno', 
              estado: 'pendiente', 
              tipo: 'Patrullaje', 
              hora: '20:00',
              ubicacion: 'Pocitos',
              recursos: {
                moviles: 4,
                motos: 6,
                efectivos: 15
              }
            },
            { 
              id: '5', 
              titulo: 'Control de Accesos', 
              estado: 'pendiente', 
              tipo: 'Control', 
              hora: '18:30',
              ubicacion: 'Terminal Tres Cruces',
              recursos: {
                moviles: 2,
                motos: 2,
                efectivos: 8
              }
            },
            { 
              id: '6', 
              titulo: 'Vigilancia Especial', 
              estado: 'pendiente', 
              tipo: 'Patrullaje', 
              hora: '19:00',
              ubicacion: 'Prado',
              recursos: {
                moviles: 3,
                motos: 4,
                hipo: 2,
                efectivos: 12
              }
            }
          ]);

          setLoading({
            jefes: false,
            patrullaje: false,
            recursos: false,
            despliegues: false,
          });
        }, 1000);
      } catch (err) {
        setError({
          jefes: 'Error al cargar datos',
          patrullaje: 'Error al cargar datos',
          recursos: 'Error al cargar datos',
          despliegues: 'Error al cargar datos',
        });
        setLoading({
          jefes: false,
          patrullaje: false,
          recursos: false,
          despliegues: false,
        });
      }
    };

    fetchData();
  }, []);

  return (
    <Box sx={{ p: 2 }}>
      <DashboardHeader />
      
      {/* Cards superiores */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <JefeDiaCard 
            jefeDir1={jefesActuales.jefeDir1}
            jefeDir2={jefesActuales.jefeDir2}
            jefeMañanaPrincipal={jefesMañana.principal}
            jefeMañanaSecundario={jefesMañana.secundario}
            loading={loading.jefes} 
            error={error.jefes}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DatosDespliegueCard 
            {...datosDespliegue}
            error={error.despliegues}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DesplieguesCard 
            titulo="Despliegues Transitorios"
            despliegues={desplieguesActuales}
            loading={loading.despliegues}
            error={error.despliegues}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <DesplieguesCard 
            titulo="Despliegues Próximo Día"
            despliegues={desplieguesProximos}
            loading={loading.despliegues}
            error={error.despliegues}
          />
        </Grid>
      </Grid>

      {/* Mapa y Nivel de Patrullaje */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
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

      {/* Gráfica de Recursos por Hora */}
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <RecursosHoraChart 
            data={recursosHora}
            error={error.recursos}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
