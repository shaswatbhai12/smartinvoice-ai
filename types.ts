
export interface InvoiceItem {
  id: string;
  description: string;
  hsnCode?: string;
  quantity: number;
  unitPrice: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  date: string;
  dueDate: string;
  
  // Vendor Info
  vendorName: string;
  vendorAddress: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorGstin: string;
  
  // Client Info
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  clientGstin: string;
  
  // Items
  items: InvoiceItem[];
  
  // Financial Details
  pan: string;
  bankName: string;
  bankAccount: string;
  bankIfsc: string;
  
  // Taxes
  cgstRate: number;
  sgstRate: number;
  igstRate: number;
  
  notes: string;
  currency: string;
}

export interface AppState {
  history: InvoiceData[];
  currentInvoice: InvoiceData;
  isProcessing: boolean;
  error: string | null;
}

export const EMPTY_INVOICE: InvoiceData = {
  invoiceNumber: ``,
  date: new Date().toISOString().split('T')[0],
  dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  vendorName: 'STAR LIFT AND CONTROLLER',
  vendorAddress: 'A-437 POCKET 00 SECTOR 2 ROHINI',
  vendorEmail: 'sanjeevkumar9868@gmail.com',
  vendorPhone: '9625075388, 9868051925',
  vendorGstin: '07ATQPK4160N1Z4',
  clientName: '',
  clientAddress: '',
  clientEmail: '',
  clientGstin: '',
  items: [
    { id: '1', description: 'Annual Maintenance Contract for Elevator', hsnCode: '', quantity: 1, unitPrice: 0 }
  ],
  pan: 'ATQPK4160N',
  bankName: 'KOTAK MAHINDRA BANK',
  bankAccount: '9868051925',
  bankIfsc: 'KKBK0004601',
  cgstRate: 9,
  sgstRate: 9,
  igstRate: 0,
  notes: 'Goods once sold will not take back. Subject to Delhi jurisdiction.',
  currency: 'INR'
};
