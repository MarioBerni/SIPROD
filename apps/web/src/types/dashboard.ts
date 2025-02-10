export interface RecursoDetalle {
  cantidad: number;
  icono: string;
}

export interface RecursosActuales {
  moviles: RecursoDetalle;
  motos: RecursoDetalle;
  hipos: RecursoDetalle;
  pieTierra: RecursoDetalle;
  choqueApostado: RecursoDetalle;
  choqueAlerta: RecursoDetalle;
  totalEfectivos: number;
}

export interface ResultadoOperativo {
  puntosControl: number;
  registros: {
    personas: number;
    autos: number;
    motos: number;
  };
  incautaciones: {
    autos: number;
    motos: number;
  };
  incautacionArmas: {
    fuego: number;
    blanca: number;
    cartucho: number;
  };
  incautacionSustancias: {
    cocaina: number;
    pastaBase: number;
    vegetal: number;
  };
}
