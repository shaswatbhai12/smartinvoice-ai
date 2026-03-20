
import React, { useState, useEffect } from 'react';
import { InvoiceData, EMPTY_INVOICE } from './types';
import InvoiceForm from './components/InvoiceForm';
import InvoicePreview from './components/InvoicePreview';

interface VendorProfile {
  id: string;
  vendorName: string;
  vendorAddress: string;
  vendorEmail: string;
  vendorPhone: string;
  vendorGstin: string;
  pan: string;
  bankName: string;
  bankAccount: string;
  bankIfsc: string;
  dealsIn: string;
  lastInvoiceNumber: number;
}

const EMPTY_PROFILE: Omit<VendorProfile, 'id'> = {
  vendorName: '',
  vendorAddress: '',
  vendorEmail: '',
  vendorPhone: '',
  vendorGstin: '',
  pan: '',
  bankName: '',
  bankAccount: '',
  bankIfsc: '',
  dealsIn: '',
  lastInvoiceNumber: 114,
};

interface ProfileFormModalProps {
  profileDraft: Omit<VendorProfile, 'id'>;
  setProfileDraft: React.Dispatch<React.SetStateAction<Omit<VendorProfile, 'id'>>>;
  editingProfile: VendorProfile | null;
  profiles: VendorProfile[];
  onSave: () => void;
  onCancel: () => void;
}

const ProfileFormModal: React.FC<ProfileFormModalProps> = ({ profileDraft, setProfileDraft, editingProfile, profiles, onSave, onCancel }) => {
  const inputCls = "w-full px-3 py-2 border border-gray-200 rounded-md text-sm focus:ring-2 focus:ring-indigo-500 outline-none";
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-6 space-y-4 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold text-gray-900">{editingProfile ? 'Edit Profile' : 'New Vendor Profile'}</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Company Name *</label>
            <input className={inputCls} placeholder="e.g. STAR LIFT AND CONTROLLER" value={profileDraft.vendorName} onChange={e => setProfileDraft(d => ({ ...d, vendorName: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Deals In</label>
            <input className={inputCls} placeholder="e.g. New Elevator Installation, Repair, AMC" value={profileDraft.dealsIn} onChange={e => setProfileDraft(d => ({ ...d, dealsIn: e.target.value }))} />
          </div>
          <div className="col-span-2">
            <label className="block text-xs font-medium text-gray-500 mb-1">Address</label>
            <textarea className={`${inputCls} h-16`} placeholder="Full address" value={profileDraft.vendorAddress} onChange={e => setProfileDraft(d => ({ ...d, vendorAddress: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Phone</label>
            <input className={inputCls} placeholder="Phone number" value={profileDraft.vendorPhone} onChange={e => setProfileDraft(d => ({ ...d, vendorPhone: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
            <input className={inputCls} placeholder="Email" value={profileDraft.vendorEmail} onChange={e => setProfileDraft(d => ({ ...d, vendorEmail: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">GSTIN</label>
            <input className={inputCls} placeholder="GSTIN" value={profileDraft.vendorGstin} onChange={e => setProfileDraft(d => ({ ...d, vendorGstin: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">PAN</label>
            <input className={inputCls} placeholder="PAN" value={profileDraft.pan} onChange={e => setProfileDraft(d => ({ ...d, pan: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Bank Name</label>
            <input className={inputCls} placeholder="Bank Name" value={profileDraft.bankName} onChange={e => setProfileDraft(d => ({ ...d, bankName: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Account No</label>
            <input className={inputCls} placeholder="Account No" value={profileDraft.bankAccount} onChange={e => setProfileDraft(d => ({ ...d, bankAccount: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">IFSC Code</label>
            <input className={inputCls} placeholder="IFSC Code" value={profileDraft.bankIfsc} onChange={e => setProfileDraft(d => ({ ...d, bankIfsc: e.target.value }))} />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Starting Invoice No.</label>
            <input type="number" className={inputCls} value={profileDraft.lastInvoiceNumber} onChange={e => setProfileDraft(d => ({ ...d, lastInvoiceNumber: parseInt(e.target.value) || 0 }))} />
          </div>
        </div>
        <div className="flex gap-3 pt-2">
          <button onClick={onSave} className="flex-1 bg-indigo-600 text-white py-2 rounded-lg font-bold hover:bg-indigo-700 transition">Save Profile</button>
          {profiles.length > 0 && (
            <button onClick={onCancel} className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition">Cancel</button>
          )}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [profiles, setProfiles] = useState<VendorProfile[]>([]);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);
  const [view, setView] = useState<'editor' | 'history' | 'profiles'>('editor');
  const [showProfileForm, setShowProfileForm] = useState(false);
  const [editingProfile, setEditingProfile] = useState<VendorProfile | null>(null);
  const [profileDraft, setProfileDraft] = useState<Omit<VendorProfile, 'id'>>(EMPTY_PROFILE);
  const [currentInvoice, setCurrentInvoice] = useState<InvoiceData>(EMPTY_INVOICE);
  const [history, setHistory] = useState<InvoiceData[]>([]);

  // Load from localStorage
  useEffect(() => {
    const savedProfiles = localStorage.getItem('vendor_profiles');
    const savedActiveId = localStorage.getItem('active_profile_id');
    const savedHistory = localStorage.getItem('invoice_history');

    const parsedProfiles: VendorProfile[] = savedProfiles ? JSON.parse(savedProfiles) : [];
    setProfiles(parsedProfiles);
    if (savedHistory) setHistory(JSON.parse(savedHistory));

    if (parsedProfiles.length === 0) {
      setView('profiles');
      setShowProfileForm(true);
    } else {
      const active = savedActiveId && parsedProfiles.find(p => p.id === savedActiveId)
        ? savedActiveId
        : parsedProfiles[0].id;
      setActiveProfileId(active);
      applyProfile(parsedProfiles.find(p => p.id === active)!, parsedProfiles.find(p => p.id === active)!.lastInvoiceNumber);
    }
  }, []);

  const GSTIN_STATE_MAP: Record<string, string> = {
    '01':'Jammu & Kashmir','02':'Himachal Pradesh','03':'Punjab','04':'Chandigarh','05':'Uttarakhand',
    '06':'Haryana','07':'Delhi','08':'Rajasthan','09':'Uttar Pradesh','10':'Bihar','11':'Sikkim',
    '12':'Arunachal Pradesh','13':'Nagaland','14':'Manipur','15':'Mizoram','16':'Tripura',
    '17':'Meghalaya','18':'Assam','19':'West Bengal','20':'Jharkhand','21':'Odisha',
    '22':'Chhattisgarh','23':'Madhya Pradesh','24':'Gujarat','26':'Dadra & Nagar Haveli and Daman & Diu',
    '27':'Maharashtra','28':'Andhra Pradesh','29':'Karnataka','30':'Goa','31':'Lakshadweep',
    '32':'Kerala','33':'Tamil Nadu','34':'Puducherry','35':'Andaman & Nicobar Islands',
    '36':'Telangana','37':'Andhra Pradesh (New)','38':'Ladakh','97':'Other Territory','99':'Centre Jurisdiction',
  };

  const notesWithJurisdiction = (gstin: string, notes: string) => {
    const state = GSTIN_STATE_MAP[gstin.slice(0, 2)];
    if (!state) return notes;
    const newLine = `Subject to ${state} jurisdiction.`;
    const lines = notes.split('\n').filter(l => !/subject to .* jurisdiction/i.test(l));
    return [...lines, newLine].join('\n');
  };

  const applyProfile = (profile: VendorProfile, lastNum: number) => {
    setCurrentInvoice({
      ...EMPTY_INVOICE,
      vendorProfileId: profile.id,
      vendorName: profile.vendorName,
      vendorAddress: profile.vendorAddress,
      vendorEmail: profile.vendorEmail,
      vendorPhone: profile.vendorPhone,
      vendorGstin: profile.vendorGstin,
      pan: profile.pan,
      bankName: profile.bankName,
      bankAccount: profile.bankAccount,
      bankIfsc: profile.bankIfsc,
      dealsIn: profile.dealsIn,
      invoiceNumber: '',
      notes: notesWithJurisdiction(profile.vendorGstin, EMPTY_INVOICE.notes),
    });
  };

  const saveProfiles = (updated: VendorProfile[]) => {
    setProfiles(updated);
    localStorage.setItem('vendor_profiles', JSON.stringify(updated));
  };

  const persistHistory = (newHistory: InvoiceData[]) => {
    setHistory(newHistory);
    localStorage.setItem('invoice_history', JSON.stringify(newHistory));
  };

  const activeProfile = profiles.find(p => p.id === activeProfileId);

  const switchProfile = (id: string) => {
    const profile = profiles.find(p => p.id === id);
    if (!profile) return;
    setActiveProfileId(id);
    localStorage.setItem('active_profile_id', id);
    applyProfile(profile, profile.lastInvoiceNumber);
    setView('editor');
  };

  const saveProfile = () => {
    if (!profileDraft.vendorName.trim()) return alert('Vendor name is required');
    if (editingProfile) {
      const updated = profiles.map(p => p.id === editingProfile.id ? { ...profileDraft, id: editingProfile.id } : p);
      saveProfiles(updated);
      if (activeProfileId === editingProfile.id) applyProfile({ ...profileDraft, id: editingProfile.id }, profileDraft.lastInvoiceNumber);
    } else {
      const newProfile: VendorProfile = { ...profileDraft, id: Date.now().toString() };
      const updated = [...profiles, newProfile];
      saveProfiles(updated);
      setActiveProfileId(newProfile.id);
      localStorage.setItem('active_profile_id', newProfile.id);
      applyProfile(newProfile, newProfile.lastInvoiceNumber);
    }
    setShowProfileForm(false);
    setEditingProfile(null);
    setProfileDraft(EMPTY_PROFILE);
    setView('editor');
  };

  const deleteProfile = (id: string) => {
    if (profiles.length === 1) return alert('You need at least one profile.');
    if (!confirm('Delete this profile?')) return;
    const updated = profiles.filter(p => p.id !== id);
    saveProfiles(updated);
    if (activeProfileId === id) switchProfile(updated[0].id);
  };

  const startNew = () => {
    if (!activeProfile) return;
    const nextNum = activeProfile.lastInvoiceNumber + 1;
    const updatedProfiles = profiles.map(p => p.id === activeProfile.id ? { ...p, lastInvoiceNumber: nextNum } : p);
    saveProfiles(updatedProfiles);
    setCurrentInvoice({
      ...EMPTY_INVOICE,
      vendorProfileId: activeProfile.id,
      vendorName: activeProfile.vendorName,
      vendorAddress: activeProfile.vendorAddress,
      vendorEmail: activeProfile.vendorEmail,
      vendorPhone: activeProfile.vendorPhone,
      vendorGstin: activeProfile.vendorGstin,
      pan: activeProfile.pan,
      bankName: activeProfile.bankName,
      bankAccount: activeProfile.bankAccount,
      bankIfsc: activeProfile.bankIfsc,
      dealsIn: activeProfile.dealsIn,
      invoiceNumber: `${nextNum}`,
      notes: notesWithJurisdiction(activeProfile.vendorGstin, EMPTY_INVOICE.notes),
    });
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

  const handleCancel = () => { setShowProfileForm(false); setEditingProfile(null); setProfileDraft(EMPTY_PROFILE); };

  return (
    <div className="min-h-screen flex flex-col">
      {showProfileForm && (
        <ProfileFormModal
          profileDraft={profileDraft}
          setProfileDraft={setProfileDraft}
          editingProfile={editingProfile}
          profiles={profiles}
          onSave={saveProfile}
          onCancel={handleCancel}
        />
      )}

      {/* Navigation */}
      <nav className="no-print bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900 tracking-tight">SmartInvoice AI</span>
              {/* Profile switcher */}
              {profiles.length > 0 && (
                <select
                  value={activeProfileId || ''}
                  onChange={e => switchProfile(e.target.value)}
                  className="ml-2 text-sm border border-gray-200 rounded-md px-2 py-1 text-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {profiles.map(p => (
                    <option key={p.id} value={p.id}>{p.vendorName}</option>
                  ))}
                </select>
              )}
            </div>
            <div className="flex gap-2">
              <button onClick={() => setView('editor')} className={`px-3 py-2 text-sm font-medium rounded-md transition ${view === 'editor' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>Generator</button>
              <button onClick={() => setView('history')} className={`px-3 py-2 text-sm font-medium rounded-md transition ${view === 'history' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>History ({history.filter(inv => inv.vendorProfileId === activeProfileId).length})</button>
              <button onClick={() => setView('profiles')} className={`px-3 py-2 text-sm font-medium rounded-md transition ${view === 'profiles' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-500 hover:text-gray-700'}`}>Profiles</button>
            </div>
          </div>
        </div>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">

        {/* EDITOR VIEW */}
        {view === 'editor' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="no-print space-y-6">
              <div className="flex items-center gap-3">
                <button onClick={startNew} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-bold hover:bg-indigo-700 transition">
                  + Start New Invoice
                </button>
                {activeProfile && (
                  <span className="text-sm text-gray-500">Profile: <span className="font-semibold text-gray-700">{activeProfile.vendorName}</span></span>
                )}
              </div>
              <InvoiceForm data={currentInvoice} onChange={setCurrentInvoice} />
            </div>
            <div className="space-y-4">
              <div className="no-print flex justify-between items-center mb-2">
                <h3 className="text-lg font-bold text-gray-900">Live Preview</h3>
                <div className="flex gap-2">
                  <button onClick={saveToHistory} className="bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-md font-semibold hover:bg-gray-50 transition">Save Draft</button>
                  <button onClick={handlePrint} className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold hover:bg-indigo-700 transition flex items-center gap-2">
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
        )}

        {/* HISTORY VIEW */}
        {view === 'history' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Past Invoices</h2>
            {history.filter(inv => inv.vendorProfileId === activeProfileId).length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center border-2 border-dashed border-gray-200">
                <h3 className="text-lg font-medium text-gray-900">No invoices yet</h3>
                <p className="text-gray-500 mt-1">Save or print an invoice to see it here.</p>
                <button onClick={() => setView('editor')} className="mt-6 text-indigo-600 font-bold hover:underline">Start creating</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {history.filter(inv => inv.vendorProfileId === activeProfileId).map((inv, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition cursor-pointer group" onClick={() => { setCurrentInvoice(inv); setView('editor'); }}>
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-sm font-bold text-indigo-600">#{inv.invoiceNumber}</div>
                      <div className="flex items-center gap-2">
                        <div className="text-xs text-gray-400 font-medium">{inv.date}</div>
                        <button onClick={e => { e.stopPropagation(); deleteFromHistory(history.indexOf(inv)); }} className="text-gray-300 hover:text-red-500 transition">
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                    <div className="mb-3">
                      <div className="text-gray-900 font-bold text-lg leading-tight group-hover:text-indigo-600 transition">{inv.clientName || 'Unknown Client'}</div>
                      <div className="text-sm text-gray-500">{inv.vendorName}</div>
                    </div>
                    <div className="flex justify-between items-end">
                      <div className="text-xs text-gray-400">{inv.items.length} {inv.items.length === 1 ? 'item' : 'items'}</div>
                      <div className="text-lg font-bold text-gray-900">
                        {new Intl.NumberFormat(inv.currency === 'USD' ? 'en-US' : 'en-IN', { style: 'currency', currency: inv.currency || 'INR' }).format(
                          inv.items.reduce((acc, item) => acc + item.quantity * item.unitPrice, 0) * (1 + (inv.cgstRate + inv.sgstRate + inv.igstRate) / 100)
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PROFILES VIEW */}
        {view === 'profiles' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Vendor Profiles</h2>
              <button onClick={() => { setProfileDraft(EMPTY_PROFILE); setEditingProfile(null); setShowProfileForm(true); }} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 transition">+ Add Profile</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {profiles.map(p => (
                <div key={p.id} className={`bg-white p-6 rounded-xl border-2 shadow-sm transition ${activeProfileId === p.id ? 'border-indigo-500' : 'border-gray-100'}`}>
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="font-bold text-gray-900 text-lg">{p.vendorName}</div>
                      {activeProfileId === p.id && <span className="text-xs text-indigo-600 font-semibold">● Active</span>}
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => { setEditingProfile(p); setProfileDraft({ ...p }); setShowProfileForm(true); }} className="text-gray-400 hover:text-indigo-600 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                      </button>
                      <button onClick={() => deleteProfile(p.id)} className="text-gray-400 hover:text-red-500 transition">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500 space-y-0.5">
                    <p>{p.vendorGstin}</p>
                    <p>{p.vendorPhone}</p>
                    <p className="text-xs">{p.bankName} · {p.bankAccount}</p>
                  </div>
                  {activeProfileId !== p.id && (
                    <button onClick={() => switchProfile(p.id)} className="mt-4 w-full bg-indigo-50 text-indigo-700 py-1.5 rounded-lg text-sm font-semibold hover:bg-indigo-100 transition">Switch to this profile</button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
