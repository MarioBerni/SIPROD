export interface Polygon {
  name: string;
  orden: string;
  compromiso: string;
  coordinates: number[][];
}

export interface PolygonGroup {
  orden: string;
  polygons: Polygon[];
}
