import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Layers } from 'lucide-react';

/**
 * Professional, highly-responsive and accessible Pagination component.
 * Adapts seamlessly across mobile (compact picker & touch targets),
 */
export function Pagination({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  totalItems = 0,
  pageSize = 20,
  className = '',
}) {
  if (totalPages <= 1) return null;

  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalItems);

  // Generate page numbers with standard professional ellipsis algorithm
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (currentPage <= 4) {
      return [1, 2, 3, 4, 5, 'ellipsis-end', totalPages];
    }

    if (currentPage >= totalPages - 3) {
      return [
        1,
        'ellipsis-start',
        totalPages - 4,
        totalPages - 3,
        totalPages - 2,
        totalPages - 1,
        totalPages,
      ];
    }

    return [
      1,
      'ellipsis-start',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'ellipsis-end',
      totalPages,
    ];
  };

  const pages = getPageNumbers();

  const handleSelectChange = (e) => {
    const page = parseInt(e.target.value, 10);
    if (!isNaN(page) && page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  };

  return (
    <nav
      role="navigation"
      aria-label="Pagination Navigation"
      className={`glass-card rounded-2xl p-4 sm:p-5 border border-pitch-border flex flex-col md:flex-row items-center justify-between gap-4 transition-all shadow-md ${className}`}
    >
      {/* 1. Informative Items Counter with 20/page Badge */}
      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 text-xs text-sport-muted select-none">
        <span>
          Showing <strong className="text-sport-text font-semibold">{startItem}</strong> to{' '}
          <strong className="text-sport-text font-semibold">{endItem}</strong> of{' '}
          <strong className="text-sport-text font-semibold">{totalItems}</strong> fixtures
        </span>
        <span className="hidden sm:inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-pitch-surface border border-pitch-border text-[11px] font-mono text-sport-subtle">
          <Layers className="w-3 h-3 text-accent-green" />
          <span>{pageSize}/page</span>
        </span>
      </div>

      {/* 2. Responsive Pagination Controls */}
      <div className="flex items-center flex-wrap justify-center gap-1 sm:gap-1.5 w-full md:w-auto">
        {/* First Page (Tablet & Desktop) */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          className="hidden sm:inline-flex items-center justify-center p-2 rounded-xl text-sport-muted hover:text-sport-text hover:bg-pitch-surface disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer border border-transparent hover:border-pitch-border"
          aria-label="Go to first page"
          title="First Page"
        >
          <ChevronsLeft className="w-4 h-4" />
        </button>

        {/* Previous Page */}
        <button
          type="button"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-sport-muted hover:text-sport-text hover:bg-pitch-surface disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer border border-transparent hover:border-pitch-border"
          aria-label="Go to previous page"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden xs:inline">Prev</span>
        </button>

        {/* Desktop Numbered Page Buttons with Smooth Ellipsis */}
        <div className="hidden md:flex items-center space-x-1">
          {pages.map((p, idx) => {
            if (p === 'ellipsis-start' || p === 'ellipsis-end') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-9 flex items-center justify-center text-xs text-sport-subtle select-none font-mono"
                  aria-hidden="true"
                >
                  •••
                </span>
              );
            }

            const isActive = currentPage === p;

            return (
              <motion.button
                key={`page-${p}`}
                whileHover={isActive ? undefined : { scale: 1.05 }}
                whileTap={isActive ? undefined : { scale: 0.95 }}
                type="button"
                onClick={() => onPageChange(p)}
                aria-current={isActive ? 'page' : undefined}
                aria-label={`Page ${p}`}
                className={`w-9 h-9 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center select-none ${isActive
                    ? 'bg-accent-green text-slate-950 shadow-glow-green font-extrabold'
                    : 'text-sport-muted hover:text-sport-text hover:bg-pitch-surface border border-transparent hover:border-pitch-border'
                  }`}
              >
                {p}
              </motion.button>
            );
          })}
        </div>

        {/* Mobile / Tablet Quick Page Selector & Indicator */}
        <div className="md:hidden flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-pitch-surface border border-pitch-border text-xs font-semibold text-sport-text">
          <label htmlFor="mobile-page-select" className="text-sport-muted sr-only">
            Select page
          </label>
          <span className="text-sport-muted">Page</span>
          <select
            id="mobile-page-select"
            value={currentPage}
            onChange={handleSelectChange}
            className="bg-pitch-card border border-pitch-border text-sport-text font-bold text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-accent-green cursor-pointer"
            aria-label={`Current page ${currentPage} of ${totalPages}`}
          >
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <option key={`m-page-${num}`} value={num}>
                {num}
              </option>
            ))}
          </select>
          <span className="text-sport-subtle">of</span>
          <span className="font-bold text-sport-text">{totalPages}</span>
        </div>

        {/* Next Page */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="inline-flex items-center justify-center space-x-1 px-3 py-2 rounded-xl text-xs font-semibold text-sport-muted hover:text-sport-text hover:bg-pitch-surface disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer border border-transparent hover:border-pitch-border"
          aria-label="Go to next page"
        >
          <span className="hidden xs:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Last Page (Tablet & Desktop) */}
        <button
          type="button"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          className="hidden sm:inline-flex items-center justify-center p-2 rounded-xl text-sport-muted hover:text-sport-text hover:bg-pitch-surface disabled:opacity-30 disabled:pointer-events-none transition-colors cursor-pointer border border-transparent hover:border-pitch-border"
          aria-label="Go to last page"
          title="Last Page"
        >
          <ChevronsRight className="w-4 h-4" />
        </button>

        {/* Desktop Quick Jump Dropdown (when more than 7 pages) */}
        {totalPages > 7 && (
          <div className="hidden lg:flex items-center space-x-1.5 ml-2 pl-2 border-l border-pitch-border text-xs text-sport-muted">
            <span>Jump to:</span>
            <select
              value={currentPage}
              onChange={handleSelectChange}
              className="bg-pitch-surface border border-pitch-border text-sport-text text-xs rounded-lg px-2 py-1 focus:outline-none focus:border-accent-green cursor-pointer"
              aria-label="Quick jump to page"
            >
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                <option key={`jump-${num}`} value={num}>
                  Page {num}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Pagination;
