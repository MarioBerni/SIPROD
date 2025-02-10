import { AssignmentType } from '@/app/dashboard/escalafon-jefes/types';

export const UNIT_COLORS: Record<AssignmentType, { bg: string; text: string }> = {
  direccionI: {
    bg: '#1565C0',
    text: '#ffffff'
  },
  direccionII_GEO: {
    bg: '#2E7D32',
    text: '#ffffff'
  }
};
