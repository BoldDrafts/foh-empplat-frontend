# Portal del Empleador - Financiera Oh

Portal web empresarial para gestión de cuentas sueldo, pagos de haberes y transferencias bancarias.

## Características Implementadas

### Autenticación
- Login con DNI/CE/Pasaporte + contraseña
- Validación OTP (simulada con código 123456)
- Sistema dual de autenticación (Mock/Keycloak)
- Sesión persistente con localStorage
- Opción "Recordar DNI"

### Dashboard Principal
- Vista de información del usuario
- Listado de cuentas con saldos disponibles y retenidos
- Selector de empresas (multiempresa)
- Acceso rápido a reportes
- Navegación lateral con iconos

### Transferencias
- Listado de transferencias con filtros
- Detalle de transferencia en modal
- Estados de transferencias (Pendiente, Aprobado, Procesado, etc.)
- Visualización de aprobadores
- Opción de descarga de constancias

### Diseño UI/UX
- Material Design con tema personalizado
- Colores corporativos de Financiera Oh (#0097CE)
- Diseño responsive
- Sidebar de navegación
- Tablas con paginación
- Badges de estado coloreados
- Iconografía Material Icons

## Tecnologías

- **Angular 20.0** (Standalone Components)
- **Angular Material 20.2**
- **TypeScript 5.8**
- **RxJS 7.8**
- **Hexagonal Architecture** (Ports & Adapters)
- **Vertical Slicing** por features

## Estructura del Proyecto

```
src/
├── app/
│   ├── core/                     # Núcleo de la aplicación
│   │   ├── guards/               # Guards de autenticación
│   │   ├── interceptors/         # HTTP interceptors
│   │   ├── models/               # Modelos compartidos
│   │   └── services/             # Servicios core
│   │       └── auth/             # Autenticación (Mock/Keycloak)
│   │
│   ├── features/                 # Características por dominio
│   │   ├── auth/                 # Autenticación
│   │   │   ├── domain/           # Modelos de dominio
│   │   │   └── presentation/     # Componentes UI
│   │   │       ├── pages/        # Login
│   │   │       └── components/   # OTP Dialog
│   │   │
│   │   ├── dashboard/            # Dashboard principal
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │
│   │   ├── transfers/            # Gestión de transferencias
│   │   │   ├── domain/
│   │   │   └── presentation/
│   │   │       ├── pages/        # Lista, detalle
│   │   │       └── components/   # Dialogs
│   │   │
│   │   └── accounts/             # Gestión de cuentas
│   │       └── domain/
│   │
│   ├── app.component.ts
│   ├── app.routes.ts             # Rutas con lazy loading
│   └── app.config.ts             # Configuración de providers
│
└── environments/                 # Configuración por ambiente
    ├── environment.ts            # Development (useKeycloak: false)
    └── environment.production.ts # Production (useKeycloak: true)
```

## Credenciales de Prueba

### Login
- **DNI:** 12345678
- **Password:** demo123

### OTP
- **Código:** 123456

## Instalación y Ejecución

```bash
# Instalar dependencias
npm install

# IMPORTANTE: Construir primero para generar el caché
npm run build

# Ejecutar en desarrollo
npm start

# Construir para producción
npm run build
```

La aplicación estará disponible en `http://localhost:4200`

### ⚠️ Solución de Problemas

Si encuentras el error `"Cannot find module '@angular/material/...'"`:

```bash
# Limpiar caché y reconstruir
rm -rf .angular dist
npm run build
npm start
```

Ver [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) para más detalles.

## Configuración de Autenticación

El sistema soporta dos modos de autenticación controlados por el flag `useKeycloak` en `environment.ts`:

### Modo Mock (Desarrollo)
```typescript
// src/environments/environment.ts
export const environment = {
  useKeycloak: false,  // Usa MockAuthService
  // ...
};
```

### Modo Keycloak (Producción)
```typescript
// src/environments/environment.production.ts
export const environment = {
  useKeycloak: true,  // Usa KeycloakAuthService
  keycloak: {
    url: 'https://auth.financieraoh.com/auth',
    realm: 'financiera-oh',
    clientId: 'portal-empleador',
  }
};
```

## Rutas Principales

- `/` - Redirige a login
- `/auth/login` - Página de inicio de sesión
- `/dashboard` - Dashboard principal (protegido)
- `/transfers` - Listado de transferencias (protegido)
- `/accounts` - Gestión de cuentas (protegido)
- `/payroll` - Pago de haberes (protegido)
- `/reports` - Reportes (protegido)

## Arquitectura

### Hexagonal (Ports & Adapters)
Cada feature está organizado en capas:
- **Domain:** Modelos e interfaces (ports)
- **Application:** Casos de uso
- **Infrastructure:** Implementaciones (adapters)
- **Presentation:** Componentes Angular

### Vertical Slicing
Cada módulo de negocio es independiente y contiene toda su lógica, desde el dominio hasta la presentación.

## Características de Seguridad

- HTTP Interceptors para JWT automático
- Guards para protección de rutas
- Manejo centralizado de errores
- Validaciones de formularios
- Sanitización de datos

## Próximos Pasos para Desarrollo

1. Implementar KeycloakAuthService real
2. Conectar con APIs backend
3. Agregar funcionalidad de creación de transferencias
4. Implementar módulo de pago de haberes
5. Agregar módulo de reportes con exportación
6. Implementar módulo de cuentas sueldo
7. Tests unitarios y e2e
8. Optimización de performance

## Diseño Basado en Mockups

El diseño UI/UX está basado exactamente en los mockups proporcionados:
- Login con selector de documento
- Dashboard con información de usuario y cuentas
- Listado de transferencias con filtros
- Modal de detalle de transferencia
- Estados visuales con badges coloreados

## Soporte

Para más información sobre el proyecto contactar al equipo de desarrollo.
