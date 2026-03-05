import React, { useId } from 'react';
import { cn } from '../../lib/utils';
export function Input({ className, label, error, id, ...props }) {
  const inputId = id || useId();
  return (
    <div className="w-full space-y-2">
      {label &&
      <label
        htmlFor={inputId}
        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-slate-700">

          {label}
        </label>
      }
      <input
        id={inputId}
        className={cn(
          'flex h-10 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
          error && 'border-red-500 focus-visible:ring-red-500',
          className
        )}
        {...props} />

      {error && <p className="text-xs text-red-500 font-medium">{error}</p>}
    </div>);

}