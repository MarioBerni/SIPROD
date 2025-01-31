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
  nombreOperativo: string;
  moviles: number;
  motos: number;
  hipos: number;
  totalPpss: number;
  valores: (number | string)[];
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
    
    datos.forEach(dato => {
      dato.detalles.forEach(detalle => {
        const valores = tipo === 'seccional' ? detalle.seccional : detalle.barrios;
        if (!valores || valores.length === 0) return;
        
        valores.forEach(valor => {
          const valorKey = String(valor);
          if (!consolidadosPorValor.has(valorKey)) {
            consolidadosPorValor.set(valorKey, {
              nombreOperativo: '',
              moviles: 0,
              motos: 0,
              hipos: 0,
              totalPpss: 0,
              valores: [valor],
              operativos: new Set<string>()
            });
          }

          const consolidado = consolidadosPorValor.get(valorKey)!;
          consolidado.moviles += (detalle.moviles || 0);
          consolidado.motos += (detalle.motos || 0);
          consolidado.hipos += (detalle.hipos || 0);
          consolidado.totalPpss += (detalle.totalPpss || 0);
          
          if (detalle.nombreOperativo) {
            consolidado.operativos.add(detalle.nombreOperativo);
          }
        });
      });
    });

    // Convertir el Map a array y formatear los nombres de operativos
    return Array.from(consolidadosPorValor.values()).map(consolidado => {
      const nombresOperativos = Array.from(consolidado.operativos).sort().join(', ');
      return {
        ...consolidado,
        nombreOperativo: nombresOperativos || 'Sin nombre',
        operativos: consolidado.operativos // Mantener el Set para futuros usos si es necesario
      };
    });
  }, [datos, tipo]);

  const getColumnTitle = () => {
    return tipo === 'seccional' ? 'Seccional' : 'Barrio';
  };

  const renderValores = (valores: (number | string)[]) => {
    const sortedValues = [...valores].sort((a, b) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
      }
      return String(a).localeCompare(String(b));
    });

    const displayText = sortedValues.join(', ');
    
    if (displayText.length > 50) {
      return (
        <Tooltip title={displayText} arrow placement="top">
          <Typography variant="body2" noWrap>
            {displayText.substring(0, 47) + '...'}
          </Typography>
        </Tooltip>
      );
    }
    
    return displayText;
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
              <TableCell>Operativo</TableCell>
              <TableCell>{getColumnTitle()}</TableCell>
              <TableCell align="right">Móviles</TableCell>
              <TableCell align="right">Motos</TableCell>
              <TableCell align="right">Hipos</TableCell>
              <TableCell align="right">Total PPSS</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {detallesConsolidados.map((detalle, index) => (
              <TableRow key={`${detalle.nombreOperativo}-${index}`}>
                <TableCell>
                  <Typography variant="body2" fontWeight="medium">
                    {detalle.nombreOperativo}
                  </Typography>
                </TableCell>
                <TableCell>{renderValores(detalle.valores)}</TableCell>
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
