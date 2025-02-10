'use client';

import { Card, CardContent, CardHeader, Typography, Stack, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getChiefRankStatsCardStyles } from './ChiefRankStatsCard.styles';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TodayIcon from '@mui/icons-material/Today';
import UpdateIcon from '@mui/icons-material/Update';
import { ChiefRankStatsProps, PendingOfficerAssignment, UnavailableOfficer } from './types';
import { PendingAssignmentsList } from './components/PendingAssignmentsList';
import { UnavailableOfficersList } from './components/UnavailableOfficersList';
import { useMemo } from 'react';
import { mockChiefs } from '@/data/__mocks__/chiefsRankMock';

interface SectionProps {
  title: string;
  icon: React.ElementType;
  count: number;
  sectionStyle: 'pendingSection' | 'currentSection' | 'upcomingSection';
  styles: ReturnType<typeof getChiefRankStatsCardStyles>;
  children?: React.ReactNode;
}

const Section = ({ title, icon: Icon, count, sectionStyle, styles, children }: SectionProps) => (
  <Box sx={{ ...styles.section, ...(styles[sectionStyle] || {}) }}>
    <Stack spacing={2}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Icon />
        <Typography variant="subtitle1">
          {title}
        </Typography>
        <Typography variant="caption" sx={{ ml: 'auto' }}>
          ({count})
        </Typography>
      </Stack>
      {children || (count === 0 && (
        <Typography sx={styles.emptyMessage}>
          No hay servicios en esta categoría
        </Typography>
      ))}
    </Stack>
  </Box>
);

export const ChiefRankStatsCard = ({ assignments, officers }: ChiefRankStatsProps) => {
  const theme = useTheme();
  const styles = getChiefRankStatsCardStyles(theme);

  const officerAssignments = useMemo(() => {
    const assignmentMap = new Map<number, PendingOfficerAssignment>();

    assignments.forEach(assignment => {
      const officer = officers.find(o => o.id === assignment.officerId);
      if (officer) {
        if (!assignmentMap.has(officer.id)) {
          assignmentMap.set(officer.id, {
            officer,
            assignments: []
          });
        }
        assignmentMap.get(officer.id)?.assignments.push(assignment);
      }
    });

    return Array.from(assignmentMap.values());
  }, [assignments, officers]);

  // Datos de ejemplo para oficiales no disponibles
  const unavailableOfficers: UnavailableOfficer[] = [
    {
      officer: mockChiefs.find(chief => chief.nombre === 'María') || {
        ...mockChiefs[0],
        id: 1,
        nombre: 'María',
        apellido: 'González',
        grado: 'Capitán',
      },
      reason: 'Licencia anual',
      startDate: new Date('2025-02-02'),
      endDate: new Date('2025-02-20'),
    },
    {
      officer: mockChiefs.find(chief => chief.nombre === 'Juan') || {
        ...mockChiefs[0],
        id: 2,
        nombre: 'Juan',
        apellido: 'Pérez',
        grado: 'Capitán',
      },
      reason: 'Curso Negociadores',
      startDate: new Date('2025-02-15'),
      endDate: new Date('2025-03-03'),
    },
  ];

  const currentDate = new Date();

  const upcomingAssignments = assignments.filter(
    assignment => assignment.date > currentDate
  );

  return (
    <Card sx={styles.card}>
      <CardHeader
        title="Estadísticas"
        subheader="Resumen de asignaciones"
        sx={styles.cardHeader}
      />
      <CardContent sx={styles.cardContent}>
        <Section
          title="No disponibles"
          icon={AccessTimeIcon}
          count={unavailableOfficers.length}
          sectionStyle="pendingSection"
          styles={styles}
        >
          <UnavailableOfficersList unavailableOfficers={unavailableOfficers} />
        </Section>
        <Section
          title="Designaciones"
          icon={TodayIcon}
          count={officerAssignments.length}
          sectionStyle="currentSection"
          styles={styles}
        >
          <PendingAssignmentsList pendingAssignments={officerAssignments} />
        </Section>
        <Section
          title="Próximos Servicios"
          icon={UpdateIcon}
          count={upcomingAssignments.length}
          sectionStyle="upcomingSection"
          styles={styles}
        />
      </CardContent>
    </Card>
  );
};
