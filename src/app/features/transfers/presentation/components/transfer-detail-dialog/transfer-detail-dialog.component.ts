import { Component, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { Transfer } from '../../../domain/models/transfer.model';

@Component({
  selector: 'app-transfer-detail-dialog',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    MatTableModule
  ],
  template: `
    <h2 mat-dialog-title>Detalle de la transferencia</h2>

    <mat-dialog-content>
      <div class="detail-grid">
        <div class="detail-item">
          <span class="label">Fecha de creación:</span>
          <span class="value">{{ transfer.createdAt | date: 'dd/MM/yyyy - HH:mm a' }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Número de solicitud:</span>
          <span class="value">{{ transfer.requestNumber }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Descripción:</span>
          <span class="value">{{ transfer.description }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Cuenta de cargo:</span>
          <span class="value">{{ transfer.sourceAccount }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Cuenta de destino:</span>
          <span class="value">{{ transfer.destinationAccount }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Beneficiario:</span>
          <span class="value">{{ transfer.beneficiaryName }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Monto:</span>
          <span class="value amount">{{ transfer.currency }} {{ transfer.amount | number:'1.2-2' }}</span>
        </div>

        <div class="detail-item">
          <span class="label">Estado:</span>
          <span class="status-badge" [class]="getStatusClass(transfer.status)">
            {{ transfer.status }}
          </span>
        </div>
      </div>

      <mat-divider></mat-divider>

      <div class="approvers-section" *ngIf="transfer.approvers && transfer.approvers.length > 0">
        <h3>Lista de aprobadores</h3>
        <table mat-table [dataSource]="transfer.approvers" class="approvers-table">
          <ng-container matColumnDef="name">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let approver">{{ approver.name }}</td>
          </ng-container>

          <ng-container matColumnDef="observation">
            <th mat-header-cell *matHeaderCellDef>Observación</th>
            <td mat-cell *matCellDef="let approver">
              {{ approver.observation || '-' }}
            </td>
          </ng-container>

          <ng-container matColumnDef="status">
            <th mat-header-cell *matHeaderCellDef>Estado</th>
            <td mat-cell *matCellDef="let approver">
              <span class="status-badge" [class]="getApproverStatusClass(approver.status)">
                {{ approver.status }}
              </span>
            </td>
          </ng-container>

          <tr mat-header-row *matHeaderRowDef="approverColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: approverColumns;"></tr>
        </table>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button (click)="close()">Cerrar</button>
      <button mat-raised-button color="primary" (click)="downloadReceipt()">
        <mat-icon>download</mat-icon>
        Descargar constancia
      </button>
    </mat-dialog-actions>
  `,
  styles: [`
    mat-dialog-content {
      min-width: 600px;
      max-height: 70vh;
      overflow-y: auto;
    }

    .detail-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 1.5rem;
      margin-bottom: 2rem;
    }

    .detail-item {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;

      .label {
        font-size: 0.85rem;
        color: #7f8c8d;
        font-weight: 500;
      }

      .value {
        font-size: 1rem;
        color: #2c3e50;
        font-weight: 600;

        &.amount {
          color: #0097CE;
          font-size: 1.25rem;
        }
      }
    }

    mat-divider {
      margin: 2rem 0;
    }

    .approvers-section {
      h3 {
        font-size: 1.1rem;
        font-weight: 600;
        color: #2c3e50;
        margin-bottom: 1rem;
      }
    }

    .approvers-table {
      width: 100%;

      th {
        background-color: #f8f9fa;
        font-weight: 600;
        color: #495057;
      }

      td {
        color: #2c3e50;
      }
    }

    .status-badge {
      display: inline-block;
      padding: 0.35rem 0.85rem;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 500;
      text-transform: uppercase;

      &.pending {
        background-color: #fff3cd;
        color: #856404;
      }

      &.approved, &.processed {
        background-color: #d4edda;
        color: #155724;
      }

      &.rejected, &.failed {
        background-color: #f8d7da;
        color: #721c24;
      }
    }

    mat-dialog-actions {
      padding: 1rem 0 0;
    }

    @media (max-width: 768px) {
      mat-dialog-content {
        min-width: unset;
        max-width: 100%;
      }

      .detail-grid {
        grid-template-columns: 1fr;
      }
    }
  `]
})
export class TransferDetailDialogComponent {
  transfer: Transfer;
  approverColumns: string[] = ['name', 'observation', 'status'];

  constructor(
    private dialogRef: MatDialogRef<TransferDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { transfer: Transfer }
  ) {
    this.transfer = data.transfer;
  }

  getStatusClass(status: string): string {
    const statusMap: Record<string, string> = {
      'PENDIENTE': 'pending',
      'APROBADO': 'approved',
      'RECHAZADO': 'rejected',
      'PROCESADO': 'processed',
      'FALLIDO': 'failed'
    };
    return statusMap[status] || '';
  }

  getApproverStatusClass(status: string): string {
    return this.getStatusClass(status);
  }

  downloadReceipt() {
    console.log('Downloading receipt for transfer:', this.transfer.id);
    this.dialogRef.close();
  }

  close() {
    this.dialogRef.close();
  }
}
