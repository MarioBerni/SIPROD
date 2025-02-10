import { Assignment, Officer } from '@/app/dashboard/escalafon-jefes/types';

export interface ChiefRankStatsProps {
  assignments: Assignment[];
  officers: Officer[];
}

export interface PendingOfficerAssignment {
  officer: Officer;
  assignments: Assignment[];
}

export interface UnavailableOfficer {
  officer: Officer;
  reason: string;
  startDate: Date;
  endDate: Date;
}
