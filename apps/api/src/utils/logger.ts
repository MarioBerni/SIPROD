import winston from 'winston';
import { Request, Response, NextFunction } from 'express';
import { TransformableInfo } from 'logform';
import { config } from '../config';

const { combine, timestamp, printf, colorize } = winston.format;

interface LogInfo extends TransformableInfo {
  timestamp?: string;
  [key: string]: unknown;
}

// Formato personalizado
const logFormat = printf(({ level, message, timestamp = new Date().toISOString(), ...metadata }: LogInfo) => {
  let msg = `${timestamp} [${level}] ${message}`;
  
  if (Object.keys(metadata).length > 0) {
    msg += ` ${JSON.stringify(metadata)}`;
  }
  
  return msg;
});

// Configuración del logger
const logger = winston.createLogger({
  level: config.logLevel || 'info',
  format: combine(
    timestamp(),
    logFormat
  ),
  transports: [
    // Consola con colores en desarrollo
    new winston.transports.Console({
      format: combine(
        colorize(),
        timestamp(),
        logFormat
      ),
    }),
    // Archivo para todos los logs
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Archivo separado para errores
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Métodos de logging tipados
const log = {
  error: (message: string, meta?: Record<string, unknown>) => logger.error(message, meta),
  warn: (message: string, meta?: Record<string, unknown>) => logger.warn(message, meta),
  info: (message: string, meta?: Record<string, unknown>) => logger.info(message, meta),
  debug: (message: string, meta?: Record<string, unknown>) => logger.debug(message, meta),
};

// Middleware para logging de API
export const apiLogger = (req: Request, res: Response, next: NextFunction): void => {
  const start = Date.now();
  
  // Usar el evento 'finish' de la respuesta
  res.on('finish', () => {
    const duration = Date.now() - start;
    
    log.info('API Request', {
      method: req.method,
      url: req.originalUrl || req.url,
      status: res.statusCode,
      duration,
      ip: req.ip,
      userAgent: req.headers['user-agent'],
    });
  });
  
  next();
};

export default log;
