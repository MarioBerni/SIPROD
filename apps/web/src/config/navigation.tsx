import {
  Dashboard as DashboardIcon,
  Assessment as AssessmentIcon,
  Assignment as AssignmentIcon,
  LabelImportant as LabelImportantIcon,
  LocationOn as LocationOnIcon,
  Settings as SettingsIcon,
  Person as PersonIcon,
  TableChart as TableChartIcon,
  Map as MapIcon,
} from '@mui/icons-material';

export interface NavigationItem {
  href: string;
  icon: typeof DashboardIcon;
  title: string;
  subItems?: NavigationSubItem[];
}

export interface NavigationSubItem {
  href: string;
  icon: typeof LocationOnIcon;
  title: string;
}

export const navigationConfig: NavigationItem[] = [
  {
    href: '/dashboard',
    icon: DashboardIcon,
    title: 'Panel Principal'
  },
  {
    href: '/dashboard/direccion-1',
    icon: LabelImportantIcon,
    title: 'Dirección I'
  },
  {
    href: '/dashboard/direccion-2',
    icon: LabelImportantIcon,
    title: 'Dirección II'
  },
  {
    href: '/dashboard/direccion-3',
    icon: LabelImportantIcon,
    title: 'Dirección III',
    subItems: [
      {
        href: '/dashboard/direccion-3/regional-este',
        icon: LocationOnIcon,
        title: 'Regional Este'
      },
      {
        href: '/dashboard/direccion-3/regional-norte',
        icon: LocationOnIcon,
        title: 'Regional Norte'
      }
    ]
  },
  {
    href: '/dashboard/geo',
    icon: LabelImportantIcon,
    title: 'GEO'
  },
  {
    href: '/dashboard/estadistica',
    icon: AssessmentIcon,
    title: 'Estadística'
  },
  {
    href: '/dashboard/resultados',
    icon: AssignmentIcon,
    title: 'Resultados'
  },
  {
    href: '/dashboard/reportes',
    icon: AssignmentIcon,
    title: 'Reportes'
  },
  {
    href: '/dashboard/administrador',
    icon: SettingsIcon,
    title: 'Administrador',
    subItems: [
      {
        href: '/dashboard/administrador/usuarios',
        icon: PersonIcon,
        title: 'Usuarios'
      },
      {
        href: '/dashboard/administrador/tabla-principal',
        icon: TableChartIcon,
        title: 'Tabla Principal'
      },
      {
        href: '/dashboard/administrador/mapas',
        icon: MapIcon,
        title: 'Mapas'
      }
    ]
  }
];
