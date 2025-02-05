import { Officer } from '../types';
import { 
  School as SchoolIcon,
  LocalHospital as LicenciaIcon,
  Security as ServicioIcon,
  DirectionsRun as OperativoIcon,
  Assignment as AsignacionIcon,
} from '@mui/icons-material';

export const mockOfficers: Officer[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    grado: 'Comisario',
    legajo: '12345',
    estado: 'activo',
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'González',
    grado: 'Subcomisario',
    legajo: '12346',
    estado: 'licencia',
  },
  {
    id: '3',
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    grado: 'Oficial Principal',
    legajo: '12347',
    estado: 'curso',
  },
  {
    id: '4',
    nombre: 'Ana',
    apellido: 'Martínez',
    grado: 'Oficial Inspector',
    legajo: '12348',
    estado: 'activo',
  },
  {
    id: '5',
    nombre: 'Luis',
    apellido: 'García',
    grado: 'Oficial Ayudante',
    legajo: '12349',
    estado: 'activo',
  },
  {
    id: '6',
    nombre: 'Patricia',
    apellido: 'López',
    grado: 'Oficial Subinspector',
    legajo: '12350',
    estado: 'comision',
  },
  {
    id: '7',
    nombre: 'Miguel',
    apellido: 'Sánchez',
    grado: 'Oficial',
    legajo: '12351',
    estado: 'activo',
  },
  {
    id: '8',
    nombre: 'Laura',
    apellido: 'Díaz',
    grado: 'Oficial',
    legajo: '12352',
    estado: 'activo',
  },
  {
    id: '9',
    nombre: 'Roberto',
    apellido: 'Fernández',
    grado: 'Oficial Principal',
    legajo: '12353',
    estado: 'licencia',
  },
  {
    id: '10',
    nombre: 'Silvia',
    apellido: 'Torres',
    grado: 'Oficial Inspector',
    legajo: '12354',
    estado: 'activo',
  },
  {
    id: '11',
    nombre: 'Diego',
    apellido: 'Ruiz',
    grado: 'Oficial Ayudante',
    legajo: '12355',
    estado: 'activo',
  },
  {
    id: '12',
    nombre: 'Marcela',
    apellido: 'Acosta',
    grado: 'Oficial Subinspector',
    legajo: '12356',
    estado: 'curso',
  },
  {
    id: '13',
    nombre: 'Javier',
    apellido: 'Morales',
    grado: 'Oficial',
    legajo: '12357',
    estado: 'activo',
  },
  {
    id: '14',
    nombre: 'Cecilia',
    apellido: 'Romero',
    grado: 'Oficial',
    legajo: '12358',
    estado: 'activo',
  },
  {
    id: '15',
    nombre: 'Gabriel',
    apellido: 'Peralta',
    grado: 'Oficial Principal',
    legajo: '12359',
    estado: 'activo',
  },
];

export const mockAssignments = [
  {
    id: '1',
    officerId: '1',
    startDate: '2025-02-05',
    endDate: '2025-02-05',
    type: 'jefeDia',
    status: 'asignado',
  },
  {
    id: '2',
    officerId: '4',
    startDate: '2025-02-05',
    endDate: '2025-02-05',
    type: 'jefeDia',
    status: 'asignado',
  },
  {
    id: '3',
    officerId: '5',
    startDate: '2025-02-05',
    endDate: '2025-02-05',
    type: 'control222',
    status: 'asignado',
  },
  {
    id: '4',
    officerId: '7',
    startDate: '2025-02-05',
    endDate: '2025-02-05',
    type: 'opEspeciales',
    status: 'asignado',
    description: 'AUF - Partido Nacional vs Peñarol',
  },
];

export const getOfficerStatusIcon = (estado: string) => {
  switch (estado) {
    case 'curso':
      return SchoolIcon;
    case 'licencia':
      return LicenciaIcon;
    case 'comision':
      return ServicioIcon;
    case 'opEspeciales':
      return OperativoIcon;
    default:
      return AsignacionIcon;
  }
};

export const getOfficerStatusColor = (estado: string) => {
  switch (estado) {
    case 'curso':
      return '#2196F3'; // Azul
    case 'licencia':
      return '#F44336'; // Rojo
    case 'comision':
      return '#FF9800'; // Naranja
    case 'activo':
      return '#4CAF50'; // Verde
    default:
      return '#9E9E9E'; // Gris
  }
};

export const getOfficerStatusLabel = (estado: string) => {
  switch (estado) {
    case 'curso':
      return 'En Curso';
    case 'licencia':
      return 'De Licencia';
    case 'comision':
      return 'En Comisión';
    case 'activo':
      return 'Activo';
    default:
      return 'Desconocido';
  }
};
