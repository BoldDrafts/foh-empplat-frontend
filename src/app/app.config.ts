import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { AuthService } from './core/services/auth/auth.service.interface';
import { MockAuthService } from './core/services/auth/mock-auth.service';
import { environment } from '../environments/environment';

export function authServiceFactory(): AuthService {
  if (environment.useKeycloak) {
    console.warn('Keycloak integration not yet implemented. Using mock service.');
    return new MockAuthService();
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
    {
      provide: AuthService,
      useFactory: authServiceFactory
    }
  ]
};
