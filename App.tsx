
import React, { useState, useEffect } from 'react';
import { InvoiceData, EMPTY_INVOICE } from './types';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';

const App: React.FC = () => {
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData>(EMPTY_INVOICE);
  const [history, setHistory] = useState<InvoiceData[]>([]);
  const [view, setView] = useState<'editor' | 'history'>('editor');

  useEffect(() => {
    const saved = localStorage.getItem('invoice_history');
    if (saved) setHistory(JSON.parse(saved));
    
    localStorage.setItem('last_invoice_number', '114');
  }, []);

  const persistHistory = (newHistory: InvoiceData[]) => {
    setHistory(newHistory);
    localStorage.setItem('invoice_history', JSON.stringify(newHistory));
  };

  const saveToHistory = () => {
    const filtered = history.filter(h => h.invoiceNumber !== currentInvoice.invoiceNumber);
    persistHistory([currentInvoice, ...filtered].slice(0, 50));
    alert('Invoice saved to history!');
  };

  const deleteFromHistory = (idx: number) => {
    persistHistory(history.filter((_, i) => i !== idx));
  };

  const handlePrint = () => {
    const filtered = history.filter(h => h.invoiceNumber !== currentInvoice.invoiceNumber);
    persistHistory([currentInvoice, ...filtered].slice(0, 50));
    const prev = document.title;
    document.title = `${currentInvoice.clientName || 'Invoice'} - ${currentInvoice.invoiceNumber}`.trim();
    window.print();
    document.title = prev;
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="no-print bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">SmartInvoice AI</span>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setView('editor')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${view === 'editor' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Generator
              </button>
              <button 
                onClick={() => setView('history')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition ${view === 'history' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}
              >
                History ({history.length})
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {view === 'editor' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left: Editor */}
            <div className="no-print space-y-6">
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => {
                    const lastNum = parseInt(localStorage.getItem('last_invoice_number') || '114');
                    const nextNum = lastNum + 1;
                    localStorage.setItem('last_invoice_number', nextNum.toString());
                    setCurrentInvoice({ ...EMPTY_INVOICE, invoiceNumber: `${nextNum}` });
                  }}
                  className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition"
                >
                  + Start New Invoice
                </button>
              </div>

              <InvoiceForm data={currentInvoice} onChange={setCurrentInvoice} />
            </div>

            {/* Right: Preview */}
            <div className="space-y-4">
              <div className="no-print flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-900">Live Preview</h3>
                <div className="flex gap-2">
                  <button 
                    onClick={saveToHistory}
                    className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-50 transition"
                  >
                    Save Draft
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                    </svg>
                    Print / Export PDF
                  </button>
                </div>
              </div>
              <InvoicePreview data={currentInvoice} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Past Invoices</h2>
            {history.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">No invoices yet</h3>
                <p className="text-gray-500 mt-1">Generated invoices will appear here for quick access.</p>
                <button 
                  onClick={() => setView('editor')}
                  className="mt-6 text-indigo-600 font-bold hover:underline"
                >
                  Start creating your first invoice
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.map((inv, idx) => (
                  <div 
                    key={idx} 
                    className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group"
                    onClick={() => {
                      setCurrentInvoice(inv);
                      setView('editor');
                    }}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm font-bold text-indigo-600">#{inv.invoiceNumber}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-400 font-medium uppercase">{inv.date}</div>
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteFromHistory(idx); }}
                          className="text-gray-300 hover:text-red-500 transition"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-gray-900 font-bold text-lg leading-tight group-hover:text-indigo-600 transition">{inv.clientName || 'Unknown Client'}</div>
                      <div className="text-sm text-gray-500">{inv.vendorName}</div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-xs text-gray-400">
                        {inv.items.length} {inv.items.length === 1 ? 'item' : 'items'}
                      </div>
                      <div className="text-xl font-bold text-gray-900">
                        {new Intl.NumberFormat(inv.currency === 'USD' ? 'en-US' : 'en-IN', { style: 'currency', currency: inv.currency || 'INR' }).format(
                          inv.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0) +
                          inv.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0) * ((inv.cgstRate + inv.sgstRate + inv.igstRate) / 100)
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
