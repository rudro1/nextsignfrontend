// // // import React, { useState } from 'react';
// // // import { useNavigate } from 'react-router-dom';
// // // import { LayoutDashboard, Upload, Settings, LogOut, PenTool, Menu, X, User } from 'lucide-react';

// // // export function Sidebar({ currentView }) {
// // //   const navigate = useNavigate();
// // //   const [isOpen, setIsOpen] = useState(false);

// // //   const navItems = [
// // //     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
// // //     { id: 'upload', label: 'Upload PDF', icon: Upload, path: '/upload' },
// // //     { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
// // //   ];

// // //   return (
// // //     <>
// // //       {/* 📱 Mobile Toggle Button */}
// // //       <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-6 z-[60] border-b border-slate-800">
// // //         <div className="flex items-center gap-2 text-white">
// // //           <div className="bg-sky-500 p-1 rounded-md"><PenTool size={18} /></div>
// // //           <span className="font-bold">FixenSysign</span>
// // //         </div>
// // //         <button onClick={() => setIsOpen(!isOpen)} className="text-white">
// // //           {isOpen ? <X size={24} /> : <Menu size={24} />}
// // //         </button>
// // //       </div>

// // //       {/* 🛠 Main Sidebar */}
// // //       <aside className={`
// // //         fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-50 
// // //         transition-transform duration-300 lg:translate-x-0
// // //         ${isOpen ? "translate-x-0" : "-translate-x-full"}
// // //       `}>
// // //         <div className="p-6 hidden lg:flex items-center gap-3 border-b border-slate-800">
// // //           <div className="bg-sky-500 p-1.5 rounded-md"><PenTool size={20} /></div>
// // //           <span className="text-xl font-bold">FixenSysign</span>
// // //         </div>

// // //         <nav className="flex-1 py-20 lg:py-6 px-4 space-y-2">
// // //           {navItems.map((item) => (
// // //             <button
// // //               key={item.id}
// // //               onClick={() => { navigate(item.path); setIsOpen(false); }}
// // //               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
// // //                 ${currentView === item.id ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
// // //             >
// // //               <item.icon size={20} />
// // //               {item.label}
// // //             </button>
// // //           ))}
// // //         </nav>

// // //         <div className="p-4 border-t border-slate-800">
// // //           <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-red-400 transition-colors">
// // //             <LogOut size={18} /> <span className="text-sm font-medium">Logout</span>
// // //           </button>
// // //         </div>
// // //       </aside>

// // //       {/* Background Overlay for Mobile */}
// // //       {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />}
// // //     </>
// // //   );
// // // }

// // import React from 'react';
// // import { useNavigate } from 'react-router-dom';
// // import { LayoutDashboard, Upload, Settings, LogOut, PenTool, Menu, X } from 'lucide-react';

// // export function Sidebar({ currentView, isOpen, setIsOpen }) {
// //   const navigate = useNavigate();

// //   const navItems = [
// //     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
// //     { id: 'upload', label: 'Upload PDF', icon: Upload, path: '/upload' },
// //     { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
// //   ];

// //   return (
// //     <>
// //       {/* 📱 Mobile Top Bar - Only one logo and one menu button */}
// //       <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-6 z-[60] border-b border-slate-800">
// //         <div className="flex items-center gap-2 text-white">
// //           <div className="bg-sky-500 p-1.5 rounded-md"><PenTool size={18} /></div>
// //           <span className="font-bold tracking-tight">FixenSysign</span>
// //         </div>
// //         <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2 hover:bg-slate-800 rounded-lg transition-colors">
// //           {isOpen ? <X size={24} /> : <Menu size={24} />}
// //         </button>
// //       </div>

// //       {/* 🛠 Main Sidebar Drawer */}
// //       <aside className={`
// //         fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-[70] 
// //         transition-transform duration-300 lg:static lg:translate-x-0
// //         ${isOpen ? "translate-x-0" : "-translate-x-full"}
// //       `}>
// //         {/* Desktop Header */}
// //         <div className="p-6 hidden lg:flex items-center gap-3 border-b border-slate-800">
// //           <div className="bg-sky-500 p-1.5 rounded-md"><PenTool size={20} /></div>
// //           <span className="text-xl font-bold">FixenSysign</span>
// //         </div>

// //         <nav className="flex-1 py-20 lg:py-6 px-4 space-y-2">
// //           {navItems.map((item) => (
// //             <button
// //               key={item.id}
// //               onClick={() => { navigate(item.path); setIsOpen(false); }}
// //               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
// //                 ${currentView === item.id ? 'bg-sky-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
// //             >
// //               <item.icon size={20} />
// //               {item.label}
// //             </button>
// //           ))}
// //         </nav>

// //         <div className="p-4 border-t border-slate-800">
// //           <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-red-400 transition-colors">
// //             <LogOut size={18} /> <span className="text-sm font-medium">Logout</span>
// //           </button>
// //         </div>
// //       </aside>

// //       {/* Background Overlay */}
// //       {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" />}
// //     </>
// //   );
// // }

// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { LayoutDashboard, Upload, Settings, LogOut, PenTool, Menu, X } from 'lucide-react';

// export function Sidebar({ currentView, isOpen, setIsOpen }) {
//   const navigate = useNavigate();

//   const navItems = [
//     { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
//     { id: 'upload', label: 'Upload PDF', icon: Upload, path: '/upload' },
//     { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
//   ];

//   // Safety function to handle toggle without crashing
//   const handleToggle = (val: boolean) => {
//     if (typeof setIsOpen === 'function') {
//       setIsOpen(val);
//     }
//   };

//   return (
//     <>
//       {/* 📱 Mobile Top Bar - Only visible on small screens */}
//       <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-6 z-[60] border-b border-slate-800">
//         <div className="flex items-center gap-2 text-white">
//           <div className="bg-sky-500 p-1.5 rounded-md"><PenTool size={18} /></div>
//           <span className="font-bold tracking-tight">FixenSysign</span>
//         </div>
//         <button 
//           onClick={() => handleToggle(true)} 
//           className="text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
//         >
//           <Menu size={24} />
//         </button>
//       </div>

//       {/* 🛠 Sidebar Drawer */}
//       <aside className={`
//         fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-[100] 
//         transition-transform duration-300
//         ${/* Desktop: Always fixed and visible | Mobile: Toggle based on isOpen */ ""}
//         lg:translate-x-0 
//         ${isOpen ? "translate-x-0" : "-translate-x-full"}
//       `}>
//         <div className="p-6 flex items-center justify-between border-b border-slate-800">
//           <div className="flex items-center gap-3">
//             <div className="bg-sky-500 p-1.5 rounded-md"><PenTool size={20} /></div>
//             <span className="text-xl font-bold">FixenSysign</span>
//           </div>
//           {/* Close button only for mobile */}
//           <button onClick={() => handleToggle(false)} className="lg:hidden text-slate-400 p-1">
//             <X size={24} />
//           </button>
//         </div>

//         <nav className="flex-1 py-10 lg:py-6 px-4 space-y-2">
//           {navItems.map((item) => (
//             <button
//               key={item.id}
//               onClick={() => { 
//                 navigate(item.path); 
//                 handleToggle(false); 
//               }}
//               className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
//                 ${currentView === item.id ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
//             >
//               <item.icon size={20} />
//               {item.label}
//             </button>
//           ))}
//         </nav>

//         <div className="p-4 border-t border-slate-800">
//           <button onClick={() => navigate('/')} className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-red-400 transition-colors">
//             <LogOut size={18} /> <span className="text-sm font-medium">Logout</span>
//           </button>
//         </div>
//       </aside>

//       {/* 🌑 Overlay - Only for Mobile */}
//       {isOpen && (
//         <div onClick={() => handleToggle(false)} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden" />
//       )}
//     </>
//   );
// }



import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, Upload, Settings, LogOut, PenTool, Menu, X } from 'lucide-react';

export function Sidebar({ currentView, isOpen, setIsOpen }) {
  const navigate = useNavigate();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
    { id: 'upload', label: 'Upload PDF', icon: Upload, path: '/upload' },
    { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' }
  ];

  // এরর এড়ানোর জন্য সেফটি ফাংশন
  const handleToggle = (val: boolean) => {
    if (typeof setIsOpen === 'function') {
      setIsOpen(val);
    }
  };

  return (
    <>
      {/* 📱 মোবাইল টপ বার - লোগোতে ক্লিক করলে ল্যান্ডিং পেজে যাবে */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-slate-900 flex items-center justify-between px-6 z-[60] border-b border-slate-800">
        <div 
          onClick={() => navigate('/')} 
          className="flex items-center gap-2 text-white cursor-pointer active:scale-95 transition-transform"
        >
          <div className="bg-sky-500 p-1.5 rounded-md"><PenTool size={18} /></div>
          <span className="font-bold tracking-tight">FixenSysign</span>
        </div>
        <button 
          onClick={() => handleToggle(true)} 
          className="text-white p-2 hover:bg-slate-800 rounded-lg transition-colors"
        >
          <Menu size={24} />
        </button>
      </div>

      {/* 🛠 মেইন সাইডবার ড্রয়ার */}
      <aside className={`
        fixed left-0 top-0 h-full w-64 bg-slate-900 text-white flex flex-col z-[100] 
        transition-transform duration-300
        lg:translate-x-0 
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}>
        {/* ডেস্কটপ হেডার ও লোগো */}
        <div className="p-6 flex items-center justify-between border-b border-slate-800">
          <div 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="bg-sky-500 p-1.5 rounded-md group-hover:bg-sky-400 transition-colors shadow-lg shadow-sky-500/20">
              <PenTool size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-sky-100 transition-colors">
              FixenSysign
            </span>
          </div>
          {/* মোবাইলে ক্লোজ বাটন */}
          <button onClick={() => handleToggle(false)} className="lg:hidden text-slate-400 p-1 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* নেভিগেশন আইটেমসমূহ */}
        <nav className="flex-1 py-10 lg:py-6 px-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => { 
                navigate(item.path); 
                handleToggle(false); 
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                ${currentView === item.id 
                  ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/20' 
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'}`}
            >
              <item.icon size={20} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* লগআউট সেকশন */}
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={() => navigate('/')} 
            className="flex items-center gap-3 w-full p-3 text-slate-400 hover:text-red-400 transition-colors"
          >
            <LogOut size={18} /> 
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* 🌑 মোবাইল ব্যাকড্রপ ওভারলে */}
      {isOpen && (
        <div 
          onClick={() => handleToggle(false)} 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] lg:hidden" 
        />
      )}
    </>
  );
}