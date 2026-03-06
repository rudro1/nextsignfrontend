// import React, { useState, useRef, useEffect } from 'react';
// import { Sidebar } from '../components/Sidebar';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import { Upload, Move, Check, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
// import { documentAPI } from '../api/api';
// import { Document, Page, pdfjs } from 'react-pdf';

// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface SignaturePos {
//   id: number;
//   x: number;
//   y: number;       
//   localY: number;  
//   page: number; 
// }

// export function UploadPage({ onNavigate }: { onNavigate: (view: string) => void }) {
//   const [step, setStep] = useState<'upload' | 'place' | 'success'>('upload');
//   const [isUploading, setIsUploading] = useState(false);
//   const [generatedLink, setGeneratedLink] = useState('');
//   const [signatures, setSignatures] = useState<SignaturePos[]>([]);
//   const [activeId, setActiveId] = useState<number | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
  
//   const containerRef = useRef<HTMLDivElement>(null);
//   const scrollParentRef = useRef<HTMLDivElement>(null);

//   const addSignatureBox = () => {
//     if (!containerRef.current || !scrollParentRef.current) return;
//     const scrollOffset = scrollParentRef.current.scrollTop;
//     const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
//     const currentPage = Math.max(1, Math.min(Math.floor((scrollOffset + 100) / pageHeight) + 1, numPages || 1));

//     setSignatures([...signatures, {
//       id: Date.now(),
//       x: 50, 
//       y: scrollOffset + 50,
//       localY: (scrollOffset + 50) % pageHeight, 
//       page: currentPage 
//     }]);
//   };

//   const handleGenerateLink = async () => {
//     if (!selectedFile || signatures.length === 0) return alert("Please add a sign box!");
//     setIsUploading(true);
//     try {
//         const formData = new FormData();
//         formData.append('pdfFile', selectedFile);
//         const uploadRes = await documentAPI.uploadPdf(formData);
//         const formattedSigns = signatures.map(sig => ({ id: sig.id, x: sig.x, y: sig.localY, page: sig.page }));
//         const linkRes = await documentAPI.generateLink({ pdfPath: uploadRes.data.pdfPath, signs: formattedSigns, name: selectedFile.name });
//         if (linkRes.data.id) {
//             setGeneratedLink(`${window.location.origin}/sign/${linkRes.data.id}`);
//             setStep('success');
//         }
//     } catch (err) { alert("Server error!"); } finally { setIsUploading(false); }
//   };

//   useEffect(() => {
//     const handleMove = (e: any) => {
//       if (activeId === null || !containerRef.current) return;
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//       const rect = containerRef.current.getBoundingClientRect();
//       const newX = Math.max(0, Math.min(clientX - rect.left - 75, rect.width - 150));
//       const newY = Math.max(0, Math.min(clientY - rect.top - 25, rect.height - 50));
//       const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
//       setSignatures(prev => prev.map(s => s.id === activeId ? { ...s, x: newX, y: newY, localY: newY % pageHeight, page: Math.floor(newY / pageHeight) + 1 } : s ));
//     };
//     const stopDrag = () => setActiveId(null);
//     window.addEventListener('mousemove', handleMove);
//     window.addEventListener('mouseup', stopDrag);
//     window.addEventListener('touchmove', handleMove, { passive: false });
//     window.addEventListener('touchend', stopDrag);
//     return () => { 
//         window.removeEventListener('mousemove', handleMove); 
//         window.removeEventListener('mouseup', stopDrag);
//         window.removeEventListener('touchmove', handleMove);
//         window.removeEventListener('touchend', stopDrag);
//     };
//   }, [activeId, numPages]);

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
//       <Sidebar currentView="upload" onNavigate={onNavigate} />
//       <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
//         <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon" onClick={() => onNavigate('dashboard')}><ArrowLeft className="h-5 w-5" /></Button>
//             <div>
//               <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Prepare Document</h1>
//               <p className="text-xs lg:text-sm text-slate-500">Drag signature fields to desired positions</p>
//             </div>
//           </div>
//           {step === 'place' && (
//             <Button onClick={addSignatureBox} className="bg-sky-600 hover:bg-sky-700 shadow-md flex gap-2 w-full sm:w-auto">
//               <Plus className="h-4 w-4" /> Add Field
//             </Button>
//           )}
//         </header>

//         {step === 'upload' && (
//           <div className="max-w-2xl mx-auto mt-12 bg-white p-10 lg:p-20 border-2 border-dashed rounded-3xl text-center">
//             <Upload className="h-12 w-12 text-sky-400 mx-auto mb-6" />
//             <h3 className="text-xl font-semibold mb-2">Upload your PDF</h3>
//             <p className="text-slate-400 mb-8 text-sm">Select the document you want to get signed</p>
//             <Button onClick={() => document.getElementById('fileInput')?.click()} className="bg-sky-600 px-8 w-full sm:w-auto">Choose File</Button>
//             <input type="file" id="fileInput" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) { setSelectedFile(e.target.files[0]); setStep('place'); } }} className="hidden" />
//           </div>
//         )}

//         {step === 'place' && (
//           <div className="flex flex-col lg:flex-row gap-8">
//             <div ref={scrollParentRef} className="flex-1 bg-slate-200 rounded-2xl p-2 lg:p-8 overflow-auto border border-slate-300 max-h-[70vh]">
//               <div ref={containerRef} className="relative mx-auto shadow-2xl bg-white select-none" style={{ width: '600px' }}>
//                 <Document file={selectedFile} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
//                   {Array.from(new Array(numPages), (_, i) => (
//                     <div key={i} className="border-b"><Page pageNumber={i + 1} width={600} renderTextLayer={false} renderAnnotationLayer={false} /></div>
//                   ))}
//                 </Document>
//                 {signatures.map((sig) => (
//                   <div key={sig.id} style={{ left: `${sig.x}px`, top: `${sig.y}px` }} onMouseDown={() => setActiveId(sig.id)} onTouchStart={() => setActiveId(sig.id)}
//                     className="absolute z-[50] w-[150px] h-[50px] border-2 border-dashed border-sky-600 bg-sky-500/20 flex items-center justify-center cursor-move touch-none"
//                   >
//                     <span className="text-[10px] font-bold text-sky-800 pointer-events-none flex items-center gap-1"><Move className="h-3 w-3" /> SIGN HERE</span>
//                     <button onClick={(e) => { e.stopPropagation(); setSignatures(signatures.filter(s => s.id !== sig.id)); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><Trash2 className="h-3 w-3" /></button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="w-full lg:w-80 space-y-4">
//               <Card className="p-6 bg-white border-none shadow-sm">
//                 <h3 className="font-bold text-slate-800 text-lg mb-4 text-center border-b pb-2">Summary</h3>
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between"><span className="text-slate-400">Total Fields:</span><span className="font-bold text-sky-600">{signatures.length}</span></div>
//                   <div className="flex justify-between"><span className="text-slate-400">Pages:</span><span className="font-bold">{numPages || 0}</span></div>
//                 </div>
//               </Card>
//               <Button className="w-full bg-sky-600 h-14 text-lg font-bold" onClick={handleGenerateLink} disabled={isUploading || signatures.length === 0}>
//                 {isUploading ? <Loader2 className="animate-spin" /> : 'Generate Link'}
//               </Button>
//             </div>
//           </div>
//         )}

//         {step === 'success' && (
//           <div className="max-w-xl mx-auto mt-10 text-center px-4">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"><Check className="h-12 w-12 text-green-600" /></div>
//             <h2 className="text-2xl font-bold mb-2">Link Generated!</h2>
//             <div className="flex flex-col sm:flex-row gap-2 p-3 bg-white border rounded-2xl mb-10 shadow-inner">
//               <input readOnly value={generatedLink} className="flex-1 bg-transparent px-2 text-sm truncate focus:outline-none" />
//               <Button size="sm" onClick={() => { navigator.clipboard.writeText(generatedLink); alert("Copied!"); }} className="bg-slate-900">Copy</Button>
//             </div>
//             <Button variant="outline" size="lg" className="px-10 rounded-xl w-full" onClick={() => onNavigate('dashboard')}>Go to Dashboard</Button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom'; // Router navigation এর জন্য
// import { Sidebar } from '../components/Sidebar';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import { Upload, Move, Check, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
// import { documentAPI } from '../api/api';
// import { Document, Page, pdfjs } from 'react-pdf';

// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface SignaturePos {
//   id: number;
//   x: number;
//   y: number;       
//   localY: number;  
//   page: number; 
// }

// export function UploadPage() {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Sidebar toggle এর জন্য স্টেট
  
//   const [step, setStep] = useState<'upload' | 'place' | 'success'>('upload');
//   const [isUploading, setIsUploading] = useState(false);
//   const [generatedLink, setGeneratedLink] = useState('');
//   const [signatures, setSignatures] = useState<SignaturePos[]>([]);
//   const [activeId, setActiveId] = useState<number | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
  
//   const containerRef = useRef<HTMLDivElement>(null);
//   const scrollParentRef = useRef<HTMLDivElement>(null);

//   const addSignatureBox = () => {
//     if (!containerRef.current || !scrollParentRef.current) return;
//     const scrollOffset = scrollParentRef.current.scrollTop;
//     const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
//     const currentPage = Math.max(1, Math.min(Math.floor((scrollOffset + 100) / pageHeight) + 1, numPages || 1));

//     setSignatures([...signatures, {
//       id: Date.now(),
//       x: 50, 
//       y: scrollOffset + 50,
//       localY: (scrollOffset + 50) % pageHeight, 
//       page: currentPage 
//     }]);
//   };

//   const handleGenerateLink = async () => {
//     if (!selectedFile || signatures.length === 0) return alert("Please add a sign box!");
//     setIsUploading(true);
//     try {
//         const formData = new FormData();
//         formData.append('pdfFile', selectedFile);
//         const uploadRes = await documentAPI.uploadPdf(formData);
//         const formattedSigns = signatures.map(sig => ({ id: sig.id, x: sig.x, y: sig.localY, page: sig.page }));
//         const linkRes = await documentAPI.generateLink({ 
//             pdfPath: uploadRes.data.pdfPath, 
//             signs: formattedSigns, 
//             name: selectedFile.name 
//         });
//         if (linkRes.data.id) {
//             setGeneratedLink(`${window.location.origin}/sign/${linkRes.data.id}`);
//             setStep('success');
//         }
//     } catch (err) { 
//         alert("Server error!"); 
//     } finally { 
//         setIsUploading(false); 
//     }
//   };

//   useEffect(() => {
//     const handleMove = (e: any) => {
//       if (activeId === null || !containerRef.current) return;
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//       const rect = containerRef.current.getBoundingClientRect();
//       const newX = Math.max(0, Math.min(clientX - rect.left - 75, rect.width - 150));
//       const newY = Math.max(0, Math.min(clientY - rect.top - 25, rect.height - 50));
//       const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
//       setSignatures(prev => prev.map(s => s.id === activeId ? { ...s, x: newX, y: newY, localY: newY % pageHeight, page: Math.floor(newY / pageHeight) + 1 } : s ));
//     };
//     const stopDrag = () => setActiveId(null);
//     window.addEventListener('mousemove', handleMove);
//     window.addEventListener('mouseup', stopDrag);
//     window.addEventListener('touchmove', handleMove, { passive: false });
//     window.addEventListener('touchend', stopDrag);
//     return () => { 
//         window.removeEventListener('mousemove', handleMove); 
//         window.removeEventListener('mouseup', stopDrag);
//         window.removeEventListener('touchmove', handleMove);
//         window.removeEventListener('touchend', stopDrag);
//     };
//   }, [activeId, numPages]);

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
//       {/* Sidebar এ সঠিকভাবে প্রপস পাঠানো হয়েছে */}
//       <Sidebar 
//         currentView="upload" 
//         isOpen={isSidebarOpen} 
//         setIsOpen={setIsSidebarOpen} 
//       />
      
//       {/* ডেস্কটপে সাইডবারের জন্য জায়গা রাখতে lg:ml-64 ব্যবহার করা হয়েছে */}
//       <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8">
//         <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-4">
//             {/* Back arrow navigation fix */}
//             <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h1 className="text-xl lg:text-2xl font-bold text-slate-900">Prepare Document</h1>
//               <p className="text-xs lg:text-sm text-slate-500">Drag signature fields to desired positions</p>
//             </div>
//           </div>
//           {step === 'place' && (
//             <Button onClick={addSignatureBox} className="bg-sky-600 hover:bg-sky-700 shadow-md flex gap-2 w-full sm:w-auto">
//               <Plus className="h-4 w-4" /> Add Field
//             </Button>
//           )}
//         </header>

//         {step === 'upload' && (
//           <div className="max-w-2xl mx-auto mt-12 bg-white p-10 lg:p-20 border-2 border-dashed rounded-3xl text-center">
//             <Upload className="h-12 w-12 text-sky-400 mx-auto mb-6" />
//             <h3 className="text-xl font-semibold mb-2">Upload your PDF</h3>
//             <p className="text-slate-400 mb-8 text-sm">Select the document you want to get signed</p>
//             <Button onClick={() => document.getElementById('fileInput')?.click()} className="bg-sky-600 px-8 w-full sm:w-auto">Choose File</Button>
//             <input type="file" id="fileInput" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) { setSelectedFile(e.target.files[0]); setStep('place'); } }} className="hidden" />
//           </div>
//         )}

//         {step === 'place' && (
//           <div className="flex flex-col lg:flex-row gap-8">
//             <div ref={scrollParentRef} className="flex-1 bg-slate-200 rounded-2xl p-2 lg:p-8 overflow-auto border border-slate-300 max-h-[70vh]">
//               <div ref={containerRef} className="relative mx-auto shadow-2xl bg-white select-none" style={{ width: '600px' }}>
//                 <Document file={selectedFile} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
//                   {Array.from(new Array(numPages), (_, i) => (
//                     <div key={i} className="border-b">
//                       <Page pageNumber={i + 1} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
//                     </div>
//                   ))}
//                 </Document>
//                 {signatures.map((sig) => (
//                   <div key={sig.id} style={{ left: `${sig.x}px`, top: `${sig.y}px` }} onMouseDown={() => setActiveId(sig.id)} onTouchStart={() => setActiveId(sig.id)}
//                     className="absolute z-[50] w-[150px] h-[50px] border-2 border-dashed border-sky-600 bg-sky-500/20 flex items-center justify-center cursor-move touch-none"
//                   >
//                     <span className="text-[10px] font-bold text-sky-800 pointer-events-none flex items-center gap-1"><Move className="h-3 w-3" /> SIGN HERE</span>
//                     <button onClick={(e) => { e.stopPropagation(); setSignatures(signatures.filter(s => s.id !== sig.id)); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"><Trash2 className="h-3 w-3" /></button>
//                   </div>
//                 ))}
//               </div>
//             </div>
//             <div className="w-full lg:w-80 space-y-4">
//               <Card className="p-6 bg-white border-none shadow-sm">
//                 <h3 className="font-bold text-slate-800 text-lg mb-4 text-center border-b pb-2">Summary</h3>
//                 <div className="space-y-3 text-sm">
//                   <div className="flex justify-between"><span className="text-slate-400">Total Fields:</span><span className="font-bold text-sky-600">{signatures.length}</span></div>
//                   <div className="flex justify-between"><span className="text-slate-400">Pages:</span><span className="font-bold">{numPages || 0}</span></div>
//                 </div>
//               </Card>
//               <Button className="w-full bg-sky-600 h-14 text-lg font-bold" onClick={handleGenerateLink} disabled={isUploading || signatures.length === 0}>
//                 {isUploading ? <Loader2 className="animate-spin" /> : 'Generate Link'}
//               </Button>
//             </div>
//           </div>
//         )}

//         {step === 'success' && (
//           <div className="max-w-xl mx-auto mt-10 text-center px-4">
//             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8"><Check className="h-12 w-12 text-green-600" /></div>
//             <h2 className="text-2xl font-bold mb-2">Link Generated!</h2>
//             <div className="flex flex-col sm:flex-row gap-2 p-3 bg-white border rounded-2xl mb-10 shadow-inner">
//               <input readOnly value={generatedLink} className="flex-1 bg-transparent px-2 text-sm truncate focus:outline-none" />
//               <Button size="sm" onClick={() => { navigator.clipboard.writeText(generatedLink); alert("Copied!"); }} className="bg-slate-900">Copy</Button>
//             </div>
//             <Button variant="outline" size="lg" className="px-10 rounded-xl w-full" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }


// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Sidebar } from '../components/Sidebar';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import { Upload, Move, Check, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
// import { documentAPI } from '../api/api';
// import { Document, Page, pdfjs } from 'react-pdf';

// // CSS Imports
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// // 🛠 ফিক্স ১: প্রোডাকশন-রেডি PDF Worker পাথ
// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;

// interface SignaturePos {
//   id: number;
//   x: number;
//   y: number;       
//   localY: number;  
//   page: number; 
// }

// export function UploadPage() {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
//   const [step, setStep] = useState<'upload' | 'place' | 'success'>('upload');
//   const [isUploading, setIsUploading] = useState(false);
//   const [generatedLink, setGeneratedLink] = useState('');
//   const [signatures, setSignatures] = useState<SignaturePos[]>([]);
//   const [activeId, setActiveId] = useState<number | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
  
//   const containerRef = useRef<HTMLDivElement>(null);
//   const scrollParentRef = useRef<HTMLDivElement>(null);

//   // 🛠 ফিক্স ২: অটোমেটিক পেজ ডিটেকশন লজিক উন্নত করা হয়েছে
//   const addSignatureBox = () => {
//     if (!containerRef.current || !scrollParentRef.current) return;
//     const scrollOffset = scrollParentRef.current.scrollTop;
//     const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
    
//     // বর্তমান স্ক্রল অনুযায়ী পেজ নাম্বার বের করা
//     const currentPage = Math.max(1, Math.min(Math.floor((scrollOffset + 150) / pageHeight) + 1, numPages || 1));

//     setSignatures([...signatures, {
//       id: Date.now(),
//       x: 50, 
//       y: scrollOffset + 100, // স্ক্রিনের ভেতরে যেন দেখা যায়
//       localY: (scrollOffset + 100) % pageHeight, 
//       page: currentPage 
//     }]);
//   };

//   const handleGenerateLink = async () => {
//     if (!selectedFile || signatures.length === 0) return alert("Please add a sign box!");
//     setIsUploading(true);
//     try {
//         const formData = new FormData();
//         formData.append('pdfFile', selectedFile);
        
//         // ১. PDF আপলোড করা
//         const uploadRes = await documentAPI.uploadPdf(formData);
        
//         // ২. সিগনেচার ডাটা ম্যাপ করা
//         const formattedSigns = signatures.map(sig => ({ 
//           id: sig.id, 
//           x: sig.x, 
//           y: sig.localY, 
//           page: sig.page 
//         }));

//         // ৩. লিঙ্কের জন্য রিকোয়েস্ট পাঠানো
//         const linkRes = await documentAPI.generateLink({ 
//             pdfPath: uploadRes.data.pdfPath, 
//             signs: formattedSigns, 
//             name: selectedFile.name 
//         });

//         if (linkRes.data.id) {
//             // 🛠 ফিক্স ৩: সঠিক ডোমেইন লিঙ্ক তৈরি
//             const fullLink = `${window.location.origin}/sign/${linkRes.data.id}`;
//             setGeneratedLink(fullLink);
//             setStep('success');
//         }
//     } catch (err: any) { 
//         console.error("Link Generation Error:", err);
//         alert(err.response?.data?.message || "Failed to generate link. Backend error!"); 
//     } finally { 
//         setIsUploading(false); 
//     }
//   };

//   // মাউস এবং টাচ ড্র্যাগ লজিক
//   useEffect(() => {
//     const handleMove = (e: any) => {
//       if (activeId === null || !containerRef.current) return;
      
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
//       const rect = containerRef.current.getBoundingClientRect();
//       const newX = Math.max(0, Math.min(clientX - rect.left - 75, rect.width - 150));
//       const newY = Math.max(0, Math.min(clientY - rect.top - 25, rect.height - 50));
      
//       const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
      
//       setSignatures(prev => prev.map(s => s.id === activeId ? { 
//         ...s, 
//         x: newX, 
//         y: newY, 
//         localY: newY % pageHeight, 
//         page: Math.floor(newY / pageHeight) + 1 
//       } : s ));
//     };

//     const stopDrag = () => setActiveId(null);

//     window.addEventListener('mousemove', handleMove);
//     window.addEventListener('mouseup', stopDrag);
//     window.addEventListener('touchmove', handleMove, { passive: false });
//     window.addEventListener('touchend', stopDrag);

//     return () => { 
//         window.removeEventListener('mousemove', handleMove); 
//         window.removeEventListener('mouseup', stopDrag);
//         window.removeEventListener('touchmove', handleMove);
//         window.removeEventListener('touchend', stopDrag);
//     };
//   }, [activeId, numPages]);

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
//       <Sidebar 
//         currentView="upload" 
//         isOpen={isSidebarOpen} 
//         setIsOpen={setIsSidebarOpen} 
//       />
      
//       <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 transition-all duration-300">
//         <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full hover:bg-slate-200">
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">Prepare Document</h1>
//               <p className="text-xs lg:text-sm text-slate-500">Add and position signature fields on the PDF</p>
//             </div>
//           </div>
//           {step === 'place' && (
//             <Button onClick={addSignatureBox} className="bg-sky-600 hover:bg-sky-700 shadow-lg flex gap-2 w-full sm:w-auto rounded-xl">
//               <Plus className="h-4 w-4" /> Add Sign Field
//             </Button>
//           )}
//         </header>

//         {step === 'upload' && (
//           <div className="max-w-2xl mx-auto mt-12 bg-white p-10 lg:p-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center shadow-sm">
//             <div className="bg-sky-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Upload className="h-10 w-10 text-sky-500" />
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 mb-2">Upload your PDF</h3>
//             <p className="text-slate-400 mb-8 text-sm">Upload the document you want to send for signing</p>
//             <Button onClick={() => document.getElementById('fileInput')?.click()} className="bg-sky-600 px-10 h-12 rounded-xl text-white font-bold">Choose PDF File</Button>
//             <input type="file" id="fileInput" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) { setSelectedFile(e.target.files[0]); setStep('place'); } }} className="hidden" />
//           </div>
//         )}

//         {step === 'place' && (
//           <div className="flex flex-col lg:flex-row gap-8">
//             <div ref={scrollParentRef} className="flex-1 bg-slate-200 rounded-3xl p-4 lg:p-8 overflow-auto border border-slate-300 max-h-[75vh] shadow-inner custom-scrollbar">
//               <div ref={containerRef} className="relative mx-auto shadow-2xl bg-white select-none rounded-lg overflow-hidden" style={{ width: '600px' }}>
//                 <Document 
//                   file={selectedFile} 
//                   onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                   loading={<div className="p-10 text-center text-slate-500">Loading PDF...</div>}
//                 >
//                   {Array.from(new Array(numPages), (_, i) => (
//                     <div key={i} className="border-b last:border-0">
//                       <Page pageNumber={i + 1} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
//                     </div>
//                   ))}
//                 </Document>
                
//                 {signatures.map((sig) => (
//                   <div 
//                     key={sig.id} 
//                     style={{ left: `${sig.x}px`, top: `${sig.y}px` }} 
//                     onMouseDown={() => setActiveId(sig.id)} 
//                     onTouchStart={() => setActiveId(sig.id)}
//                     className="absolute z-[50] w-[150px] h-[50px] border-2 border-dashed border-sky-600 bg-sky-500/20 backdrop-blur-[2px] flex items-center justify-center cursor-move touch-none rounded-lg"
//                   >
//                     <span className="text-[10px] font-black text-sky-800 uppercase tracking-widest flex items-center gap-1"><Move className="h-3 w-3" /> Sign Here</span>
//                     <button 
//                       onClick={(e) => { e.stopPropagation(); setSignatures(signatures.filter(s => s.id !== sig.id)); }} 
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
//                     >
//                       <Trash2 className="h-3 w-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="w-full lg:w-80 space-y-6">
//               <Card className="p-6 bg-white border-none shadow-sm rounded-3xl">
//                 <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest mb-4 border-b pb-4">Document Details</h3>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-400 text-xs font-bold uppercase">Sign Fields</span>
//                     <span className="font-black text-sky-600 text-lg">{signatures.length}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-400 text-xs font-bold uppercase">Total Pages</span>
//                     <span className="font-bold text-slate-700">{numPages || 0}</span>
//                   </div>
//                 </div>
//               </Card>
//               <Button 
//                 className="w-full bg-sky-600 h-16 text-lg font-black uppercase tracking-widest rounded-3xl shadow-lg shadow-sky-600/20" 
//                 onClick={handleGenerateLink} 
//                 disabled={isUploading || signatures.length === 0}
//               >
//                 {isUploading ? <Loader2 className="animate-spin" /> : 'Finish & Share'}
//               </Button>
//             </div>
//           </div>
//         )}

//         {step === 'success' && (
//           <div className="max-w-xl mx-auto mt-10 text-center px-4">
//             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
//               <Check className="h-12 w-12 text-green-600" />
//             </div>
//             <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">LINK GENERATED!</h2>
//             <p className="text-slate-500 mb-8">Anyone with this link can now sign the document.</p>
            
//             <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-slate-100 rounded-[2rem] mb-10 shadow-inner">
//               <input 
//                 readOnly 
//                 value={generatedLink} 
//                 className="flex-1 bg-transparent px-4 text-sm font-medium text-sky-700 truncate focus:outline-none" 
//               />
//               <Button 
//                 onClick={() => { 
//                   navigator.clipboard.writeText(generatedLink); 
//                   alert("Link copied to clipboard!"); 
//                 }} 
//                 className="bg-slate-900 px-8 rounded-2xl font-bold uppercase text-xs tracking-widest h-12"
//               >
//                 Copy Link
//               </Button>
//             </div>
            
//             <div className="flex flex-col gap-3">
//                <Button 
//                  className="h-14 bg-sky-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-sky-600/20"
//                  onClick={() => window.open(generatedLink, '_blank')}
//                >
//                  Open Signing Page
//                </Button>
//                <Button variant="ghost" className="h-12 text-slate-400 font-bold" onClick={() => navigate('/dashboard')}>
//                  Back to Dashboard
//                </Button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Sidebar } from '../components/Sidebar';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import { Upload, Move, Check, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
// import { documentAPI } from '../api/api';
// import { Document, Page, pdfjs } from 'react-pdf';

// // CSS Imports
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// // ✅ ফিক্স: ডায়নামিক ভার্সন ডিটেকশন (unpkg CDN ব্যবহার করা হয়েছে যা একদম সঠিক ভার্সন লোড করবে)
// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// interface SignaturePos {
//   id: number;
//   x: number;
//   y: number;       
//   localY: number;  
//   page: number; 
// }

// export function UploadPage() {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
//   const [step, setStep] = useState<'upload' | 'place' | 'success'>('upload');
//   const [isUploading, setIsUploading] = useState(false);
//   const [generatedLink, setGeneratedLink] = useState('');
//   const [signatures, setSignatures] = useState<SignaturePos[]>([]);
//   const [activeId, setActiveId] = useState<number | null>(null);
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
  
//   const containerRef = useRef<HTMLDivElement>(null);
//   const scrollParentRef = useRef<HTMLDivElement>(null);

//   // 🛠 অটোমেটিক পেজ ডিটেকশন লজিক
//   const addSignatureBox = () => {
//     if (!containerRef.current || !scrollParentRef.current) return;
//     const scrollOffset = scrollParentRef.current.scrollTop;
//     const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
    
//     const currentPage = Math.max(1, Math.min(Math.floor((scrollOffset + 150) / pageHeight) + 1, numPages || 1));

//     setSignatures([...signatures, {
//       id: Date.now(),
//       x: 50, 
//       y: scrollOffset + 100, 
//       localY: (scrollOffset + 100) % pageHeight, 
//       page: currentPage 
//     }]);
//   };

//   const handleGenerateLink = async () => {
//     if (!selectedFile || signatures.length === 0) return alert("Please add a sign box!");
//     setIsUploading(true);
//     try {
//         const formData = new FormData();
//         formData.append('pdfFile', selectedFile);
        
//         const uploadRes = await documentAPI.uploadPdf(formData);
        
//         const formattedSigns = signatures.map(sig => ({ 
//           id: sig.id, 
//           x: sig.x, 
//           y: sig.localY, 
//           page: sig.page 
//         }));

//         const linkRes = await documentAPI.generateLink({ 
//             pdfPath: uploadRes.data.pdfPath, 
//             signs: formattedSigns, 
//             name: selectedFile.name 
//         });

//         if (linkRes.data.id) {
//             const fullLink = `${window.location.origin}/sign/${linkRes.data.id}`;
//             setGeneratedLink(fullLink);
//             setStep('success');
//         }
//     } catch (err: any) { 
//         console.error("Link Generation Error:", err);
//         alert(err.response?.data?.message || "Failed to generate link. Backend error!"); 
//     } finally { 
//         setIsUploading(false); 
//     }
//   };

//   // ড্র্যাগ লজিক
//   useEffect(() => {
//     const handleMove = (e: any) => {
//       if (activeId === null || !containerRef.current) return;
      
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
//       const rect = containerRef.current.getBoundingClientRect();
//       const newX = Math.max(0, Math.min(clientX - rect.left - 75, rect.width - 150));
//       const newY = Math.max(0, Math.min(clientY - rect.top - 25, rect.height - 50));
      
//       const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
      
//       setSignatures(prev => prev.map(s => s.id === activeId ? { 
//         ...s, 
//         x: newX, 
//         y: newY, 
//         localY: newY % pageHeight, 
//         page: Math.floor(newY / pageHeight) + 1 
//       } : s ));
//     };

//     const stopDrag = () => setActiveId(null);

//     window.addEventListener('mousemove', handleMove);
//     window.addEventListener('mouseup', stopDrag);
//     window.addEventListener('touchmove', handleMove, { passive: false });
//     window.addEventListener('touchend', stopDrag);

//     return () => { 
//         window.removeEventListener('mousemove', handleMove); 
//         window.removeEventListener('mouseup', stopDrag);
//         window.removeEventListener('touchmove', handleMove);
//         window.removeEventListener('touchend', stopDrag);
//     };
//   }, [activeId, numPages]);

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row">
//       <Sidebar currentView="upload" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
//       <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 lg:pt-8 transition-all duration-300">
//         <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
//           <div className="flex items-center gap-4">
//             <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')} className="rounded-full hover:bg-slate-200">
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h1 className="text-xl lg:text-2xl font-bold text-slate-900 tracking-tight">Prepare Document</h1>
//               <p className="text-xs lg:text-sm text-slate-500">Add and position signature fields on the PDF</p>
//             </div>
//           </div>
//           {step === 'place' && (
//             <Button onClick={addSignatureBox} className="bg-sky-600 hover:bg-sky-700 shadow-lg flex gap-2 w-full sm:w-auto rounded-xl text-white">
//               <Plus className="h-4 w-4" /> Add Sign Field
//             </Button>
//           )}
//         </header>

//         {step === 'upload' && (
//           <div className="max-w-2xl mx-auto mt-12 bg-white p-10 lg:p-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center shadow-sm">
//             <div className="bg-sky-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Upload className="h-10 w-10 text-sky-500" />
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 mb-2">Upload your PDF</h3>
//             <p className="text-slate-400 mb-8 text-sm">Upload the document you want to send for signing</p>
//             <Button onClick={() => document.getElementById('fileInput')?.click()} className="bg-sky-600 px-10 h-12 rounded-xl text-white font-bold">Choose PDF File</Button>
//             <input type="file" id="fileInput" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) { setSelectedFile(e.target.files[0]); setStep('place'); } }} className="hidden" />
//           </div>
//         )}

//         {step === 'place' && (
//           <div className="flex flex-col lg:flex-row gap-8">
//             <div ref={scrollParentRef} className="flex-1 bg-slate-200 rounded-3xl p-4 lg:p-8 overflow-auto border border-slate-300 max-h-[75vh] shadow-inner">
//               <div ref={containerRef} className="relative mx-auto shadow-2xl bg-white select-none rounded-lg overflow-hidden" style={{ width: '600px' }}>
//                 <Document 
//                   file={selectedFile} 
//                   onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                   loading={<div className="p-10 text-center text-slate-500 font-bold">Loading PDF...</div>}
//                 >
//                   {Array.from(new Array(numPages || 0), (_, i) => (
//                     <div key={i} className="border-b last:border-0">
//                       <Page pageNumber={i + 1} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
//                     </div>
//                   ))}
//                 </Document>
                
//                 {signatures.map((sig) => (
//                   <div 
//                     key={sig.id} 
//                     style={{ left: `${sig.x}px`, top: `${sig.y}px` }} 
//                     onMouseDown={() => setActiveId(sig.id)} 
//                     onTouchStart={() => setActiveId(sig.id)}
//                     className="absolute z-[50] w-[150px] h-[50px] border-2 border-dashed border-sky-600 bg-sky-500/20 backdrop-blur-[2px] flex items-center justify-center cursor-move touch-none rounded-lg"
//                   >
//                     <span className="text-[10px] font-black text-sky-800 uppercase tracking-widest flex items-center gap-1"><Move className="h-3 w-3" /> Sign Here</span>
//                     <button 
//                       onClick={(e) => { e.stopPropagation(); setSignatures(signatures.filter(s => s.id !== sig.id)); }} 
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
//                     >
//                       <Trash2 className="h-3 w-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             <div className="w-full lg:w-80 space-y-6">
//               <Card className="p-6 bg-white border-none shadow-sm rounded-3xl">
//                 <h3 className="font-bold text-slate-800 text-sm uppercase tracking-widest mb-4 border-b pb-4">Document Details</h3>
//                 <div className="space-y-4">
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-400 text-xs font-bold uppercase">Sign Fields</span>
//                     <span className="font-black text-sky-600 text-lg">{signatures.length}</span>
//                   </div>
//                   <div className="flex justify-between items-center">
//                     <span className="text-slate-400 text-xs font-bold uppercase">Total Pages</span>
//                     <span className="font-bold text-slate-700">{numPages || 0}</span>
//                   </div>
//                 </div>
//               </Card>
//               <Button 
//                 className="w-full bg-sky-600 h-16 text-lg font-black uppercase tracking-widest rounded-3xl shadow-lg shadow-sky-600/20 text-white" 
//                 onClick={handleGenerateLink} 
//                 disabled={isUploading || signatures.length === 0}
//               >
//                 {isUploading ? <Loader2 className="animate-spin mx-auto" /> : 'Finish & Share'}
//               </Button>
//             </div>
//           </div>
//         )}

//         {step === 'success' && (
//           <div className="max-w-xl mx-auto mt-10 text-center px-4">
//             <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-8 shadow-sm">
//               <Check className="h-12 w-12 text-green-600" />
//             </div>
//             <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">LINK GENERATED!</h2>
//             <p className="text-slate-500 mb-8 font-medium">Anyone with this link can now sign the document.</p>
            
//             <div className="flex flex-col sm:flex-row gap-3 p-4 bg-white border border-slate-100 rounded-[2rem] mb-10 shadow-inner">
//               <input 
//                 readOnly 
//                 value={generatedLink} 
//                 className="flex-1 bg-transparent px-4 text-sm font-medium text-sky-700 truncate focus:outline-none" 
//               />
//               <Button 
//                 onClick={() => { 
//                   navigator.clipboard.writeText(generatedLink); 
//                   alert("Link copied to clipboard!"); 
//                 }} 
//                 className="bg-slate-900 px-8 rounded-2xl font-bold uppercase text-xs tracking-widest h-12 text-white"
//               >
//                 Copy Link
//               </Button>
//             </div>
            
//             <div className="flex flex-col gap-3">
//                <Button 
//                  className="h-14 bg-sky-600 text-white rounded-2xl font-bold text-sm uppercase tracking-widest shadow-lg shadow-sky-600/20"
//                  onClick={() => window.open(generatedLink, '_blank')}
//                >
//                  Open Signing Page
//                </Button>
//                <Button variant="ghost" className="h-12 text-slate-400 font-bold" onClick={() => navigate('/dashboard')}>
//                  Back to Dashboard
//                </Button>
//             </div>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }
// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Sidebar } from '../components/Sidebar';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import { Upload, Move, Check, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
// import { documentAPI } from '../api/api';
// import { Document, Page, pdfjs } from 'react-pdf';

// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// // ✅ Worker Fix: Standard CDN link use kora hoyeche jate loading fail na hoy
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// export function UploadPage() {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [step, setStep] = useState('upload');
//   const [isUploading, setIsUploading] = useState(false);
//   const [generatedLink, setGeneratedLink] = useState('');
//   const [signatures, setSignatures] = useState([]);
//   const [activeId, setActiveId] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [numPages, setNumPages] = useState(null);
  
//   const containerRef = useRef(null);
//   const scrollParentRef = useRef(null);

//   // ✅ Add Sign Function (Button name changed to "Add Sign")
//   const addSignatureBox = () => {
//     if (!containerRef.current || !scrollParentRef.current) return;
//     const scrollOffset = scrollParentRef.current.scrollTop;
//     const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
//     const currentPage = Math.max(1, Math.min(Math.floor((scrollOffset + 150) / pageHeight) + 1, numPages || 1));

//     setSignatures([...signatures, {
//       id: Date.now(),
//       x: 50, 
//       y: scrollOffset + 100, 
//       localY: (scrollOffset + 100) % pageHeight, 
//       page: currentPage 
//     }]);
//   };

//   const handleGenerateLink = async () => {
//     if (!selectedFile || signatures.length === 0) return alert("Please add a sign box!");
//     setIsUploading(true);
//     try {
//         const formData = new FormData();
//         formData.append('pdfFile', selectedFile);
//         const uploadRes = await documentAPI.uploadPdf(formData);
//         const formattedSigns = signatures.map(sig => ({ 
//           id: sig.id, x: sig.x, y: sig.localY, page: sig.page 
//         }));
//         const linkRes = await documentAPI.generateLink({ 
//             pdfPath: uploadRes.data.pdfPath, 
//             signs: formattedSigns, 
//             name: selectedFile.name 
//         });
//         if (linkRes.data.id) {
//             setGeneratedLink(`${window.location.origin}/sign/${linkRes.data.id}`);
//             setStep('success');
//         }
//     } catch (err) { 
//         alert("Upload Failed!"); 
//     } finally { setIsUploading(false); }
//   };

//   useEffect(() => {
//     const handleMove = (e) => {
//       if (activeId === null || !containerRef.current) return;
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
//       const rect = containerRef.current.getBoundingClientRect();
//       const newX = Math.max(0, Math.min(clientX - rect.left - 75, rect.width - 150));
//       const newY = Math.max(0, Math.min(clientY - rect.top - 25, rect.height - 50));
//       const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
//       setSignatures(prev => prev.map(s => s.id === activeId ? { 
//         ...s, x: newX, y: newY, localY: newY % pageHeight, page: Math.floor(newY / pageHeight) + 1 
//       } : s ));
//     };
//     const stopDrag = () => setActiveId(null);
//     window.addEventListener('mousemove', handleMove);
//     window.addEventListener('mouseup', stopDrag);
//     window.addEventListener('touchmove', handleMove, { passive: false });
//     window.addEventListener('touchend', stopDrag);
//     return () => { 
//         window.removeEventListener('mousemove', handleMove); 
//         window.removeEventListener('mouseup', stopDrag);
//         window.removeEventListener('touchmove', handleMove);
//         window.removeEventListener('touchend', stopDrag);
//     };
//   }, [activeId, numPages]);

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-x-hidden">
//       <Sidebar currentView="upload" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
//       <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 transition-all duration-300">
//         <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 text-left">
//           <div className="flex items-center gap-4 w-full">
//             <Button variant="ghost" onClick={() => navigate('/dashboard')} className="rounded-full">
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h1 className="text-xl lg:text-3xl font-black text-slate-900 uppercase italic">Prepare Document</h1>
//               <p className="text-xs lg:text-sm text-slate-500 font-bold uppercase tracking-widest">Add signature boxes and position them</p>
//             </div>
//           </div>
//           {step === 'place' && (
//             <Button onClick={addSignatureBox} className="bg-sky-600 text-white rounded-xl shadow-lg flex gap-2 w-full sm:w-auto font-black italic h-12 px-6">
//               <Plus className="h-4 w-4" /> ADD SIGN
//             </Button>
//           )}
//         </header>

//         {step === 'upload' && (
//           <div className="max-w-2xl mx-auto mt-12 bg-white p-10 lg:p-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center shadow-sm">
//             <div className="bg-sky-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Upload className="h-10 w-10 text-sky-500" />
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 mb-2">Upload your PDF</h3>
//             <p className="text-slate-400 mb-8 text-sm">Upload the document you want to send for signing</p>
//             <Button onClick={() => document.getElementById('fileInput')?.click()} className="bg-sky-600 px-10 h-12 rounded-xl text-white font-bold">Choose PDF File</Button>
//             <input type="file" id="fileInput" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) { setSelectedFile(e.target.files[0]); setStep('place'); } }} className="hidden" />
//           </div>
//         )}

//         {step === 'place' && (
//           // ✅ Large screen responsive fix (flex-row for desktop)
//           <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
            
//             {/* PDF View Container */}
//             <div ref={scrollParentRef} className="w-full xl:w-[850px] bg-slate-200 rounded-[2rem] p-4 lg:p-10 overflow-auto border border-slate-300 h-[70vh] xl:h-[80vh] shadow-inner custom-scrollbar">
//               <div ref={containerRef} className="relative mx-auto shadow-2xl bg-white select-none" style={{ width: '600px', maxWidth: '100%' }}>
//                 <Document 
//                   file={selectedFile} 
//                   onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                   loading={<div className="p-20 text-center font-black text-slate-400 animate-pulse tracking-tighter text-2xl uppercase">Rendering Secure PDF...</div>}
//                 >
//                   {Array.from(new Array(numPages || 0), (_, i) => (
//                     <div key={i} className="mb-4 border-b last:border-0 shadow-sm">
//                       <Page pageNumber={i + 1} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
//                     </div>
//                   ))}
//                 </Document>
                
//                 {signatures.map((sig) => (
//                   <div key={sig.id} style={{ left: sig.x, top: sig.y, touchAction: 'none' }} onMouseDown={() => setActiveId(sig.id)} onTouchStart={() => setActiveId(sig.id)}
//                     className="absolute z-[50] w-[150px] h-[50px] border-2 border-dashed border-sky-600 bg-sky-500/20 backdrop-blur-[2px] flex items-center justify-center cursor-move rounded-lg shadow-lg group"
//                   >
//                     <span className="text-[10px] font-black text-sky-800 uppercase flex items-center gap-1"><Move className="h-3 w-3" /> Sign Here</span>
//                     <button onClick={(e) => { e.stopPropagation(); setSignatures(signatures.filter(s => s.id !== sig.id)); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:scale-110 transition-transform"><Trash2 className="h-3 w-3" /></button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* ✅ Info Panel Responsive Fix */}
//             <div className="w-full xl:w-80 space-y-6">
//               <Card className="p-8 bg-white rounded-[2rem] border-none shadow-xl text-left">
//                 <h3 className="font-black text-slate-800 text-xs uppercase mb-6 border-b pb-4 tracking-widest italic">Document Details</h3>
//                 <div className="flex justify-between mb-3 text-sm font-bold"><span className="text-slate-400">SIGN BOXES:</span><span className="text-sky-600 font-black">{signatures.length}</span></div>
//                 <div className="flex justify-between text-sm font-bold"><span className="text-slate-400">TOTAL PAGES:</span><span className="text-slate-700 font-black">{numPages || 0}</span></div>
//               </Card>
//               <Button className="w-full bg-sky-600 h-20 text-xl font-black text-white rounded-[2rem] shadow-2xl shadow-sky-100 uppercase tracking-tighter italic" onClick={handleGenerateLink} disabled={isUploading || signatures.length === 0}>
//                 {isUploading ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : 'FINISH & SHARE'}
//               </Button>
//             </div>
//           </div>
//         )}

//         {step === 'success' && (
//           <div className="max-w-xl mx-auto mt-10 text-center px-4 animate-in fade-in zoom-in duration-500">
//              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                <Check className="h-10 w-10 text-green-600" />
//             </div>
//             <h2 className="text-3xl font-black mb-2 uppercase italic">Success! Link Ready</h2>
//             <div className="flex gap-3 p-5 bg-white border-2 border-slate-100 rounded-[2rem] mb-10 shadow-inner mt-6 items-center">
//               <input readOnly value={generatedLink} className="flex-1 bg-transparent px-4 text-sm truncate outline-none font-bold text-sky-700" />
//               <Button onClick={() => { navigator.clipboard.writeText(generatedLink); alert("Copied!"); }} className="bg-slate-900 text-white px-6 h-12 rounded-2xl font-black uppercase text-xs">Copy</Button>
//             </div>
//             <Button className="w-full h-16 bg-sky-600 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl" onClick={() => window.open(generatedLink, '_blank')}>OPEN SIGNING PAGE</Button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// // }
// import React, { useState, useRef, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { Sidebar } from '../components/Sidebar';
// import { Button } from '../components/ui/Button';
// import { Card } from '../components/ui/Card';
// import { Upload, Move, Check, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
// import { documentAPI } from '../api/api';
// import { Document, Page, pdfjs } from 'react-pdf';

// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';

// // ✅ Worker Fix: Standard version specific CDN use kora hoyeche
// pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

// export function UploadPage() {
//   const navigate = useNavigate();
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [step, setStep] = useState('upload');
//   const [isUploading, setIsUploading] = useState(false);
//   const [generatedLink, setGeneratedLink] = useState('');
//   const [signatures, setSignatures] = useState([]);
//   const [activeId, setActiveId] = useState(null);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [numPages, setNumPages] = useState(null);
  
//   const containerRef = useRef(null);
//   const scrollParentRef = useRef(null);

//   // ✅ Box Add korar logic (Page calculation fix)
//   const addSignatureBox = () => {
//     if (!containerRef.current || !scrollParentRef.current) return;
//     const scrollOffset = scrollParentRef.current.scrollTop;
//     const totalHeight = containerRef.current.scrollHeight;
//     const pageHeight = totalHeight / (numPages || 1);
    
//     // Position box near the current scroll view
//     const currentPage = Math.max(1, Math.min(Math.floor((scrollOffset + 100) / pageHeight) + 1, numPages || 1));

//     setSignatures([...signatures, {
//       id: Date.now(),
//       x: 50, 
//       y: scrollOffset + 100, 
//       localY: (scrollOffset + 100) % pageHeight, 
//       page: currentPage 
//     }]);
//   };

//   // ✅ Cloudinary Direct Upload Logic implemented inside handleGenerateLink
//   const handleGenerateLink = async () => {
//     if (!selectedFile || signatures.length === 0) return alert("Please add a sign box!");
    
//     setIsUploading(true);
//     try {
//       // ☁️ 1. Direct Cloudinary Upload (Preventing 5MB Backend Limit)
//       const data = new FormData();
//       data.append("file", selectedFile);
//       data.append("upload_preset", "fixensy_preset");
//       data.append("cloud_name", "dxbpamnhh");

//       const cloudRes = await fetch(
//         `https://api.cloudinary.com/v1_1/dxbpamnhh/auto/upload`,
//         { method: "POST", body: data }
//       );
      
//       const cloudData = await cloudRes.json();

//       if (cloudData.secure_url) {
//         // 🚀 2. Send Metadata to Backend
//         const formattedSigns = signatures.map(sig => ({ 
//           id: sig.id, 
//           x: sig.x, 
//           y: sig.localY, 
//           page: sig.page 
//         }));

//         const linkRes = await documentAPI.generateLink({ 
//             pdfPath: cloudData.secure_url, 
//             signs: formattedSigns, 
//             name: selectedFile.name 
//         });

//         if (linkRes.data.id) {
//             setGeneratedLink(`${window.location.origin}/sign/${linkRes.data.id}`);
//             setStep('success');
//         }
//       } else {
//         throw new Error("Cloudinary upload failed");
//       }
//     } catch (err) { 
//       console.error("Full Error Details:", err);
//       alert("Process Failed! Please try again."); 
//     } finally { 
//       setIsUploading(false); 
//     }
//   };

//   // ✅ Drag logic with Touch support
//   useEffect(() => {
//     const handleMove = (e) => {
//       if (activeId === null || !containerRef.current) return;
      
//       const clientX = e.touches ? e.touches[0].clientX : e.clientX;
//       const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      
//       const rect = containerRef.current.getBoundingClientRect();
//       const newX = Math.max(0, Math.min(clientX - rect.left - 75, rect.width - 150));
//       const newY = Math.max(0, Math.min(clientY - rect.top - 25, rect.height - 50));
      
//       const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
      
//       setSignatures(prev => prev.map(s => s.id === activeId ? { 
//         ...s, 
//         x: newX, 
//         y: newY, 
//         localY: newY % pageHeight, 
//         page: Math.floor(newY / pageHeight) + 1 
//       } : s ));
//     };

//     const stopDrag = () => setActiveId(null);

//     window.addEventListener('mousemove', handleMove);
//     window.addEventListener('mouseup', stopDrag);
//     window.addEventListener('touchmove', handleMove, { passive: false });
//     window.addEventListener('touchend', stopDrag);
    
//     return () => { 
//         window.removeEventListener('mousemove', handleMove); 
//         window.removeEventListener('mouseup', stopDrag);
//         window.removeEventListener('touchmove', handleMove);
//         window.removeEventListener('touchend', stopDrag);
//     };
//   }, [activeId, numPages]);

//   return (
//     <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-x-hidden">
//       <Sidebar currentView="upload" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
//       <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 transition-all duration-300">
//         <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 text-left">
//           <div className="flex items-center gap-4 w-full">
//             <Button variant="ghost" onClick={() => navigate('/dashboard')} className="rounded-full hover:bg-slate-200">
//               <ArrowLeft className="h-5 w-5" />
//             </Button>
//             <div>
//               <h1 className="text-xl lg:text-3xl font-black text-slate-900 uppercase italic">Prepare Document</h1>
//               <p className="text-xs lg:text-sm text-slate-500 font-bold uppercase tracking-widest">Position the signature boxes</p>
//             </div>
//           </div>
//           {step === 'place' && (
//             <Button onClick={addSignatureBox} className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-lg flex gap-2 w-full sm:w-auto font-black italic h-12 px-6 transition-all">
//               <Plus className="h-4 w-4" /> ADD SIGN
//             </Button>
//           )}
//         </header>

//         {step === 'upload' && (
//           <div className="max-w-2xl mx-auto mt-12 bg-white p-10 lg:p-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center shadow-sm">
//             <div className="bg-sky-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
//               <Upload className="h-10 w-10 text-sky-500" />
//             </div>
//             <h3 className="text-xl font-bold text-slate-900 mb-2">Upload your PDF</h3>
//             <p className="text-slate-400 mb-8 text-sm">PDF documents only</p>
//             <Button onClick={() => document.getElementById('fileInput')?.click()} className="bg-sky-600 px-10 h-12 rounded-xl text-white font-bold hover:scale-105 transition-transform">Choose PDF File</Button>
//             <input type="file" id="fileInput" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) { setSelectedFile(e.target.files[0]); setStep('place'); } }} className="hidden" />
//           </div>
//         )}

//         {step === 'place' && (
//           <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
//             {/* PDF Viewport */}
//             <div ref={scrollParentRef} className="w-full xl:w-[850px] bg-slate-300 rounded-[2rem] p-4 lg:p-10 overflow-auto border border-slate-400 h-[70vh] xl:h-[80vh] shadow-inner custom-scrollbar relative">
//               <div ref={containerRef} className="relative mx-auto shadow-2xl bg-white select-none" style={{ width: '600px' }}>
//                 <Document 
//                   file={selectedFile} 
//                   onLoadSuccess={({ numPages }) => setNumPages(numPages)}
//                   loading={<div className="p-20 text-center font-black text-slate-500 animate-pulse text-2xl uppercase">Loading PDF...</div>}
//                 >
//                   {Array.from(new Array(numPages || 0), (_, i) => (
//                     <div key={i} className="mb-4 border-b last:border-0">
//                       <Page pageNumber={i + 1} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
//                     </div>
//                   ))}
//                 </Document>
                
//                 {signatures.map((sig) => (
//                   <div key={sig.id} style={{ left: sig.x, top: sig.y, touchAction: 'none' }} 
//                     onMouseDown={() => setActiveId(sig.id)} 
//                     onTouchStart={() => setActiveId(sig.id)}
//                     className="absolute z-[50] w-[150px] h-[50px] border-2 border-dashed border-sky-600 bg-sky-500/30 backdrop-blur-sm flex items-center justify-center cursor-move rounded-lg shadow-xl group animate-in zoom-in"
//                   >
//                     <span className="text-[10px] font-black text-sky-900 uppercase flex items-center gap-1"><Move className="h-3 w-3" /> Sign Box</span>
//                     <button onClick={(e) => { e.stopPropagation(); setSignatures(signatures.filter(s => s.id !== sig.id)); }} 
//                       className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors">
//                       <Trash2 className="h-3 w-3" />
//                     </button>
//                   </div>
//                 ))}
//               </div>
//             </div>

//             {/* Panel */}
//             <div className="w-full xl:w-80 space-y-6">
//               <Card className="p-8 bg-white rounded-[2rem] border-none shadow-xl text-left">
//                 <h3 className="font-black text-slate-800 text-xs uppercase mb-6 border-b pb-4 tracking-widest italic">Info</h3>
//                 <div className="flex justify-between mb-3 text-sm font-bold"><span className="text-slate-400">SIGN BOXES:</span><span className="text-sky-600 font-black">{signatures.length}</span></div>
//                 <div className="flex justify-between text-sm font-bold"><span className="text-slate-400">TOTAL PAGES:</span><span className="text-slate-700 font-black">{numPages || 0}</span></div>
//               </Card>
//               <Button 
//                 className="w-full bg-sky-600 hover:bg-sky-700 h-20 text-xl font-black text-white rounded-[2rem] shadow-2xl shadow-sky-100 uppercase italic transition-all disabled:opacity-50" 
//                 onClick={handleGenerateLink} 
//                 disabled={isUploading || signatures.length === 0}
//               >
//                 {isUploading ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : 'GENERATE LINK'}
//               </Button>
//             </div>
//           </div>
//         )}

//         {step === 'success' && (
//           <div className="max-w-xl mx-auto mt-10 text-center px-4 animate-in fade-in zoom-in duration-500">
//              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
//                <Check className="h-10 w-10 text-green-600" />
//             </div>
//             <h2 className="text-3xl font-black mb-2 uppercase italic">Success! Link Ready</h2>
//             <div className="flex gap-3 p-5 bg-white border-2 border-slate-100 rounded-[2rem] mb-10 shadow-inner mt-6 items-center">
//               <input readOnly value={generatedLink} className="flex-1 bg-transparent px-4 text-sm truncate outline-none font-bold text-sky-700" />
//               <Button onClick={() => { navigator.clipboard.writeText(generatedLink); alert("Link Copied!"); }} className="bg-slate-900 text-white px-6 h-12 rounded-2xl font-black uppercase text-xs hover:bg-black">Copy</Button>
//             </div>
//             <Button className="w-full h-16 bg-sky-600 hover:bg-sky-700 text-white rounded-[2rem] font-black uppercase tracking-widest shadow-xl transition-all" onClick={() => window.open(generatedLink, '_blank')}>OPEN SIGNING PAGE</Button>
//           </div>
//         )}
//       </main>
//     </div>
//   );
// }

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sidebar } from '../components/Sidebar';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { Upload, Move, Check, ArrowLeft, Loader2, Plus, Trash2 } from 'lucide-react';
import { documentAPI } from '../api/api';
import { Document, Page, pdfjs } from 'react-pdf';

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`;

export function UploadPage() {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [step, setStep] = useState('upload');
  const [isUploading, setIsUploading] = useState(false);
  const [generatedLink, setGeneratedLink] = useState('');
  const [signatures, setSignatures] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  
  const containerRef = useRef(null);
  const scrollParentRef = useRef(null);

  const addSignatureBox = () => {
    if (!containerRef.current || !scrollParentRef.current) return;
    const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
    const scrollOffset = scrollParentRef.current.scrollTop;
    const currentPage = Math.floor((scrollOffset + 100) / pageHeight) + 1;

    setSignatures([...signatures, {
      id: Date.now(), x: 50, y: scrollOffset + 100, localY: (scrollOffset + 100) % pageHeight, page: currentPage 
    }]);
  };

  const handleGenerateLink = async () => {
    if (!selectedFile || signatures.length === 0) return alert("Please add a sign box!");
    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", selectedFile);
      data.append("upload_preset", "fixensy_preset");
      data.append("cloud_name", "dxbpamnhh");

      const cloudRes = await fetch(`https://api.cloudinary.com/v1_1/dxbpamnhh/auto/upload`, { method: "POST", body: data });
      const cloudData = await cloudRes.json();

      if (cloudData.secure_url) {
        const res = await documentAPI.generateLink({ 
          pdfPath: cloudData.secure_url, 
          signs: signatures.map(s => ({ id: s.id, x: s.x, y: s.localY, page: s.page })),
          name: selectedFile.name 
        });
        if (res.data.id) {
          setGeneratedLink(`${window.location.origin}/sign/${res.data.id}`);
          setStep('success');
        }
      } else {
        alert("Cloudinary Upload Error. Check your Preset!");
      }
    } catch (err) { 
      console.error(err);
      alert("Network Error or API Down!"); 
    } finally { setIsUploading(false); }
  };

  useEffect(() => {
    const handleMove = (e) => {
      if (activeId === null || !containerRef.current) return;
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const clientY = e.touches ? e.touches[0].clientY : e.clientY;
      const rect = containerRef.current.getBoundingClientRect();
      const pageHeight = containerRef.current.scrollHeight / (numPages || 1);
      const newX = Math.max(0, Math.min(clientX - rect.left - 75, rect.width - 150));
      const newY = Math.max(0, Math.min(clientY - rect.top - 25, rect.height - 50));
      
      setSignatures(prev => prev.map(s => s.id === activeId ? { ...s, x: newX, y: newY, localY: newY % pageHeight, page: Math.floor(newY / pageHeight) + 1 } : s ));
    };
    const stopDrag = () => setActiveId(null);
    window.addEventListener('mousemove', handleMove); window.addEventListener('mouseup', stopDrag);
    window.addEventListener('touchmove', handleMove, { passive: false }); window.addEventListener('touchend', stopDrag);
    return () => { window.removeEventListener('mousemove', handleMove); window.removeEventListener('mouseup', stopDrag); window.removeEventListener('touchmove', handleMove); window.removeEventListener('touchend', stopDrag); };
  }, [activeId, numPages]);

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col lg:flex-row overflow-x-hidden">
      <Sidebar currentView="upload" isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      <main className="flex-1 lg:ml-64 p-4 lg:p-8 pt-20 transition-all duration-300">
        <header className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4 text-left">
          <div className="flex items-center gap-4 w-full">
            <Button variant="ghost" onClick={() => navigate('/dashboard')} className="rounded-full hover:bg-slate-200"><ArrowLeft className="h-5 w-5" /></Button>
            <div>
              <h1 className="text-xl lg:text-3xl font-black text-slate-900 uppercase italic">Prepare Document</h1>
              <p className="text-xs lg:text-sm text-slate-500 font-bold uppercase tracking-widest">Position the signature boxes</p>
            </div>
          </div>
          {step === 'place' && <Button onClick={addSignatureBox} className="bg-sky-600 hover:bg-sky-700 text-white rounded-xl shadow-lg flex gap-2 w-full sm:w-auto font-black italic h-12 px-6 transition-all"><Plus className="h-4 w-4" /> ADD SIGN</Button>}
        </header>

        {step === 'upload' && (
          <div className="max-w-2xl mx-auto mt-12 bg-white p-10 lg:p-20 border-2 border-dashed border-slate-200 rounded-[2.5rem] text-center shadow-sm">
            <div className="bg-sky-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"><Upload className="h-10 w-10 text-sky-500" /></div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">Upload your PDF</h3>
            <Button onClick={() => document.getElementById('fileInput')?.click()} className="bg-sky-600 px-10 h-12 rounded-xl text-white font-bold hover:scale-105 transition-transform">Choose PDF File</Button>
            <input type="file" id="fileInput" accept=".pdf" onChange={(e) => { if (e.target.files?.[0]) { setSelectedFile(e.target.files[0]); setStep('place'); } }} className="hidden" />
          </div>
        )}

        {step === 'place' && (
          <div className="flex flex-col xl:flex-row gap-8 items-start justify-center">
            <div ref={scrollParentRef} className="w-full xl:w-[850px] bg-slate-300 rounded-[2rem] p-4 lg:p-10 overflow-auto border border-slate-400 h-[70vh] xl:h-[80vh] shadow-inner relative">
              <div ref={containerRef} className="relative mx-auto shadow-2xl bg-white select-none" style={{ width: '600px' }}>
                <Document file={selectedFile} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
                  {Array.from(new Array(numPages || 0), (_, i) => (
                    <div key={i} className="mb-4 border-b last:border-0"><Page pageNumber={i + 1} width={600} renderTextLayer={false} renderAnnotationLayer={false} /></div>
                  ))}
                </Document>
                {signatures.map((sig) => (
                  <div key={sig.id} style={{ left: sig.x, top: sig.y, touchAction: 'none' }} onMouseDown={() => setActiveId(sig.id)} onTouchStart={() => setActiveId(sig.id)}
                    className="absolute z-[50] w-[150px] h-[50px] border-2 border-dashed border-sky-600 bg-sky-500/30 backdrop-blur-sm flex items-center justify-center cursor-move rounded-lg shadow-xl"
                  >
                    <span className="text-[10px] font-black text-sky-900 uppercase flex items-center gap-1"><Move className="h-3 w-3" /> Sign Box</span>
                    <button onClick={(e) => { e.stopPropagation(); setSignatures(signatures.filter(s => s.id !== sig.id)); }} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md"><Trash2 className="h-3 w-3" /></button>
                  </div>
                ))}
              </div>
            </div>
            <div className="w-full xl:w-80 space-y-6">
              <Card className="p-8 bg-white rounded-[2rem] border-none shadow-xl">
                <h3 className="font-black text-slate-800 text-xs uppercase mb-6 border-b pb-4 italic tracking-widest">Info</h3>
                <div className="flex justify-between mb-3 text-sm font-bold"><span className="text-slate-400">SIGN BOXES:</span><span className="text-sky-600">{signatures.length}</span></div>
                <div className="flex justify-between text-sm font-bold"><span className="text-slate-400">TOTAL PAGES:</span><span className="text-slate-700">{numPages || 0}</span></div>
              </Card>
              <Button className="w-full bg-sky-600 hover:bg-sky-700 h-20 text-xl font-black text-white rounded-[2rem] shadow-2xl uppercase italic" onClick={handleGenerateLink} disabled={isUploading || signatures.length === 0}>
                {isUploading ? <Loader2 className="animate-spin mx-auto h-8 w-8" /> : 'GENERATE LINK'}
              </Button>
            </div>
          </div>
        )}

        {step === 'success' && (
          <div className="max-w-xl mx-auto mt-10 text-center px-4 animate-in fade-in zoom-in">
             <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"><Check className="h-10 w-10 text-green-600" /></div>
            <h2 className="text-3xl font-black mb-2 uppercase italic">Success! Link Ready</h2>
            <div className="flex gap-3 p-5 bg-white border-2 border-slate-100 rounded-[2rem] mb-10 items-center shadow-inner">
              <input readOnly value={generatedLink} className="flex-1 bg-transparent px-4 text-sm truncate outline-none font-bold text-sky-700" />
              <Button onClick={() => { navigator.clipboard.writeText(generatedLink); alert("Copied!"); }} className="bg-slate-900 text-white px-6 h-12 rounded-2xl font-black text-xs">Copy</Button>
            </div>
            <Button className="w-full h-16 bg-sky-600 text-white rounded-[2rem] font-black uppercase tracking-widest" onClick={() => window.open(generatedLink, '_blank')}>OPEN SIGNING PAGE</Button>
          </div>
        )}
      </main>
    </div>
  );
}