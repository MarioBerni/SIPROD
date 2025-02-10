import { Assignment, Officer } from "@/app/dashboard/escalafon-jefes/types";

// Datos mock de oficiales
export const mockChiefs: Officer[] = [
  {
    id: 1,
    nombre: 'Juan',
    apellido: 'Pérez',
    grado: 'Capitán',
    legajo: '12345',
    estado: 'activo',
    score: 85,
    shiftsThisMonth: 2,
    complianceHistory: 95,
    requestedDates: [new Date('2025-02-15'), new Date('2025-02-20')],
    approvedDates: [new Date('2025-02-15')],
    publicEventsCount: 3,
    unidad: 'direccionI'
  },
  {
    id: 2,
    nombre: 'María',
    apellido: 'González',
    grado: 'Capitán',
    legajo: '12346',
    estado: 'activo',
    score: 90,
    shiftsThisMonth: 1,
    complianceHistory: 98,
    requestedDates: [new Date('2025-02-18')],
    approvedDates: [new Date('2025-02-18')],
    publicEventsCount: 2,
    unidad: 'direccionII_GEO'
  },
  {
    id: 3,
    nombre: "Carlos",
    apellido: "González",
    grado: "Capitán",
    legajo: "12347",
    score: 92,
    lastShift: new Date('2025-02-01'),
    shiftsThisMonth: 1,
    complianceHistory: 95,
    estado: "licencia",
    publicEventsCount: 2,
    unidad: 'direccionI'
  },
  {
    id: 4,
    nombre: "Ana",
    apellido: "Martínez",
    grado: "Tte. 1°",
    legajo: "12348",
    score: 88,
    lastShift: new Date('2025-02-03'),
    shiftsThisMonth: 2,
    complianceHistory: 90,
    estado: "activo",
    publicEventsCount: 4,
    unidad: 'direccionII_GEO'
  },
  {
    id: 8,
    nombre: 'Laura',
    apellido: 'Sánchez',
    grado: 'Tte. 1°',
    legajo: '12352',
    estado: 'activo',
    score: 88,
    shiftsThisMonth: 3,
    complianceHistory: 92,
    requestedDates: [
      new Date('2025-02-10'),
      new Date('2025-02-15'),
      new Date('2025-02-28')
    ],
    approvedDates: [new Date('2025-02-15')],
    publicEventsCount: 5,
    unidad: 'direccionI'
  },
  {
    id: 9,
    nombre: 'Ricardo',
    apellido: 'Mendoza',
    grado: 'Teniente',
    legajo: '12353',
    estado: 'activo',
    score: 95,
    shiftsThisMonth: 1,
    complianceHistory: 97,
    requestedDates: [new Date('2025-02-12')],
    approvedDates: [],
    publicEventsCount: 8,
    unidad: 'direccionII_GEO'
  },
];

// Datos mock de turnos
export const mockShifts: Assignment[] = [
  {
    id: 1,
    officerId: 1,
    date: new Date('2025-02-10'),
    status: 'confirmado',
    type: 'direccionI',
    isSpecialService222: false
  },
  {
    id: 2,
    officerId: 2,
    date: new Date('2025-02-05'),
    status: 'completado',
    type: 'direccionII_GEO',
    isSpecialService222: false
  },
  {
    id: 3,
    officerId: 4,
    date: new Date('2025-02-03'),
    status: 'completado',
    type: 'direccionII_GEO',
    isSpecialService222: false
  }
];

// Función para calcular el score de un oficial
export const calculateChiefScore = (officer: Officer): number => {
  // Implementar lógica de cálculo de score
  return officer.score;
};

// Función para obtener el siguiente ID disponible
export const getNextId = (): number => {
  const maxId = Math.max(...mockShifts.map(s => s.id));
  return maxId + 1;
};
