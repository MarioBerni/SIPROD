import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Express } from 'express';
import swaggerDefinition from './definition';
import logger from '../utils/logger';

const options = {
  swaggerDefinition,
  apis: ['./src/routes/*.ts'], // Rutas donde buscar anotaciones de Swagger
};

const specs = swaggerJsdoc(options);

export const setupSwagger = (app: Express) => {
  // Servir la documentación de Swagger
  app.use(
    '/api-docs',
    swaggerUi.serve,
    swaggerUi.setup(specs, {
      explorer: true,
      customCss: '.swagger-ui .topbar { display: none }',
    })
  );

  // Endpoint para obtener la especificación OpenAPI en formato JSON
  app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });

  logger.info('Swagger documentation configured', {
    url: '/api-docs',
    specUrl: '/api-docs.json',
  });
};
