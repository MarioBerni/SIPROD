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
    const consolidadosPorGrupo = datos.map(dato => {
      const consolidadosGrupo = new Map<string, DetalleConsolidado>();
      
      dato.detalles.forEach(detalle => {
        const nombreOperativo = detalle.nombreOperativo || 'Sin nombre';
        
        if (!consolidadosGrupo.has(nombreOperativo)) {
          consolidadosGrupo.set(nombreOperativo, {
            nombreOperativo,
            moviles: 0,
            motos: 0,
            hipos: 0,
            totalPpss: 0,
            valores: Array.isArray(dato.valor) ? dato.valor : [dato.valor]
          });
        }

        const consolidado = consolidadosGrupo.get(nombreOperativo)!;
        consolidado.moviles = (detalle.moviles || 0);
        consolidado.motos = (detalle.motos || 0);
        consolidado.hipos = (detalle.hipos || 0);
        consolidado.totalPpss = (detalle.totalPpss || 0);

        // Agregar valores de seccional o barrios si existen
        if (tipo === 'seccional' && detalle.seccional) {
          detalle.seccional.forEach(sec => {
            if (!consolidado.valores.includes(sec)) {
              consolidado.valores.push(sec);
            }
          });
        } else if (tipo === 'barrio' && detalle.barrios) {
          detalle.barrios.forEach(barrio => {
            if (!consolidado.valores.includes(barrio)) {
              consolidado.valores.push(barrio);
            }
          });
        }
      });

      return Array.from(consolidadosGrupo.values());
    });

    const consolidadosFinal = new Map<string, DetalleConsolidado>();
    
    consolidadosPorGrupo.flat().forEach(detalle => {
      if (!consolidadosFinal.has(detalle.nombreOperativo)) {
        consolidadosFinal.set(detalle.nombreOperativo, {
          ...detalle,
          valores: []
        });
      }

      const consolidado = consolidadosFinal.get(detalle.nombreOperativo)!;
      consolidado.moviles = Math.max(consolidado.moviles, detalle.moviles);
      consolidado.motos = Math.max(consolidado.motos, detalle.motos);
      consolidado.hipos = Math.max(consolidado.hipos, detalle.hipos);
      consolidado.totalPpss = Math.max(consolidado.totalPpss, detalle.totalPpss);
      
      detalle.valores.forEach(valor => {
        if (!consolidado.valores.includes(valor)) {
          consolidado.valores.push(valor);
        }
      });
    });

    return Array.from(consolidadosFinal.values());
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
