import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, Download, Search, Copy, X, FileText, Mail } from 'lucide-react';
import { Card } from "./ui/Card";
import { Input } from "./ui/Input";

const PdfPreviewModal = ({ isOpen, url, onClose, fileName }) => {
  if (!url) return null;
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 md:p-4">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" />
          <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="bg-white rounded-t-2xl md:rounded-3xl w-full max-w-5xl h-[90vh] md:h-[85vh] flex flex-col shadow-2xl overflow-hidden relative z-[110]">
            <div className="p-4 md:p-5 border-b flex justify-between items-center bg-white sticky top-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-sky-50 rounded-lg hidden xs:block"><FileText className="h-5 w-5 text-sky-600" /></div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-800 text-sm md:text-base leading-none truncate max-w-[150px] sm:max-w-[300px]">{fileName}</h3>
                  <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-tighter">Preview Mode</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full transition-all"><X className="h-5 w-5 text-slate-500" /></button>
            </div>
            <div className="flex-1 bg-slate-50 relative">
               <iframe src={url} className="w-full h-full border-none" title="PDF Preview" />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export function DocumentTable({ documents = [] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [previewData, setPreviewData] = useState({ isOpen: false, url: '', name: '' });
  const [loadingId, setLoadingId] = useState(null);

  const filteredDocs = documents.filter((doc) =>
    (doc.name || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (doc.signerEmail || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const copyLink = (id) => {
    const link = `${window.location.origin}/sign/${id}`;
    navigator.clipboard.writeText(link);
    alert("Signing link copied!");
  };

  // 🔥 Standalone Fetch Logic (No external API file required)
  const handleAction = async (doc, mode) => {
    setLoadingId(doc._id);
    try {
      // Direct fetch calling your backend port 5011
      const res = await fetch(`http://localhost:5011/api/documents/download/${doc._id}`);
      const data = await res.json();
      
      if (!data.pdf) {
          alert("PDF URL not found in server response");
          return;
      }

      if (mode === 'preview') {
        setPreviewData({ isOpen: true, url: data.pdf, name: doc.name });
      } else {
        const link = document.createElement('a');
        link.href = data.pdf;
        link.target = "_blank";
        link.download = `${doc.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    } catch (err) {
      console.error("Error fetching PDF:", err);
      alert("Failed to connect to server. Check if backend is running on port 5011.");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <Card className="overflow-hidden border-none shadow-xl shadow-slate-200/50 rounded-2xl bg-white">
        <div className="p-4 md:p-6 border-b border-slate-50 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <h3 className="font-bold text-slate-800 self-start sm:self-center">Recent Documents</h3>
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input 
              placeholder="Search documents..." 
              className="pl-10 bg-slate-50 border-none rounded-xl h-10 w-full outline-none focus:ring-2 ring-sky-50 text-sm" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* 💻 Desktop Table */}
        <div className="hidden md:block w-full overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm text-left min-w-[650px]">
            <thead className="text-[11px] text-slate-400 uppercase bg-slate-50/50 font-black tracking-wider">
              <tr>
                <th className="px-6 py-4">Document</th>
                <th className="px-6 py-4">Recipient</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredDocs.map((doc) => {
                const isSigned = doc.status?.toLowerCase() === 'signed';
                const isLoading = loadingId === doc._id;
                return (
                  <motion.tr layout key={doc._id} className="bg-white hover:bg-sky-50/30 transition-colors group">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700 truncate max-w-[150px]">{doc.name}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{new Date(doc.createdAt).toLocaleDateString()}</p>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{doc.signerEmail || 'N/A'}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border inline-block min-w-[70px] ${
                        isSigned ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                      }`}>
                        {isSigned ? 'signed' : 'pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {!isSigned && <button onClick={() => copyLink(doc._id)} className="p-2 text-sky-600 hover:bg-sky-50 rounded-lg"><Copy size={16} /></button>}
                        <button disabled={isLoading} onClick={() => handleAction(doc, 'preview')} className={`p-2 rounded-lg transition-all ${isLoading ? 'animate-pulse text-slate-300' : 'text-slate-400 hover:text-sky-600 bg-slate-50'}`}><Eye size={16} /></button>
                        <button disabled={!isSigned || isLoading} onClick={() => handleAction(doc, 'download')} className={`p-2 rounded-lg ${isSigned ? 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100' : 'text-slate-200 bg-slate-50'}`}><Download size={16} /></button>
                      </div>
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* 📱 Mobile Card Layout */}
        <div className="md:hidden grid grid-cols-1 divide-y divide-slate-100">
          {filteredDocs.map((doc) => {
            const isSigned = doc.status?.toLowerCase() === 'signed';
            const isLoading = loadingId === doc._id;
            return (
              <div key={doc._id} className="p-4 flex flex-col gap-3 bg-white">
                <div className="flex justify-between items-start">
                  <div className="flex gap-3 min-w-0">
                    <div className="p-2 bg-slate-100 rounded-lg"><FileText size={16} className="text-slate-500" /></div>
                    <div className="min-w-0">
                      <p className="font-bold text-slate-800 text-sm truncate">{doc.name}</p>
                      <span className="text-[10px] text-slate-400 block mt-1">{new Date(doc.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-black uppercase border shrink-0 ${isSigned ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'}`}>{isSigned ? 'signed' : 'pending'}</span>
                </div>
                <div className="flex gap-2 text-slate-500 bg-slate-50 p-2 rounded-xl text-xs overflow-hidden"><Mail size={12} className="shrink-0" /><span className="truncate">{doc.signerEmail || 'No recipient'}</span></div>
                <div className="flex items-center justify-between mt-1">
                  {!isSigned ? <button onClick={() => copyLink(doc._id)} className="flex items-center gap-1.5 px-3 py-1.5 bg-sky-50 text-sky-600 rounded-lg text-xs font-bold"><Copy size={14} /> Link</button> : <div />}
                  <div className="flex gap-2">
                    <button disabled={isLoading} onClick={() => handleAction(doc, 'preview')} className="p-2 text-slate-500 bg-slate-100 rounded-lg"><Eye size={18} /></button>
                    <button disabled={!isSigned || isLoading} onClick={() => handleAction(doc, 'download')} className={`p-2 rounded-lg ${isSigned ? 'text-emerald-600 bg-emerald-50' : 'text-slate-200 bg-slate-100'}`}><Download size={18} /></button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      <PdfPreviewModal isOpen={previewData.isOpen} url={previewData.url} fileName={previewData.name} onClose={() => setPreviewData({ ...previewData, isOpen: false })} />
    </>
  );
}