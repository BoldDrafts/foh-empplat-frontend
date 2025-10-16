export interface User {
  id: string;
  documentType: 'DNI' | 'CE' | 'Pasaporte';
  documentNumber: string;
  name: string;
  email: string;
  ruc?: string;
  companyName?: string;
  companies: Company[];
  roles: string[];
}

export interface Company {
  code: string;
  name: string;
  ruc: string;
}

export interface UserInfo {
  name: string;
  dni: string;
  companyName: string;
  ruc: string;
  email: string;
}
