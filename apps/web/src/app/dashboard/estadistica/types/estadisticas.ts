export interface Detalle {
  tipoOperativo: string | null;
  cantidad: number;
}

export interface DetalleRegistro {
  id: number;
  tipoOperativo: string | null;
  cantidad: number;
  fecha: string;
}

export interface EstadisticaDetallada {
  id: number;
  detalles: DetalleRegistro[];
}

export interface EstadisticasPorSeccional extends EstadisticaDetallada {
  resumen: {
    valor: number;
    totalPpss: number;
  };
}

export interface EstadisticasPorBarrio extends EstadisticaDetallada {
  resumen: {
    valor: string;
    totalPpss: number;
  };
}

export interface EstadisticaPorHora {
  hora: number;
  totalPpss: number;
  porcentaje: number;
  detalles: Detalle[];
}
