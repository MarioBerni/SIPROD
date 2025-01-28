import { Departamento } from '@/components/tabla-principal/types/generated';

export enum Zona {
  MONTEVIDEO = 'MONTEVIDEO',
  METROPOLITANA = 'METROPOLITANA',
  INTERIOR = 'INTERIOR',
}

export const ZonaLabel: Record<Zona, string> = {
  [Zona.MONTEVIDEO]: 'Montevideo',
  [Zona.METROPOLITANA]: 'Metropolitana',
  [Zona.INTERIOR]: 'Interior',
};

export const DepartamentosPorZona: Record<Zona, Departamento[]> = {
  [Zona.MONTEVIDEO]: [Departamento.MONTEVIDEO],
  [Zona.METROPOLITANA]: [
    Departamento.MONTEVIDEO,
    Departamento.SAN_JOSE,
    Departamento.CANELONES,
  ],
  [Zona.INTERIOR]: [
    Departamento.ARTIGAS,
    Departamento.CERRO_LARGO,
    Departamento.COLONIA,
    Departamento.DURAZNO,
    Departamento.FLORES,
    Departamento.FLORIDA,
    Departamento.LAVALLEJA,
    Departamento.MALDONADO,
    Departamento.PAYSANDU,
    Departamento.RIO_NEGRO,
    Departamento.RIVERA,
    Departamento.ROCHA,
    Departamento.SALTO,
    Departamento.SORIANO,
    Departamento.TACUAREMBO,
    Departamento.TREINTA_Y_TRES,
  ],
};
