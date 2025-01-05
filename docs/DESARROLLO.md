# Guía de Desarrollo - SIPROD

## Objetivo
Proveer una guía paso a paso de cómo iniciar y mantener el proceso de desarrollo dentro de SIPROD. Incluye estándares de código, estilos de UI y directrices de testing.

## Función
- Explicar requisitos previos, pasos de configuración inicial y best practices de codificación.
- Unificar criterios de diseño (Material UI, paleta de colores, tipografía) y de estructura en la UI.
- Indicar lineamientos de testing, control de versiones y flujos de trabajo (branching).

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
```

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

### Tipografía
```css
font-family: 'Roboto', sans-serif;
/* Tamaños */
h1: 2rem
h2: 1.5rem
body: 1rem
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
