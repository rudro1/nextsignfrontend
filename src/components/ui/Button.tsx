import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';
export function Button({
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  children,
  disabled,
  ...props
}) {
  const baseStyles =
  'inline-flex items-center justify-center rounded-lg font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]';
  const variants = {
    primary:
    'bg-gradient-to-r from-sky-500 to-sky-600 text-white hover:from-sky-600 hover:to-sky-700 shadow-md hover:shadow-lg border border-transparent',
    secondary:
    'bg-slate-100 text-slate-900 hover:bg-slate-200 border border-transparent',
    outline:
    'border border-slate-200 bg-white hover:bg-slate-50 text-slate-700',
    ghost: 'hover:bg-slate-100 text-slate-700 hover:text-slate-900',
    danger: 'bg-red-500 text-white hover:bg-red-600 shadow-sm'
  };
  const sizes = {
    sm: 'h-8 px-3 text-xs',
    md: 'h-10 px-4 py-2 text-sm',
    lg: 'h-12 px-8 text-base',
    icon: 'h-10 w-10'
  };
  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}>

      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
      {children}
    </button>);

}