import { Officer } from '../types';
import { 
  School as SchoolIcon,
  LocalHospital as LicenciaIcon,
  Security as ServicioIcon,
  Assignment as AsignacionIcon,
} from '@mui/icons-material';

export const mockOfficers: Officer[] = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    grado: 'Comisario',
    legajo: '12345',
    estado: 'activo',
    score: 85,
    shiftsThisMonth: 2,
    complianceHistory: 95,
    publicEventsCount: 3,
    unidad: 'direccionI'
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    grado: 'Subcomisario',
    legajo: '12346',
    estado: 'licencia',
    score: 78,
    shiftsThisMonth: 1,
    complianceHistory: 88,
    publicEventsCount: 2,
    unidad: 'direccionII_GEO'
  },
  {
    id: 3,
    nombre: 'Carlos',
    apellido: 'Rodríguez',
    grado: 'Oficial Principal',
    legajo: '12347',
    estado: 'curso',
    score: 92,
    shiftsThisMonth: 3,
    complianceHistory: 94,
    publicEventsCount: 4,
    unidad: 'direccionI'
  },
  {
    id: 4,
    nombre: 'Ana',
    apellido: 'Martínez',
    grado: 'Oficial Inspector',
    legajo: '12348',
    estado: 'activo',
    score: 88,
    shiftsThisMonth: 2,
    complianceHistory: 91,
    publicEventsCount: 3,
    unidad: 'direccionII_GEO'
  },
  {
    id: 5,
    nombre: 'Luis',
    apellido: 'García',
    grado: 'Oficial Ayudante',
    legajo: '12349',
    estado: 'activo',
    score: 82,
    shiftsThisMonth: 1,
    complianceHistory: 87,
    publicEventsCount: 2,
    unidad: 'direccionI'
  }
];

export function getOfficerStatusIcon(estado: Officer['estado']) {
  switch (estado) {
    case 'curso':
      return SchoolIcon;
    case 'licencia':
      return LicenciaIcon;
    case 'activo':
      return ServicioIcon;
    default:
      return AsignacionIcon;
  }
}

export function getOfficerStatusColor(estado: Officer['estado']) {
  switch (estado) {
    case 'curso':
      return 'info';
    case 'licencia':
      return 'error';
    case 'activo':
      return 'success';
    default:
      return 'warning';
  }
}

export function getOfficerStatusLabel(estado: Officer['estado']) {
  switch (estado) {
    case 'curso':
      return 'En Curso';
    case 'licencia':
      return 'De Licencia';
    case 'activo':
      return 'Activo';
    default:
      return 'Desconocido';
  }
}

export function getUnitLabel(unidad: Officer['unidad']) {
  switch (unidad) {
    case 'direccionI':
      return 'Dir. I';
    case 'direccionII_GEO':
      return 'Dir. II\nGEO';
    default:
      return 'N/A';
  }
}
