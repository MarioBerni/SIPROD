import { Router } from 'express';
import { 
  obtenerEstadisticasPorHorario,
  obtenerEstadisticasPorSeccional,
  obtenerEstadisticasPorBarrio 
} from '../controllers/estadisticas.controller';

const router = Router();

router.get('/horario', obtenerEstadisticasPorHorario);
router.get('/seccional', obtenerEstadisticasPorSeccional);
router.get('/barrio', obtenerEstadisticasPorBarrio);

export default router;
