import { Router } from 'express';
import { obtenerEstadisticasPorHorario } from '../controllers/estadisticas.controller';

const router = Router();

router.get('/horario', obtenerEstadisticasPorHorario);

export default router;
