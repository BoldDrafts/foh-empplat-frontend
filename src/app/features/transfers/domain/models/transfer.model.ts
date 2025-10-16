export interface Transfer {
  id: string;
  requestNumber: string;
  operationNumber: string;
  sourceAccount: string;
  destinationAccount: string;
  beneficiaryName: string;
  destinationBank: string;
  amount: number;
  currency: 'PEN' | 'USD';
  description: string;
  transferType: 'IMMEDIATE' | 'SCHEDULED';
  status: TransferStatus;
  createdAt: Date;
  executedAt?: Date;
  approvers?: Approver[];
}

export type TransferStatus =
  | 'PENDIENTE'
  | 'APROBADO'
  | 'RECHAZADO'
  | 'PROCESADO'
  | 'FALLIDO';

export interface Approver {
  name: string;
  email: string;
  status: 'PENDIENTE' | 'APROBADO' | 'RECHAZADO';
  observation?: string;
  approvedAt?: Date;
}

export interface CreateTransferRequest {
  transferType: 'CHECKING' | 'CTS';
  sourceAccount: string;
  destinationAccount: string;
  beneficiaryName: string;
  currency: 'PEN' | 'USD';
  amount: number;
  description: string;
  saveAsRecurring: boolean;
  recurringName?: string;
}

export interface FrequentOperation {
  id: string;
  description: string;
  destinationAccount: string;
  destinationBank: string;
  beneficiaryName: string;
  amount: number;
  currency: string;
  accountNumber: string;
}
