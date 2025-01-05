# 👨‍💻 Guía de Desarrollo

## 🚀 Inicio Rápido

### Requisitos Previos
- Node.js 18+
- pnpm 8+
- PostgreSQL 15+
- Redis 7+

### Configuración Inicial
```bash
# Clonar repositorio
git clone https://github.com/tu-org/siprod.git

# Instalar dependencias
pnpm install

# Configurar variables de entorno
cp .env.example .env

# Iniciar desarrollo
pnpm dev
```

## 🎨 Guía de Diseño y Estilos

### Sistema de Diseño
SIPROD utiliza MaterialUI con emotion-styled, diseñado específicamente para entornos policiales y ministeriales.

### Paleta de Colores
```typescript
// Tema MaterialUI
const theme = createTheme({
  palette: {
    primary: {
      main: '#1a3b6e', // Azul institucional
      light: '#234c8d',
      dark: '#112845',
    },
    secondary: {
      main: '#2c3e50', // Gris azulado profesional
      light: '#34495e',
      dark: '#243342',
    },
    success: {
      main: '#2d5a27', // Verde institucional
      light: '#367d30',
      dark: '#1e3d1a',
    },
    warning: {
      main: '#8b4513', // Marrón alerta
      light: '#a0522d',
      dark: '#723a0f',
    },
    error: {
      main: '#7b1818', // Rojo institucional
      light: '#8f1d1d',
      dark: '#671313',
    }
  }
});
```

### Tipografía
- Fuente principal: Roboto (integrada con MaterialUI)
- Tamaños predefinidos a través del tema de MaterialUI

### Componentes UI

#### Botones
```tsx
// Variantes disponibles de MaterialUI
<Button variant="contained" color="primary">Acción Principal</Button>
<Button variant="outlined" color="warning">Revisar</Button>
```

#### Tarjetas
```tsx
// Ejemplo de uso de Card de MaterialUI
<Card>
  <CardHeader
    title="Título"
    subheader="Descripción"
  />
  <CardContent>Contenido</CardContent>
  <CardActions>Acciones</CardActions>
</Card>
```

### Mejores Prácticas de UI/UX

1. **Jerarquía Visual**
   - Usar variantes contained para acciones principales
   - Reservar colores de warning y error para alertas importantes
   - Mantener consistencia en el espaciado usando theme.spacing

2. **Responsividad**
   - Usar el sistema de Grid de MaterialUI
   - Implementar breakpoints de MaterialUI
   - Utilizar hooks como useMediaQuery para lógica responsive

3. **Accesibilidad**
   - Usar componentes semánticos de MaterialUI
   - Mantener contraste adecuado siguiendo el tema
   - Asegurar navegación por teclado

4. **Consistencia**
   - Usar componentes de MaterialUI
   - Mantener espaciado consistente con theme.spacing
   - Seguir la paleta de colores del tema

## 📝 Estándares de Código

### TypeScript
- Usar tipos explícitos
- Evitar `any`
- Documentar interfaces públicas

```typescript
interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}

function getUserById(id: string): Promise<User> {
  return prisma.user.findUnique({ where: { id } });
}
```

### React/Next.js
- Preferir Server Components
- Usar Client Components solo cuando sea necesario
- Implementar manejo de errores

```typescript
// Server Component
async function UserList() {
  const users = await getUsers();
  return <div>{users.map(user => <UserCard key={user.id} {...user} />)}</div>;
}

// Client Component
'use client';
function InteractiveForm() {
  // Lógica del cliente aquí
}
```

### API
- RESTful por defecto
- Documentar con OpenAPI/Swagger
- Validar inputs con Zod

```typescript
const userSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  role: z.enum(['ADMIN', 'USER'])
});

app.post('/api/users', validateBody(userSchema), createUser);
```

## 🧪 Testing

### Configuración con Turborepo
El proyecto utiliza Turborepo para gestionar los tests en todo el monorepo, permitiendo una ejecución eficiente y paralela de los tests en todos los paquetes.

#### Ejecutar Tests
Para ejecutar todos los tests del monorepo:
```bash
pnpm test
```

Este comando utilizará Turborepo para:
- Ejecutar tests en paralelo
- Cachear resultados para ejecuciones más rápidas
- Manejar dependencias entre paquetes

#### Estructura de Tests

##### Frontend (@siprod/web)
- Framework: Jest + React Testing Library
- Configuración: `apps/web/jest.config.js`
- Setup: `apps/web/jest.setup.js`
- Ubicación: `apps/web/src/tests`

Ejemplo de test de componente:
```typescript
import { render, screen } from '@testing-library/react';
import Header from '@/components/Header';

describe('Header Component', () => {
  it('renders header with title', () => {
    render(<Header />);
    const titleElement = screen.getByText(/SIPROD/i);
    expect(titleElement).toBeInTheDocument();
  });
});
```

##### Backend (@siprod/api)
- Framework: Jest
- Configuración: `apps/api/jest.config.js`
- Ubicación: `apps/api/src/tests`

##### Paquetes Compartidos
- @siprod/ui: Tests de componentes UI compartidos
- @siprod/utils: Tests de utilidades compartidas

#### Scripts Disponibles
```bash
# Test todos los paquetes
pnpm test

# Test con watch mode (específico por paquete)
cd apps/web
pnpm test:watch

# Test con cobertura
pnpm test:coverage

# Test paquete específico
cd apps/api
pnpm test
```

#### Mejores Prácticas
1. **Organización de Tests**
   - Mantener los tests junto al código (`__tests__` o `*.test.ts`)
   - Usar nombres descriptivos para los test suites

2. **Testing de Componentes**
   - Probar comportamiento, no implementación
   - Usar queries accesibles de Testing Library
   - Simular interacciones de usuario realistas

3. **Testing de API**
   - Probar endpoints principales
   - Validar respuestas y códigos de estado
   - Usar mocks para servicios externos

4. **Mantenimiento**
   - Mantener tests actualizados con cambios de código
   - Revisar y actualizar snapshots cuando sea necesario
   - Mantener la cobertura de código por encima del 80%

## 🔄 Control de Versiones

### Convenciones de Commits
- feat: Nueva característica
- fix: Corrección de bug
- docs: Documentación
- style: Formato
- refactor: Refactorización
- test: Tests
- chore: Mantenimiento

### Flujo de Ramas
```
main
  └── develop
       ├── feature/user-auth
       ├── fix/login-error
       └── docs/api-docs
```

## 📦 Despliegue

### Proceso
1. Tests pasan
2. Build exitoso
3. Review de código
4. Merge a develop
5. Deploy a staging
6. Pruebas de QA
7. Deploy a producción

### Comandos
```bash
# Build
pnpm build

# Tests
pnpm test

# Lint
pnpm lint

# Deploy
pnpm deploy
```

## 🔍 Debugging

### Backend
```typescript
logger.debug('User data:', { userId, action });
logger.error('Error in auth:', error);
```

### Frontend
```typescript
'use client';
useEffect(() => {
  console.debug('Component mounted', { props });
}, [props]);
```

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Testing Library](https://testing-library.com/docs)
- [Documentación de MaterialUI](https://mui.com/material-ui/getting-started/overview/)
