import { Injectable } from '@angular/core';
import { Observable, from, of, throwError, BehaviorSubject } from 'rxjs';
import { map, catchError, switchMap } from 'rxjs/operators';
import Keycloak from 'keycloak-js';
import { AuthService, LoginRequest, LoginResponse, OtpValidationRequest } from './auth.service.interface';
import { UserInfo } from '../../models/user.model';
import { getKeycloakInstance } from '../../initializers/keycloak.initializer';

@Injectable()
export class KeycloakAuthService extends AuthService {
  private keycloakInstance: Keycloak;
  private userInfoSubject = new BehaviorSubject<UserInfo | null>(null);

  constructor() {
    super();
    const instance = getKeycloakInstance();
    if (!instance) {
      throw new Error('Keycloak instance not initialized');
    }
    this.keycloakInstance = instance;
  }

  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (this.keycloakInstance.authenticated) {
      return this.processKeycloakLogin();
    }

    return from(
      this.keycloakInstance.login({
        redirectUri: window.location.origin
      })
    ).pipe(
      switchMap(() => {
        if (this.keycloakInstance.authenticated) {
          return this.processKeycloakLogin();
        }
        return throwError(() => ({
          error: { message: 'Error al autenticar con Keycloak' }
        }));
      }),
      catchError((error) => {
        console.error('Keycloak login error:', error);
        return throwError(() => ({
          error: { message: 'Error de autenticación' }
        }));
      })
    );
  }

  private processKeycloakLogin(): Observable<LoginResponse> {
    const token = this.keycloakInstance.token;
    const refreshToken = this.keycloakInstance.refreshToken;

    if (!token || !refreshToken) {
      return throwError(() => ({
        error: { message: 'No se pudo obtener el token' }
      }));
    }

    return from(this.keycloakInstance.loadUserProfile()).pipe(
      map((profile) => {
        const userInfo: UserInfo = {
          name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
          dni: profile.username || '',
          companyName: (profile.attributes?.['company'] as string[])?.[0] || '',
          ruc: (profile.attributes?.['ruc'] as string[])?.[0] || '',
          email: profile.email || ''
        };

        this.userInfoSubject.next(userInfo);

        const response: LoginResponse = {
          accessToken: token,
          refreshToken: refreshToken,
          expiresIn: this.keycloakInstance.tokenParsed?.exp || 3600,
          user: {
            id: profile.id || '',
            documentType: 'DNI',
            documentNumber: profile.username || '',
            name: userInfo.name,
            email: userInfo.email,
            ruc: userInfo.ruc,
            companyName: userInfo.companyName,
            companies: [],
            roles: this.keycloakInstance.realmAccess?.roles || []
          },
          requiresOtp: false
        };

        return response;
      }),
      catchError((error) => {
        console.error('Error loading user profile:', error);
        return throwError(() => ({
          error: { message: 'Error al cargar el perfil del usuario' }
        }));
      })
    );
  }

  validateOtp(request: OtpValidationRequest): Observable<LoginResponse> {
    return throwError(() => ({
      error: { message: 'OTP no es necesario con Keycloak' }
    }));
  }

  logout(): Observable<void> {
    return from(
      this.keycloakInstance.logout({
        redirectUri: window.location.origin
      })
    ).pipe(
      map(() => {
        this.userInfoSubject.next(null);
        return void 0;
      }),
      catchError((error) => {
        console.error('Logout error:', error);
        return of(void 0);
      })
    );
  }

  isAuthenticated(): Observable<boolean> {
    if (!this.keycloakInstance || !this.keycloakInstance.authenticated) {
      return of(false);
    }

    return from(
      this.keycloakInstance.updateToken(5)
    ).pipe(
      map(() => !!this.keycloakInstance.authenticated),
      catchError(() => of(false))
    );
  }

  getToken(): string | null {
    return this.keycloakInstance?.token || null;
  }

  getUserInfo(): Observable<UserInfo> {
    if (this.userInfoSubject.value) {
      return of(this.userInfoSubject.value);
    }

    return from(this.keycloakInstance.loadUserProfile()).pipe(
      map((profile) => {
        const userInfo: UserInfo = {
          name: `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
          dni: profile.username || '',
          companyName: (profile.attributes?.['company'] as string[])?.[0] || '',
          ruc: (profile.attributes?.['ruc'] as string[])?.[0] || '',
          email: profile.email || ''
        };
        this.userInfoSubject.next(userInfo);
        return userInfo;
      }),
      catchError(() => {
        const emptyUser: UserInfo = {
          name: '',
          dni: '',
          companyName: '',
          ruc: '',
          email: ''
        };
        return of(emptyUser);
      })
    );
  }

  refreshToken(): Observable<string> {
    return from(
      this.keycloakInstance.updateToken(-1)
    ).pipe(
      map(() => this.keycloakInstance.token || ''),
      catchError((error) => {
        console.error('Token refresh error:', error);
        return throwError(() => ({
          error: { message: 'Error al renovar el token' }
        }));
      })
    );
  }

  getKeycloakInstance(): Keycloak {
    return this.keycloakInstance;
  }
}
