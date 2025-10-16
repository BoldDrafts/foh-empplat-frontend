# Integración con Keycloak

Esta aplicación Angular ha sido integrada con Keycloak para autenticación centralizada.

## Configuración

### Variables de entorno

La configuración de Keycloak se encuentra en los archivos de environment:

**Development** (`src/environments/environment.ts`):
```typescript
export const environment = {
  useKeycloak: true,
  keycloak: {
    url: 'https://auth.cmaconsulting.org/auth',
    realm: 'fohrealm',
    clientId: 'portal-empleador',
  },
  // ...
};
```

**Production** (`src/environments/environment.production.ts`):
```typescript
export const environment = {
  useKeycloak: true,
  keycloak: {
    url: 'https://auth.financieraoh.com/auth',
    realm: 'financiera-oh',
    clientId: 'portal-empleador',
  },
  // ...
};
```

### Habilitar/Deshabilitar Keycloak

Para cambiar entre autenticación mock y Keycloak, modifica la propiedad `useKeycloak` en el archivo de environment correspondiente:

- `useKeycloak: true` - Usa autenticación con Keycloak
- `useKeycloak: false` - Usa el servicio mock para desarrollo

## Arquitectura

### Componentes principales

1. **KeycloakAuthService** (`src/app/core/services/auth/keycloak-auth.service.ts`)
   - Implementa la interfaz `AuthService`
   - Gestiona la autenticación con Keycloak
   - Maneja tokens y sesiones de usuario

2. **Keycloak Initializer** (`src/app/core/initializers/keycloak.initializer.ts`)
   - Inicializa Keycloak antes de que la aplicación arranque
   - Configura silent SSO check

3. **Auth Guard** (`src/app/core/guards/auth.guard.ts`)
   - Protege rutas que requieren autenticación
   - Redirige a login si el usuario no está autenticado

4. **Auth Interceptor** (`src/app/core/interceptors/auth.interceptor.ts`)
   - Agrega el token de Keycloak a todas las peticiones HTTP

## Flujo de autenticación

1. La aplicación se inicia y ejecuta el `keycloakInitializer`
2. Keycloak verifica si hay una sesión activa (silent SSO check)
3. Si el usuario accede a una ruta protegida sin autenticación:
   - El `authGuard` detecta que no está autenticado
   - Redirige al componente de login
4. En el login:
   - Si `useKeycloak: true`, muestra botón de "Iniciar sesión con Keycloak"
   - Al hacer clic, redirige a la página de login de Keycloak
5. Después de autenticarse en Keycloak:
   - El usuario es redirigido de vuelta a la aplicación
   - El servicio carga el perfil del usuario
   - Se guarda el token en memoria
6. Las peticiones HTTP incluyen automáticamente el token

## Configuración de Keycloak Server

### Requisitos del cliente en Keycloak

El cliente `portal-empleador` debe estar configurado con:

- **Client Protocol**: openid-connect
- **Access Type**: public
- **Valid Redirect URIs**: `http://localhost:4200/*`, URL de producción
- **Web Origins**: `http://localhost:4200`, URL de producción

### Atributos de usuario

El servicio espera los siguientes atributos en el perfil de usuario:

- `firstName`: Nombre del usuario
- `lastName`: Apellido del usuario
- `username`: DNI o identificador único
- `email`: Correo electrónico
- `company` (custom attribute): Nombre de la empresa
- `ruc` (custom attribute): RUC de la empresa

### Roles

Los roles asignados en Keycloak se mapean directamente a los roles de la aplicación.

## Archivos importantes

- `/src/assets/silent-check-sso.html` - Página para verificación silenciosa de SSO
- `angular.json` - Configurado para copiar assets incluyendo silent-check-sso.html

## Desarrollo local

Para desarrollo local puedes usar el servicio mock cambiando `useKeycloak` a `false`:

```typescript
export const environment = {
  useKeycloak: false,
  // ...
};
```

Credenciales mock:
- DNI: 12345678
- Password: demo123
- OTP: 123456

## Troubleshooting

### Error: "Keycloak instance not initialized"

Asegúrate de que el `keycloakInitializerProvider` está incluido en `app.config.ts`:

```typescript
export const appConfig: ApplicationConfig = {
  providers: [
    // ...
    keycloakInitializerProvider,
    // ...
  ]
};
```

### Error de CORS

Verifica que las URLs de la aplicación están configuradas en "Web Origins" del cliente Keycloak.

### Token expirado

El servicio renueva automáticamente el token 5 segundos antes de que expire. Si hay problemas, revisa la configuración de tiempo de vida del token en Keycloak.

## Seguridad

- Los tokens se almacenan en memoria, no en localStorage
- El token se incluye automáticamente en todas las peticiones HTTP mediante interceptor
- Las rutas están protegidas con `authGuard`
- El logout cierra la sesión tanto en la aplicación como en Keycloak
