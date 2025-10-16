import { Injectable } from '@angular/core';
import { Observable, of, delay, throwError } from 'rxjs';
import { AuthService, LoginRequest, LoginResponse, OtpValidationRequest } from './auth.service.interface';
import { UserInfo } from '../../models/user.model';

@Injectable()
export class MockAuthService extends AuthService {
  private readonly STORAGE_KEY = 'portal_auth_token';
  private readonly USER_KEY = 'portal_user_info';

  private mockUser: UserInfo = {
    name: 'JEAN PEREZ',
    dni: '12345678',
    companyName: 'Tu Empresa SAC',
    ruc: '20123456789',
    email: 'usuario@tuempresa.com'
  };

  login(credentials: LoginRequest): Observable<LoginResponse> {
    if (credentials.documentNumber === '12345678' && credentials.password === 'demo123') {
      const response: LoginResponse = {
        accessToken: 'mock-jwt-token-' + Date.now(),
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
        user: {
          id: '1',
          documentType: credentials.documentType,
          documentNumber: credentials.documentNumber,
          name: 'JEAN PEREZ',
          email: 'usuario@tuempresa.com',
          ruc: '20123456789',
          companyName: 'Tu Empresa SAC',
          companies: [
            { code: 'TES', name: 'Tu Empresa SAC', ruc: '20123456789' },
            { code: 'FIN', name: 'FINANCIERA OH', ruc: '20987654321' }
          ],
          roles: ['ADMIN', 'USER']
        },
        requiresOtp: true
      };

      if (credentials.rememberMe) {
        localStorage.setItem('remembered_dni', credentials.documentNumber);
      }

      return of(response).pipe(delay(500));
    }

    return throwError(() => ({
      error: { message: 'Credenciales inválidas' }
    })).pipe(delay(500));
  }

  validateOtp(request: OtpValidationRequest): Observable<LoginResponse> {
    if (request.otpCode === '123456') {
      const response: LoginResponse = {
        accessToken: 'mock-jwt-token-validated-' + Date.now(),
        refreshToken: 'mock-refresh-token',
        expiresIn: 3600,
        user: {
          id: '1',
          documentType: 'DNI',
          documentNumber: request.documentNumber,
          name: 'JEAN PEREZ',
          email: 'usuario@tuempresa.com',
          ruc: '20123456789',
          companyName: 'Tu Empresa SAC',
          companies: [
            { code: 'TES', name: 'Tu Empresa SAC', ruc: '20123456789' },
            { code: 'FIN', name: 'FINANCIERA OH', ruc: '20987654321' }
          ],
          roles: ['ADMIN', 'USER']
        },
        requiresOtp: false
      };

      localStorage.setItem(this.STORAGE_KEY, response.accessToken);
      localStorage.setItem(this.USER_KEY, JSON.stringify(this.mockUser));

      return of(response).pipe(delay(500));
    }

    return throwError(() => ({
      error: { message: 'Código OTP inválido' }
    })).pipe(delay(500));
  }

  logout(): Observable<void> {
    localStorage.removeItem(this.STORAGE_KEY);
    localStorage.removeItem(this.USER_KEY);
    return of(void 0).pipe(delay(300));
  }

  isAuthenticated(): Observable<boolean> {
    return of(!!this.getToken());
  }

  getToken(): string | null {
    return localStorage.getItem(this.STORAGE_KEY);
  }

  getUserInfo(): Observable<UserInfo> {
    const userStr = localStorage.getItem(this.USER_KEY);
    if (userStr) {
      return of(JSON.parse(userStr));
    }
    return of(this.mockUser);
  }

  refreshToken(): Observable<string> {
    const newToken = 'mock-jwt-token-refreshed-' + Date.now();
    localStorage.setItem(this.STORAGE_KEY, newToken);
    return of(newToken).pipe(delay(300));
  }
}
