import React from 'react';
import { cn } from '../lib/utils';
import { CheckCircle2, Clock } from 'lucide-react';
export function StatusBadge({ status, className }) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border',
        status === 'pending' ?
        'bg-amber-50 text-amber-700 border-amber-200' :
        'bg-emerald-50 text-emerald-700 border-emerald-200',
        className
      )}>

      {status === 'pending' ?
      <Clock className="w-3.5 h-3.5" /> :

      <CheckCircle2 className="w-3.5 h-3.5" />
      }
      <span className="capitalize">{status}</span>
    </div>);

}