# Escalafón Jefes - Guía para Desarrolladores

## ¿Qué es el Escalafón de Jefes?
Sistema que gestiona los turnos de los Jefes de Día en la Guardia Republicana, organizando quién estará a cargo cada día.

### Conceptos Clave
- **Turno**: Período de 24 horas (08:00 a 08:00) donde un Jefe supervisa una unidad designada
- **Jefe de Día**: Oficial a cargo de supervisar y gestionar una unidad durante su turno
- **ESMAPO**: Dependencia donde el Sub Director es el encargado de aprobar y gestionar las designaciones de los Jefes de día
- **Servicio 222**: Servicio especial que no genera conflicto con ninguna de las opciones. Solo es designado por el Sub Director del ESMAPO y se pone en conocimiento a los Jefes. Dichas designaciones se pueden también aceptar o rechazar por los Jefes

## Estados del Turno

### Estados y Validaciones
1. **PROPUESTO**: 
   - Sistema sugiere basado en score y disponibilidad
   - Considera preferencias del Jefe (días solicitados)
   - Verifica conflictos con licencias y cursos

2. **SOLICITADO**: 
   - Jefe pide un turno específico
   - Puede indicar múltiples fechas de preferencia
   - Sistema registra la solicitud para evaluación

3. **PENDIENTE**: 
   - En revisión por ESMAPO
   - Se evalúan todas las solicitudes para la fecha
   - Sub Director decide en caso de múltiples solicitudes

4. **CONFIRMADO**: 
   - Turno asignado y notificado
   - Se bloquea la fecha en calendario
   - Se actualiza el score del Jefe

5. **RECHAZADO**: 
   - No se puede asignar por conflictos
   - Se notifica el motivo del rechazo
   - Se sugieren fechas alternativas

6. **COMPLETADO**: 
   - Turno finalizado y registrado
   - Se actualiza el historial
   - Se recalcula el score

### Ejemplo de Flujo de Estados
Seguimiento del turno del Cap. Juan Pérez para el día 15/02/2025:

1. **PROPUESTO**: El sistema sugiere a Juan porque:
   - Tiene score de 85 puntos
   - Su último turno fue hace 5 días
   - No tiene licencias pendientes
   - Solo ha tenido 2 turnos este mes
   - Ha solicitado preferencia para esta fecha

2. **SOLICITADO**: 
   - Juan solicita específicamente el turno del 15/02
   - También indica disponibilidad para 16/02 y 17/02
   - Sistema registra sus preferencias

3. **PENDIENTE**: ESMAPO revisa y verifica:
   - No tiene licencia médica 
   - No tiene curso programado 
   - Cumple el descanso requerido 
   - Es el único solicitante para esa fecha 

4. **CONFIRMADO**: ESMAPO aprueba y:
   - Se notifica a Juan por el sistema
   - Se bloquea la fecha en su calendario
   - Se actualiza su score

5. **COMPLETADO**: Juan finaliza su turno el 16/02 a las 08:00

## Sistema de Score y Asignación

### Cálculo del Score
El score es un valor numérico (0-100) que ayuda a priorizar las asignaciones:

1. **Componentes Base (70 puntos)**:
   - Tiempo desde último turno (30 pts)
   - Cantidad de turnos en el mes (20 pts)
   - Historial de cumplimiento (20 pts)

2. **Bonificaciones (30 puntos)**:
   - Solicitud anticipada (10 pts)
   - Flexibilidad de fechas (10 pts)
   - Turnos en fechas especiales que serian fin de semana (10 pts)

### Ejemplo de Cálculo
Cap. María Rodríguez:
- Último turno hace 7 días: 25 pts
- 2 turnos este mes: 15 pts
- 100% cumplimiento: 20 pts
- Solicitó con 2 semanas: 8 pts
- Ofreció 3 fechas: 10 pts
Score Total: 78 puntos

## Gestión de Preferencias

### Sistema de Solicitudes
1. **Registro de Preferencias**:
   - Jefes pueden indicar días preferidos del mes
   - Mínimo 3 días de anticipación
   - Máximo 30 días hacia adelante
   - Sin límite de fechas solicitadas

2. **Proceso de Evaluación**:
   - Sub Director ESMAPO revisa todas las solicitudes
   - Prioriza según necesidades del servicio
   - Considera el score como referencia
   - Decide en caso de múltiples solicitudes

### Ejemplo de Solicitud Múltiple
Fecha: 20/02/2025
- Cap. Rodríguez (Score 78) solicita el día
- Tte. González (Score 85) también lo solicita
- Sub Director evalúa:
  * Necesidades de la unidad
  * Experiencia previa
  * Historial de turnos
  * Decide asignar a Rodríguez por conocimiento específico

## Validaciones del Sistema

### Reglas Principales
1. **Disponibilidad**:
   - Sin licencias activas
   - Sin cursos programados
   - Descanso suficiente (mínimo 48h)

2. **Restricciones**:
   - Solicitudes con 2+ días de anticipación

### Ejemplo de Validaciones
Solicitud del Tte. González:
- Fecha solicitada: 25/02/2025
- Sistema verifica:
  * Sin licencias 
  * Sin cursos 
  * Último turno 24/02 
  * Solicitud rechazada por tiempo insuficiente

