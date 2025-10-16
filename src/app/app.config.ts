import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthService } from './core/services/auth/auth.service.interface';
import { MockAuthService } from './core/services/auth/mock-auth.service';
import { KeycloakAuthService } from './core/services/auth/keycloak-auth.service';
import { keycloakInitializerProvider } from './core/initializers/keycloak.initializer';
import { environment } from '../environments/environment';

export function authServiceFactory(): AuthService {
  if (environment.useKeycloak) {
    return new KeycloakAuthService();
  }
  return new MockAuthService();
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    keycloakInitializerProvider,
    {
      provide: AuthService,
      useFactory: authServiceFactory
    }
  ]
};
