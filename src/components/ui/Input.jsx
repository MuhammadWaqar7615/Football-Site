import React from 'react';
import { X } from 'lucide-react';

/**
 * Accessible Input component with icon slots and optional clear button.
 */
export function Input({
  value,
  onChange,
  onClear,
  placeholder = 'Search...',
  icon: Icon,
  className = '',
  id,
  type = 'text',
  autoFocus = false,
  error = null,
  ...props
}) {
  return (
    <div className="relative w-full">
      {Icon && (
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-sport-muted">
          <Icon className="w-4 h-4" />
        </div>
      )}
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full bg-pitch-card border border-pitch-border rounded-xl text-sport-text text-sm placeholder:text-sport-muted transition-colors focus:outline-none focus:border-accent-green focus:ring-1 focus:ring-accent-green ${
          Icon ? 'pl-9' : 'pl-3.5'
        } ${value && onClear ? 'pr-9' : 'pr-3.5'} py-2.5 ${
          error ? 'border-red-500 focus:border-red-500 focus:ring-red-500' : ''
        } ${className}`}
        {...props}
      />
      {value && onClear && (
        <button
          type="button"
          onClick={onClear}
          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sport-muted hover:text-sport-text transition-colors cursor-pointer"
          aria-label="Clear search input"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default Input;
