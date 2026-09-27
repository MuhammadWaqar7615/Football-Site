import React from 'react';

/**
 * Reusable status, league, and counter badge.
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
  icon: Icon,
  pulse = false,
  ...props
}) {
  const baseStyles = 'inline-flex items-center font-medium rounded-full tracking-wide select-none';

  const sizeStyles = {
    sm: 'text-[10px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  };

  const variantStyles = {
    default: 'bg-pitch-surface text-sport-text border border-pitch-border',
    live: 'bg-red-500/15 text-red-400 border border-red-500/30 font-bold',
    upcoming: 'bg-sky-500/15 text-sky-400 border border-sky-500/30',
    finished: 'bg-slate-800/80 text-sport-muted border border-slate-700/60',
    green: 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30',
    amber: 'bg-amber-500/15 text-amber-400 border border-amber-500/30',
    league: 'bg-pitch-card/90 text-sport-text border border-pitch-border font-medium',
    counter: 'bg-pitch-surface text-sport-muted border border-pitch-border font-mono text-[11px]',
  };

  return (
    <span
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.default} ${className}`}
      {...props}
    >
      {pulse && (
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
      {Icon && <Icon className="w-3.5 h-3.5 shrink-0" />}
      {children}
    </span>
  );
}

export default Badge;
