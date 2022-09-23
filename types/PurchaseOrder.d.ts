export interface DataTablePurchaseOrder {
  id: string;
  company: string;
  date: string;
  createdBy: string;
  status: 'pending' | 'rejected' | 'approved';
}