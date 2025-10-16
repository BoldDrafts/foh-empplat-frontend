import { Observable } from 'rxjs';
import { User, UserInfo } from '../../models/user.model';

export interface LoginRequest {
  documentType: 'DNI' | 'CE' | 'Pasaporte';
  documentNumber: string;
  password: string;
  rememberMe?: boolean;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  user: User;
  requiresOtp: boolean;
}

export interface OtpValidationRequest {
  documentNumber: string;
  otpCode: string;
}

export abstract class AuthService {
  abstract login(credentials: LoginRequest): Observable<LoginResponse>;
  abstract validateOtp(request: OtpValidationRequest): Observable<LoginResponse>;
  abstract logout(): Observable<void>;
  abstract isAuthenticated(): Observable<boolean>;
  abstract getToken(): string | null;
  abstract getUserInfo(): Observable<UserInfo>;
  abstract refreshToken(): Observable<string>;
}
