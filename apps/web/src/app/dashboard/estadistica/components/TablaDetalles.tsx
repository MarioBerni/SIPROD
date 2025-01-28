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
  Typography
} from '@mui/material';
import { DetalleRegistro } from '../services/estadisticas.service';

interface TablaDetallesProps {
  titulo: string;
  detalles: DetalleRegistro[];
  tipo: 'seccional' | 'barrio';
}

export const TablaDetalles: React.FC<TablaDetallesProps> = ({ titulo, detalles, tipo }) => {
  return (
    <div className="mt-4">
      <Typography variant="h6" component="h3" className="mb-2">
        {titulo}
      </Typography>
      <TableContainer component={Paper}>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Nombre Operativo</TableCell>
              <TableCell align="right">Móviles</TableCell>
              <TableCell align="right">Motos</TableCell>
              <TableCell align="right">Hipos</TableCell>
              <TableCell align="right">Total PPSS</TableCell>
              <TableCell>{tipo === 'seccional' ? 'Seccional' : 'Barrios'}</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detalles.map((detalle, index) => (
              <TableRow key={index}>
                <TableCell>{detalle.nombreOperativo || '-'}</TableCell>
                <TableCell align="right">{detalle.moviles || 0}</TableCell>
                <TableCell align="right">{detalle.motos || 0}</TableCell>
                <TableCell align="right">{detalle.hipos || 0}</TableCell>
                <TableCell align="right">{detalle.totalPpss || 0}</TableCell>
                <TableCell>
                  {tipo === 'seccional'
                    ? detalle.seccional?.join(', ') || '-'
                    : detalle.barrios?.join(', ') || '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
