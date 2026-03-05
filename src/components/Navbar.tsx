import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';
import { PenTool } from 'lucide-react';
import { cn } from '../lib/utils';

// ✅ 'export' কিউয়ার্ডটি নিশ্চিত করুন
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b',
        scrolled ? 
        'bg-white/90 backdrop-blur-md border-slate-200 py-3 shadow-sm' : 
        'bg-white border-transparent py-5'
      )}>

      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        {/* Logo Section */}
        <div
          className="flex items-center gap-2 cursor-pointer"
          onClick={() => navigate('/')}>
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 text-white p-2 rounded-lg">
            <PenTool className="h-5 w-5" />
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700">
            FixenSysign
          </span>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          <a href="#features" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
            Features
          </a>
          <a href="#how-it-works" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
            How it Works
          </a>
          <a href="#pricing" className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors">
            Pricing
          </a>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/dashboard')}
            className="text-sm font-medium text-slate-600 hover:text-sky-600 transition-colors hidden sm:block">
            Dashboard
          </button>
          <Button
            onClick={() => navigate('/upload')}
            size="sm"
            className="rounded-full px-6 bg-sky-600">
            Get Started
          </Button>
        </div>
      </div>
    </header>
  );
}