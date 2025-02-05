'use client';

import React, { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
  Box,
  useTheme,
  Tooltip,
} from '@mui/material';
import { DetalleRegistro } from '../services/estadisticas.service';

interface DatoFormateado {
  nombre: string;
  valor: number | string | (number | string)[];
  totalPpss: number;
  detalles: DetalleRegistro[];
}

interface Props {
  datos: DatoFormateado[];
  tipo: 'seccional' | 'barrio';
}

interface DetalleConsolidado {
  valor: number | string;
  nombreOperativo: string;
  moviles: number;
  motos: number;
  hipos: number;
  totalPpss: number;
  operativos: Set<string>;
}

const ListaDetalles: React.FC<Props> = ({ datos, tipo }) => {
  const theme = useTheme();

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

  const detallesConsolidados = useMemo(() => {
    const consolidadosPorValor = new Map<string | number, DetalleConsolidado>();
    
    // Procesar cada registro
    datos.forEach(dato => {
      dato.detalles.forEach(detalle => {
        const valores = tipo === 'seccional' ? detalle.seccional : detalle.barrios;
        if (!valores || valores.length === 0) return;
        
        // Expandir el registro por cada valor (seccional o barrio)
        valores.forEach(valor => {
          const valorKey = String(valor);
          
          // Inicializar el consolidado si no existe
          if (!consolidadosPorValor.has(valorKey)) {
            consolidadosPorValor.set(valorKey, {
              valor,
              nombreOperativo: '',
              moviles: 0,
              motos: 0,
              hipos: 0,
              totalPpss: 0,
              operativos: new Set<string>()
            });
          }

          const consolidado = consolidadosPorValor.get(valorKey)!;
          
          // Distribuir los recursos proporcionalmente según el número de valores
          const factorDistribucion = 1 / valores.length;
          consolidado.moviles += (detalle.moviles || 0) * factorDistribucion;
          consolidado.motos += (detalle.motos || 0) * factorDistribucion;
          consolidado.hipos += (detalle.hipos || 0) * factorDistribucion;
          consolidado.totalPpss += (detalle.totalPpss || 0) * factorDistribucion;
          
          if (detalle.nombreOperativo) {
            consolidado.operativos.add(detalle.nombreOperativo);
          }
        });
      });
    });

    // Convertir el Map a array y formatear los datos
    return Array.from(consolidadosPorValor.entries())
      .map(([, consolidado]) => ({
        ...consolidado,
        // Redondear los valores numéricos
        moviles: Math.round(consolidado.moviles),
        motos: Math.round(consolidado.motos),
        hipos: Math.round(consolidado.hipos),
        totalPpss: Math.round(consolidado.totalPpss),
        nombreOperativo: Array.from(consolidado.operativos).sort().join(', ')
      }))
      .sort((a, b) => {
        // Ordenar por valor (seccional o barrio)
        if (typeof a.valor === 'number' && typeof b.valor === 'number') {
          return a.valor - b.valor;
        }
        return String(a.valor).localeCompare(String(b.valor));
      });
  }, [datos, tipo]);

  const getColumnTitle = () => {
    return tipo === 'seccional' ? 'Seccional' : 'Barrio';
  };


  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h6" gutterBottom>
        Detalles por {getColumnTitle()}
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
              <TableCell>{getColumnTitle()}</TableCell>
              <TableCell>Operativos</TableCell>
              <TableCell align="right">Móviles</TableCell>
              <TableCell align="right">Motos</TableCell>
              <TableCell align="right">Hipos</TableCell>
              <TableCell align="right">Total PPSS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detallesConsolidados.map((detalle) => (
              <TableRow key={detalle.valor}>
                <TableCell>{detalle.valor}</TableCell>
                <TableCell>
                  <Tooltip title={detalle.nombreOperativo} arrow placement="top">
                    <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                      {detalle.nombreOperativo}
                    </Typography>
                  </Tooltip>
                </TableCell>
                <TableCell align="right">{detalle.moviles}</TableCell>
                <TableCell align="right">{detalle.motos}</TableCell>
                <TableCell align="right">{detalle.hipos}</TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight="bold" color="primary">
                    {detalle.totalPpss}
                  </Typography>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default ListaDetalles;
