'use client';

import {
  Card,
  CardHeader,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from '@mui/material';

interface OperativoData {
  operativo: string;
  moviles: number;
  ssoo: number;
  motos: number;
  hipos: number;
  pieTierra: number;
  totalFFPP: number;
  horaInicio: string;
  horaFin: string;
  seccional: string;
}

interface TablaOperativosCardProps {
  datos: OperativoData[];
}

export const TablaOperativosCard = ({ datos }: TablaOperativosCardProps) => {
  return (
    <Card>
      <CardHeader
        title="Operativos Actuales"
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          '& .MuiCardHeader-title': {
            fontSize: '1.2rem',
            fontWeight: 'bold'
          }
        }}
      />
      <CardContent>
        <TableContainer component={Paper} sx={{ maxHeight: 440 }}>
          <Table stickyHeader size="small">
            <TableHead>
              <TableRow>
                <TableCell>OPERATIVOS</TableCell>
                <TableCell align="center">MOVILES</TableCell>
                <TableCell align="center">SSOO</TableCell>
                <TableCell align="center">MOTOS</TableCell>
                <TableCell align="center">HIPOS</TableCell>
                <TableCell align="center">PIE TIERRA</TableCell>
                <TableCell align="center">TOTAL FFPP</TableCell>
                <TableCell align="center">HORA INICIO</TableCell>
                <TableCell align="center">HORA FIN</TableCell>
                <TableCell align="center">SECCIONAL</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {datos.map((row, index) => (
                <TableRow key={index} hover>
                  <TableCell component="th" scope="row" sx={{ whiteSpace: 'nowrap' }}>
                    {row.operativo}
                  </TableCell>
                  <TableCell align="center">{row.moviles}</TableCell>
                  <TableCell align="center">{row.ssoo}</TableCell>
                  <TableCell align="center">{row.motos}</TableCell>
                  <TableCell align="center">{row.hipos}</TableCell>
                  <TableCell align="center">{row.pieTierra}</TableCell>
                  <TableCell align="center">{row.totalFFPP}</TableCell>
                  <TableCell align="center">{row.horaInicio}</TableCell>
                  <TableCell align="center">{row.horaFin}</TableCell>
                  <TableCell align="center">{row.seccional}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};
