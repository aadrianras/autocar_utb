import { Moment } from "moment";

export type Provider = {
  id?: string;
  contactName: string;
  city: string;
  address: string;
  company: string;
  contactPhone: string;
};

export type Client = {
  id?: string;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  address: string;
  invoiceName: string;
  invoiceNumber: string;
  contactPhone: string;
};

export type SaleOrder = {
  id?: string;
  clientId: string;
  date: moment.Moment;
  cars: OrderedCarForSale[];
  total: number;
  invoice: string;
  status: 'pending' | 'completed' | 'canceled'
}

export type OrderedCarForSale = {
  carId: string;
  quantity: number;
  profit: number;
  subTotal: number;
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
  status: 'pending' | 'rejected' | 'approved';
}

export interface OrderedCar {
  year: number;
  quantity: number;
  name: string;
  detail: string;
}

export interface ReceptionOrder {
  id?: string;
  date: number;
  createdBy: string;
  providerId: string;
  cars?: Car[];
  stock?: Stock[];
}

export interface Stock {
  carId: string;
  quantity: number;
}

export interface Car {
  cc: number;
  color: string;
  company: string;
  doors: number;
  edition: string;
  fuel: string;
  hp: number;
  id?: string;
  name: string;
  providerId: string;
  quantity: number;
  type: string;
  year: number;
  price: number;
}
