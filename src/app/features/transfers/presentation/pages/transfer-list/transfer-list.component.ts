import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Transfer, TransferStatus } from '../../../domain/models/transfer.model';
import { TransferDetailDialogComponent } from '../../components/transfer-detail-dialog/transfer-detail-dialog.component';

@Component({
  selector: 'app-transfer-list',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatMenuModule,
    MatDialogModule
  ],
  templateUrl: './transfer-list.component.html',
  styleUrls: ['./transfer-list.component.scss']
})
export class TransferListComponent implements OnInit {
  filterForm: FormGroup;
  transfers: Transfer[] = [];
  displayedColumns: string[] = [
    'date',
    'operation',
    'description',
    'sourceAccount',
    'destinationAccount',
    'amount',
    'status',
    'actions'
  ];

  totalRecords = 0;
  pageSize = 10;

  constructor(
    private fb: FormBuilder,
    private dialog: MatDialog
  ) {
    this.filterForm = this.fb.group({
      dateFrom: [''],
      dateTo: [''],
      operationNumber: [''],
      description: [''],
      destinationAccount: ['']
    });
  }

  ngOnInit() {
    this.loadTransfers();
  }

  loadTransfers() {
    this.transfers = [
      {
        id: '1',
        requestNumber: 'TRF-2024-524188',
        operationNumber: 'OP-2024-524188',
        sourceAccount: 'TRF-2024-524188',
        destinationAccount: 'TRF-2024-524188',
        beneficiaryName: 'Synopsies S.A.',
        destinationBank: 'BCP',
        amount: 220.00,
        currency: 'PEN',
        description: 'Pago servicios octubre',
        transferType: 'IMMEDIATE',
        status: 'PENDIENTE',
        createdAt: new Date('2025-10-16T09:28:00'),
        approvers: [
          {
            name: 'Carlos Mendoza',
            email: 'cmendoza@tuempresa.com',
            status: 'PENDIENTE'
          }
        ]
      },
      {
        id: '2',
        requestNumber: 'TRF-2024-524187',
        operationNumber: 'OP-2024-524187',
        sourceAccount: 'TRF-2024-524187',
        destinationAccount: 'TRF-2024-524187',
        beneficiaryName: 'Proveedores Unidos SAC',
        destinationBank: 'Interbank',
        amount: 1500.00,
        currency: 'PEN',
        description: 'Pago facturas pendientes',
        transferType: 'IMMEDIATE',
        status: 'APROBADO',
        createdAt: new Date('2025-10-15T14:20:00'),
        executedAt: new Date('2025-10-15T14:25:00'),
        approvers: [
          {
            name: 'Carlos Mendoza',
            email: 'cmendoza@tuempresa.com',
            status: 'APROBADO',
            approvedAt: new Date('2025-10-15T14:22:00')
          }
        ]
      },
      {
        id: '3',
        requestNumber: 'TRF-2024-524186',
        operationNumber: 'OP-2024-524186',
        sourceAccount: 'TRF-2024-524186',
        destinationAccount: 'TRF-2024-524186',
        beneficiaryName: 'Servicios Generales SA',
        destinationBank: 'BBVA',
        amount: 3400.00,
        currency: 'PEN',
        description: 'Mantenimiento equipos',
        transferType: 'IMMEDIATE',
        status: 'PROCESADO',
        createdAt: new Date('2025-10-14T10:15:00'),
        executedAt: new Date('2025-10-14T10:20:00')
      }
    ];

    this.totalRecords = this.transfers.length;
  }

  viewDetail(transfer: Transfer) {
    this.dialog.open(TransferDetailDialogComponent, {
      width: '700px',
      data: { transfer }
    });
  }

  downloadReceipt(transfer: Transfer) {
    console.log('Downloading receipt for:', transfer.id);
  }

  exportToExcel() {
    console.log('Exporting to Excel');
  }

  getStatusClass(status: TransferStatus): string {
    const statusMap: Record<TransferStatus, string> = {
      'PENDIENTE': 'pending',
      'APROBADO': 'approved',
      'RECHAZADO': 'rejected',
      'PROCESADO': 'processed',
      'FALLIDO': 'failed'
    };
    return statusMap[status] || '';
  }
}
