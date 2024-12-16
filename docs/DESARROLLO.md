# Guía de Desarrollo SIPROD

> **Propósito**: Este documento establece los estándares y mejores prácticas de desarrollo, incluyendo nomenclaturas, estilo de código, patrones de arquitectura y guías de testing.
>
> **Público Objetivo**: Todos los desarrolladores, con énfasis en mantener la calidad del código y coherencia del proyecto.

## Estándares de Código

### Convenciones de Nombrado

#### General
- **Componentes React:** PascalCase (ej: `UserProfile.tsx`)
- **Archivos de utilidad:** camelCase (ej: `formatDate.ts`)
- **Constantes:** UPPER_SNAKE_CASE
- **Variables y funciones:** camelCase
- **Tipos y interfaces:** PascalCase

#### Específicos del Proyecto
- **Endpoints API:** kebab-case (ej: `/api/user-profile`)
- **Tablas BD:** snake_case
- **Branches:** feature/, bugfix/, hotfix/

### Estructura de Archivos

#### Frontend
```
components/
├── common/          # Componentes reutilizables
├── features/        # Componentes específicos
├── layouts/         # Layouts de página
└── hooks/           # Custom hooks
```

#### Backend
```
src/
├── controllers/     # Controladores por recurso
├── services/        # Lógica de negocio
├── dto/            # Data Transfer Objects
└── entities/       # Modelos de datos
```

## Patrones y Mejores Prácticas

### Frontend

#### Componentes React
```typescript
// UserProfile.tsx
import { FC } from 'react';
import { useQuery } from '@tanstack/react-query';

interface UserProfileProps {
  userId: string;
}

export const UserProfile: FC<UserProfileProps> = ({ userId }) => {
  const { data, isLoading } = useQuery(['user', userId], () => 
    fetchUser(userId)
  );

  if (isLoading) return <Spinner />;
  
  return (
    <Card>
      <CardHeader title={data.name} />
      <CardContent>{/* ... */}</CardContent>
    </Card>
  );
};
```

### Backend

#### Controllers y DTOs
```typescript
// user.controller.ts
@Controller('users')
export class UserController {
  @Get(':id')
  async getUser(@Param('id') id: string): Promise<UserDTO> {
    return this.userService.findById(id);
  }
}

// user.dto.ts
export class CreateUserDTO {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;
}
```

## Testing

### Frontend
```typescript
// UserProfile.test.tsx
describe('UserProfile', () => {
  it('displays user data when loaded', async () => {
    render(<UserProfile userId="123" />);
    
    expect(await screen.findByText('John Doe')).toBeInTheDocument();
  });
});
```

### Backend
```typescript
// user.service.spec.ts
describe('UserService', () => {
  it('should create a user', async () => {
    const user = await service.create({
      name: 'John',
      email: 'john@example.com'
    });
    
    expect(user).toBeDefined();
  });
});
```

## Control de Calidad

### Linting y Formateo
- ESLint con configuración extendida
- Prettier para formateo consistente
- Husky para pre-commit hooks

### Revisión de Código
- Pull requests obligatorios
- Code review por al menos 1 desarrollador
- CI debe pasar antes de merge

## Flujo de Trabajo Git

1. Crear branch desde develop
2. Desarrollar y commitear cambios
3. Push y crear pull request
4. Code review y ajustes
5. Merge a develop

## Despliegue

### Ambientes
- Development: Rama develop
- Staging: Rama staging
- Production: Rama main

### Proceso
1. Merge a rama destino
2. CI/CD automático
3. Smoke tests
4. Monitoreo post-deploy

## Documentación de Código

### JSDoc
```typescript
/**
 * Formatea una fecha al formato local
 * @param date - Fecha a formatear
 * @param locale - Locale a utilizar (default: 'es-UY')
 * @returns Fecha formateada
 */
export function formatDate(date: Date, locale = 'es-UY'): string {
  return date.toLocaleDateString(locale);
}
```

### Swagger/OpenAPI
- Documentar todos los endpoints
- Incluir ejemplos de request/response
- Mantener versiones actualizadas

## Seguridad

### Frontend
- Sanitización de inputs
- CSP configurado
- XSS prevention

### Backend
- Rate limiting
- CORS configurado
- Validación de inputs
- Encriptación de datos sensibles

## Performance

### Frontend
- Lazy loading de rutas
- Optimización de imágenes
- Code splitting
- Caching efectivo

### Backend
- Query optimization
- Caching con Redis
- Paginación
- Compresión de respuestas
