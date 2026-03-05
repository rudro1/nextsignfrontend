// // // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // // // import SignatureCanvas from 'react-signature-canvas';
// // // // // // import { Document, Page, pdfjs } from 'react-pdf';
// // // // // // import { documentAPI } from '../api/api';
// // // // // // import { Button } from '../components/ui/Button';
// // // // // // import { PenTool, Loader2, X, CheckCircle2 } from 'lucide-react';

// // // // // // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // // // // // export function SigningPage() {
// // // // // //   const { id } = useParams();
// // // // // //   const navigate = useNavigate();
// // // // // //   const sigCanvas = useRef<any>(null);
// // // // // //   const containerRef = useRef<HTMLDivElement>(null);
  
// // // // // //   const [doc, setDoc] = useState<any>(null);
// // // // // //   const [numPages, setNumPages] = useState<number | null>(null);
// // // // // //   const [loading, setLoading] = useState(true);
// // // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // // //   const [isSigned, setIsSigned] = useState(false);
// // // // // //   const [email, setEmail] = useState('');
// // // // // //   const [pageWidth, setPageWidth] = useState(0);

// // // // // //   useEffect(() => {
// // // // // //     const updateWidth = () => { 
// // // // // //         if (containerRef.current) setPageWidth(Math.min(containerRef.current.offsetWidth - 32, 600)); 
// // // // // //     };
// // // // // //     updateWidth();
// // // // // //     window.addEventListener('resize', updateWidth);
// // // // // //     return () => window.removeEventListener('resize', updateWidth);
// // // // // //   }, [loading]);

// // // // // //   useEffect(() => {
// // // // // //     documentAPI.getById(id!).then(res => setDoc(res.data)).catch(() => alert("Invalid link!")).finally(() => setLoading(false));
// // // // // //   }, [id]);

// // // // // //   const downloadBase64PDF = (base64Data: string) => {
// // // // // //     const base64String = base64Data.includes('base64,') ? base64Data.split('base64,')[1] : base64Data;
// // // // // //     const byteCharacters = atob(base64String);
// // // // // //     const byteNumbers = new Array(byteCharacters.length);
// // // // // //     for (let i = 0; i < byteCharacters.length; i++) { byteNumbers[i] = byteCharacters.charCodeAt(i); }
// // // // // //     const byteArray = new Uint8Array(byteNumbers);
// // // // // //     const blob = new Blob([byteArray], { type: 'application/pdf' });
// // // // // //     const url = window.URL.createObjectURL(blob);
// // // // // //     const link = document.createElement('a');
// // // // // //     link.href = url;
// // // // // //     link.setAttribute('download', `Signed_${doc?.name || 'Document'}.pdf`);
// // // // // //     document.body.appendChild(link);
// // // // // //     link.click();
// // // // // //     document.body.removeChild(link);
// // // // // //   };

// // // // // //   const handleSignSubmit = async () => {
// // // // // //     if (!email || sigCanvas.current.isEmpty()) return alert("Fill all fields!");
// // // // // //     setIsSubmitting(true);
// // // // // //     try {
// // // // // //       const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');
// // // // // //       const signaturesMap: Record<string, string> = {};
// // // // // //       doc.signs.forEach((s: any) => { signaturesMap[s.id || s._id] = signatureImage; });
// // // // // //       const response = await documentAPI.submitSign(id!, { signaturesMap, email });
// // // // // //       if (response.data.pdf) downloadBase64PDF(response.data.pdf);
// // // // // //       setIsSigned(true);
// // // // // //     } catch (e) { alert("Error!"); } finally { setIsSubmitting(false); }
// // // // // //   };

// // // // // //   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-sky-600" /></div>;

// // // // // //   if (isSigned) return (
// // // // // //     <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
// // // // // //       <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
// // // // // //       <h2 className="text-3xl font-bold">Document Signed!</h2>
// // // // // //       <p className="text-slate-500">Your signed PDF has been downloaded.</p>
// // // // // //       <Button onClick={() => navigate('/')} className="mt-8 bg-slate-900 px-10 rounded-xl">Go Home</Button>
// // // // // //     </div>
// // // // // //   );

// // // // // //   return (
// // // // // //     <div className="min-h-screen bg-slate-100 flex flex-col items-center pb-20">
// // // // // //       <header className="w-full bg-white border-b p-4 sticky top-0 z-[100] flex justify-between items-center px-6 shadow-sm">
// // // // // //         <div className="flex items-center gap-2"><PenTool className="text-sky-600" /><span className="font-bold italic text-sky-600">FixenSysign</span></div>
// // // // // //         <div className="flex gap-2">
// // // // // //           <input type="email" placeholder="Email" className="border p-2 px-4 rounded-xl text-sm outline-none" value={email} onChange={(e)=>setEmail(e.target.value)} />
// // // // // //           <Button onClick={() => setIsModalOpen(true)} className="bg-sky-600 px-8 rounded-xl text-white">Sign Now</Button>
// // // // // //         </div>
// // // // // //       </header>

// // // // // //       <main ref={containerRef} className="mt-8 w-full max-w-[600px] px-4">
// // // // // //         <Document file={doc?.pdfPath} onLoadSuccess={({numPages}) => setNumPages(numPages)}>
// // // // // //           {Array.from(new Array(numPages), (_, i) => (
// // // // // //             <div key={i} className="relative mb-6 bg-white shadow-xl">
// // // // // //               <Page pageNumber={i + 1} width={pageWidth} renderTextLayer={false} renderAnnotationLayer={false} />
// // // // // //               {doc?.signs?.filter((s:any) => Number(s.page) === i+1).map((sig: any, idx: number) => {
// // // // // //                 const scale = pageWidth / 600;
// // // // // //                 return (
// // // // // //                   <div key={idx} onClick={() => setIsModalOpen(true)} className="absolute border-2 border-dashed border-sky-500 bg-sky-400/10 cursor-pointer flex items-center justify-center"
// // // // // //                     style={{ left: `${sig.x * scale}px`, top: `${sig.y * scale}px`, width: `${150 * scale}px`, height: `${50 * scale}px` }}
// // // // // //                   >
// // // // // //                     <span className="font-bold text-sky-600 uppercase text-[10px]">Sign Here</span>
// // // // // //                   </div>
// // // // // //                 )
// // // // // //               })}
// // // // // //             </div>
// // // // // //           ))}
// // // // // //         </Document>
// // // // // //       </main>

// // // // // //       {isModalOpen && (
// // // // // //         <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200] p-4">
// // // // // //           <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
// // // // // //             <div className="p-6 border-b flex justify-between font-bold">Draw Signature <button onClick={() => setIsModalOpen(false)}><X size={20}/></button></div>
// // // // // //             <div className="p-8 bg-slate-50">
// // // // // //               <div className="border bg-white rounded-xl overflow-hidden"><SignatureCanvas ref={sigCanvas} penColor='#000' canvasProps={{ className: 'w-full h-44' }} /></div>
// // // // // //               <button onClick={() => sigCanvas.current.clear()} className="mt-2 text-xs text-rose-500 font-bold uppercase">Clear</button>
// // // // // //             </div>
// // // // // //             <div className="p-6 flex gap-3">
// // // // // //               <Button variant="outline" className="flex-1" onClick={() => setIsModalOpen(false)}>Cancel</Button>
// // // // // //               <Button onClick={handleSignSubmit} disabled={isSubmitting} className="flex-1 bg-sky-600 text-white font-bold">{isSubmitting ? 'Signing...' : 'Confirm'}</Button>
// // // // // //             </div>
// // // // // //           </div>
// // // // // //         </div>
// // // // // //       )}
// // // // // //     </div>
// // // // // //   );
// // // // // // }\
// // // // // import React, { useState, useEffect, useRef } from 'react';
// // // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // // import SignatureCanvas from 'react-signature-canvas';
// // // // // import { Document, Page, pdfjs } from 'react-pdf';
// // // // // import { documentAPI } from '../api/api';
// // // // // import { Button } from '../components/ui/Button';
// // // // // import { PenTool, Loader2, X, CheckCircle2 } from 'lucide-react';

// // // // // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // // // // export function SigningPage() {
// // // // //   const { id } = useParams();
// // // // //   const navigate = useNavigate();
// // // // //   const sigCanvas = useRef<any>(null);
  
// // // // //   const [doc, setDoc] = useState<any>(null);
// // // // //   const [numPages, setNumPages] = useState<number | null>(null);
// // // // //   const [loading, setLoading] = useState(true);
// // // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // // //   const [isSigned, setIsSigned] = useState(false);
// // // // //   const [email, setEmail] = useState('');

// // // // //   useEffect(() => {
// // // // //     documentAPI.getById(id!)
// // // // //       .then(res => setDoc(res.data))
// // // // //       .catch(() => alert("Invalid or Expired Link!"))
// // // // //       .finally(() => setLoading(false));
// // // // //   }, [id]);

// // // // //   const handleSignSubmit = async () => {
// // // // //     if (!email || sigCanvas.current.isEmpty()) return alert("Fill all fields!");
// // // // //     setIsSubmitting(true);
// // // // //     try {
// // // // //       const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');
// // // // //       const signaturesMap: Record<string, string> = {};
// // // // //       doc.signs.forEach((s: any) => { signaturesMap[s.id || s._id] = signatureImage; });
      
// // // // //       const response = await documentAPI.submitSign(id!, { signaturesMap, email });
      
// // // // //       // Auto Download
// // // // //       const link = document.createElement('a');
// // // // //       link.href = response.data.pdf;
// // // // //       link.download = `Signed_${doc.name || 'Document'}.pdf`;
// // // // //       link.click();
      
// // // // //       setIsSigned(true);
// // // // //     } catch (e) { alert("Error submitting signature!"); } 
// // // // //     finally { setIsSubmitting(false); }
// // // // //   };

// // // // //   if (loading) return <div className="h-screen flex items-center justify-center bg-white"><Loader2 className="animate-spin text-sky-600" /></div>;

// // // // //   if (isSigned) return (
// // // // //     <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
// // // // //       <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
// // // // //       <h2 className="text-3xl font-bold">Document Signed!</h2>
// // // // //       <p className="text-slate-500">The signed PDF has been downloaded automatically.</p>
// // // // //       <Button onClick={() => navigate('/')} className="mt-8 bg-slate-900 px-10 rounded-xl text-white">Go Home</Button>
// // // // //     </div>
// // // // //   );

// // // // //   return (
// // // // //     <div className="min-h-screen bg-slate-100 flex flex-col items-center pb-20">
// // // // //       <header className="w-full bg-white border-b p-4 sticky top-0 z-[100] flex justify-between items-center px-6 shadow-sm">
// // // // //         <div className="flex items-center gap-2 font-bold text-sky-600"><PenTool /> FixenSysign</div>
// // // // //         <div className="flex gap-2">
// // // // //           <input type="email" placeholder="Enter Email" className="border p-2 px-4 rounded-xl text-sm outline-none" value={email} onChange={(e)=>setEmail(e.target.value)} />
// // // // //           <Button onClick={() => setIsModalOpen(true)} className="bg-sky-600 px-8 rounded-xl text-white font-bold h-10">Sign Now</Button>
// // // // //         </div>
// // // // //       </header>

// // // // //       <main className="mt-8 px-4 flex flex-col items-center">
// // // // //         <Document file={doc?.pdfPath} onLoadSuccess={({numPages}) => setNumPages(numPages)} className="shadow-2xl">
// // // // //           {Array.from(new Array(numPages), (_, i) => (
// // // // //             <div key={i} className="relative mb-6 bg-white border border-slate-200">
// // // // //               <Page pageNumber={i + 1} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
// // // // //               {doc?.signs?.filter((s:any) => Number(s.page) === i+1).map((sig: any, idx: number) => (
// // // // //                 <div key={idx} onClick={() => setIsModalOpen(true)} className="absolute border-2 border-dashed border-sky-500 bg-sky-500/10 cursor-pointer flex items-center justify-center animate-pulse"
// // // // //                   style={{ left: `${sig.x}px`, top: `${sig.y}px`, width: `150px`, height: `50px` }}
// // // // //                 >
// // // // //                   <span className="font-bold text-sky-600 uppercase text-[10px]">Sign Here</span>
// // // // //                 </div>
// // // // //               ))}
// // // // //             </div>
// // // // //           ))}
// // // // //         </Document>
// // // // //       </main>

// // // // //       {isModalOpen && (
// // // // //         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
// // // // //           <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
// // // // //             <div className="p-6 border-b flex justify-between font-bold text-slate-800">Draw Signature <button onClick={() => setIsModalOpen(false)}><X size={20}/></button></div>
// // // // //             <div className="p-8 bg-slate-50">
// // // // //               <div className="border-2 border-slate-200 bg-white rounded-2xl overflow-hidden"><SignatureCanvas ref={sigCanvas} penColor='#000' canvasProps={{ className: 'w-full h-44' }} /></div>
// // // // //               <button onClick={() => sigCanvas.current.clear()} className="mt-3 text-xs text-rose-500 font-bold uppercase tracking-widest">Clear</button>
// // // // //             </div>
// // // // //             <div className="p-6 flex gap-3">
// // // // //               <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setIsModalOpen(false)}>Cancel</Button>
// // // // //               <Button onClick={handleSignSubmit} disabled={isSubmitting} className="flex-1 bg-sky-600 text-white font-bold rounded-xl h-12 shadow-lg">
// // // // //                 {isSubmitting ? 'Signing...' : 'Confirm'}
// // // // //               </Button>
// // // // //             </div>
// // // // //           </div>
// // // // //         </div>
// // // // //       )}
// // // // //     </div>
// // // // //   );
// // // // // }

// // // // import React, { useState, useEffect, useRef } from 'react';
// // // // import { useParams, useNavigate } from 'react-router-dom';
// // // // import SignatureCanvas from 'react-signature-canvas';
// // // // import { Document, Page, pdfjs } from 'react-pdf';
// // // // import { documentAPI } from '../api/api';
// // // // import { Button } from '../components/ui/Button';
// // // // import { PenTool, Loader2, X, CheckCircle2 } from 'lucide-react';

// // // // // 🚀 Fixed: Worker and Font configuration
// // // // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;
// // // // const CMAP_URL = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`;

// // // // export function SigningPage() {
// // // //   const { id } = useParams();
// // // //   const navigate = useNavigate();
// // // //   const sigCanvas = useRef<any>(null);
// // // //   const containerRef = useRef<HTMLDivElement>(null);
  
// // // //   const [doc, setDoc] = useState<any>(null);
// // // //   const [numPages, setNumPages] = useState<number | null>(null);
// // // //   const [loading, setLoading] = useState(true);
// // // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // // //   const [isSigned, setIsSigned] = useState(false);
// // // //   const [email, setEmail] = useState('');
// // // //   const [pageWidth, setPageWidth] = useState(600);

// // // //   // Responsive logic to prevent overflow
// // // //   useEffect(() => {
// // // //     const updateWidth = () => { 
// // // //         if (containerRef.current) setPageWidth(Math.min(containerRef.current.offsetWidth - 32, 600)); 
// // // //     };
// // // //     updateWidth();
// // // //     window.addEventListener('resize', updateWidth);
// // // //     return () => window.removeEventListener('resize', updateWidth);
// // // //   }, [loading]);

// // // //   useEffect(() => {
// // // //     documentAPI.getById(id!)
// // // //       .then(res => {
// // // //         if (!res.data) throw new Error("No data");
// // // //         setDoc(res.data);
// // // //       })
// // // //       .catch((err) => {
// // // //         console.error("Fetch error:", err);
// // // //         alert("Invalid or Expired Link!");
// // // //       })
// // // //       .finally(() => setLoading(false));
// // // //   }, [id]);

// // // //   const handleSignSubmit = async () => {
// // // //     if (!email || sigCanvas.current.isEmpty()) return alert("Please provide email and signature!");
// // // //     setIsSubmitting(true);
// // // //     try {
// // // //       const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');
// // // //       const signaturesMap: Record<string, string> = {};
      
// // // //       // Map the signature to all designated spots
// // // //       doc.signs.forEach((s: any) => { 
// // // //         signaturesMap[s.id || s._id] = signatureImage; 
// // // //       });
      
// // // //       const response = await documentAPI.submitSign(id!, { signaturesMap, email });
      
// // // //       if (response.data.pdf) {
// // // //         const link = document.createElement('a');
// // // //         link.href = response.data.pdf;
// // // //         link.download = `Signed_${doc.name || 'Document'}.pdf`;
// // // //         document.body.appendChild(link);
// // // //         link.click();
// // // //         document.body.removeChild(link);
// // // //       }
      
// // // //       setIsSigned(true);
// // // //     } catch (e) { 
// // // //       console.error("Submit error:", e);
// // // //       alert("Error submitting signature!"); 
// // // //     } finally { 
// // // //       setIsSubmitting(false); 
// // // //     }
// // // //   };

// // // //   if (loading) return (
// // // //     <div className="h-screen flex items-center justify-center bg-white">
// // // //         <Loader2 className="animate-spin text-sky-600 h-10 w-10" />
// // // //     </div>
// // // //   );

// // // //   if (isSigned) return (
// // // //     <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
// // // //       <CheckCircle2 className="h-20 w-20 text-emerald-500 mb-6" />
// // // //       <h2 className="text-4xl font-black text-slate-900 tracking-tight">DOCUMENT SIGNED!</h2>
// // // //       <p className="text-slate-500 mt-2 font-medium">The signed PDF has been downloaded automatically.</p>
// // // //       <Button onClick={() => navigate('/')} className="mt-10 bg-slate-900 px-12 py-6 rounded-2xl text-white font-bold hover:scale-105 transition-transform">
// // // //         GO TO DASHBOARD
// // // //       </Button>
// // // //     </div>
// // // //   );

// // // //   return (
// // // //     <div className="min-h-screen bg-slate-50 flex flex-col items-center pb-20">
// // // //       <header className="w-full bg-white/80 backdrop-blur-md border-b p-4 sticky top-0 z-[100] flex justify-between items-center px-6 shadow-sm">
// // // //         <div className="flex items-center gap-2 font-black text-sky-600 text-xl tracking-tighter italic">
// // // //             <PenTool className="rotate-12" /> FixenSysign
// // // //         </div>
// // // //         <div className="flex gap-3">
// // // //           <input 
// // // //             type="email" 
// // // //             placeholder="Enter your email" 
// // // //             className="border-2 border-slate-100 p-2 px-4 rounded-xl text-sm outline-none focus:border-sky-500 transition-colors bg-slate-50 w-44 md:w-64" 
// // // //             value={email} 
// // // //             onChange={(e)=>setEmail(e.target.value)} 
// // // //           />
// // // //           <Button onClick={() => setIsModalOpen(true)} className="bg-sky-600 hover:bg-sky-700 px-8 rounded-xl text-white font-bold h-11 shadow-lg shadow-sky-100 transition-all">
// // // //             SIGN DOCUMENT
// // // //           </Button>
// // // //         </div>
// // // //       </header>

// // // //       <main ref={containerRef} className="mt-10 w-full max-w-[650px] px-4 flex flex-col items-center">
// // // //         <Document 
// // // //             file={doc?.pdfPath} 
// // // //             onLoadSuccess={({numPages}) => setNumPages(numPages)}
// // // //             options={{ cMapUrl: CMAP_URL, cMapPacked: true }}
// // // //             className="shadow-2xl rounded-sm overflow-hidden"
// // // //         >
// // // //           {Array.from(new Array(numPages), (_, i) => (
// // // //             <div key={i} className="relative mb-8 bg-white border border-slate-200 shadow-sm">
// // // //               <Page 
// // // //                 pageNumber={i + 1} 
// // // //                 width={pageWidth} 
// // // //                 renderTextLayer={false} 
// // // //                 renderAnnotationLayer={false} 
// // // //               />
              
// // // //               {/* Overlay signature spots */}
// // // //               {doc?.signs?.filter((s:any) => Number(s.page) === i+1).map((sig: any, idx: number) => {
// // // //                 const scale = pageWidth / 600; // Scaling logic for responsive view
// // // //                 return (
// // // //                     <div 
// // // //                         key={idx} 
// // // //                         onClick={() => setIsModalOpen(true)} 
// // // //                         className="absolute border-2 border-dashed border-sky-500 bg-sky-500/10 cursor-pointer flex items-center justify-center group"
// // // //                         style={{ 
// // // //                             left: `${sig.x * scale}px`, 
// // // //                             top: `${sig.y * scale}px`, 
// // // //                             width: `${150 * scale}px`, 
// // // //                             height: `${50 * scale}px` 
// // // //                         }}
// // // //                     >
// // // //                         <div className="flex flex-col items-center animate-pulse group-hover:scale-110 transition-transform">
// // // //                             <PenTool size={14} className="text-sky-600" />
// // // //                             <span className="font-bold text-sky-600 uppercase text-[9px] tracking-tighter">Sign Here</span>
// // // //                         </div>
// // // //                     </div>
// // // //                 )
// // // //               })}
// // // //             </div>
// // // //           ))}
// // // //         </Document>
// // // //       </main>

// // // //       {/* Signature Modal */}
// // // //       {isModalOpen && (
// // // //         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
// // // //           <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden border border-white/20">
// // // //             <div className="p-8 border-b flex justify-between items-center">
// // // //                 <h3 className="font-black text-slate-800 text-xl tracking-tight uppercase">Draw Signature</h3>
// // // //                 <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
// // // //                     <X size={24}/>
// // // //                 </button>
// // // //             </div>
            
// // // //             <div className="p-10 bg-slate-50">
// // // //               <div className="border-4 border-white shadow-inner bg-white rounded-3xl overflow-hidden cursor-crosshair">
// // // //                 <SignatureCanvas 
// // // //                     ref={sigCanvas} 
// // // //                     penColor='#000' 
// // // //                     canvasProps={{ className: 'w-full h-48' }} 
// // // //                 />
// // // //               </div>
// // // //               <button 
// // // //                 onClick={() => sigCanvas.current.clear()} 
// // // //                 className="mt-4 text-[10px] text-rose-500 font-black uppercase tracking-[0.2em] hover:text-rose-600 transition-colors"
// // // //               >
// // // //                 Clear Canvas
// // // //               </button>
// // // //             </div>

// // // //             <div className="p-8 flex gap-4">
// // // //               <Button variant="outline" className="flex-1 rounded-2xl h-14 font-bold border-slate-200" onClick={() => setIsModalOpen(false)}>
// // // //                 CANCEL
// // // //               </Button>
// // // //               <Button 
// // // //                 onClick={handleSignSubmit} 
// // // //                 disabled={isSubmitting} 
// // // //                 className="flex-1 bg-sky-600 text-white font-black rounded-2xl h-14 shadow-lg shadow-sky-100 hover:bg-sky-700 disabled:opacity-50"
// // // //               >
// // // //                 {isSubmitting ? <Loader2 className="animate-spin" /> : 'CONFIRM SIGN'}
// // // //               </Button>
// // // //             </div>
// // // //           </div>
// // // //         </div>
// // // //       )}
// // // //     </div>
// // // //   );
// // // // }

// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import SignatureCanvas from 'react-signature-canvas';
// // // import { Document, Page, pdfjs } from 'react-pdf';
// // // import { documentAPI } from '../api/api';
// // // import { Button } from '../components/ui/Button';
// // // import { PenTool, Loader2, X, CheckCircle2 } from 'lucide-react';

// // // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // // export function SigningPage() {
// // //   const { id } = useParams();
// // //   const navigate = useNavigate();
// // //   const sigCanvas = useRef<any>(null);
  
// // //   const [doc, setDoc] = useState<any>(null);
// // //   const [numPages, setNumPages] = useState<number | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [step, setStep] = useState<'sign' | 'otp' | 'success'>('sign');
// // //   const [email, setEmail] = useState('');
// // //   const [otp, setOtp] = useState('');

// // //   useEffect(() => {
// // //     documentAPI.getById(id!).then(res => setDoc(res.data)).finally(() => setLoading(false));
// // //   }, [id]);

// // //   const handleSignSubmit = async () => {
// // //     if (!email || sigCanvas.current.isEmpty()) return alert("Fill all fields!");
// // //     setIsSubmitting(true);
// // //     try {
// // //       const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');
// // //       const signaturesMap: Record<string, string> = {};
// // //       doc.signs.forEach((s: any) => { signaturesMap[s.id || s._id] = signatureImage; });
// // //       await documentAPI.submitSign(id!, { signaturesMap, email });
// // //       setStep('otp');
// // //       setIsModalOpen(false);
// // //     } catch (e) { alert("Error!"); } finally { setIsSubmitting(false); }
// // //   };

// // //   const handleVerifyOtp = async () => {
// // //     setIsSubmitting(true);
// // //     try {
// // //       const res = await documentAPI.verifyOtp({ email, otp });
// // //       const link = document.createElement('a');
// // //       link.href = res.data.pdf;
// // //       link.download = "Signed_Doc.pdf";
// // //       link.click();
// // //       setStep('success');
// // //     } catch (e) { alert("Invalid OTP"); } finally { setIsSubmitting(false); }
// // //   };

// // //   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-sky-600" /></div>;

// // //   if (step === 'success') return (
// // //     <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
// // //       <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
// // //       <h2 className="text-3xl font-bold italic text-sky-600">Document Signed!</h2>
// // //       <Button onClick={() => navigate('/')} className="mt-8 bg-slate-900 px-10 rounded-xl text-white font-bold h-12">Go Home</Button>
// // //     </div>
// // //   );

// // //   return (
// // //     <div className="min-h-screen bg-slate-100 flex flex-col items-center pb-20">
// // //       <header className="w-full bg-white border-b p-4 sticky top-0 z-[100] flex justify-between items-center px-6 shadow-sm">
// // //         <div className="flex items-center gap-2 font-bold text-sky-600 italic"><PenTool /> FixenSysign</div>
// // //         {step === 'sign' && (
// // //           <div className="flex gap-2">
// // //             <input type="email" placeholder="Enter Email" className="border p-2 px-4 rounded-xl text-sm outline-none w-44 md:w-64" value={email} onChange={(e)=>setEmail(e.target.value)} />
// // //             <Button onClick={() => setIsModalOpen(true)} className="bg-sky-600 px-8 rounded-xl text-white font-bold h-10 shadow-lg">Sign Now</Button>
// // //           </div>
// // //         )}
// // //       </header>

// // //       {step === 'sign' ? (
// // //         <main className="mt-8 px-4 flex flex-col items-center">
// // //           <Document file={doc?.pdfPath} onLoadSuccess={({numPages}) => setNumPages(numPages)} className="shadow-2xl">
// // //             {Array.from(new Array(numPages), (_, i) => (
// // //               <div key={i} className="relative mb-6 bg-white border border-slate-200">
// // //                 <Page pageNumber={i + 1} width={600} renderTextLayer={false} renderAnnotationLayer={false} />
// // //                 {doc?.signs?.filter((s:any) => Number(s.page) === i+1).map((sig: any, idx: number) => (
// // //                   <div key={idx} onClick={() => setIsModalOpen(true)} className="absolute border-2 border-dashed border-sky-500 bg-sky-500/10 cursor-pointer flex items-center justify-center animate-pulse"
// // //                     style={{ left: `${sig.x}px`, top: `${sig.y}px`, width: `150px`, height: `50px` }}
// // //                   >
// // //                     <span className="font-bold text-sky-600 uppercase text-[10px]">Sign Here</span>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             ))}
// // //           </Document>
// // //         </main>
// // //       ) : (
// // //         <div className="mt-20 bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-md w-full text-center">
// // //           <h2 className="text-2xl font-black mb-4 uppercase">Verify Email</h2>
// // //           <p className="text-slate-500 mb-6">Enter code sent to <b>{email}</b></p>
// // //           <input type="text" maxLength={6} className="w-full text-center text-4xl font-bold tracking-[0.3em] p-4 bg-slate-50 rounded-2xl mb-6 outline-none border-2 focus:border-sky-500" value={otp} onChange={(e) => setOtp(e.target.value)} />
// // //           <Button onClick={handleVerifyOtp} disabled={isSubmitting} className="w-full bg-sky-600 h-14 text-white font-bold rounded-2xl shadow-lg">
// // //             {isSubmitting ? 'Verifying...' : 'VERIFY & DOWNLOAD'}
// // //           </Button>
// // //         </div>
// // //       )}

// // //       {isModalOpen && (
// // //         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
// // //           <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
// // //             <div className="p-6 border-b flex justify-between font-bold text-slate-800 tracking-tight uppercase">Draw Signature <button onClick={() => setIsModalOpen(false)}><X size={20}/></button></div>
// // //             <div className="p-8 bg-slate-50">
// // //               <div className="border-2 border-slate-200 bg-white rounded-2xl overflow-hidden shadow-inner"><SignatureCanvas ref={sigCanvas} penColor='#000' canvasProps={{ className: 'w-full h-44' }} /></div>
// // //               <button onClick={() => sigCanvas.current.clear()} className="mt-3 text-xs text-rose-500 font-bold uppercase tracking-widest">Clear</button>
// // //             </div>
// // //             <div className="p-6 flex gap-3">
// // //               <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setIsModalOpen(false)}>Cancel</Button>
// // //               <Button onClick={handleSignSubmit} disabled={isSubmitting} className="flex-1 bg-sky-600 text-white font-bold rounded-xl h-12 shadow-lg">
// // //                 {isSubmitting ? 'Sending Code...' : 'Confirm'}
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }

// // // import React, { useState, useEffect, useRef } from 'react';
// // // import { useParams, useNavigate } from 'react-router-dom';
// // // import SignatureCanvas from 'react-signature-canvas';
// // // import { Document, Page, pdfjs } from 'react-pdf';
// // // import { documentAPI } from '../api/api';
// // // import { Button } from '../components/ui/Button';
// // // import { PenTool, Loader2, X, CheckCircle2 } from 'lucide-react';

// // // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // // export function SigningPage() {
// // //   const { id } = useParams();
// // //   const navigate = useNavigate();
// // //   const sigCanvas = useRef<any>(null);
// // //   const containerRef = useRef<HTMLDivElement>(null); // Container reference for width
  
// // //   const [doc, setDoc] = useState<any>(null);
// // //   const [numPages, setNumPages] = useState<number | null>(null);
// // //   const [loading, setLoading] = useState(true);
// // //   const [isModalOpen, setIsModalOpen] = useState(false);
// // //   const [isSubmitting, setIsSubmitting] = useState(false);
// // //   const [step, setStep] = useState<'sign' | 'otp' | 'success'>('sign');
// // //   const [email, setEmail] = useState('');
// // //   const [otp, setOtp] = useState('');
// // //   const [pageWidth, setPageWidth] = useState(600); // Dynamic width state

// // //   // 📱 Logic for Responsive PDF Width
// // //   useEffect(() => {
// // //     const updateWidth = () => {
// // //       if (containerRef.current) {
// // //         // Mobile-e screen width onujayi PDF adjust hobe, max 600px thakbe
// // //         const availableWidth = containerRef.current.offsetWidth - 32; 
// // //         setPageWidth(availableWidth > 600 ? 600 : availableWidth);
// // //       }
// // //     };
    
// // //     updateWidth();
// // //     window.addEventListener('resize', updateWidth);
// // //     return () => window.removeEventListener('resize', updateWidth);
// // //   }, [loading]);

// // //   useEffect(() => {
// // //     documentAPI.getById(id!).then(res => setDoc(res.data)).finally(() => setLoading(false));
// // //   }, [id]);

// // //   const handleSignSubmit = async () => {
// // //     if (!email || sigCanvas.current.isEmpty()) return alert("Fill all fields!");
// // //     setIsSubmitting(true);
// // //     try {
// // //       const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');
// // //       const signaturesMap: Record<string, string> = {};
// // //       doc.signs.forEach((s: any) => { signaturesMap[s.id || s._id] = signatureImage; });
// // //       await documentAPI.submitSign(id!, { signaturesMap, email });
// // //       setStep('otp');
// // //       setIsModalOpen(false);
// // //     } catch (e) { alert("Error!"); } finally { setIsSubmitting(false); }
// // //   };

// // //   const handleVerifyOtp = async () => {
// // //     setIsSubmitting(true);
// // //     try {
// // //       const res = await documentAPI.verifyOtp({ email, otp });
// // //       const link = document.createElement('a');
// // //       link.href = res.data.pdf;
// // //       link.download = "Signed_Doc.pdf";
// // //       link.click();
// // //       setStep('success');
// // //     } catch (e) { alert("Invalid OTP"); } finally { setIsSubmitting(false); }
// // //   };

// // //   if (loading) return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin text-sky-600" /></div>;

// // //   if (step === 'success') return (
// // //     <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
// // //       <CheckCircle2 className="h-16 w-16 text-emerald-500 mb-4" />
// // //       <h2 className="text-3xl font-bold italic text-sky-600">Document Signed!</h2>
// // //       <Button onClick={() => navigate('/')} className="mt-8 bg-slate-900 px-10 rounded-xl text-white font-bold h-12">Go Home</Button>
// // //     </div>
// // //   );

// // //   return (
// // //     <div className="min-h-screen bg-slate-100 flex flex-col items-center pb-20">
// // //       {/* 📱 Header Fixed for Mobile */}
// // //       <header className="w-full bg-white border-b p-4 sticky top-0 z-[100] flex flex-col md:flex-row justify-between items-center px-6 gap-4 shadow-sm">
// // //         <div className="flex items-center gap-2 font-bold text-sky-600 italic"><PenTool /> FixenSysign</div>
// // //         {step === 'sign' && (
// // //           <div className="flex gap-2 w-full md:w-auto">
// // //             <input type="email" placeholder="Enter Email" className="border p-2 px-4 rounded-xl text-sm outline-none flex-1 md:w-64" value={email} onChange={(e)=>setEmail(e.target.value)} />
// // //             <Button onClick={() => setIsModalOpen(true)} className="bg-sky-600 px-4 md:px-8 rounded-xl text-white font-bold h-10 shadow-lg text-sm">Sign Now</Button>
// // //           </div>
// // //         )}
// // //       </header>

// // //       {step === 'sign' ? (
// // //         <main ref={containerRef} className="mt-8 px-4 w-full flex flex-col items-center">
// // //           <Document file={doc?.pdfPath} onLoadSuccess={({numPages}) => setNumPages(numPages)} className="shadow-2xl">
// // //             {Array.from(new Array(numPages), (_, i) => (
// // //               <div key={i} className="relative mb-6 bg-white border border-slate-200">
// // //                 <Page pageNumber={i + 1} width={pageWidth} renderTextLayer={false} renderAnnotationLayer={false} />
                
// // //                 {/* 🎯 Responsive Signature Boxes */}
// // //                 {doc?.signs?.filter((s:any) => Number(s.page) === i+1).map((sig: any, idx: number) => {
// // //                   const scale = pageWidth / 600; // Scaling logic to keep signatures in right place
// // //                   return (
// // //                     <div key={idx} onClick={() => setIsModalOpen(true)} className="absolute border-2 border-dashed border-sky-500 bg-sky-500/10 cursor-pointer flex items-center justify-center animate-pulse"
// // //                       style={{ 
// // //                         left: `${sig.x * scale}px`, 
// // //                         top: `${sig.y * scale}px`, 
// // //                         width: `${150 * scale}px`, 
// // //                         height: `${50 * scale}px` 
// // //                       }}
// // //                     >
// // //                       <span className="font-bold text-sky-600 uppercase text-[8px] md:text-[10px]">Sign Here</span>
// // //                     </div>
// // //                   );
// // //                 })}
// // //               </div>
// // //             ))}
// // //           </Document>
// // //         </main>
// // //       ) : (
// // //         <div className="mt-20 px-4 w-full max-w-md">
// // //           <div className="bg-white p-6 md:p-10 rounded-[2.5rem] shadow-2xl text-center">
// // //             <h2 className="text-2xl font-black mb-4 uppercase tracking-tight text-slate-800">Verify Email</h2>
// // //             <p className="text-slate-500 mb-6 text-sm">Enter code sent to <b>{email}</b></p>
// // //             <input type="text" maxLength={6} className="w-full text-center text-3xl md:text-4xl font-bold tracking-[0.3em] p-4 bg-slate-50 rounded-2xl mb-6 outline-none border-2 focus:border-sky-500" value={otp} onChange={(e) => setOtp(e.target.value)} />
// // //             <Button onClick={handleVerifyOtp} disabled={isSubmitting} className="w-full bg-sky-600 h-14 text-white font-bold rounded-2xl shadow-lg">
// // //               {isSubmitting ? 'Verifying...' : 'VERIFY & DOWNLOAD'}
// // //             </Button>
// // //           </div>
// // //         </div>
// // //       )}

// // //       {/* Signature Modal */}
// // //       {isModalOpen && (
// // //         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
// // //           <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
// // //             <div className="p-6 border-b flex justify-between font-bold text-slate-800 tracking-tight uppercase text-sm">Draw Signature <button onClick={() => setIsModalOpen(false)}><X size={20}/></button></div>
// // //             <div className="p-6 md:p-8 bg-slate-50">
// // //               <div className="border-2 border-slate-200 bg-white rounded-2xl overflow-hidden shadow-inner"><SignatureCanvas ref={sigCanvas} penColor='#000' canvasProps={{ className: 'w-full h-44' }} /></div>
// // //               <button onClick={() => sigCanvas.current.clear()} className="mt-3 text-xs text-rose-500 font-bold uppercase tracking-widest">Clear</button>
// // //             </div>
// // //             <div className="p-6 flex gap-3">
// // //               <Button variant="outline" className="flex-1 rounded-xl h-12 text-sm" onClick={() => setIsModalOpen(false)}>Cancel</Button>
// // //               <Button onClick={handleSignSubmit} disabled={isSubmitting} className="flex-1 bg-sky-600 text-white font-bold rounded-xl h-12 shadow-lg text-sm">
// // //                 {isSubmitting ? 'Sending...' : 'Confirm'}
// // //               </Button>
// // //             </div>
// // //           </div>
// // //         </div>
// // //       )}
// // //     </div>
// // //   );
// // // }



// // import React, { useState, useEffect, useRef } from 'react';
// // import { useParams, useNavigate } from 'react-router-dom';
// // import SignatureCanvas from 'react-signature-canvas';
// // import { Document, Page, pdfjs } from 'react-pdf';
// // import { documentAPI } from '../api/api';
// // import { Button } from '../components/ui/Button';
// // import { PenTool, Loader2, X, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

// // pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// // export function SigningPage() {
// //   const { id } = useParams();
// //   const navigate = useNavigate();
// //   const sigCanvas = useRef<any>(null);
// //   const containerRef = useRef<HTMLDivElement>(null);
  
// //   const [doc, setDoc] = useState<any>(null);
// //   const [numPages, setNumPages] = useState<number | null>(null);
// //   const [loading, setLoading] = useState(true);
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isSubmitting, setIsSubmitting] = useState(false);
// //   const [step, setStep] = useState<'sign' | 'otp' | 'success'>('sign');
// //   const [email, setEmail] = useState('');
// //   const [otp, setOtp] = useState('');
// //   const [pageWidth, setPageWidth] = useState(600);

// //   // 📱 Responsive PDF Width Logic
// //   useEffect(() => {
// //     const updateWidth = () => {
// //       if (containerRef.current) {
// //         const availableWidth = containerRef.current.offsetWidth - 32; 
// //         setPageWidth(availableWidth > 600 ? 600 : availableWidth);
// //       }
// //     };
// //     updateWidth();
// //     window.addEventListener('resize', updateWidth);
// //     return () => window.removeEventListener('resize', updateWidth);
// //   }, [loading]);

// //   useEffect(() => {
// //     if (id) {
// //       documentAPI.getById(id)
// //         .then(res => setDoc(res.data))
// //         .catch(() => alert("Document link expired or invalid"))
// //         .finally(() => setLoading(false));
// //     }
// //   }, [id]);

// //   // 1️⃣ Step 1: Submit Sign & Send OTP
// //   const handleSignSubmit = async () => {
// //     if (!email || !sigCanvas.current || sigCanvas.current.isEmpty()) {
// //       return alert("Please enter email and provide a signature!");
// //     }
// //     setIsSubmitting(true);
// //     try {
// //       const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');
// //       const signaturesMap: Record<string, string> = {};
// //       doc.signs.forEach((s: any) => { 
// //         signaturesMap[s.id || s._id] = signatureImage; 
// //       });

// //       // Backend trigger for OTP email
// //       await documentAPI.submitSign(id!, { signaturesMap, email });
// //       setStep('otp');
// //       setIsModalOpen(false);
// //     } catch (e) { 
// //       alert("Error sending verification code!"); 
// //     } finally { 
// //       setIsSubmitting(false); 
// //     }
// //   };

// //   // 2️⃣ Step 2: Verify OTP & Finalize
// //   const handleVerifyOtp = async () => {
// //     if (otp.length < 4) return alert("Please enter a valid code");
// //     setIsSubmitting(true);
// //     try {
// //       // Backend marks doc as 'Signed' only after this verification
// //       const res = await documentAPI.verifyOtp({ id, email, otp });
      
// //       // Auto Download
// //       const link = document.createElement('a');
// //       link.href = res.data.pdf;
// //       link.download = `Signed_${doc.name || 'Doc'}.pdf`;
// //       document.body.appendChild(link);
// //       link.click();
// //       document.body.removeChild(link);
      
// //       setStep('success');
// //     } catch (e) { 
// //       alert("Invalid OTP! Verification failed."); 
// //     } finally { 
// //       setIsSubmitting(false); 
// //     }
// //   };

// //   if (loading) return (
// //     <div className="h-screen flex items-center justify-center bg-white font-bold text-sky-600 animate-pulse">
// //       <Loader2 className="animate-spin mr-2" /> LOADING DOCUMENT...
// //     </div>
// //   );

// //   if (step === 'success') return (
// //     <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
// //       <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mb-6">
// //         <CheckCircle2 className="h-12 w-12 text-emerald-600" />
// //       </div>
// //       <h2 className="text-3xl font-black text-slate-900 uppercase italic tracking-tighter">Document Signed!</h2>
// //       <p className="text-slate-500 mt-2 font-medium">Your verified document has been downloaded.</p>
// //       <Button onClick={() => navigate('/')} className="mt-8 bg-slate-900 px-10 rounded-2xl text-white font-black h-12 shadow-lg">
// //         DONE
// //       </Button>
// //     </div>
// //   );

// //   return (
// //     <div className="min-h-screen bg-slate-100 flex flex-col items-center pb-20">
// //       {/* 📱 Sticky Header */}
// //       <header className="w-full bg-white border-b p-4 sticky top-0 z-[100] flex flex-col md:flex-row justify-between items-center px-6 gap-4 shadow-sm">
// //         <div className="flex items-center gap-2 font-black text-sky-600 italic text-xl">
// //           <PenTool /> FixenSysign
// //         </div>
// //         {step === 'sign' && (
// //           <div className="flex gap-2 w-full md:w-auto">
// //             <input 
// //               type="email" 
// //               placeholder="Your Email" 
// //               className="border-2 border-slate-100 p-2 px-4 rounded-xl text-sm outline-none focus:border-sky-600 flex-1 md:w-64 font-medium" 
// //               value={email} 
// //               onChange={(e)=>setEmail(e.target.value)} 
// //             />
// //             <Button onClick={() => setIsModalOpen(true)} className="bg-sky-600 px-6 rounded-xl text-white font-black h-10 shadow-lg text-xs uppercase tracking-widest">
// //               Sign Now
// //             </Button>
// //           </div>
// //         )}
// //       </header>

// //       {step === 'sign' ? (
// //         <main ref={containerRef} className="mt-8 px-4 w-full flex flex-col items-center">
// //           <div className="bg-white p-2 md:p-4 shadow-2xl rounded-sm">
// //             <Document file={doc?.pdfPath} onLoadSuccess={({numPages}) => setNumPages(numPages)}>
// //               {Array.from(new Array(numPages), (_, i) => (
// //                 <div key={i} className="relative mb-6 border-b border-slate-100 last:border-0">
// //                   <Page pageNumber={i + 1} width={pageWidth} renderTextLayer={false} renderAnnotationLayer={false} />
                  
// //                   {/* 🎯 Signature Position Map */}
// //                   {doc?.signs?.filter((s:any) => Number(s.page) === i+1).map((sig: any, idx: number) => {
// //                     const scale = pageWidth / 600; 
// //                     return (
// //                       <div key={idx} onClick={() => setIsModalOpen(true)} 
// //                         className="absolute border-2 border-dashed border-sky-500 bg-sky-500/10 cursor-pointer flex items-center justify-center animate-pulse hover:bg-sky-500/20 transition-all"
// //                         style={{ 
// //                           left: `${sig.x * scale}px`, 
// //                           top: `${sig.y * scale}px`, 
// //                           width: `${150 * scale}px`, 
// //                           height: `${50 * scale}px` 
// //                         }}
// //                       >
// //                         <span className="font-black text-sky-600 uppercase text-[8px] md:text-[10px]">Sign Here</span>
// //                       </div>
// //                     );
// //                   })}
// //                 </div>
// //               ))}
// //             </Document>
// //           </div>
// //         </main>
// //       ) : (
// //         /* 🔐 OTP Verification UI */
// //         <div className="mt-20 px-4 w-full max-w-md">
// //           <div className="bg-white p-8 md:p-12 rounded-[2.5rem] shadow-2xl text-center border border-slate-50">
// //             <div className="bg-sky-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6">
// //               <ShieldCheck className="text-sky-600 h-10 w-10" />
// //             </div>
// //             <h2 className="text-2xl font-black mb-2 uppercase tracking-tight text-slate-800 italic">Verify Identity</h2>
// //             <p className="text-slate-500 mb-8 text-sm font-medium">Enter the 6-digit code sent to <br/><span className="text-slate-900 font-bold">{email}</span></p>
// //             <input 
// //               type="text" 
// //               maxLength={6} 
// //               placeholder="0 0 0 0 0 0"
// //               className="w-full text-center text-3xl md:text-4xl font-black tracking-[0.3em] p-4 bg-slate-50 rounded-2xl mb-8 outline-none border-2 border-transparent focus:border-sky-500 transition-all" 
// //               value={otp} 
// //               onChange={(e) => setOtp(e.target.value)} 
// //             />
// //             <Button onClick={handleVerifyOtp} disabled={isSubmitting} className="w-full bg-sky-600 h-16 text-white font-black rounded-2xl shadow-xl shadow-sky-100 uppercase tracking-widest text-sm">
// //               {isSubmitting ? <Loader2 className="animate-spin" /> : 'VERIFY & DOWNLOAD'}
// //             </Button>
// //           </div>
// //         </div>
// //       )}

// //       {/* Signature Modal */}
// //       {isModalOpen && (
// //         <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
// //           <div className="bg-white rounded-[2.5rem] w-full max-w-md shadow-2xl overflow-hidden">
// //             <div className="p-6 border-b flex justify-between items-center">
// //               <span className="font-black text-slate-800 uppercase tracking-tight italic">Draw Signature</span>
// //               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors"><X size={24}/></button>
// //             </div>
// //             <div className="p-8 bg-slate-50">
// //                <div className="mb-4">
// //                 <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1 block">Email Address</label>
// //                 <div className="relative">
// //                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
// //                   <input 
// //                     type="email" 
// //                     value={email} 
// //                     onChange={(e)=>setEmail(e.target.value)}
// //                     className="w-full bg-white border-2 border-slate-100 rounded-xl py-3 pl-12 pr-4 outline-none focus:border-sky-500 font-bold" 
// //                     placeholder="name@email.com"
// //                   />
// //                 </div>
// //                </div>
// //               <div className="border-2 border-slate-200 bg-white rounded-2xl overflow-hidden shadow-inner cursor-crosshair">
// //                 <SignatureCanvas ref={sigCanvas} penColor='#000' canvasProps={{ className: 'w-full h-44' }} />
// //               </div>
// //               <button onClick={() => sigCanvas.current.clear()} className="mt-3 text-[10px] text-rose-500 font-black uppercase tracking-widest">Clear Pad</button>
// //             </div>
// //             <div className="p-6 flex gap-4">
// //               <Button variant="outline" className="flex-1 rounded-2xl h-14 font-black border-slate-200 uppercase text-xs" onClick={() => setIsModalOpen(false)}>Cancel</Button>
// //               <Button onClick={handleSignSubmit} disabled={isSubmitting} className="flex-1 bg-sky-600 text-white font-black rounded-2xl h-14 shadow-lg shadow-sky-100 uppercase text-xs">
// //                 {isSubmitting ? <Loader2 className="animate-spin" /> : 'Confirm Sign'}
// //               </Button>
// //             </div>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import SignatureCanvas from 'react-signature-canvas';
// import { Document, Page, pdfjs } from 'react-pdf';
// import { documentAPI } from '../api/api';
// import { Button } from '../components/ui/Button';
// import { PenTool, Loader2, X, CheckCircle2, ShieldCheck } from 'lucide-react';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// export function SigningPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const sigCanvas = useRef<any>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   const [doc, setDoc] = useState<any>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [step, setStep] = useState<'sign' | 'otp' | 'success'>('sign');
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [pageWidth, setPageWidth] = useState(600);

//   useEffect(() => {
//     const updateWidth = () => {
//       if (containerRef.current) {
//         const availableWidth = containerRef.current.offsetWidth - 32; 
//         setPageWidth(availableWidth > 600 ? 600 : availableWidth);
//       }
//     };
//     updateWidth();
//     window.addEventListener('resize', updateWidth);
//     return () => window.removeEventListener('resize', updateWidth);
//   }, [loading]);

//   useEffect(() => {
//     documentAPI.getById(id!).then(res => setDoc(res.data)).finally(() => setLoading(false));
//   }, [id]);

//   const handleSignSubmit = async () => {
//     if (!email || sigCanvas.current.isEmpty()) return alert("Fill all fields!");
//     setIsSubmitting(true);
//     try {
//       const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');
//       const signaturesMap: Record<string, string> = {};
//       doc.signs.forEach((s: any) => { signaturesMap[s.id || s._id] = signatureImage; });
//       await documentAPI.submitSign(id!, { signaturesMap, email });
//       setStep('otp');
//       setIsModalOpen(false);
//     } catch (e) { alert("Error sending code!"); } finally { setIsSubmitting(false); }
//   };

//   const handleVerifyOtp = async () => {
//     if (otp.length < 6) return alert("Enter 6 digit code");
//     setIsSubmitting(true);
//     try {
//       const res = await documentAPI.verifyOtp({ id, otp });
//       const link = document.createElement('a');
//       link.href = res.data.pdf;
//       link.download = `Signed_${doc.name || 'Document'}.pdf`;
//       link.click();
//       setStep('success');
//     } catch (e) { alert("Invalid OTP!"); } finally { setIsSubmitting(false); }
//   };

//   if (loading) return <div className="h-screen flex items-center justify-center font-bold text-sky-600"><Loader2 className="animate-spin mr-2" /> Loading...</div>;

//   if (step === 'success') return (
//     <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center">
//       <CheckCircle2 className="h-20 w-20 text-emerald-500 mb-4 animate-bounce" />
//       <h2 className="text-4xl font-black italic text-slate-900 uppercase">Signed Successfully!</h2>
//       <p className="text-slate-500 mt-2">Your document has been verified and downloaded.</p>
//       <Button onClick={() => navigate('/')} className="mt-10 bg-slate-900 px-12 rounded-2xl text-white font-bold h-14 shadow-xl">Back to Home</Button>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-100 flex flex-col items-center pb-20">
//       <header className="w-full bg-white border-b p-4 sticky top-0 z-[100] flex flex-col md:flex-row justify-between items-center px-6 gap-4 shadow-sm">
//         <div className="flex items-center gap-2 font-black text-sky-600 italic text-xl"><PenTool /> FixenSysign</div>
//         {step === 'sign' && (
//           <div className="flex gap-2 w-full md:w-auto">
//             <input type="email" placeholder="Verification Email" className="border-2 p-2 px-4 rounded-xl text-sm outline-none md:w-64 focus:border-sky-500" value={email} onChange={(e)=>setEmail(e.target.value)} />
//             <Button onClick={() => setIsModalOpen(true)} className="bg-sky-600 px-8 rounded-xl text-white font-black h-10 shadow-lg">Sign Now</Button>
//           </div>
//         )}
//       </header>

//       {step === 'sign' ? (
//         <main ref={containerRef} className="mt-8 px-4 w-full flex flex-col items-center">
//           <Document file={doc?.pdfPath} onLoadSuccess={({numPages}) => setNumPages(numPages)} className="shadow-2xl bg-white p-2">
//             {Array.from(new Array(numPages), (_, i) => (
//               <div key={i} className="relative mb-6 border-b">
//                 <Page pageNumber={i + 1} width={pageWidth} renderTextLayer={false} renderAnnotationLayer={false} />
//                 {doc?.signs?.filter((s:any) => Number(s.page) === i+1).map((sig: any, idx: number) => {
//                   const scale = pageWidth / 600;
//                   return (
//                     <div key={idx} onClick={() => setIsModalOpen(true)} className="absolute border-2 border-dashed border-sky-500 bg-sky-500/10 cursor-pointer flex items-center justify-center"
//                       style={{ left: `${sig.x * scale}px`, top: `${sig.y * scale}px`, width: `${150 * scale}px`, height: `${50 * scale}px` }}
//                     >
//                       <span className="font-bold text-sky-600 uppercase text-[8px]">Sign Here</span>
//                     </div>
//                   );
//                 })}
//               </div>
//             ))}
//           </Document>
//         </main>
//       ) : (
//         <div className="mt-20 px-4 w-full max-w-md">
//           <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border-t-8 border-sky-600">
//             <ShieldCheck className="h-16 w-16 text-sky-600 mx-auto mb-4" />
//             <h2 className="text-2xl font-black mb-2 uppercase tracking-tight text-slate-800">Verify Code</h2>
//             <p className="text-slate-500 mb-8 text-sm font-medium">Enter the 6-digit code sent to <br/><b>{email}</b></p>
//             <input type="text" maxLength={6} className="w-full text-center text-4xl font-black tracking-[0.3em] p-4 bg-slate-50 rounded-2xl mb-8 border-2 focus:border-sky-500 outline-none" value={otp} onChange={(e) => setOtp(e.target.value)} />
//             <Button onClick={handleVerifyOtp} disabled={isSubmitting} className="w-full bg-sky-600 h-16 text-white font-black rounded-2xl shadow-lg">
//               {isSubmitting ? <Loader2 className="animate-spin" /> : 'VERIFY & DOWNLOAD'}
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Signature Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4">
//           <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
//             <div className="p-6 border-b flex justify-between font-black uppercase text-sm italic">Draw Your Signature <button onClick={() => setIsModalOpen(false)}><X size={20}/></button></div>
//             <div className="p-8 bg-slate-50 text-center">
//               <div className="border-2 border-slate-200 bg-white rounded-2xl overflow-hidden shadow-inner"><SignatureCanvas ref={sigCanvas} penColor='#000' canvasProps={{ className: 'w-full h-44' }} /></div>
//               <button onClick={() => sigCanvas.current.clear()} className="mt-3 text-xs text-rose-500 font-bold uppercase">Clear Pad</button>
//             </div>
//             <div className="p-6 flex gap-3 bg-white">
//               <Button variant="outline" className="flex-1 rounded-xl h-12" onClick={() => setIsModalOpen(false)}>Cancel</Button>
//               <Button onClick={handleSignSubmit} disabled={isSubmitting} className="flex-1 bg-sky-600 text-white font-bold rounded-xl h-12">
//                 {isSubmitting ? 'Sending...' : 'Confirm'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// import React, { useState, useEffect, useRef } from 'react';
// import { useParams, useNavigate } from 'react-router-dom';
// import SignatureCanvas from 'react-signature-canvas';
// import { Document, Page, pdfjs } from 'react-pdf';
// import { documentAPI } from '../api/api';
// import { Button } from '../components/ui/Button';
// import { PenTool, Loader2, X, CheckCircle2, ShieldCheck } from 'lucide-react';

// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

// export function SigningPage() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const sigCanvas = useRef<any>(null);
//   const containerRef = useRef<HTMLDivElement>(null);
  
//   const [doc, setDoc] = useState<any>(null);
//   const [numPages, setNumPages] = useState<number | null>(null);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [step, setStep] = useState<'sign' | 'otp' | 'success'>('sign');
//   const [email, setEmail] = useState('');
//   const [otp, setOtp] = useState('');
//   const [pageWidth, setPageWidth] = useState(600);

//   // 📱 Screen size anujayi PDF width adjust
//   useEffect(() => {
//     const updateWidth = () => {
//       if (containerRef.current) {
//         const availableWidth = containerRef.current.offsetWidth - 32; 
//         setPageWidth(availableWidth > 600 ? 600 : availableWidth);
//       }
//     };
    
//     updateWidth();
//     window.addEventListener('resize', updateWidth);
//     return () => window.removeEventListener('resize', updateWidth);
//   }, [loading]);

//   useEffect(() => {
//     if (id) {
//       documentAPI.getById(id)
//         .then(res => setDoc(res.data))
//         .catch(err => console.error("Error fetching doc:", err))
//         .finally(() => setLoading(false));
//     }
//   }, [id]);

//   const handleSignSubmit = async () => {
//     if (!email || !sigCanvas.current || sigCanvas.current.isEmpty()) {
//       return alert("Please enter email and provide a signature!");
//     }
//     setIsSubmitting(true);
//     try {
//       const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');
//       const signaturesMap: Record<string, string> = {};
      
//       doc.signs.forEach((s: any) => { 
//         signaturesMap[s.id || s._id] = signatureImage; 
//       });

//       await documentAPI.submitSign(id!, { signaturesMap, email });
//       setStep('otp');
//       setIsModalOpen(false);
//     } catch (e) { 
//       alert("Error sending verification code!"); 
//     } finally { 
//       setIsSubmitting(false); 
//     }
//   };

//   const handleVerifyOtp = async () => {
//     if (otp.length < 6) return alert("Enter 6 digit code");
//     setIsSubmitting(true);
//     try {
//       const res = await documentAPI.verifyOtp({ id, otp });
      
//       const link = document.createElement('a');
//       link.href = res.data.pdf;
//       link.download = `Signed_${doc?.name || 'Document'}.pdf`;
//       document.body.appendChild(link);
//       link.click();
//       document.body.removeChild(link);
      
//       setStep('success');
//     } catch (e) { 
//       alert("Invalid OTP! Verification failed."); 
//     } finally { 
//       setIsSubmitting(false); 
//     }
//   };

//   if (loading) return (
//     <div className="h-screen flex items-center justify-center font-bold text-sky-600 bg-white">
//       <Loader2 className="animate-spin mr-2" /> Loading Document...
//     </div>
//   );

//   if (step === 'success') return (
//     <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center animate-in fade-in duration-500">
//       <CheckCircle2 className="h-20 w-20 text-emerald-500 mb-4 animate-bounce" />
//       <h2 className="text-4xl font-black italic text-slate-900 uppercase">Signed Successfully!</h2>
//       <p className="text-slate-500 mt-2 font-medium">Your document has been verified and downloaded.</p>
//       <Button onClick={() => navigate('/')} className="mt-10 bg-slate-900 px-12 rounded-2xl text-white font-bold h-14 shadow-xl">
//         Back to Home
//       </Button>
//     </div>
//   );

//   return (
//     <div className="min-h-screen bg-slate-100 flex flex-col items-center pb-20 font-sans">
//       <header className="w-full bg-white border-b p-4 sticky top-0 z-[100] flex flex-col md:flex-row justify-between items-center px-6 gap-4 shadow-sm">
//         <div className="flex items-center gap-2 font-black text-sky-600 italic text-xl">
//           <PenTool /> FixenSysign
//         </div>
//         {step === 'sign' && (
//           <div className="flex gap-2 w-full md:w-auto">
//             <input 
//               type="email" 
//               placeholder="Verification Email" 
//               className="border-2 p-2 px-4 rounded-xl text-sm outline-none md:w-64 focus:border-sky-500 transition-all font-medium" 
//               value={email} 
//               onChange={(e)=>setEmail(e.target.value)} 
//             />
//             <Button onClick={() => setIsModalOpen(true)} className="bg-sky-600 px-8 rounded-xl text-white font-black h-10 shadow-lg active:scale-95 transition-all">
//               Sign Now
//             </Button>
//           </div>
//         )}
//       </header>

//       {step === 'sign' ? (
//         <main ref={containerRef} className="mt-8 px-4 w-full flex flex-col items-center overflow-x-hidden">
//           <div className="bg-white p-2 md:p-4 shadow-2xl rounded-sm">
//             <Document 
//               file={doc?.pdfPath} 
//               onLoadSuccess={({numPages}) => setNumPages(numPages)}
//             >
//               {Array.from(new Array(numPages || 0), (_, i) => (
//                 <div key={i} className="relative mb-6 border-b border-slate-100 last:border-0">
//                   <Page 
//                     pageNumber={i + 1} 
//                     width={pageWidth} 
//                     renderTextLayer={false} 
//                     renderAnnotationLayer={false} 
//                   />
//                   {doc?.signs?.filter((s:any) => Number(s.page) === i+1).map((sig: any, idx: number) => {
//                     const scale = pageWidth / 600;
//                     return (
//                       <div 
//                         key={idx} 
//                         onClick={() => setIsModalOpen(true)} 
//                         className="absolute border-2 border-dashed border-sky-500 bg-sky-500/10 cursor-pointer flex items-center justify-center animate-pulse hover:bg-sky-500/20 transition-all"
//                         style={{ 
//                           left: `${sig.x * scale}px`, 
//                           top: `${sig.y * scale}px`, 
//                           width: `${150 * scale}px`, 
//                           height: `${50 * scale}px` 
//                         }}
//                       >
//                         <span className="font-bold text-sky-600 uppercase text-[8px] md:text-[10px]">Sign Here</span>
//                       </div>
//                     );
//                   })}
//                 </div>
//               ))}
//             </Document>
//           </div>
//         </main>
//       ) : (
//         <div className="mt-20 px-4 w-full max-w-md animate-in slide-in-from-bottom-5 duration-500">
//           <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border-t-8 border-sky-600">
//             <ShieldCheck className="h-16 w-16 text-sky-600 mx-auto mb-4" />
//             <h2 className="text-2xl font-black mb-2 uppercase tracking-tight text-slate-800">Verify Code</h2>
//             <p className="text-slate-500 mb-8 text-sm font-medium">Enter the 6-digit code sent to <br/><b>{email}</b></p>
//             <input 
//               type="text" 
//               maxLength={6} 
//               placeholder="000000"
//               className="w-full text-center text-4xl font-black tracking-[0.3em] p-4 bg-slate-50 rounded-2xl mb-8 border-2 focus:border-sky-500 outline-none transition-all" 
//               value={otp} 
//               onChange={(e) => setOtp(e.target.value)} 
//             />
//             <Button 
//               onClick={handleVerifyOtp} 
//               disabled={isSubmitting} 
//               className="w-full bg-sky-600 h-16 text-white font-black rounded-2xl shadow-lg hover:bg-sky-700 transition-colors"
//             >
//               {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'VERIFY & DOWNLOAD'}
//             </Button>
//           </div>
//         </div>
//       )}

//       {/* Signature Modal */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
//             <div className="p-6 border-b flex justify-between font-black uppercase text-sm italic items-center">
//               Draw Your Signature 
//               <button onClick={() => setIsModalOpen(false)} className="hover:text-rose-500 transition-colors">
//                 <X size={24}/>
//               </button>
//             </div>
//             <div className="p-8 bg-slate-50 text-center">
//               <div className="border-2 border-slate-200 bg-white rounded-2xl overflow-hidden shadow-inner cursor-crosshair">
//                 <SignatureCanvas 
//                   ref={sigCanvas} 
//                   penColor='#000' 
//                   canvasProps={{ className: 'w-full h-44' }} 
//                 />
//               </div>
//               <button 
//                 onClick={() => sigCanvas.current.clear()} 
//                 className="mt-3 text-xs text-rose-500 font-bold uppercase hover:underline"
//               >
//                 Clear Pad
//               </button>
//             </div>
//             <div className="p-6 flex gap-3 bg-white">
//               <Button 
//                 variant="outline" 
//                 className="flex-1 rounded-xl h-12 font-bold" 
//                 onClick={() => setIsModalOpen(false)}
//               >
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={handleSignSubmit} 
//                 disabled={isSubmitting} 
//                 className="flex-1 bg-sky-600 text-white font-bold rounded-xl h-12 shadow-md active:scale-95 transition-all"
//               >
//                 {isSubmitting ? 'Sending...' : 'Confirm'}
//               </Button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }
import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import SignatureCanvas from 'react-signature-canvas';
import { Document, Page, pdfjs } from 'react-pdf';
import { documentAPI } from '../api/api';
import { Button } from '../components/ui/Button';
import { PenTool, Loader2, X, CheckCircle2, ShieldCheck } from 'lucide-react';

// ✅ CSS Imports for PDF
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// ✅ ফিক্স: লোকাল ওয়ার্কার (CORS এবং Version Mismatch চিরতরে শেষ)
// এটি অটোমেটিক আপনার প্রজেক্টের installed pdfjs-dist ভার্সন খুঁজে নিবে
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();

export function SigningPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const sigCanvas = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [doc, setDoc] = useState<any>(null);
  const [numPages, setNumPages] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'sign' | 'otp' | 'success'>('sign');
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [pageWidth, setPageWidth] = useState(600);

  // Responsive Width Logic
  useEffect(() => {
    const updateWidth = () => {
      if (containerRef.current) {
        const availableWidth = containerRef.current.offsetWidth - 32; 
        setPageWidth(availableWidth > 600 ? 600 : availableWidth);
      }
    };
    updateWidth();
    window.addEventListener('resize', updateWidth);
    return () => window.removeEventListener('resize', updateWidth);
  }, [loading]);

  useEffect(() => {
    if (id) {
      documentAPI.getById(id)
        .then(res => setDoc(res.data))
        .catch(err => console.error("Error fetching doc:", err))
        .finally(() => setLoading(false));
    }
  }, [id]);

  const handleSignSubmit = async () => {
    if (!email || !sigCanvas.current || sigCanvas.current.isEmpty()) {
      return alert("Please enter email and provide a signature!");
    }
    setIsSubmitting(true);
    try {
      const signatureImage = sigCanvas.current.getCanvas().toDataURL('image/png');
      const signaturesMap: Record<string, string> = {};
      
      // Mapping signatures to the specific fields
      doc.signs.forEach((s: any) => { 
        signaturesMap[s.id || s._id] = signatureImage; 
      });

      await documentAPI.submitSign(id!, { signaturesMap, email });
      setStep('otp');
      setIsModalOpen(false);
    } catch (e) { 
      alert("Error sending verification code! Check if backend is running."); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleVerifyOtp = async () => {
    if (otp.length < 6) return alert("Enter 6 digit code");
    setIsSubmitting(true);
    try {
      const res = await documentAPI.verifyOtp({ id, otp });
      
      // Auto-download logic
      const link = document.createElement('a');
      link.href = res.data.pdf;
      link.download = `Signed_${doc?.name || 'Document'}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      setStep('success');
    } catch (e) { 
      alert("Invalid OTP! Verification failed."); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  if (loading) return (
    <div className="h-screen flex items-center justify-center font-bold text-sky-600 bg-white">
      <Loader2 className="animate-spin mr-2" /> Loading Document...
    </div>
  );

  if (step === 'success') return (
    <div className="h-screen flex flex-col items-center justify-center bg-white p-6 text-center animate-in fade-in duration-500">
      <CheckCircle2 className="h-20 w-20 text-emerald-500 mb-4 animate-bounce" />
      <h2 className="text-4xl font-black italic text-slate-900 uppercase tracking-tighter">Signed Successfully!</h2>
      <p className="text-slate-500 mt-2 font-medium">Your document has been verified and downloaded.</p>
      <Button onClick={() => navigate('/')} className="mt-10 bg-slate-900 px-12 rounded-2xl text-white font-bold h-14 shadow-xl active:scale-95 transition-transform">
        Back to Home
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col items-center pb-20 font-sans">
      <header className="w-full bg-white border-b p-4 sticky top-0 z-[100] flex flex-col md:flex-row justify-between items-center px-6 gap-4 shadow-sm">
        <div className="flex items-center gap-2 font-black text-sky-600 italic text-xl select-none">
          <PenTool /> FixenSysign
        </div>
        {step === 'sign' && (
          <div className="flex gap-2 w-full md:w-auto">
            <input 
              type="email" 
              placeholder="Verification Email" 
              className="border-2 p-2 px-4 rounded-xl text-sm outline-none md:w-64 focus:border-sky-500 transition-all font-medium bg-slate-50" 
              value={email} 
              onChange={(e)=>setEmail(e.target.value)} 
            />
            <Button onClick={() => setIsModalOpen(true)} className="bg-sky-600 px-8 rounded-xl text-white font-black h-10 shadow-lg active:scale-95 transition-all whitespace-nowrap">
              Sign Now
            </Button>
          </div>
        )}
      </header>

      {step === 'sign' ? (
        <main ref={containerRef} className="mt-8 px-4 w-full flex flex-col items-center overflow-x-hidden">
          <div className="bg-white p-2 md:p-4 shadow-2xl rounded-sm">
            <Document 
              file={doc?.pdfPath} 
              onLoadSuccess={({numPages}) => setNumPages(numPages)}
              loading={<div className="p-10 text-center font-bold text-slate-400">Loading PDF...</div>}
            >
              {Array.from(new Array(numPages || 0), (_, i) => (
                <div key={i} className="relative mb-6 border-b border-slate-100 last:border-0 shadow-sm">
                  <Page 
                    pageNumber={i + 1} 
                    width={pageWidth} 
                    renderTextLayer={false} 
                    renderAnnotationLayer={false} 
                  />
                  {/* Signature Box Rendering */}
                  {doc?.signs?.filter((s:any) => Number(s.page) === i+1).map((sig: any, idx: number) => {
                    const scale = pageWidth / 600;
                    return (
                      <div 
                        key={idx} 
                        onClick={() => setIsModalOpen(true)} 
                        className="absolute border-2 border-dashed border-sky-500 bg-sky-500/10 cursor-pointer flex items-center justify-center animate-pulse hover:bg-sky-500/20 transition-all rounded-md group"
                        style={{ 
                          left: `${sig.x * scale}px`, 
                          top: `${sig.y * scale}px`, 
                          width: `${150 * scale}px`, 
                          height: `${50 * scale}px` 
                        }}
                      >
                        <span className="font-bold text-sky-600 uppercase text-[8px] md:text-[10px] group-hover:scale-110 transition-transform">Click to Sign</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </Document>
          </div>
        </main>
      ) : (
        /* OTP STEP */
        <div className="mt-20 px-4 w-full max-w-md animate-in slide-in-from-bottom-5 duration-500">
          <div className="bg-white p-10 rounded-[2.5rem] shadow-2xl text-center border-t-8 border-sky-600">
            <ShieldCheck className="h-16 w-16 text-sky-600 mx-auto mb-4" />
            <h2 className="text-2xl font-black mb-2 uppercase tracking-tight text-slate-800">Verify Identity</h2>
            <p className="text-slate-500 mb-8 text-sm font-medium">Enter the 6-digit code sent to <br/><b className="text-slate-900">{email}</b></p>
            <input 
              type="text" maxLength={6} placeholder="000000"
              className="w-full text-center text-4xl font-black tracking-[0.3em] p-4 bg-slate-50 rounded-2xl mb-8 border-2 focus:border-sky-500 outline-none transition-all placeholder:text-slate-200" 
              value={otp} onChange={(e) => setOtp(e.target.value)} 
            />
            <Button onClick={handleVerifyOtp} disabled={isSubmitting} className="w-full bg-sky-600 h-16 text-white font-black rounded-2xl shadow-lg hover:bg-sky-700 transition-colors disabled:bg-slate-300">
              {isSubmitting ? <Loader2 className="animate-spin mx-auto" /> : 'VERIFY & DOWNLOAD'}
            </Button>
          </div>
        </div>
      )}

      {/* Signature Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[200] p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[2rem] w-full max-w-md shadow-2xl overflow-hidden">
            <div className="p-6 border-b flex justify-between font-black uppercase text-sm italic items-center bg-white">
              Draw Your Signature 
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-rose-500 transition-colors">
                <X size={24}/>
              </button>
            </div>
            <div className="p-8 bg-slate-50 text-center">
              <div className="border-2 border-slate-200 bg-white rounded-2xl overflow-hidden shadow-inner cursor-crosshair">
                <SignatureCanvas 
                  ref={sigCanvas} 
                  penColor='#000' 
                  canvasProps={{ className: 'w-full h-44' }} 
                />
              </div>
              <button onClick={() => sigCanvas.current.clear()} className="mt-3 text-xs text-rose-500 font-bold uppercase hover:underline">Clear Pad</button>
            </div>
            <div className="p-6 flex gap-3 bg-white">
              <Button variant="outline" className="flex-1 rounded-xl h-12 font-bold" onClick={() => setIsModalOpen(false)}>Cancel</Button>
              <Button onClick={handleSignSubmit} disabled={isSubmitting} className="flex-1 bg-sky-600 text-white font-bold rounded-xl h-12 shadow-md active:scale-95 transition-all">
                {isSubmitting ? <Loader2 className="animate-spin h-5 w-5 mx-auto" /> : 'Confirm'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}