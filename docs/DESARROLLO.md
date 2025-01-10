# Guía de Desarrollo - SIPROD

## Objetivo
Proveer una guía paso a paso de cómo iniciar y mantener el proceso de desarrollo dentro de SIPROD. Incluye estándares de código, estilos de UI y directrices de testing.

## Función
- Explicar requisitos previos, pasos de configuración inicial y best practices de codificación.
- Unificar criterios de diseño (Material UI, paleta de colores, tipografía) y de estructura en la UI.
- Indicar lineamientos de testing, control de versiones y flujos de trabajo.
- Mantener documentación clara con comentarios descriptivos en el código para facilitar el mantenimiento.

## 🚀 Inicio Rápido

### 1. Configuración del Entorno
```bash
# Instalar dependencias globales
npm i -g pnpm@8 turbo@latest

# Clonar y configurar
git clone https://github.com/MarioBerni/SIPROD.git
cd SIPROD
pnpm install
```

### 2. Variables de Entorno
```bash
# .env.local
DATABASE_URL=postgresql://user:pass@localhost:5432/siprod
REDIS_URL=redis://localhost:6379
JWT_SECRET=dev_jwt_secret
```

### 3. Desarrollo Local
```bash
pnpm dev        # Inicia todos los servicios
pnpm test       # Ejecuta tests
pnpm lint       # Verifica linting
```

## 📝 Estándares de Código

### TypeScript
```typescript
// Usar tipos explícitos
interface Usuario {
  id: number;
  nombre: string;
  rol: 'admin' | 'usuario';
}

// Evitar any
function getUsuario(id: number): Promise<Usuario>
```

### React
```typescript
// Componentes funcionales
const MiComponente: React.FC<Props> = ({ prop }) => {
  return <div>{prop}</div>;
};

// Hooks personalizados
const useRecursos = (id: string) => {
  return useQuery(['recursos', id], () => getRecurso(id));
};

### DataTable Component
```typescript
// Componente de tabla de datos con Material-UI
const DataTable: React.FC<DataTableProps> = ({ rows, loading }) => {
  // Configuración de localización en español
  const localeText = {
    // Paginación
    labelRowsPerPage: 'Filas por página:',
    MuiTablePagination: {
      labelRowsPerPage: 'Filas por página:',
    },
    
    // Filtros y búsqueda
    toolbarFilters: 'Filtros',
    toolbarQuickFilterPlaceholder: 'Buscar...',
    
    // Columnas
    columnMenuLabel: 'Menú',
    columnMenuShowColumns: 'Mostrar columnas',
  };

  return (
    <DataGrid
      rows={rows}
      columns={columns}
      localeText={localeText}
      slots={{
        toolbar: GridToolbar,
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: true,
        },
        pagination: {
          labelRowsPerPage: 'Filas por página:',
        },
      }}
    />
  );
};

### Hooks Personalizados para DataTable
```typescript
// Hook para manejar columnas
const useTableColumns = () => {
  return useMemo(() => [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'nombre', headerName: 'Nombre', flex: 1 },
    // ... más columnas
  ], []);
};

// Hook para manejar paginación
const usePagination = () => {
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  
  return { paginationModel, setPaginationModel };
};
```

## 🗺️ Módulo de Mapas

### Componentes Principales

#### useMapDrawing Hook
```typescript
// Hook personalizado para dibujo de polígonos en mapas
const useMapDrawing = ({ map, isDrawingMode }: UseMapDrawingProps) => {
  // Gestiona el estado del dibujo de polígonos
  return {
    clearCurrentDrawing,  // Limpia el dibujo actual
    renderContextMenu     // Renderiza menú contextual para vértices
  };
};
```

#### Estructura de Componentes
```
src/
  ├── hooks/
  │   └── useMapDrawing.tsx      // Hook principal para dibujo en mapas
  ├── components/
  │   └── maps/
  │       └── VertexContextMenu.tsx  // Menú contextual para vértices
  └── app/
      └── dashboard/
          └── administrador/
              └── mapas/
                  └── page.tsx    // Página principal de administración de mapas
```

### Funcionalidades Principales

#### 1. Dibujo de Polígonos
- Click en el mapa para añadir vértices
- Arrastrar vértices para ajustar forma
- Menú contextual para eliminar vértices
- Puntos medios para añadir nuevos vértices

#### 2. Gestión de Marcadores
```typescript
// Tipos de marcadores
interface VertexMarker {
  marker: mapboxgl.Marker;
  index: number;
}

// Gestión de estado
const vertices = useRef<[number, number][]>([]);
const vertexMarkers = useRef<VertexMarker[]>([]);
const midpointMarkers = useRef<mapboxgl.Marker[]>([]);
```

#### 3. Menú Contextual
- Aparece al hacer click derecho sobre un vértice
- Permite eliminar vértices individuales
- Se cierra al hacer click fuera del menú

### Implementación

#### 1. Configuración del Mapa
```typescript
// En page.tsx
const MapComponent: React.FC = () => {
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const [isDrawingMode, setIsDrawingMode] = useState(false);

  const { clearCurrentDrawing, renderContextMenu } = useMapDrawing({
    map: mapRef,
    isDrawingMode
  });

  return (
    <>
      <div ref={mapContainer} className="map-container" />
      {renderContextMenu()}
    </>
  );
};
```

#### 2. Manejo de Eventos
```typescript
// Eventos principales
marker.on('drag', () => {
  const pos = marker.getLngLat();
  vertices.current[index] = [pos.lng, pos.lat];
  updateVerticesAndLine(mapInstance);
});

marker.on('dragend', onMidpointUpdate);
```

#### 3. Actualización de Polígonos
```typescript
const updatePolyline = (mapInstance: mapboxgl.Map) => {
  // Actualiza la fuente GeoJSON del polígono
  const source = mapInstance.getSource(polylineSource.current);
  if (source) {
    (source as mapboxgl.GeoJSONSource).setData({
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: vertices.current
      }
    });
  }
};
```

### Mejores Prácticas

1. **Gestión de Estado**
   - Usar `useRef` para datos que no requieren re-renders
   - Mantener estado mínimo necesario
   - Evitar dependencias circulares en callbacks

2. **Optimización de Rendimiento**
   - Memoizar callbacks con `useCallback`
   - Evitar re-renders innecesarios
   - Limpiar listeners y marcadores al desmontar

3. **Manejo de Errores**
   - Validar existencia de instancia del mapa
   - Verificar número mínimo de vértices
   - Manejar casos edge en eliminación de vértices

4. **Estilos y Visualización**
   - Usar colores consistentes para marcadores
   - Mantener tamaños apropiados para interacción
   - Proporcionar feedback visual claro

## 🎨 Guía de Diseño

### Paleta de Colores
```typescript
const theme = {
  primary: '#1976d2',
  secondary: '#dc004e',
  background: '#f5f5f5',
  text: '#333333'
};
```

### Componentes Material-UI
```typescript
// Contenedores estilizados
const PageContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: 1200,
  margin: '0 auto',
}));

// Chips de estado
const StatusChip = styled(Box)<{ status: 'active' | 'inactive' }>(({ theme, status }) => ({
  padding: '4px 12px',
  borderRadius: '16px',
  backgroundColor: status === 'active' ? theme.palette.success.light : theme.palette.error.light,
  color: status === 'active' ? theme.palette.success.dark : theme.palette.error.dark,
  display: 'inline-block',
  fontSize: '0.875rem',
}));
```

### Tipografía
```css
font-family: 'Roboto', sans-serif;
/* Tamaños */
h1: 2rem
h2: 1.5rem
body: 1rem
```

### Manejo de Cookies
```typescript
// Configuración de cookies seguras
const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'strict' as const : 'lax' as const,
  path: '/',
  domain: process.env.NODE_ENV === 'production' ? process.env.DOMAIN : undefined,
  maxAge: 24 * 60 * 60 * 1000 // 24 horas
};
```

### Manejo de Errores
```typescript
// Utilidad para manejo tipado de errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'Error desconocido';
};
```

## 🧪 Testing

### Tests Unitarios
```typescript
describe('AuthService', () => {
  it('debe validar credenciales correctamente', () => {
    const result = await validateCredentials(user);
    expect(result).toBeTruthy();
  });
});
```

### Tests E2E
```typescript
describe('Login', () => {
  it('debe iniciar sesión correctamente', () => {
    cy.visit('/login');
    cy.get('[data-testid="email"]').type('user@test.com');
    cy.get('[data-testid="password"]').type('password');
    cy.get('button').click();
    cy.url().should('include', '/dashboard');
  });
});
```

## 🌿 Control de Versiones

### Ramas
```bash
main        # Producción
develop     # Desarrollo
feature/*   # Nuevas funcionalidades
bugfix/*    # Correcciones
release/*   # Preparación de releases
```

### Commits
```bash
feat: nueva funcionalidad
fix: corrección de bug
docs: cambios en documentación
style: cambios de estilo
refactor: refactorización de código
```

## 📦 Gestión de Dependencias

### Actualización
```bash
# Verificar actualizaciones
pnpm outdated

# Actualizar dependencias
pnpm update

# Actualizar una específica
pnpm update @package/name
```

## 🚀 Despliegue

### Preparación
1. Actualizar versión en package.json
2. Ejecutar tests completos
3. Generar build de producción
4. Crear tag de versión

### Comando
```bash
pnpm deploy
```

## 📋 Lista de Verificación

### Antes de Commit
- [ ] Tests pasan localmente
- [ ] Linting sin errores
- [ ] Tipos TypeScript verificados
- [ ] Documentación actualizada

### Antes de PR
- [ ] Branch actualizado con develop
- [ ] Conflictos resueltos
- [ ] Tests de integración pasan
- [ ] Review de código propio
