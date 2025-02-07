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

### Estructura de Archivos y carptas
```
Directory structure:
└── marioberni-siprod/
    ├── README.md
    ├── commitlint.config.js
    ├── deploy.sh
    ├── ecosystem.config.js
    ├── package.json
    ├── pnpm-lock.yaml
    ├── pnpm-workspace.yaml
    ├── tsconfig.json
    ├── turbo.json
    ├── .env.example
    ├── .eslintignore
    ├── .eslintrc.js
    ├── .npmrc
    ├── .prettierrc
    ├── apps/
    │   ├── api/
    │   │   ├── drizzle.config.ts
    │   │   ├── ecosystem.config.js
    │   │   ├── jest.config.js
    │   │   ├── jest.setup.js
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   ├── .eslintignore
    │   │   ├── .eslintrc.js
    │   │   ├── backend/
    │   │   │   ├── package-lock.json
    │   │   │   └── package.json
    │   │   ├── prisma/
    │   │   │   ├── schema.prisma
    │   │   │   ├── seed.ts
    │   │   │   ├── tsconfig.json
    │   │   │   └── migrations/
    │   │   │       ├── migration_lock.toml
    │   │   │       ├── 20250114050012_init/
    │   │   │       │   └── migration.sql
    │   │   │       ├── 20250114184852_make_fields_optional/
    │   │   │       │   └── migration.sql
    │   │   │       ├── 20250117135424_init/
    │   │   │       │   └── migration.sql
    │   │   │       ├── 20250120140519_add_escalafon_jefes_with_hora/
    │   │   │       │   └── migration.sql
    │   │   │       └── 20250120140806_add_escalafon_jefes_with_hora/
    │   │   │           └── migration.sql
    │   │   ├── scripts/
    │   │   │   └── test-db.ts
    │   │   └── src/
    │   │       ├── app.ts
    │   │       ├── index.ts
    │   │       ├── config/
    │   │       │   ├── env.validator.ts
    │   │       │   └── index.ts
    │   │       ├── controllers/
    │   │       │   ├── auth.controller.ts
    │   │       │   ├── estadisticas.controller.ts
    │   │       │   ├── tabla-principal.controller.ts
    │   │       │   └── user.controller.ts
    │   │       ├── db/
    │   │       │   ├── config.ts
    │   │       │   ├── index.ts
    │   │       │   ├── schema.ts
    │   │       │   └── schema/
    │   │       │       ├── index.ts
    │   │       │       └── users.ts
    │   │       ├── lib/
    │   │       │   └── prisma.ts
    │   │       ├── middleware/
    │   │       │   ├── auth.middleware.ts
    │   │       │   ├── error.ts
    │   │       │   ├── metrics.ts
    │   │       │   ├── performance.ts
    │   │       │   ├── security.ts
    │   │       │   └── validate.middleware.ts
    │   │       ├── middlewares/
    │   │       │   └── auth.middleware.ts
    │   │       ├── routes/
    │   │       │   ├── auth.ts
    │   │       │   ├── estadisticas.routes.ts
    │   │       │   ├── index.ts
    │   │       │   ├── tabla-principal.routes.ts
    │   │       │   ├── user.routes.ts
    │   │       │   └── user.ts
    │   │       ├── scripts/
    │   │       │   └── seed.ts
    │   │       ├── test/
    │   │       │   ├── auth.test.ts
    │   │       │   └── setup.ts
    │   │       ├── tests/
    │   │       │   └── health.test.ts
    │   │       ├── types/
    │   │       │   ├── error.ts
    │   │       │   ├── express.d.ts
    │   │       │   └── express/
    │   │       │       └── index.d.ts
    │   │       ├── utils/
    │   │       │   ├── auth.ts
    │   │       │   ├── cache.ts
    │   │       │   ├── errors.ts
    │   │       │   ├── jwt.utils.ts
    │   │       │   └── logger.ts
    │   │       └── validators/
    │   │           └── auth.ts
    │   └── web/
    │       ├── bundle-analysis.html
    │       ├── ecosystem.config.js
    │       ├── jest.config.cjs
    │       ├── jest.setup.cjs
    │       ├── jest.setup.ts
    │       ├── next-env.d.ts
    │       ├── next.config.js
    │       ├── next.config.mjs
    │       ├── package.json
    │       ├── tsconfig.json
    │       ├── tsconfig.node.json
    │       ├── .eslintignore
    │       ├── .eslintrc.cjs
    │       ├── public/
    │       │   ├── robots.txt
    │       │   ├── .gitkeep
    │       │   └── images/
    │       │       └── logo-gr.webp
    │       ├── scripts/
    │       │   └── generateEnumTypes.ts
    │       └── src/
    │           ├── middleware.ts
    │           ├── app/
    │           │   ├── error.tsx
    │           │   ├── globals.css
    │           │   ├── layout.js
    │           │   ├── layout.tsx
    │           │   ├── loading.tsx
    │           │   ├── not-found.tsx
    │           │   ├── page.tsx
    │           │   ├── (auth)/
    │           │   │   └── layout.tsx
    │           │   ├── api/
    │           │   │   └── registros/
    │           │   │       ├── route.ts
    │           │   │       └── [id]/
    │           │   │           └── route.ts
    │           │   └── dashboard/
    │           │       ├── layout.tsx
    │           │       ├── page.tsx
    │           │       ├── administrador/
    │           │       │   ├── mapas/
    │           │       │   │   └── page.tsx
    │           │       │   ├── tabla-principal/
    │           │       │   │   ├── metadata.ts
    │           │       │   │   └── page.tsx
    │           │       │   └── usuarios/
    │           │       │       ├── page.tsx
    │           │       │       ├── types.ts
    │           │       │       ├── utils.ts
    │           │       │       ├── components/
    │           │       │       │   ├── UserDialog.tsx
    │           │       │       │   └── UsersTable.tsx
    │           │       │       └── hooks/
    │           │       │           └── useUsers.ts
    │           │       ├── despliegues-pdf/
    │           │       │   ├── page.tsx
    │           │       │   ├── types.ts
    │           │       │   ├── components/
    │           │       │   │   └── FilterForm.tsx
    │           │       │   ├── constants/
    │           │       │   │   ├── pdf.constants.ts
    │           │       │   │   └── table.constants.ts
    │           │       │   ├── types/
    │           │       │   │   ├── pdf.types.ts
    │           │       │   │   └── table.types.ts
    │           │       │   └── utils/
    │           │       │       ├── constants.ts
    │           │       │       ├── dataProcessingUtils.ts
    │           │       │       ├── documentUtils.ts
    │           │       │       ├── headerUtils.ts
    │           │       │       ├── pdfHelpers.ts
    │           │       │       ├── pdfUtils.ts
    │           │       │       ├── sortUtils.ts
    │           │       │       ├── tableUtils.ts
    │           │       │       ├── textUtils.ts
    │           │       │       ├── types.ts
    │           │       │       ├── charts/
    │           │       │       │   └── barChart.ts
    │           │       │       └── tables/
    │           │       │           ├── dataTable.ts
    │           │       │           ├── headerTable.ts
    │           │       │           └── summaryTable.ts
    │           │       ├── direccion-1/
    │           │       │   └── page.tsx
    │           │       ├── escalafon-jefes/
    │           │       │   ├── page.tsx
    │           │       │   ├── types.ts
    │           │       │   ├── components/
    │           │       │   │   ├── ActiveAssignmentsCard.tsx
    │           │       │   │   ├── alerts/
    │           │       │   │   │   └── OfficerStatusAlerts.tsx
    │           │       │   │   ├── calendar/
    │           │       │   │   │   ├── CalendarDay.tsx
    │           │       │   │   │   ├── CalendarEventList.tsx
    │           │       │   │   │   ├── CalendarHeader.tsx
    │           │       │   │   │   ├── CalendarWeekHeader.tsx
    │           │       │   │   │   ├── EscalafonCalendar.tsx
    │           │       │   │   │   ├── types.ts
    │           │       │   │   │   └── utils.ts
    │           │       │   │   ├── dialog/
    │           │       │   │   │   ├── AssignmentDayDialog.tsx
    │           │       │   │   │   ├── AssignmentDialog.tsx
    │           │       │   │   │   ├── types.ts
    │           │       │   │   │   ├── components/
    │           │       │   │   │   │   └── AssignmentForm.tsx
    │           │       │   │   │   ├── hooks/
    │           │       │   │   │   │   └── useAssignmentForm.ts
    │           │       │   │   │   └── styles/
    │           │       │   │   │       └── dialogStyles.ts
    │           │       │   │   └── suggestions/
    │           │       │   │       └── OfficerSuggestions.tsx
    │           │       │   └── data/
    │           │       │       └── mockData.ts
    │           │       ├── estadistica/
    │           │       │   ├── page.tsx
    │           │       │   ├── components/
    │           │       │   │   ├── DetallesHora.tsx
    │           │       │   │   ├── EstadisticaHeader.tsx
    │           │       │   │   ├── FiltrosEstadistica.tsx
    │           │       │   │   ├── GraficaEstadistica.tsx
    │           │       │   │   ├── GraficaPorHorario.tsx
    │           │       │   │   ├── GraficasDistribucion.tsx
    │           │       │   │   ├── ListaDetalles.tsx
    │           │       │   │   ├── TablaDetalles.tsx
    │           │       │   │   ├── TablaEstadisticasAccordion.tsx
    │           │       │   │   └── TablaResumenHorario.tsx
    │           │       │   ├── services/
    │           │       │   │   └── estadisticas.service.ts
    │           │       │   └── types/
    │           │       │       ├── estadisticas.ts
    │           │       │       ├── filtros.ts
    │           │       │       └── zona.ts
    │           │       ├── mapas/
    │           │       │   └── page.tsx
    │           │       ├── mis-servicios/
    │           │       │   └── page.tsx
    │           │       └── profile/
    │           │           └── page.tsx
    │           ├── components/
    │           │   ├── Header.tsx
    │           │   ├── common/
    │           │   │   └── BaseDialog.tsx
    │           │   ├── dashboard/
    │           │   │   ├── ProgressSection.tsx
    │           │   │   ├── ResourceCard.tsx
    │           │   │   ├── StatCard.tsx
    │           │   │   └── WeeklyChart.tsx
    │           │   ├── dialogs/
    │           │   │   └── HelpDialog.tsx
    │           │   ├── direction/
    │           │   │   └── DirectionDashboard.tsx
    │           │   ├── features/
    │           │   │   ├── auth/
    │           │   │   │   ├── forgot-password-dialog.tsx
    │           │   │   │   ├── login-form.tsx
    │           │   │   │   └── components/
    │           │   │   │       ├── LoginContainer.tsx
    │           │   │   │       ├── LoginForm.tsx
    │           │   │   │       ├── LoginHeader.tsx
    │           │   │   │       └── index.ts
    │           │   │   └── dashboard/
    │           │   │       └── StatCard.tsx
    │           │   ├── layout/
    │           │   │   ├── BackgroundPattern.tsx
    │           │   │   ├── DashboardLayout.tsx
    │           │   │   ├── Drawer.tsx
    │           │   │   └── Navbar.tsx
    │           │   ├── layouts/
    │           │   │   ├── ClientLayout.tsx
    │           │   │   ├── DashboardLayout.tsx
    │           │   │   ├── DashboardNavbar.tsx
    │           │   │   ├── DashboardSidebar.tsx
    │           │   │   ├── MainLayout.tsx
    │           │   │   ├── Navbar.tsx
    │           │   │   └── header.tsx
    │           │   ├── maps/
    │           │   │   ├── DrawingControls.tsx
    │           │   │   ├── MapControls.tsx
    │           │   │   ├── MapView.tsx
    │           │   │   └── VertexContextMenu.tsx
    │           │   ├── providers/
    │           │   │   ├── Providers.tsx
    │           │   │   └── ThemeRegistry.tsx
    │           │   ├── services/
    │           │   │   ├── ActiveServicesCard.tsx
    │           │   │   ├── ServiceCalendar.tsx
    │           │   │   ├── types.ts
    │           │   │   ├── calendar/
    │           │   │   │   ├── CalendarDay.tsx
    │           │   │   │   ├── CalendarDayNew.tsx
    │           │   │   │   ├── CalendarEventList.tsx
    │           │   │   │   ├── CalendarHeader.tsx
    │           │   │   │   ├── CalendarHeaderNew.tsx
    │           │   │   │   ├── CalendarWeekHeader.tsx
    │           │   │   │   ├── types.ts
    │           │   │   │   └── utils.ts
    │           │   │   ├── dialog/
    │           │   │   │   ├── ServiceDayDialog.tsx
    │           │   │   │   ├── types.ts
    │           │   │   │   ├── components/
    │           │   │   │   │   ├── AddLicenseButton.tsx
    │           │   │   │   │   ├── Control222Item.tsx
    │           │   │   │   │   ├── Control222List.tsx
    │           │   │   │   │   ├── CourseItem.tsx
    │           │   │   │   │   ├── CourseList.tsx
    │           │   │   │   │   ├── DateInputs.tsx
    │           │   │   │   │   ├── DutyDayItem.tsx
    │           │   │   │   │   ├── DutyDayList.tsx
    │           │   │   │   │   ├── DutyRequestForm.tsx
    │           │   │   │   │   ├── LicenseItem.tsx
    │           │   │   │   │   └── LicenseList.tsx
    │           │   │   │   ├── hooks/
    │           │   │   │   │   ├── useCourseManagement.tsx
    │           │   │   │   │   ├── useDutyDayManagement.tsx
    │           │   │   │   │   └── useLicenseManagement.tsx
    │           │   │   │   └── styles/
    │           │   │   │       └── StyledDialog.tsx
    │           │   │   └── hooks/
    │           │   │       ├── useCalendarEvents.ts
    │           │   │       ├── useCalendarEvents.tsx
    │           │   │       └── useServiceCounts.tsx
    │           │   ├── tabla-principal/
    │           │   │   ├── components/
    │           │   │   │   ├── AddRecordModal.tsx
    │           │   │   │   ├── DataTable.tsx
    │           │   │   │   ├── DeleteConfirmationDialog.tsx
    │           │   │   │   ├── EditRecordModal.tsx
    │           │   │   │   ├── FormSection.tsx
    │           │   │   │   ├── TableHeader.tsx
    │           │   │   │   ├── UbicacionForm.tsx
    │           │   │   │   └── form-sections/
    │           │   │   │       ├── BasicInformation.tsx
    │           │   │   │       ├── DateTimeInformation.tsx
    │           │   │   │       ├── LocationDetails.tsx
    │           │   │   │       ├── Observations.tsx
    │           │   │   │       ├── OperativeInformation.tsx
    │           │   │   │       ├── ResourceInformation.tsx
    │           │   │   │       ├── UbicacionSection.tsx
    │           │   │   │       ├── index.ts
    │           │   │   │       └── styles/
    │           │   │   │           └── FormFieldStyles.tsx
    │           │   │   ├── hooks/
    │           │   │   │   ├── useResponsiveColumns.ts
    │           │   │   │   ├── useTableColumns.tsx
    │           │   │   │   └── useTableData.ts
    │           │   │   ├── types/
    │           │   │   │   ├── generated.ts
    │           │   │   │   └── index.ts
    │           │   │   └── validation/
    │           │   │       └── index.ts
    │           │   └── ui/
    │           │       ├── button.tsx
    │           │       ├── card.tsx
    │           │       ├── input.tsx
    │           │       ├── label.tsx
    │           │       ├── typewriter.tsx
    │           │       └── Spinner/
    │           │           ├── index.tsx
    │           │           └── styles.ts
    │           ├── config/
    │           │   ├── development.ts
    │           │   └── navigation.tsx
    │           ├── contexts/
    │           │   ├── AuthContext.tsx
    │           │   └── PageTitleContext.tsx
    │           ├── data/
    │           │   └── polygonData.ts
    │           ├── hooks/
    │           │   ├── useLoading.ts
    │           │   ├── useMapControls.ts
    │           │   ├── useMapDrawing.tsx
    │           │   ├── useMapInstance.ts
    │           │   └── map/
    │           │       ├── useMapDrawing.ts
    │           │       └── useMapInstance.ts
    │           ├── lib/
    │           │   ├── api.ts
    │           │   ├── auth.ts
    │           │   ├── cookies.ts
    │           │   ├── createEmotionCache.ts
    │           │   ├── env.validator.ts
    │           │   ├── fetch.ts
    │           │   ├── fetchApi.ts
    │           │   ├── serverAuth.ts
    │           │   └── utils.ts
    │           ├── providers/
    │           │   └── LoadingProvider.tsx
    │           ├── services/
    │           │   └── auth.ts
    │           ├── styles/
    │           │   ├── MapStyles.ts
    │           │   ├── baseLayoutStyles.ts
    │           │   ├── dashboardStyles.ts
    │           │   ├── layoutStyles.ts
    │           │   └── theme.ts
    │           ├── tests/
    │           │   └── components/
    │           │       └── Header.test.tsx
    │           ├── theme/
    │           │   ├── index.ts
    │           │   └── theme.ts
    │           ├── types/
    │           │   ├── date-fns.d.ts
    │           │   ├── index.ts
    │           │   ├── map.ts
    │           │   └── user.ts
    │           └── utils/
    │               ├── colorUtils.ts
    │               ├── error-handling.ts
    │               └── imageOptimization.tsx
    ├── docs/
    │   ├── ARQUITECTURA.md
    │   ├── DESARROLLO.md
    │   └── NUEVO_SERVIDOR.md
    ├── nginx/
    │   ├── README.md
    │   └── siprod.conf
    ├── packages/
    │   ├── backend/
    │   │   └── Dockerfile.dev
    │   ├── config/
    │   │   ├── eslint.js
    │   │   ├── index.d.ts
    │   │   ├── index.js
    │   │   ├── package.json
    │   │   ├── eslint/
    │   │   │   ├── node.js
    │   │   │   ├── .eslintrc.d.ts
    │   │   │   └── .eslintrc.js
    │   │   └── tsconfig/
    │   │       ├── base.json
    │   │       └── nextjs.json
    │   ├── tsconfig/
    │   │   ├── api.json
    │   │   ├── base.json
    │   │   ├── library.json
    │   │   ├── nextjs.json
    │   │   ├── package.json
    │   │   └── base/
    │   │       └── tsconfig.json
    │   ├── ui/
    │   │   ├── package.json
    │   │   ├── tsconfig.json
    │   │   ├── .eslintignore
    │   │   ├── .eslintrc.json
    │   │   └── src/
    │   │       ├── index.d.ts
    │   │       ├── index.js
    │   │       ├── index.tsx
    │   │       └── components/
    │   │           ├── index.d.ts
    │   │           ├── index.js
    │   │           ├── index.ts
    │   │           ├── dashboard/
    │   │           │   └── DashboardStats.tsx
    │   │           ├── layouts/
    │   │           │   ├── DashboardLayout.tsx
    │   │           │   └── index.ts
    │   │           ├── navigation/
    │   │           │   └── Navbar.tsx
    │   │           └── providers/
    │   │               ├── AnalyticsProvider.tsx
    │   │               └── ThemeProvider.tsx
    │   └── utils/
    │       ├── package.json
    │       ├── tsconfig.json
    │       ├── .eslintignore
    │       ├── .eslintrc.js
    │       └── src/
    │           ├── index.d.ts
    │           ├── index.js
    │           └── index.ts
    ├── scripts/
    │   ├── dev.js
    │   ├── package.json
    │   └── setup-monorepo.ps1
    ├── src/
    │   ├── api/
    │   │   └── api.ts
    │   ├── context/
    │   │   └── AuthContext.tsx
    │   └── utils/
    │       └── cookies.ts
    └── .husky/
        └── pre-commit



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



