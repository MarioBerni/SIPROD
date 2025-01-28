'use client';

import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  useTheme
} from '@mui/material';
import { EstadisticaPorHora } from '../services/estadisticas.service';

interface Props {
  datos: EstadisticaPorHora[];
  horaSeleccionada: number | null;
}

const TablaResumenHorario: React.FC<Props> = ({ datos, horaSeleccionada }) => {
  const theme = useTheme();
  const datosFiltrados = horaSeleccionada !== null
    ? datos.filter(d => d.hora === horaSeleccionada)
    : datos;

  const tableStyles = {
    '& .MuiTableCell-head': {
      backgroundColor: theme.palette.primary.main,
      color: theme.palette.primary.contrastText,
      fontWeight: 'bold',
    },
    '& .MuiTableRow-root': {
      '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
      },
      '&:hover': {
        backgroundColor: theme.palette.action.selected,
      },
    },
    '& .MuiTableCell-body': {
      fontSize: '0.875rem',
    },
  };

  return (
    <div className="mt-4">
      <Typography variant="h6" component="h3" className="mb-2">
        {horaSeleccionada !== null 
          ? `Detalles para la hora ${horaSeleccionada}:00`
          : 'Resumen por hora'}
      </Typography>
      <TableContainer 
        component={Paper} 
        sx={{ 
          boxShadow: theme.shadows[2],
          borderRadius: '8px',
          overflow: 'hidden'
        }}
      >
        <Table size="small" sx={tableStyles}>
          <TableHead>
            <TableRow>
              <TableCell>Hora</TableCell>
              <TableCell align="right">Móviles</TableCell>
              <TableCell align="right">Motos</TableCell>
              <TableCell align="right">Hipos</TableCell>
              <TableCell align="right">Total PPSS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {datosFiltrados.map((dato) => (
              <TableRow key={dato.hora}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {dato.hora}:00
                  </Typography>
                </TableCell>
                <TableCell align="right">{dato.totalMoviles || 0}</TableCell>
                <TableCell align="right">{dato.totalMotos || 0}</TableCell>
                <TableCell align="right">{dato.totalHipos || 0}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {dato.totalPpss || 0}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default TablaResumenHorario;
