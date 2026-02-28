
import React from 'react';
import { InvoiceData } from '../types';
import { numberToWords } from '../utils/numberToWords';

interface InvoicePreviewProps {
  data: InvoiceData;
}

const InvoicePreview: React.FC<InvoicePreviewProps> = ({ data }) => {
  const subtotal = data.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0);
  const cgstAmount = (subtotal * data.cgstRate) / 100;
  const sgstAmount = (subtotal * data.sgstRate) / 100;
  const igstAmount = (subtotal * data.igstRate) / 100;
  const total = subtotal + cgstAmount + sgstAmount + igstAmount;
  const roundedTotal = Math.round(total);
  const roundOff = roundedTotal - total;

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(val);
  };

  return (
    <div className="bg-white p-4 md:p-6 shadow-2xl border border-gray-400 rounded-sm max-w-[8.5in] mx-auto text-[9px] leading-tight text-black flex flex-col font-sans" id="printable-invoice">
      
      {/* Top Border Header */}
      <div className="border border-black p-1 flex justify-between items-center bg-white border-b-0">
        <div className="font-bold text-[11px]">GSTIN – {data.vendorGstin}</div>
        <div className="text-lg font-bold text-blue-600 pr-4">Tax Invoice</div>
      </div>

      {/* Main Vendor Block */}
      <div className="border border-black grid grid-cols-[1.2fr_1fr] min-h-[60px]">
        <div className="p-2 border-r border-black flex flex-col justify-center">
          <h1 className="text-xl font-black text-red-600 mb-1 leading-none">{data.vendorName}</h1>
          <p className="text-[9px] text-gray-800 font-medium">
            Deals in: New Elevator Installation Modification Repair
          </p>
          <p className="text-[9px] text-gray-800 font-medium">
            Maintenance All Type Elevator Part, Service, & AMC
          </p>
        </div>
        <div className="p-2 flex flex-col justify-center space-y-0.5">
          <p className="font-bold text-[10px]">{data.vendorAddress}</p>
          <p className="font-medium text-[9px]">Ph. No. – {data.vendorPhone}</p>
          <p className="font-medium text-[9px]">Email– <span className="text-blue-600 underline cursor-pointer">{data.vendorEmail}</span></p>
        </div>
      </div>

      {/* Receiver & Invoice Details */}
      <div className="border border-black border-t-0 grid grid-cols-[1.2fr_1fr]">
        <div className="p-2 border-r border-black">
          <h2 className="text-[12px] font-bold mb-2 underline decoration-1 underline-offset-2">Details of receiver (Billed To)</h2>
          <div className="space-y-2">
            <div className="grid grid-cols-[80px_1fr]">
              <span className="font-bold text-[11px]">Company Name</span>
              <span className="text-[11px] border-b border-dotted border-black flex-grow ml-2">{data.clientName}</span>
            </div>
            <div className="grid grid-cols-[80px_1fr]">
              <span className="font-bold text-[11px]">Address</span>
              <span className="text-[11px] border-b border-dotted border-black flex-grow ml-2 min-h-[16px]">{data.clientAddress}</span>
            </div>
            <div className="mt-2 pt-1">
              <div className="grid grid-cols-[80px_1fr] mb-1">
                <span className="font-bold text-[11px]">GSTIN –</span>
                <span className="text-[11px] border-b border-dotted border-black flex-grow ml-2">{data.clientGstin}</span>
              </div>
              <div className="grid grid-cols-[80px_1fr_80px_1fr]">
                <span className="font-bold text-[11px]">State –</span>
                <span className="border-b border-dotted border-black ml-2 px-2 text-[10px]">Delhi</span>
                <span className="font-bold text-[11px] ml-4">State Code -</span>
                <span className="border-b border-dotted border-black ml-2 px-2 text-[10px]">07</span>
              </div>
            </div>
          </div>
        </div>
        <div className="divide-y divide-black text-[9px]">
          <div className="p-1.5 grid grid-cols-[120px_1fr]">
            <span className="font-bold">INVOICE SERIAL NO.</span>
            <span className="font-bold pl-2">- {data.invoiceNumber}</span>
          </div>
          <div className="p-1.5 grid grid-cols-[120px_1fr]">
            <span className="font-bold">INVOICE DATE</span>
            <span className="font-bold pl-2">- {data.date}</span>
          </div>
          <div className="p-1.5 grid grid-cols-[120px_1fr]">
            <span className="font-bold">Transportation mode</span>
            <span className="font-bold pl-2">-</span>
          </div>
          <div className="p-1.5 grid grid-cols-[120px_1fr]">
            <span className="font-bold">GR/RR/PR No.</span>
            <span className="text-gray-400 italic text-[8px]">...................................</span>
          </div>
          <div className="p-1.5 grid grid-cols-[120px_1fr]">
            <span className="font-bold">Date of Supply</span>
            <span className="text-gray-400 italic text-[8px]">...................................</span>
          </div>
          <div className="p-1.5 grid grid-cols-[120px_1fr]">
            <span className="font-bold">Place of Supply.</span>
            <span className="font-bold pl-2">-</span>
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-grow border-x border-black">
        <table className="w-full text-center border-collapse table-fixed">
          <thead>
            <tr className="border-b border-black">
              <th className="border-r border-black py-2 w-16 font-bold uppercase">S No.</th>
              <th className="border-r border-black py-2 text-left px-4 font-bold uppercase w-1/2">DESCRIPTION OF GOODS</th>
              <th className="border-r border-black py-2 w-24 font-bold uppercase">HSN CODE</th>
              <th className="border-r border-black py-2 w-20 font-bold uppercase">QTY.</th>
              <th className="border-r border-black py-2 w-28 font-bold uppercase">RATE</th>
              <th className="py-2 w-32 font-bold uppercase">AMOUNT</th>
            </tr>
          </thead>
          <tbody className="h-full">
            {data.items.map((item, index) => (
              <tr key={item.id} className="min-h-[24px] border-b border-gray-100">
                <td className="border-r border-black py-2 align-top">{index + 1}</td>
                <td className="border-r border-black py-2 text-left px-4 align-top font-medium break-words">{item.description}</td>
                <td className="border-r border-black py-2 align-top">{item.hsnCode}</td>
                <td className="border-r border-black py-2 align-top">{item.quantity}</td>
                <td className="border-r border-black py-2 align-top">{formatCurrency(item.unitPrice)}</td>
                <td className="py-2 text-right pr-4 font-bold align-top">{formatCurrency(item.quantity * item.unitPrice)}</td>
              </tr>
            ))}
            {/* Pad the space with reduced rows */}
            {data.items.length < 5 && Array.from({ length: 5 - data.items.length }).map((_, i) => (
              <tr key={`empty-${i}`} className="h-5">
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td className="border-r border-black"></td>
                <td></td>
              </tr>
            ))}
            <tr className="border-t border-black font-bold text-[11px]">
              <td className="border-r border-black"></td>
              <td className="border-r border-black text-left px-4 py-1.5">TOTAL</td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="border-r border-black"></td>
              <td className="py-1.5 text-right pr-4">{formatCurrency(subtotal)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Footer / Taxes / Bank Details */}
      <div className="border border-black grid grid-cols-[1.4fr_1fr] border-t-0">
        <div className="p-2 border-r border-black space-y-0.5 text-[9px]">
          <p className="font-bold text-[10px] uppercase mb-0.5">PAN {data.pan}</p>
          <p className="font-bold text-[10px]">BANK DETAIL – {data.bankName}</p>
          <p className="font-bold">CURRENT A/C NO. {data.bankAccount}</p>
          <p className="font-bold">IFSC CODE- {data.bankIfsc}</p>
          
          <div className="mt-4">
            <h3 className="text-[12px] font-bold border-b border-black inline-block mb-0.5">Amount in words</h3>
            <p className="text-[11px] font-bold">{numberToWords(roundedTotal)}</p>
          </div>
        </div>
        
        <div className="divide-y divide-black font-bold text-[10px]">
          <div className="p-1.5 grid grid-cols-[100px_1fr]">
            <span>CGST. = {data.cgstRate}%</span>
            <span className="text-right pr-2">{formatCurrency(cgstAmount)}</span>
          </div>
          <div className="p-1.5 grid grid-cols-[100px_1fr]">
            <span>SGST = {data.sgstRate}%</span>
            <span className="text-right pr-2">{formatCurrency(sgstAmount)}</span>
          </div>
          <div className="p-1.5 grid grid-cols-[100px_1fr]">
            <span>IGST. = {data.igstRate}%</span>
            <span className="text-right pr-2">{formatCurrency(igstAmount)}</span>
          </div>
          <div className="p-1.5 grid grid-cols-[100px_1fr]">
            <span className="font-normal italic">Round off</span>
            <span className="text-right pr-2">{formatCurrency(roundOff)}</span>
          </div>
          <div className="p-2 grid grid-cols-[120px_1fr] text-[13px] font-black uppercase">
            <span>Grand total =</span>
            <span className="text-right pr-2">{formatCurrency(roundedTotal)}</span>
          </div>
        </div>
      </div>

      {/* Declaration & Signature */}
      <div className="border border-black border-t-0 grid grid-cols-[1.2fr_1fr] divide-x divide-black">
        <div className="p-2 space-y-0.5 font-bold text-[10px]">
          <p>E.&O. E</p>
          <p>Goods once sold will not take back</p>
          <p>Subject to Delhi jurisdiction</p>
        </div>
        <div className="p-2 text-center flex flex-col justify-between items-center min-h-[100px]">
          <p className="text-[9px] uppercase font-bold">CERTIFIED THAT THE PARTICULARS GIVEN ABOVE ARE TRUE AND CORRECT</p>
          <div className="w-full">
            <p className="text-red-600 font-black uppercase text-[11px] mb-4">FOR {data.vendorName}</p>
            <div className="h-8 border-b border-dotted border-black w-2/3 mx-auto mb-1"></div>
            <p className="font-bold text-[11px]">Authorised Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InvoicePreview;
