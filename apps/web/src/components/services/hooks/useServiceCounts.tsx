'use client';

import { useMemo } from 'react';
import { useLicenseManagement } from '../dialog/hooks/useLicenseManagement';
import { useCourseManagement } from '../dialog/hooks/useCourseManagement';
import { useDutyDayManagement } from '../dialog/hooks/useDutyDayManagement';

export interface ServiceCounts {
  licencia: number;
  cursos: number;
  jefeDia: number;
  control222: number;
  opEspeciales: number;
  otros: number;
}

export const useServiceCounts = () => {
  const { getActiveLicenses } = useLicenseManagement();
  const { getActiveCourses } = useCourseManagement();
  const { getActiveDutyDays } = useDutyDayManagement();

  const counts = useMemo(() => ({
    licencia: getActiveLicenses().length,
    cursos: getActiveCourses().length,
    jefeDia: getActiveDutyDays().length,
    opEspeciales: 0,
    control222: 0,
    otros: 0,
  }), [
    getActiveLicenses,
    getActiveCourses,
    getActiveDutyDays,
  ]);

  return counts;
};
