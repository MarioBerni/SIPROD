'use client';

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Collapse,
  Stack,
  IconButton,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { TransitoryService } from '@/app/dashboard/escalafon-jefes/types';

interface TransitoryServicesListProps {
  services?: TransitoryService[];
}

// Datos de ejemplo con diferentes fechas y horas
const MOCK_SERVICES: TransitoryService[] = [
  {
    id: 1,
    title: 'AUF - NACIONAL vs PEÑAROL',
    date: new Date('2025-02-10T15:30:00'),
    startTime: '15:30',
    endTime: '19:30'
  },
  {
    id: 2,
    title: 'AUF - WANDERS vs CERRO',
    date: new Date('2025-02-11T14:00:00'),
    startTime: '14:00',
    endTime: '18:00'
  },
  {
    id: 3,
    title: 'FUBB - AGUADA vs NACIONAL',
    date: new Date('2025-02-12T18:00:00'),
    startTime: '18:00',
    endTime: '22:00'
  },
  {
    id: 4,
    title: 'Apoyo ALLANAMIENTO DGRTID',
    date: new Date('2025-02-13T07:00:00'),
    startTime: '07:00',
    endTime: '13:00'
  }
];

// Valores por defecto para cada índice
const DEFAULT_START_TIMES = ['08:00', '14:00', '16:00', '19:00'];
const DEFAULT_END_TIMES = ['12:00', '18:00', '20:00', '23:00'];

export function TransitoryServicesList({ services }: TransitoryServicesListProps) {
  const [isTableOpen, setIsTableOpen] = useState(false);
  const displayServices = services || MOCK_SERVICES;

  const handleTableToggle = () => {
    setIsTableOpen(!isTableOpen);
  };

  const getDefaultValue = (index: number, array: string[], fallback: string) => {
    return array[index % array.length] || fallback;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-UY', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  return (
    <Paper sx={{ bgcolor: 'background.paper', borderRadius: 1 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          p: 2,
          cursor: 'pointer',
          '&:hover': { bgcolor: 'action.hover' }
        }}
        onClick={handleTableToggle}
      >
        <EventIcon color="primary" />
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          Lista de Servicios transitorios previstos
        </Typography>
        <IconButton size="small" edge="end">
          {isTableOpen ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Stack>

      <Collapse in={isTableOpen} timeout="auto" unmountOnExit>
        <TableContainer sx={{ maxHeight: 400 }}>
          <Table size="small" stickyHeader>
            <TableHead>
              <TableRow>
                <TableCell>Operativo</TableCell>
                <TableCell>Fecha</TableCell>
                <TableCell>Hora inicio</TableCell>
                <TableCell>Hora fin</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {displayServices.map((service, index) => (
                <TableRow
                  key={service.id}
                  sx={{
                    bgcolor: index % 2 === 0 ? 'action.hover' : 'background.paper',
                    '&:hover': { bgcolor: 'action.selected' }
                  }}
                >
                  <TableCell>
                    <Typography variant="body2">{service.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {formatDate(service.date)}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {service.startTime || getDefaultValue(index, DEFAULT_START_TIMES, '08:00')}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {service.endTime || getDefaultValue(index, DEFAULT_END_TIMES, '12:00')}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
              {displayServices.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">
                    <Typography variant="body2" color="text.secondary">
                      No hay servicios transitorios disponibles
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
}
