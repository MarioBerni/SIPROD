# Tabla Principal

## Descripción General
Sistema central para el registro y gestión de operativos y patrullajes, con capacidad de seguimiento en tiempo real y generación de reportes detallados.

## Estructura de Datos

### Modelo Principal
```typescript
interface Operativo {
  id: string;
  titulo: string;
  tipo: TipoOperativo;
  fechaInicio: Date;
  fechaFin: Date;
  estado: EstadoOperativo;
  unidad: UnidadPolicial;
  recursos: {
    moviles: Movil[];
    personal: Personal[];
    otros: RecursoAdicional[];
  };
  ubicacion: {
    jurisdiccion: string;
    coordenadas: Coordenadas[];
    poligono?: GeoJSON;
  };
  metadata: {
    createdBy: string;
    updatedBy: string;
    lastUpdate: Date;
    version: number;
  };
}

type TipoOperativo = 'PATRULLAJE' | 'OPERATIVO_ESPECIAL' | 'EMERGENCIA' | 'PLANIFICADO';
type EstadoOperativo = 'PLANIFICACION' | 'EN_CURSO' | 'FINALIZADO' | 'CANCELADO';
```

## Funcionalidades Principales

### Gestión de Operativos
- Creación y edición
- Seguimiento en tiempo real
- Control de recursos
- Historial de cambios

### Control de Recursos
- Asignación de móviles
- Gestión de personal
- Equipamiento especial
- Disponibilidad actual

### Geolocalización
- Definición de jurisdicciones
- Creación de polígonos
- Puntos de control
- Zonas de cobertura

## Roles y Permisos

### Administrador
- Control total del sistema
- Gestión de configuraciones
- Auditoría completa
- Reportes avanzados

### Directores / Jefes
- Visualización por unidad
- Reportes específicos
- Estadísticas de recursos
- Control de personal

### Usuarios Operativos
- Consulta de operativos
- Descarga de reportes
- Vista de recursos
- Información básica

## Sistema de Validaciones

### Validaciones de Datos
```typescript
interface ValidacionOperativo {
  tipo: 'RECURSOS' | 'FECHAS' | 'UBICACION' | 'PERSONAL';
  resultado: boolean;
  errores: string[];
  advertencias: string[];
  sugerencias: string[];
}

const REGLAS_VALIDACION = {
  fechas: {
    inicioAnteriorFin: true,
    duracionMaxima: '72h',
    planificacionMinima: '24h'
  },
  recursos: {
    personalMinimo: 2,
    movilesRequeridos: true,
    equipamientoNecesario: ['radio', 'gps']
  },
  ubicacion: {
    dentroJurisdiccion: true,
    poligonoValido: true,
    puntosDemarcados: true
  }
};
```

### Control de Conflictos
- Solapamiento de recursos
- Disponibilidad de personal
- Cobertura territorial
- Capacidad operativa

## Interacción con Otras Páginas

### Dashboard
- KPIs operativos
- Estado actual
- Recursos desplegados
- Alertas importantes

### Mapas
- Visualización geográfica
- Zonas de cobertura
- Recursos en terreno
- Puntos críticos

### Despliegues PDF
- Generación de reportes
- Estadísticas operativas
- Resumen de recursos
- Documentación oficial

## Aspectos Técnicos

### Optimización
```typescript
interface ConfiguracionRendimiento {
  actualizacionAutomatica: {
    intervalo: number;
    prioridad: 'ALTA' | 'MEDIA' | 'BAJA';
    campos: string[];
  };
  cache: {
    duracion: number;
    tipo: 'MEMORIA' | 'REDIS';
    invalidacionAutomatica: boolean;
  };
  paginacion: {
    elementosPorPagina: number;
    maxPaginas: number;
    ordenamiento: string[];
  };
}
```

### Auditoría
- Registro de acciones
- Trazabilidad completa
- Control de versiones
- Histórico de cambios

### Seguridad
- Control de acceso
- Encriptación de datos
- Validación de permisos
- Registro de actividad

## Reportes y Estadísticas

### Informes Operativos
- Resumen diario/semanal
- Análisis de recursos
- Cobertura territorial
- Eficiencia operativa

### Métricas de Rendimiento
- Tiempo de respuesta
- Uso de recursos
- Efectividad operativa
- Cumplimiento de objetivos

## Consideraciones Futuras

### Mejoras Planificadas
- Integración con IA
- Predicción de recursos
- Optimización automática
- Análisis predictivo

### Escalabilidad
- Nuevos tipos de operativos
- Recursos adicionales
- Módulos especializados
- Integraciones externas
