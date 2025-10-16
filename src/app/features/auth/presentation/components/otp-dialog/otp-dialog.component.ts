import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { AuthService } from '../../../../../core/services/auth/auth.service.interface';

@Component({
  selector: 'app-otp-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule
  ],
  template: `
    <h2 mat-dialog-title>Clave digital</h2>
    <p class="dialog-subtitle">Por favor ingrese el código generado por su app móvil</p>

    <mat-dialog-content>
      <mat-form-field appearance="outline" class="otp-field">
        <mat-label>Código OTP</mat-label>
        <input
          matInput
          [(ngModel)]="otpCode"
          maxlength="6"
          placeholder="123456"
          (keypress)="onlyNumbers($event)"
          autocomplete="off">
        <mat-icon matPrefix>vpn_key</mat-icon>
      </mat-form-field>

      <div *ngIf="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="onCancel()">Salir</button>
      <button
        mat-raised-button
        color="primary"
        [disabled]="otpCode.length !== 6 || loading"
        (click)="onConfirm()">
        {{ loading ? 'Validando...' : 'Confirmar' }}
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    .dialog-subtitle {
      color: #666;
      margin: -1rem 0 1.5rem 0;
      font-size: 0.95rem;
    }

    .otp-field {
      width: 100%;

      input {
        font-size: 1.5rem;
        letter-spacing: 0.5rem;
        text-align: center;
      }
    }

    .error-message {
      background-color: #ffebee;
      color: #c62828;
      padding: 0.75rem;
      border-radius: 4px;
      font-size: 0.9rem;
      margin-top: 1rem;
    }

    mat-dialog-content {
      min-width: 300px;
    }
  `]
})
export class OtpDialogComponent {
  otpCode = '';
  loading = false;
  errorMessage = '';

  constructor(
    private dialogRef: MatDialogRef<OtpDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { documentNumber: string },
    private authService: AuthService
  ) {}

  onlyNumbers(event: KeyboardEvent) {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  onConfirm() {
    if (this.otpCode.length !== 6) return;

    this.loading = true;
    this.errorMessage = '';

    this.authService.validateOtp({
      documentNumber: this.data.documentNumber,
      otpCode: this.otpCode
    }).subscribe({
      next: () => {
        this.loading = false;
        this.dialogRef.close({ success: true });
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error.error?.message || 'Código OTP inválido';
      }
    });
  }

  onCancel() {
    this.dialogRef.close({ success: false });
  }
}
