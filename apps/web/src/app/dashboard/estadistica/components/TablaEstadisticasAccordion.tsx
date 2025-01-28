'use client';

import React from 'react';
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Box,
  useTheme,
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TableChartIcon from '@mui/icons-material/TableChart';
import { 
  EstadisticaPorHora, 
  EstadisticasPorSeccional,
  EstadisticasPorBarrio 
} from '../services/estadisticas.service';
import TablaResumenHorario from './TablaResumenHorario';
import ListaDetalles from './ListaDetalles';

interface Props {
  datosHorarios: EstadisticaPorHora[];
  datosSeccionales: EstadisticasPorSeccional[];
  datosBarrios: EstadisticasPorBarrio[];
  horaSeleccionada: number | null;
}

const TablaEstadisticasAccordion: React.FC<Props> = ({
  datosHorarios,
  datosSeccionales,
  datosBarrios,
  horaSeleccionada,
}) => {
  const theme = useTheme();

  const accordionStyle = {
    mb: 2,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[2],
    '&:before': {
      display: 'none',
    },
    borderRadius: '8px',
    overflow: 'hidden',
  };

  const headerStyle = {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    minHeight: 56,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
    '& .MuiAccordionSummary-expandIconWrapper': {
      color: theme.palette.primary.contrastText,
    },
  };

  const iconStyle = {
    color: theme.palette.primary.contrastText,
    mr: 2,
  };

  return (
    <Box sx={{ mt: 4, mb: 4 }}>
      <Accordion sx={accordionStyle}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          sx={headerStyle}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TableChartIcon sx={iconStyle} />
            <Typography variant="subtitle1" fontWeight="medium">
              Resumen por Horario
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <TablaResumenHorario
            datos={datosHorarios}
            horaSeleccionada={horaSeleccionada}
          />
        </AccordionDetails>
      </Accordion>

      {datosSeccionales.length > 0 && (
        <Accordion sx={accordionStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={headerStyle}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TableChartIcon sx={iconStyle} />
              <Typography variant="subtitle1" fontWeight="medium">
                Detalle por Seccional
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <ListaDetalles 
              datos={datosSeccionales.map(d => ({
                nombre: `Seccional ${d.resumen.valor}`,
                valor: d.resumen.valor,
                totalPpss: d.resumen.totalPpss,
                detalles: d.detalles
              }))} 
              tipo="seccional" 
            />
          </AccordionDetails>
        </Accordion>
      )}

      {datosBarrios.length > 0 && (
        <Accordion sx={accordionStyle}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            sx={headerStyle}
          >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <TableChartIcon sx={iconStyle} />
              <Typography variant="subtitle1" fontWeight="medium">
                Detalle por Barrio
              </Typography>
            </Box>
          </AccordionSummary>
          <AccordionDetails>
            <ListaDetalles 
              datos={datosBarrios.map(d => ({
                nombre: d.resumen.valor,
                valor: d.resumen.valor,
                totalPpss: d.resumen.totalPpss,
                detalles: d.detalles
              }))} 
              tipo="barrio" 
            />
          </AccordionDetails>
        </Accordion>
      )}
    </Box>
  );
};

export default TablaEstadisticasAccordion;
