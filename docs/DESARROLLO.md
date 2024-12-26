# Guía de Desarrollo

## Índice
1. [Configuración del Entorno](#configuración-del-entorno)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Estándares de Código](#estándares-de-código)
4. [Flujo de Desarrollo](#flujo-de-desarrollo)
5. [Testing](#testing)
6. [Debugging](#debugging)
7. [Performance](#performance)
8. [Seguridad](#seguridad)

## Configuración del Entorno

### Requisitos del Sistema
- Node.js 18+ (recomendado 18.17.0+)
- PNPM 8+ (recomendado 8.9.0+)
- PostgreSQL 15+
- Git 2.40+
- VS Code (recomendado)

### Extensiones VS Code Recomendadas
- ESLint
- Prettier
- TypeScript + JavaScript
- Tailwind CSS IntelliSense
- Prisma
- GitLens

### Configuración Inicial
1. Clonar el repositorio:
```bash
git clone [URL_REPOSITORIO]
cd SIPROD
```

2. Instalar dependencias:
```bash
pnpm install
```

3. Configurar base de datos PostgreSQL:
   - Crear base de datos: `siprod`
   - Usuario: `postgres`
   - Puerto: `5432`

4. Configurar variables de entorno:
   ### Configuración de Variables de Entorno
   El proyecto utiliza un enfoque centralizado para las variables de entorno:

   1. **Archivos de Configuración**:
      ```
      /SIPROD
      ├── .env                 # Variables de desarrollo (no versionado)
      ├── .env.production      # Variables de producción
      └── .env.example         # Plantilla de configuración
      ```

   2. **Configuración Inicial**:
      ```bash
      # Copiar plantilla de configuración
      cp .env.example .env
      
      # Editar variables según el entorno
      nano .env
      ```

   3. **Variables Principales**:
      - `DATABASE_URL`: Conexión a PostgreSQL
      - `POSTGRES_*`: Configuración de base de datos
      - `JWT_SECRET`: Clave para tokens JWT
      - `CORS_ORIGIN`: Origen permitido para CORS
      - `NEXT_PUBLIC_API_URL`: URL del API para el frontend

   4. **Herencia de Variables**:
      - Todos los subproyectos heredan las variables del archivo raíz
      - No se requieren archivos .env adicionales en los subproyectos

   ### Base de Datos
   1. **Configuración PostgreSQL**:
      ```bash
      # Crear base de datos
      createdb siprod
      
      # Aplicar migraciones
      pnpm prisma migrate deploy
      ```

5. Inicializar la base de datos:
```bash
cd apps/api
pnpm prisma generate
pnpm prisma migrate dev --name init
```

### Iniciar Desarrollo
```bash
# En la raíz del proyecto
pnpm dev
```

Esto iniciará:
- Frontend: http://localhost:3000
- Backend API: http://localhost:4000/api
- Health Check: http://localhost:4000/api/health

## Estructura del Proyecto

### Organización de Carpetas
```
SIPROD/
├── apps/
│   ├── api/                 # Backend
│   │   ├── src/
│   │   │   ├── controllers/
│   │   │   ├── middlewares/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── utils/
│   │   ├── prisma/
│   │   └── tests/
│   └── web/                 # Frontend
│       ├── src/
│       │   ├── app/
│       │   ├── components/
│       │   ├── hooks/
│       │   ├── lib/
│       │   └── utils/
│       └── public/
├── packages/
│   ├── config/             # Configuraciones compartidas
│   ├── tsconfig/          # Configuraciones de TypeScript
│   ├── ui/                # Componentes UI compartidos
│   └── utils/             # Utilidades compartidas
└── docs/                  # Documentación
```

### Convenciones de Nombrado
- **Archivos**: PascalCase para componentes, camelCase para utilidades
- **Carpetas**: camelCase
- **Componentes React**: PascalCase
- **Funciones**: camelCase
- **Interfaces/Types**: PascalCase con prefijo I para interfaces
- **Constants**: UPPER_SNAKE_CASE

## Estándares de Código

### TypeScript
```typescript
// Usar tipos explícitos
interface IUser {
  id: string;
  name: string;
  email: string;
}

// Evitar any
function processUser(user: IUser): void {
  // ...
}

// Usar enums para valores constantes
enum UserRole {
  ADMIN = 'ADMIN',
  USER = 'USER',
}
```

### React/Next.js
```typescript
// Componentes funcionales con tipos
interface Props {
  title: string;
  children: React.ReactNode;
}

const Layout: React.FC<Props> = ({ title, children }) => {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
};

// Hooks personalizados
const useUser = () => {
  // ...
};
```

### API/Backend
```typescript
// Controllers tipados
interface CreateUserDTO {
  name: string;
  email: string;
}

async function createUser(data: CreateUserDTO): Promise<IUser> {
  // ...
}
```

## Flujo de Desarrollo

### Proceso de Desarrollo
1. Crear rama feature/fix
2. Desarrollar cambios
3. Ejecutar tests
4. Crear PR
5. Code review
6. Merge a develop

### Commits
```bash
# Formato
tipo(alcance): descripción

# Ejemplos
feat(auth): implementar autenticación JWT
fix(api): corregir validación de entrada
docs(readme): actualizar instrucciones de instalación
```

### Pull Requests
- Usar plantilla proporcionada
- Incluir tests
- Actualizar documentación
- Screenshots/videos si hay cambios visuales

## Testing

### Tests Unitarios
```bash
# Frontend
pnpm --filter @siprod/web test

# Backend
pnpm --filter @siprod/api test
```

### Tests de Integración
```bash
pnpm test:integration
```

### Tests E2E
```bash
pnpm test:e2e
```

## Debugging

### Frontend
- React DevTools
- Chrome DevTools
- Next.js Debug Mode

### Backend
- Node Inspector
- PM2 Logs
```bash
pm2 logs siprod-backend-dev
```

## Performance

### Frontend
- Lazy loading
- Image optimization
- Bundle analysis
```bash
pnpm analyze
```

### Backend
- Query optimization
- Caching
- Rate limiting

## Seguridad

### Prácticas
- Validación de entrada
- Sanitización de datos
- CORS configurado
- Rate limiting
- Headers seguros

### Autenticación
- JWT
- Refresh tokens
- Session management

## Recursos Adicionales
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/usage/quick-start)
