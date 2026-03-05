import React from 'react';
import { cn } from '../../lib/utils';
export function Card({ className, hoverEffect = false, children, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl bg-white border border-slate-100 shadow-sm',
        hoverEffect &&
        'transition-all duration-300 hover:shadow-md hover:-translate-y-1',
        className
      )}
      {...props}>

      {children}
    </div>);

}
export function CardHeader({ className, children, ...props }) {
  return (
    <div className={cn('p-6 pb-3', className)} {...props}>
      {children}
    </div>);

}
export function CardTitle({ className, children, ...props }) {
  return (
    <h3
      className={cn(
        'text-lg font-semibold leading-none tracking-tight text-slate-900',
        className
      )}
      {...props}>

      {children}
    </h3>);

}
export function CardContent({ className, children, ...props }) {
  return (
    <div className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </div>);

}
export function CardFooter({ className, children, ...props }) {
  return (
    <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
      {children}
    </div>);

}