# Mis Servicios

## Descripción General
Sistema centralizado para la gestión personal de servicios, licencias, cursos y turnos como Jefe de Día, con validaciones automáticas y detección de conflictos.

## Tipos de Servicios y Estados

### Tipos de Servicios Gestionados
1. **Servicio 222**:
   - Servicios especiales designados por el Sub Director del ESMAPO
   - Las designaciones se realizan por períodos de días
   - El Jefe designado puede aceptar o rechazar la designación
   - No genera conflictos con otros servicios o condiciones
   - En caso de rechazo, se debe especificar el motivo

2. **Jefe de Día**:
   - Turnos de 24 horas (08:00 a 08:00)
   - Asignados por ESMAPO
   - Se pueden solicitar fechas preferidas
   - Requieren 2+ días de anticipación

3. **Cursos**:
   - Capacitaciones obligatorias o voluntarias
   - Horarios fijos establecidos

4. **Licencias**:
   - Médicas
   - Reglamentarias
   - Especiales
   - Tienen prioridad sobre otros servicios

### Estados de los Servicios

1. **PENDIENTE**:
   - Designación realizada por Sub Director ESMAPO
   - En espera de respuesta del Jefe designado
   - Sistema notifica al Jefe sobre la designación
   - Plazo de respuesta establecido

2. **APROBADO**:
   - Jefe acepta la designación
   - Se bloquea en calendario
   - Se envían notificaciones
   - Se registra en el sistema

3. **RECHAZADO**:
   - Jefe rechaza la designación
   - Debe especificar motivo del rechazo
   - Sub Director ESMAPO evalúa nueva fecha
   - Se registra en historial

4. **COMPLETADO**:
   - Servicio finalizado
   - Informe registrado
   - Actualización de historial
   - Disponible para consultas

5. **CANCELADO**:
   - Cancelación por motivos especiales
   - Requiere justificación
   - Notificación a superiores
   - Liberación de calendario

## Ejemplos de Flujos de Trabajo

### 1. Designación de Servicio 222
Caso: Cap. Luis Suárez - Terminal Shopping

**Día 1 (02/02/2025)**:
- Sub Director ESMAPO designa servicios
  * Período: 10/02/2025 al 15/02/2025
  * Horario: 08:00 a 16:00
  * Lugar: Terminal Shopping
  * Estado: PENDIENTE
- Sistema notifica a Luis sobre la designación

**Día 2 (03/02/2025)**:
- Luis revisa la designación y tiene dos opciones

**Opción A - Aceptación**:
- Acepta la designación completa
- Sistema actualiza estado a APROBADO
- Se bloquean las fechas en su calendario
- Se notifica al Sub Director ESMAPO

**Opción B - Rechazo**:
- Rechaza la designación
- Especifica motivo: "Compromiso familiar programado"
- Sistema notifica al Sub Director ESMAPO
- Sub Director evalúa nueva designación

**Día 3 (04/02/2025) - En caso de rechazo**:
- Sub Director ESMAPO revisa el motivo
- Designa nuevo período: 20/02/2025 al 25/02/2025
- Sistema notifica a Luis la nueva designación
- Proceso se repite hasta lograr acuerdo

### 2. Gestión de Designaciones
Caso: Cap. María Torres - Múltiples Servicios

**Situación 1: Designación de Servicio 222**
- Sub Director ESMAPO designa
  * Período: 15/02/2025 al 20/02/2025
  * Horario: 14:00 a 22:00
  * Lugar: Costa Urbana
  * Estado: PENDIENTE

- María revisa y detecta
  * Tiene curso "Táctica Operativa"
  * Día 15/02/2025
  * Horario: 13:00 a 17:00
  * Acción: Rechaza la designación
  * Motivo: "Curso programado el primer día"

- Sub Director ESMAPO
  * Recibe el rechazo y motivo
  * Evalúa la situación
  * Ajusta la designación: 16/02/2025 al 21/02/2025
  * Sistema notifica nueva designación

**Situación 2: Nueva Designación**
- Sub Director ESMAPO designa
  * Período: 16/02/2025 al 21/02/2025
  * Horario: 14:00 a 22:00
  * Lugar: Costa Urbana

- María revisa
  * Sin conflictos en el período
  * Acepta la designación
  * Sistema actualiza calendario
  * Estado: APROBADO

### 3. Calendario y Planificación
Ejemplo: Cbo. Juan Martínez - Febrero 2025

**Primera Semana**
- 05/02: Curso Primeros Auxilios
  * Horario: 08:00-12:00
  * Ubicación: Academia
  * Estado: CONFIRMADO

**Segunda Semana**
- 10/02: Servicio 222
  * Horario: 14:00-22:00
  * Lugar: Terminal
  * Estado: APROBADO

**Tercera Semana**
- 15/02: Jefe de Día
  * 24 horas (08:00-08:00)
  * Unidad: GRT
  * Estado: CONFIRMADO

**Cuarta Semana**
- 20/02: Licencia Médica
  * Día completo
  * Documentación adjunta
  * Estado: APROBADO

## Sistema de Validaciones

### 1. Validaciones Automáticas
- Verificación de disponibilidad
- Control de documentación
- Detección de conflictos
- Cumplimiento de plazos

### 2. Ejemplos de Validación
Caso: Solicitud de Servicio

**Verificaciones del Sistema**
1. Disponibilidad
   - Sin licencias activas
   - Sin cursos programados
   - Sin otros servicios

2. Documentación
   - Formularios completos
   - Firmas requeridas
   - Anexos necesarios

3. Plazos
   - Anticipación mínima
   - Duración permitida
   - Períodos de descanso

### 3. Notificaciones
- Confirmaciones automáticas
- Alertas de conflictos
- Recordatorios de servicios
- Solicitudes pendientes

## Recomendaciones para Usuarios

### 1. Planificación
- Revisar calendario regularmente
- Solicitar con anticipación
- Mantener documentación al día
- Verificar requisitos previos

### 2. Gestión de Servicios
- Confirmar asignaciones
- Reportar novedades
- Actualizar información
- Mantener comunicación activa
