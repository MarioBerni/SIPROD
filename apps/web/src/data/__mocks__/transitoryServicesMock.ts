interface TransitoryService {
  id: string;
  title: string;
  timeRange: string;
  type: 'AUF' | 'FUBB' | 'ALLANAMIENTO' | 'OTROS';
}

export const mockTransitoryServices: TransitoryService[] = [
  {
    id: '1',
    title: 'AUF - NACIONAL vs PEÑAROL',
    timeRange: '15:30 a 00:30',
    type: 'AUF'
  },
  {
    id: '2',
    title: 'AUF - WANDERS vs CERRO',
    timeRange: '14:00 a 20:00',
    type: 'AUF'
  },
  {
    id: '3',
    title: 'FUBB - AGUADA vs NACIONAL',
    timeRange: '18:00 a 23:30',
    type: 'FUBB'
  },
  {
    id: '4',
    title: 'Apoyo ALLANAMIENTO DGRTID',
    timeRange: '07:00 a fin',
    type: 'ALLANAMIENTO'
  }
];
