
import React, { useState, useEffect, useRef } from 'react';
import { InvoiceData, EMPTY_INVOICE } from './types';
import { extractInvoiceFromImage } from './services/geminiService';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';

const SUPPORTED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif', 'application/pdf'];

const App: React.FC = () => {
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData>(EMPTY_INVOICE);
  const [history, setHistory] = useState<InvoiceData[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'editor' | 'history'>('editor');
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('invoice_history');
    if (saved) setHistory(JSON.parse(saved));
    
    const lastNum = localStorage.getItem('last_invoice_number');
    if (!lastNum) {
      localStorage.setItem('last_invoice_number', '114');
    }
  }, []);

  const saveToHistory = () => {
    const newHistory = [currentInvoice, ...history].slice(0, 50);
    setHistory(newHistory);
    localStorage.setItem('invoice_history', JSON.stringify(newHistory));
    alert('Invoice saved to history!');
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local validation to prevent "application/x-zip-compressed" errors or other unsupported types
    if (!SUPPORTED_TYPES.includes(file.type)) {
      setError(`Unsupported file type: ${file.type || 'unknown'}. Please upload a JPG, PNG, WEBP, or PDF.`);
      if (fileInputRef.current) fileInputRef.current.value = '';
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      const reader = new FileReader();
      reader.onerror = () => {
        setError("Failed to read the file. It might be corrupted.");
        setIsProcessing(false);
      };
      
      reader.onload = async () => {
        try {
          const base64 = reader.result as string;
          const extracted = await extractInvoiceFromImage(base64, file.type);
          
          // Merge with defaults
          const merged: InvoiceData = {
            ...EMPTY_INVOICE,
            ...extracted,
            // Ensure unique IDs for items
            items: (extracted.items || []).map((item: any) => ({
              ...item,
              id: Math.random().toString(36).substr(2, 9)
            })),
            // Use extracted dates or default to current
            date: extracted.date || EMPTY_INVOICE.date,
            dueDate: extracted.dueDate || EMPTY_INVOICE.dueDate,
          } as InvoiceData;

          // If no items were extracted, keep the default one
          if (merged.items.length === 0) {
            merged.items = EMPTY_INVOICE.items;
          }

          setCurrentInvoice(merged);
        } catch (err: any) {
          setError(err.message || 'Failed to process invoice data.');
        } finally {
          setIsProcessing(false);
          if (fileInputRef.current) fileInputRef.current.value = '';
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      setError("An unexpected error occurred during file upload.");
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handlePrint = () => {
    window.print();
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
            {/* Left: Editor & Upload */}
            <div className="no-print space-y-6">
              <div className="bg-indigo-600 rounded-xl p-8 text-white shadow-lg overflow-hidden relative">
                <div className="relative z-10">
                  <h2 className="text-2xl font-bold mb-2">Create from AI Scan</h2>
                  <p className="text-indigo-100 mb-6">Upload a previous invoice and Gemini will automatically extract all data to pre-fill this form.</p>
                  
                  <div className="flex flex-wrap gap-3">
                    <button 
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isProcessing}
                      className="bg-white text-indigo-600 px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:bg-indigo-50 transition disabled:opacity-50"
                    >
                      {isProcessing ? (
                        <div className="animate-spin w-5 h-5 border-2 border-indigo-600 border-t-transparent rounded-full" />
                      ) : (
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      )}
                      {isProcessing ? 'Reading Invoice...' : 'Scan Old Invoice'}
                    </button>
                    <button 
                      onClick={() => {
                        const lastNum = parseInt(localStorage.getItem('last_invoice_number') || '114');
                        const nextNum = lastNum + 1;
                        localStorage.setItem('last_invoice_number', nextNum.toString());
                        setCurrentInvoice({ ...EMPTY_INVOICE, invoiceNumber: `${nextNum}` });
                        setError(null);
                      }}
                      className="bg-indigo-500 text-white px-6 py-3 rounded-lg font-bold hover:bg-indigo-400 transition"
                    >
                      Start New
                    </button>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    className="hidden" 
                    accept=".jpg,.jpeg,.png,.webp,.pdf"
                    onChange={handleFileUpload}
                  />
                </div>
                {/* Decorative blob */}
                <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 bg-indigo-400 rounded-full opacity-20 blur-3xl"></div>
              </div>

              {error && (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 flex items-start gap-3 rounded-md shadow-sm">
                  <svg className="w-5 h-5 mt-0.5 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm">{error}</div>
                </div>
              )}

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
                      <div className="text-xs text-gray-400 font-medium uppercase">{inv.date}</div>
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
                        {new Intl.NumberFormat('en-US', { style: 'currency', currency: inv.currency }).format(
                          inv.items.reduce((acc, item) => acc + (item.quantity * item.unitPrice), 0) * (1 + (inv.taxRate/100))
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
