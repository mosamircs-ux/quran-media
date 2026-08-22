import React from 'react';
import { cn } from '../lib/utils.js';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'default' | 'gold' | 'emerald' | 'destructive' | 'outline';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  const variants = {
    default: 'bg-slate-800 text-slate-200 border-slate-700',
    gold: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
    emerald: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30',
    destructive: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
    outline: 'border-slate-700 text-slate-300',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number; // 0 - 100
}

export function Progress({ className, value, ...props }: ProgressProps) {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className={cn('relative h-2 w-full overflow-hidden rounded-full bg-slate-800', className)} {...props}>
      <div
        className="h-full bg-gradient-to-r from-emerald-500 to-amber-400 transition-all duration-300 ease-out"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
