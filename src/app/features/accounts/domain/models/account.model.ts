export interface Account {
  id: string;
  number: string;
  cci: string;
  type: 'CHECKING' | 'CTS' | 'SAVINGS';
  currency: 'PEN' | 'USD';
  availableBalance: number;
  retainedBalance: number;
  status: 'ACTIVO' | 'INACTIVO' | 'BLOQUEADO';
  company: string;
  createdAt: Date;
}

export interface AccountBalance {
  accountNumber: string;
  availableBalance: number;
  retainedBalance: number;
  totalBalance: number;
  currency: string;
}
