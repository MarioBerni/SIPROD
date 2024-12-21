import { SwaggerDefinition } from 'swagger-jsdoc';

const swaggerDefinition: SwaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'SIPROD API',
    version: '1.0.0',
    description: 'API de SIPROD (Sistema de Gestión de Resultados Policiales y Recursos)',
    license: {
      name: 'Private',
      url: 'https://siprod.uy',
    },
    contact: {
      name: 'Equipo SIPROD',
      url: 'https://siprod.uy',
      email: 'soporte@siprod.uy',
    },
  },
  servers: [
    {
      url: 'http://179.27.203.219:4000',
      description: 'Servidor de Producción',
    },
    {
      url: 'http://localhost:4000',
      description: 'Servidor de Desarrollo',
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
      },
    },
    schemas: {
      Error: {
        type: 'object',
        properties: {
          code: {
            type: 'string',
          },
          message: {
            type: 'string',
          },
        },
      },
      SuccessResponse: {
        type: 'object',
        properties: {
          success: {
            type: 'boolean',
          },
          data: {
            type: 'object',
          },
        },
      },
    },
  },
  security: [
    {
      bearerAuth: [],
    },
  ],
};

export default swaggerDefinition;
