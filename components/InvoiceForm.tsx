
import React from 'react';
import { InvoiceData, InvoiceItem } from '../types';

interface InvoiceFormProps {
  data: InvoiceData;
  onChange: (data: InvoiceData) => void;
}

const InvoiceForm: React.FC<InvoiceFormProps> = ({ data, onChange }) => {
  const updateField = (field: keyof InvoiceData, value: any) => {
    onChange({ ...data, [field]: value });
  };

  const updateItem = (id: string, updates: Partial<InvoiceItem>) => {
    const newItems = data.items.map(item => 
      item.id === id ? { ...item, ...updates } : item
    );
    updateField('items', newItems);
  };

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Math.random().toString(36).substr(2, 9),
      description: '',
      hsnCode: '',
      quantity: 1,
      unitPrice: 0
    };
    updateField('items', [...data.items, newItem]);
  };

  const removeItem = (id: string) => {
    if (data.items.length > 1) {
      updateField('items', data.items.filter(i => i.id !== id));
    }
  };

  return (
    <div className="space-y-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Invoice Header</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Serial Number</label>
              <input type="text" value={data.invoiceNumber} onChange={(e) => updateField('invoiceNumber', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Date</label>
              <input type="date" value={data.date} onChange={(e) => updateField('date', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Currency</label>
            <select value={data.currency} onChange={(e) => updateField('currency', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-indigo-500 outline-none">
              <option value="INR">INR (₹)</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tax Rates (%)</h3>
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">CGST</label>
              <input type="number" value={data.cgstRate} onChange={(e) => updateField('cgstRate', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-200 rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">SGST</label>
              <input type="number" value={data.sgstRate} onChange={(e) => updateField('sgstRate', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-200 rounded-md" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">IGST</label>
              <input type="number" value={data.igstRate} onChange={(e) => updateField('igstRate', parseFloat(e.target.value) || 0)} className="w-full px-3 py-2 border border-gray-200 rounded-md" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Vendor Details (Your Info)</h3>
          <input type="text" placeholder="Vendor Name" value={data.vendorName} onChange={(e) => updateField('vendorName', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-medium" />
          <textarea placeholder="Vendor Address" value={data.vendorAddress} onChange={(e) => updateField('vendorAddress', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md h-20 text-sm" />
          <div className="grid grid-cols-2 gap-4">
            <input type="text" placeholder="Vendor GSTIN" value={data.vendorGstin} onChange={(e) => updateField('vendorGstin', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
            <input type="text" placeholder="Vendor PAN" value={data.pan} onChange={(e) => updateField('pan', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Client Details (Billed To)</h3>
          <input type="text" placeholder="Client Name" value={data.clientName} onChange={(e) => updateField('clientName', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md font-medium" />
          <textarea placeholder="Client Address" value={data.clientAddress} onChange={(e) => updateField('clientAddress', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md h-20 text-sm" />
          <input type="text" placeholder="Client GSTIN" value={data.clientGstin} onChange={(e) => updateField('clientGstin', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Bank Details</h3>
        <div className="grid grid-cols-3 gap-4">
          <input type="text" placeholder="Bank Name" value={data.bankName} onChange={(e) => updateField('bankName', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-md text-sm" />
          <input type="text" placeholder="Account No" value={data.bankAccount} onChange={(e) => updateField('bankAccount', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-md text-sm" />
          <input type="text" placeholder="IFSC Code" value={data.bankIfsc} onChange={(e) => updateField('bankIfsc', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-md text-sm" />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Items</h3>
        <div className="space-y-3">
          {data.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg">
              <div className="flex-grow space-y-2">
                <input type="text" placeholder="Description" value={item.description} onChange={(e) => updateItem(item.id, { description: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
                <input type="text" placeholder="HSN Code" value={item.hsnCode} onChange={(e) => updateItem(item.id, { hsnCode: e.target.value })} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
              </div>
              <div className="w-20">
                <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateItem(item.id, { quantity: parseInt(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
              </div>
              <div className="w-32">
                <input type="number" placeholder="Rate" value={item.unitPrice} onChange={(e) => updateItem(item.id, { unitPrice: parseFloat(e.target.value) || 0 })} className="w-full px-3 py-2 border border-gray-200 rounded-md text-sm" />
              </div>
              <button onClick={() => removeItem(item.id)} className="p-2 text-gray-400 hover:text-red-500"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          ))}
        </div>
        <button onClick={addItem} className="flex items-center gap-2 text-sm font-medium text-indigo-600 hover:text-indigo-700">Add Line Item</button>
      </div>

      <div>
        <label className="block text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Footnote / Declaration</label>
        <textarea value={data.notes} onChange={(e) => updateField('notes', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-md h-24 text-sm" />
      </div>
    </div>
  );
};

export default InvoiceForm;
