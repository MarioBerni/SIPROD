# Perfil

## Descripción General
Página personal que permite a cada usuario visualizar y gestionar su información personal, preferencias del sistema y acceder a su historial de actividades.

## Estructura del Perfil

### Diagrama de Secciones
```mermaid
graph TD
    A[Perfil Usuario] --> B[Datos Personales]
    A --> C[Seguridad]
    A --> D[Preferencias]
    A --> E[Historial]

    B --> B1[Información Básica]
    B --> B2[Datos Profesionales]
    B --> B3[Contacto]

    C --> C1[Contraseña]
    C --> C2[2FA]
    C --> C3[Sesiones]

    D --> D1[Notificaciones]
    D --> D2[Interfaz]
    D --> D3[Privacidad]

    E --> E1[Actividad]
    E --> E2[Servicios]
    E --> E3[Accesos]

    style A fill:#f96,stroke:#333
    style B fill:#9cf,stroke:#333
    style C fill:#9cf,stroke:#333
    style D fill:#9cf,stroke:#333
    style E fill:#9cf,stroke:#333
```

### Ejemplo de Perfil Completo
Caso: Perfil del Cap. María Torres

1. **Datos Personales**:
   - Nombre: María Torres
   - CI: 3.234.567-8
   - Grado: Capitán
   - Unidad: URGE Sur
   - Email: mtorres@guardia.gub.uy

2. **Datos Profesionales**:
   - Cargo: Jefe de Día
   - Antigüedad: 8 años
   - Especialidad: Táctica
   - Habilitaciones: S222, Jefe de Día

## Gestión de Seguridad

### Diagrama de Proceso 2FA
```mermaid
sequenceDiagram
    participant U as Usuario
    participant S as Sistema
    participant A as App 2FA
    participant N as Notificaciones

    U->>S: 1. Intenta acceder
    S->>U: 2. Solicita código
    U->>A: 3. Abre app
    A->>U: 4. Muestra código
    U->>S: 5. Ingresa código
    S->>S: 6. Valida
    S->>N: 7. Notifica acceso
```

### Ejemplo de Gestión de Seguridad
Caso: Activación 2FA del Cap. María Torres

1. **Configuración Inicial**:
   - Fecha: 06/02/2025
   - Dispositivo: iPhone 14
   - App: Google Authenticator
   - Backup: Códigos de respaldo generados

2. **Proceso de Activación**:
   - Escaneo de QR ✓
   - Validación de código ✓
   - Backup guardado ✓
   - Email confirmación enviado ✓

## Historial de Actividad

### Diagrama de Registro
```mermaid
flowchart TD
    A[Acción Usuario] --> B{Tipo Evento}
    B -->|Acceso| C[Registrar Login]
    B -->|Cambio| D[Guardar Modificación]
    B -->|Servicio| E[Actualizar Historial]
    C --> F[Log Completo]
    D --> F
    E --> F
```

### Ejemplo de Historial
Caso: Actividad reciente del Cap. María Torres

1. **Accesos Recientes**:
   ```
   06/02/2025 09:15 - Login exitoso (Chrome/Windows)
   06/02/2025 13:20 - Cambio de contraseña
   06/02/2025 13:25 - Activación 2FA
   06/02/2025 14:10 - Actualización de perfil
   ```

2. **Servicios del Mes**:
   - 01/02: Turno Jefe de Día ✓
   - 05/02: Servicio 222 Terminal ✓
   - 10/02: Curso Táctico (Pendiente)
   - 15/02: Turno Jefe de Día (Programado)

## Preferencias y Notificaciones

### Diagrama de Configuración
```mermaid
graph LR
    A[Preferencias] --> B[Email]
    A --> C[App Móvil]
    A --> D[Sistema]
    
    B --> B1[Diario]
    B --> B2[Semanal]
    
    C --> C1[Push]
    C --> C2[Silencioso]
    
    D --> D1[Tiempo Real]
    D --> D2[Resumen]
```

### Ejemplo de Configuración
Caso: Preferencias del Cap. María Torres

1. **Notificaciones**:
   - Email: Resumen diario ✓
   - App: Alertas inmediatas ✓
   - Sistema: Tiempo real ✓
   - Sonidos: Activados ✓

2. **Interfaz**:
   - Tema: Oscuro
   - Idioma: Español
   - Vista calendario: Mensual
   - Dashboard: Personalizado

## Recomendaciones Técnicas

### Mejores Prácticas
1. Actualizar datos regularmente
2. Verificar dispositivos conectados
3. Revisar historial de accesos
4. Mantener 2FA activo

### Optimizaciones
1. Caché de datos frecuentes
2. Validaciones en tiempo real
3. Compresión de historial
4. Limpieza automática

## ¿Necesitas Ayuda?
- Guía de usuario: `/docs/perfil`
- FAQ: `/docs/faq`
- Soporte: `/help`
