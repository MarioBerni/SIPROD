
export interface TableData {
  nombre: string;
  cantidades: number[];
  horaInicio: string;
  horaFin: string;
  secciones: string;
}

export interface ColumnWidths {
  name: number;
  image: number;
  time: number;
  secc: number;
}

export interface PdfMargins {
  top: number;
  bottom: number;
  left: number;
  right: number;
}

export interface HeaderCell {
  width: number;
  text: string;
  image?: string;
}
