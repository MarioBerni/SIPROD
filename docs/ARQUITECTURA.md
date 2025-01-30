# Arquitectura de SIPROD

## Estructura de Layouts y Contextos

### Layouts
La aplicación utiliza una estructura de layouts anidados para manejar correctamente la separación entre código del servidor y cliente:

1. **RootLayout** (`app/layout.tsx`)
   - Layout principal a nivel de aplicación
   - Maneja la estructura HTML básica
   - No contiene lógica de cliente
   - Envuelve la aplicación en el ClientLayout

2. **ClientLayout** (`components/layouts/ClientLayout.tsx`)
   - Componente marcado con 'use client'
   - Maneja todos los providers del lado del cliente:
     - ThemeProvider (MUI)
     - CssBaseline
     - AuthProvider
     - PageTitleProvider
   - Inicializa variables de entorno del cliente

### Contextos
La aplicación utiliza varios contextos para manejar el estado global. Es importante seguir estas guías para su uso correcto:

1. **AuthContext**
   ```typescript
   // ❌ Incorrecto - Usar fuera de AuthProvider
   const auth = useAuth();

   // ✅ Correcto - Asegurarse que el componente está dentro de AuthProvider
   function MyComponent() {
     const auth = useAuth();
     // ...
   }
   ```

2. **PageTitleContext**
   ```typescript
   // ❌ Incorrecto - Usar en componente del servidor
   export default function Page() {
     const { setPageTitle } = usePageTitle();
     // ...
   }

   // ✅ Correcto - Usar en componente del cliente
   'use client';
   export default function Page() {
     const { setPageTitle } = usePageTitle();
     // ...
   }
   ```

### Mejores Prácticas

1. **Componentes del Servidor**
   - No usar hooks de React (useState, useEffect, useContext)
   - No importar módulos marcados con 'use client'
   - Mantener la lógica simple y enfocada en renderizado inicial

2. **Componentes del Cliente**
   - Marcar con 'use client'
   - Pueden usar todos los hooks de React
   - Manejar la interactividad y estado
   - Asegurarse de estar dentro de los providers necesarios

3. **Uso de Contextos**
   - Siempre verificar que el componente esté dentro del provider correspondiente
   - Mantener los contextos lo más cerca posible de donde se usan
   - No usar contextos en componentes del servidor

### Estructura de Archivos
```
src/
├── app/
│   ├── layout.tsx           # RootLayout (servidor)
│   └── ...
├── components/
│   ├── layouts/
│   │   └── ClientLayout.tsx # Providers del cliente
│   └── ...
└── contexts/
    ├── AuthContext.tsx      # Contexto de autenticación
    └── PageTitleContext.tsx # Contexto de título de página
```

## Notas Importantes

1. **Server Components vs Client Components**
   - Los componentes del servidor son el default en Next.js 14
   - Usar 'use client' solo cuando sea necesario
   - Mantener la mayor cantidad posible de componentes en el servidor

2. **Manejo de Errores**
   - Implementar error boundaries en componentes del cliente
   - Manejar estados de carga y error en los contextos
   - Proporcionar valores por defecto seguros en los contextos

3. **Performance**
   - Minimizar el uso de contextos cuando sea posible
   - Considerar prop drilling para pocos niveles de componentes
   - Usar React.memo() para prevenir re-renders innecesarios
