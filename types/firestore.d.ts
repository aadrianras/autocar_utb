export type Provider = {
  id?: string;
  contactName: string;
  city: string;
  address: string;
  company: string;
  contactPhone: string;
}

export interface User {
  uid: string;
  name: string;
  lastname: string;
  job: string;
  phone: number;
  role: 'admin' | 'editor';
}

export interface PurchaseOrder {
  id?: string;
  date: Date;
  createdBy: string;
  providerId: string;
  orderedCars: OrderedCars[];
  status: 'pending' | 'rejected' | 'approved'
}

export interface OrderedCars {
  year: number;
  quantity: number;
  name: string;
  detail: string;
}