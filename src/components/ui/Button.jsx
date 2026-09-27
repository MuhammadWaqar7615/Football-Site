import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable interactive button with depth and subtle press micro-animations.
 */
export function Button({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  onClick,
  type = 'button',
  icon: Icon,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all select-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-pitch-bg';

  const sizeStyles = {
    sm: 'text-xs px-3 py-1.5 gap-1.5',
    md: 'text-sm px-4 py-2 gap-2',
    lg: 'text-base px-5 py-2.5 gap-2.5',
  };

  const variantStyles = {
    primary: 'bg-accent-green text-slate-950 hover:bg-emerald-400 focus:ring-accent-green shadow-glow-green',
    secondary: 'bg-pitch-card text-sport-text hover:bg-pitch-hover border border-pitch-border focus:ring-accent-cyan',
    cyan: 'bg-accent-cyan text-slate-950 hover:bg-sky-400 focus:ring-accent-cyan shadow-glow-cyan',
    outline: 'border border-pitch-border bg-transparent text-sport-text hover:bg-pitch-surface focus:ring-accent-green',
    ghost: 'bg-transparent text-sport-muted hover:text-sport-text hover:bg-pitch-surface focus:ring-accent-green',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/40 hover:bg-red-500/30 focus:ring-red-400',
  };

  return (
    <motion.button
      whileHover={disabled ? undefined : { scale: 1.02 }}
      whileTap={disabled ? undefined : { scale: 0.97 }}
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${baseStyles} ${sizeStyles[size] || sizeStyles.md} ${variantStyles[variant] || variantStyles.primary} ${
        disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''
      } ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      {children}
    </motion.button>
  );
}

export default Button;
