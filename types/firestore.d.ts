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
  date: number;
  createdBy: string;
  providerId: string;
  orderedCars: OrderedCar[];
  status: 'pending' | 'rejected' | 'approved'
}

export interface OrderedCar {
  year: number;
  quantity: number;
  name: string;
  detail: string;
}

export interface Car {
  year: number;
  quantity: number;
  name: string;
  cc: number;
  company: string;
  edition: string;
  color: string;
  doors: number;
  hp: number;
  type: string;
  fuel: string;
}