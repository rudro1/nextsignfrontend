// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Sidebar } from '../components/Sidebar';
// import { DocumentTable } from '../components/DocumentTable';
// import { documentAPI } from '../api/api';
// import { Plus, FileText, CheckCircle2, TrendingUp, RefreshCw, Menu, X } from 'lucide-react';
// import { Card, CardContent } from '../components/ui/Card';
// import { Button } from '../components/ui/Button';

// export function DashboardPage() {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
//   // 💾 Cache Initialization
//   const [documents, setDocuments] = useState<any[]>(() => {
//     try {
//       const saved = localStorage.getItem('fixensy_cache');
//       return saved ? JSON.parse(saved) : [];
//     } catch (e) { return []; }
//   });
  
//   const [syncing, setSyncing] = useState(false);

//   const fetchDocuments = async () => {
//     try {
//       setSyncing(true);
//       const res = await documentAPI.getDocuments();
//       const data = Array.isArray(res.data) ? res.data : [];
//       setDocuments(data);
//       localStorage.setItem('fixensy_cache', JSON.stringify(data));
//     } catch (err) { 
//       console.error("Fetch Error:", err); 
//     } finally { 
//       setSyncing(false); 
//     }
//   };

//   useEffect(() => { 
//     fetchDocuments(); 
//   }, []);

//   const handleAction = async (docId: string) => {
//     try {
//       const res = await documentAPI.downloadDoc(docId);
//       const pdfData = res.data.pdf;
//       if (!pdfData) return alert("PDF not found!");

//       if (pdfData.startsWith('http')) {
//         window.open(pdfData, '_blank');
//       } else {
//         const link = document.createElement('a');
//         link.href = pdfData;
//         link.download = "Document.pdf";
//         link.click();
//       }
//     } catch (err) { alert("Action failed."); }
//   };

//   const stats = useMemo(() => {
//     const total = documents.length;
//     const signed = documents.filter((d) => d.status?.toLowerCase() === 'signed').length;
//     return [
//       { label: 'Total Documents', value: total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
//       { label: 'Signed', value: signed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
//       { label: 'Completion Rate', value: `${total > 0 ? Math.round((signed / total) * 100) : 0}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
//     ];
//   }, [documents]);

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row w-full overflow-hidden">
      
//       {/* 📱 Mobile Top Navigation */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 px-4 flex justify-between items-center shadow-sm">
//         <div className="flex items-center gap-2">
//            <div className="bg-sky-600 p-1.5 rounded-lg text-white"><FileText size={18}/></div>
//            <span className="font-bold italic text-slate-800 text-lg">Fixensy</span>
//         </div>
//         <Button variant="ghost" size="icon" onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600">
//           {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//         </Button>
//       </div>

//       🟢 Responsive Sidebar Drawer
//       <div className={`fixed inset-y-0 left-0 z-[60] w-72 bg-white transition-transform duration-300 transform lg:static lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
//         <Sidebar currentView="dashboard" />
//       </div>

//       {/* 🔵 Main Content Area */}
//       <main className="flex-1 p-4 md:p-6 lg:p-10 pt-20 lg:pt-10 w-full overflow-y-auto">
//         <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 text-left">
//           <div className="space-y-1">
//             <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Dashboard</h1>
//             <p className="text-slate-500 font-medium text-xs md:text-sm">Manage and track your document workflow</p>
//           </div>
//           <div className="flex gap-3 w-full sm:w-auto">
//              <Button onClick={fetchDocuments} variant="outline" className="rounded-xl border-slate-200 h-11 px-4">
//                 <RefreshCw className={`h-4 w-4 text-slate-600 ${syncing ? 'animate-spin' : ''}`} />
//              </Button>
//              <Button onClick={() => navigate('/upload')} className="bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-200 rounded-xl flex gap-2 flex-1 sm:flex-none justify-center h-11 items-center font-bold text-sm px-6 text-white">
//                 <Plus className="h-4 w-4" /> UPLOAD NEW
//              </Button>
//           </div>
//         </header>

//         {/* 📊 Adaptive Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
//           {stats.map((stat, index) => (
//             <Card key={index} className="border-none shadow-sm rounded-3xl bg-white group hover:shadow-md transition-all">
//               <CardContent className="p-6 flex items-center justify-between">
//                 <div className="text-left">
//                   <p className="text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-[0.1em]">{stat.label}</p>
//                   <p className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
//                 </div>
//                 <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform`}>
//                   <stat.icon className={`h-6 w-6 ${stat.color}`} />
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* 📄 Document Table Section */}
//         <div className="w-full bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
//           <div className="p-6 border-b border-slate-50 flex items-center justify-between">
//               <h2 className="font-bold text-slate-800 text-sm md:text-base uppercase tracking-wider">Recent Documents</h2>
//               {syncing && <span className="text-[10px] text-sky-600 animate-pulse font-bold tracking-widest uppercase">Syncing...</span>}
//           </div>
//           <div className="w-full overflow-x-auto">
//                <DocumentTable documents={documents} onPreview={handleAction} onDownload={handleAction} />
//           </div>
//         </div>
//       </main>

//       {/* 🌑 Mobile Overlay Backdrop */}
//       {isSidebarOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 lg:hidden" onClick={() => setIsSidebarOpen(false)} />
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useMemo } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Sidebar } from '../components/Sidebar';
// import { DocumentTable } from '../components/DocumentTable';
// import { documentAPI } from '../api/api';
// import { Plus, FileText, CheckCircle2, TrendingUp, RefreshCw, Menu, X } from 'lucide-react';
// import { Card, CardContent } from '../components/ui/Card';
// import { Button } from '../components/ui/Button';

// export function DashboardPage() {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
//   // 💾 Cache Initialization with Safety Check
//   const [documents, setDocuments] = useState(() => {
//     try {
//       const saved = localStorage.getItem('fixensy_cache');
//       return saved ? JSON.parse(saved) : [];
//     } catch (e) { 
//       return []; 
//     }
//   });
  
//   const [syncing, setSyncing] = useState(false);

//   // ✅ Fixed Fetch Function with Storage Quota Handling
//   const fetchDocuments = async () => {
//     try {
//       setSyncing(true);
//       const res = await documentAPI.getDocuments();
//       const data = Array.isArray(res.data) ? res.data : [];
//       setDocuments(data);
      
//       // Try saving to localStorage, but clear if it's full (Quota Fix)
//       try {
//         localStorage.setItem('fixensy_cache', JSON.stringify(data));
//       } catch (quotaError) {
//         console.warn("Storage quota exceeded, clearing old cache.");
//         localStorage.removeItem('fixensy_cache');
//       }
//     } catch (err) { 
//       console.error("Fetch Error:", err); 
//     } finally { 
//       setSyncing(false); 
//     }
//   };

//   useEffect(() => { 
//     fetchDocuments(); 
//   }, []);

//   const handleAction = async (docId) => {
//     try {
//       const res = await documentAPI.downloadDoc(docId);
//       const pdfData = res.data.pdf;
//       if (!pdfData) return alert("PDF not found!");

//       if (pdfData.startsWith('http')) {
//         window.open(pdfData, '_blank');
//       } else {
//         const link = document.createElement('a');
//         link.href = pdfData;
//         link.download = "Document.pdf";
//         document.body.appendChild(link);
//         link.click();
//         document.body.removeChild(link);
//       }
//     } catch (err) { 
//       alert("Action failed. Please check your connection."); 
//     }
//   };

//   const stats = useMemo(() => {
//     const total = documents.length;
//     const signed = documents.filter((d) => d.status?.toLowerCase() === 'signed').length;
//     return [
//       { label: 'Total Documents', value: total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
//       { label: 'Signed', value: signed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
//       { label: 'Completion Rate', value: `${total > 0 ? Math.round((signed / total) * 100) : 0}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
//     ];
//   }, [documents]);

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row w-full overflow-hidden">
      
//       {/* 📱 Mobile Top Navigation */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 px-4 flex justify-between items-center shadow-sm">
//         <div className="flex items-center gap-2">
//            <div className="bg-sky-600 p-1.5 rounded-lg text-white"><FileText size={18}/></div>
//            <span className="font-bold italic text-slate-800 text-lg">Fixensy</span>
//         </div>
//         <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg">
//           {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
//         </button>
//       </div>

//       <Sidebar 
//         currentView="dashboard" 
//         isOpen={isSidebarOpen} 
//         setIsOpen={setIsSidebarOpen} 
//       />

//       <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-10 pt-20 lg:pt-10 w-full overflow-y-auto">
//         <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 text-left">
//           <div className="space-y-1">
//             <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase">Dashboard</h1>
//             <p className="text-slate-500 font-medium text-xs md:text-sm">Manage and track your document workflow</p>
//           </div>
//           <div className="flex gap-3 w-full sm:w-auto">
//              <Button onClick={fetchDocuments} variant="outline" className="rounded-xl border-slate-200 h-11 px-4">
//                 <RefreshCw className={`h-4 w-4 text-slate-600 ${syncing ? 'animate-spin' : ''}`} />
//              </Button>
//              <Button onClick={() => navigate('/upload')} className="bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-200 rounded-xl flex gap-2 flex-1 sm:flex-none justify-center h-11 items-center font-bold text-sm px-6 text-white transition-all">
//                 <Plus className="h-4 w-4" /> UPLOAD NEW
//              </Button>
//           </div>
//         </header>

//         {/* 📊 Stats Cards */}
//         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
//           {stats.map((stat, index) => (
//             <Card key={index} className="border-none shadow-sm rounded-3xl bg-white group hover:shadow-md transition-all">
//               <CardContent className="p-6 flex items-center justify-between">
//                 <div className="text-left">
//                   <p className="text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-[0.1em]">{stat.label}</p>
//                   <p className="text-2xl md:text-4xl font-black text-slate-900 tracking-tighter">{stat.value}</p>
//                 </div>
//                 <div className={`p-4 rounded-2xl ${stat.bg} group-hover:scale-110 transition-transform duration-300`}>
//                   <stat.icon className={`h-6 w-6 ${stat.color}`} />
//                 </div>
//               </CardContent>
//             </Card>
//           ))}
//         </div>

//         {/* 📄 Document Table */}
//         <div className="w-full bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
//           <div className="p-6 border-b border-slate-50 flex items-center justify-between">
//               <h2 className="font-bold text-slate-800 text-sm md:text-base uppercase tracking-wider">Recent Documents</h2>
//               {syncing && <span className="text-[10px] text-sky-600 animate-pulse font-bold tracking-widest uppercase">Syncing...</span>}
//           </div>
//           <div className="w-full overflow-x-auto custom-scrollbar">
//                <DocumentTable documents={documents} onPreview={handleAction} onDownload={handleAction} />
//           </div>
//         </div>
//       </main>

//       {/* 🌑 Mobile Backdrop */}
//       {isSidebarOpen && (
//         <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
//       )}
//     </div>
//   );
// }

import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { DocumentTable } from '../components/DocumentTable';
import { documentAPI } from '../api/api';
import { Plus, FileText, CheckCircle2, TrendingUp, RefreshCw, Menu, X } from 'lucide-react';
import { Card, CardContent } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export function DashboardPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // 💾 Cache Initialization with Safety Check
  const [documents, setDocuments] = useState(() => {
    try {
      const saved = localStorage.getItem('fixensy_cache');
      return saved ? JSON.parse(saved) : [];
    } catch (e) { 
      return []; 
    }
  });
  
  const [syncing, setSyncing] = useState(false);

  // ✅ Fixed Fetch Function with Storage Quota Handling
  const fetchDocuments = async () => {
    try {
      setSyncing(true);
      const res = await documentAPI.getDocuments();
      
      // Vercel theke ashche kina check
      const data = Array.isArray(res.data) ? res.data : [];
      setDocuments(data);
      
      // Storage quota fix
      try {
        localStorage.setItem('fixensy_cache', JSON.stringify(data));
      } catch (quotaError) {
        localStorage.removeItem('fixensy_cache');
      }
    } catch (err) { 
      console.error("Dashboard Fetch Error:", err); 
    } finally { 
      setSyncing(false); 
    }
  };

  useEffect(() => { 
    fetchDocuments(); 
  }, []);

  // ✅ Optimized Action Handler (Handles both Preview & Download)
  const handleAction = async (docId, actionType = 'preview') => {
    try {
      const selectedDoc = documents.find(d => d._id === docId);
      if (!selectedDoc) return alert("Document not found!");

      // Final Signed PDF thakle sheta priority pabe, nahole original
      const pdfUrl = selectedDoc.signedPdf || selectedDoc.pdfPath;
      
      if (!pdfUrl) return alert("PDF file link is missing!");

      if (actionType === 'preview') {
        window.open(pdfUrl, '_blank');
      } else {
        // Direct download trigger for Cloudinary links
        const link = document.createElement('a');
        link.href = pdfUrl;
        link.setAttribute('download', `Fixensy_${selectedDoc.name || 'Document'}.pdf`);
        link.setAttribute('target', '_blank');
        document.body.appendChild(link);
        link.click();
        link.remove();
      }
    } catch (err) { 
      alert("Could not process document. Please try again."); 
    }
  };

  const stats = useMemo(() => {
    const total = documents.length;
    const signed = documents.filter((d) => d.status?.toLowerCase() === 'signed').length;
    return [
      { label: 'Total Documents', value: total, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
      { label: 'Signed', value: signed, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
      { label: 'Completion Rate', value: `${total > 0 ? Math.round((signed / total) * 100) : 0}%`, icon: TrendingUp, color: 'text-purple-600', bg: 'bg-purple-50' },
    ];
  }, [documents]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row w-full overflow-hidden">
      
      {/* 📱 Mobile Top Navigation */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b z-50 px-4 flex justify-between items-center shadow-sm">
        <div className="flex items-center gap-2">
           <div className="bg-sky-600 p-1.5 rounded-lg text-white"><FileText size={18}/></div>
           <span className="font-bold italic text-slate-800 text-lg uppercase">Fixensy</span>
        </div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="text-slate-600 p-2 hover:bg-slate-100 rounded-lg">
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <Sidebar 
        currentView="dashboard" 
        isOpen={isSidebarOpen} 
        setIsOpen={setIsSidebarOpen} 
      />

      <main className="flex-1 lg:ml-64 p-4 md:p-6 lg:p-10 pt-20 lg:pt-10 w-full overflow-y-auto">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 mb-10 text-left">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight uppercase italic">Dashboard</h1>
            <p className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-[0.2em]">Manage and track your document workflow</p>
          </div>
          <div className="flex gap-3 w-full sm:w-auto">
             <Button onClick={fetchDocuments} variant="outline" className="rounded-xl border-slate-200 h-11 px-4 bg-white shadow-sm hover:bg-slate-50">
                <RefreshCw className={`h-4 w-4 text-slate-600 ${syncing ? 'animate-spin' : ''}`} />
             </Button>
             <Button onClick={() => navigate('/upload')} className="bg-sky-600 hover:bg-sky-700 shadow-lg shadow-sky-200 rounded-xl flex gap-2 flex-1 sm:flex-none justify-center h-11 items-center font-black italic text-xs px-6 text-white transition-all uppercase">
                <Plus className="h-4 w-4" /> UPLOAD NEW
             </Button>
          </div>
        </header>

        {/* 📊 Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-10">
          {stats.map((stat, index) => (
            <Card key={index} className="border-none shadow-sm rounded-[2rem] bg-white group hover:shadow-xl transition-all duration-500 overflow-hidden border border-white">
              <CardContent className="p-8 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[10px] font-black text-slate-400 mb-2 uppercase tracking-[0.2em] italic">{stat.label}</p>
                  <p className="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter italic">{stat.value}</p>
                </div>
                <div className={`p-5 rounded-[1.5rem] ${stat.bg} group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <stat.icon className={`h-7 w-7 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* 📄 Document Table */}
        <div className="w-full bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-10">
          <div className="p-8 border-b border-slate-50 flex items-center justify-between bg-slate-50/30">
              <h2 className="font-black text-slate-800 text-xs md:text-sm uppercase tracking-[0.25em] italic">Recent Documents</h2>
              {syncing && <span className="text-[10px] text-sky-600 animate-pulse font-black tracking-widest uppercase">Syncing Database...</span>}
          </div>
          <div className="w-full overflow-x-auto custom-scrollbar">
               {/* 🔄 Note: Pass handleAction for both Preview and Download */}
               <DocumentTable 
                 documents={documents} 
                 onPreview={(id) => handleAction(id, 'preview')} 
                 onDownload={(id) => handleAction(id, 'download')} 
               />
          </div>
        </div>
      </main>

      {/* 🌑 Mobile Backdrop */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}
    </div>
  );
}