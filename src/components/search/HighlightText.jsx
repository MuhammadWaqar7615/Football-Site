import React from 'react';
import { getHighlightedChunks } from '../../utils/textUtils.js';

/**
 * Renders text with search query matches highlighted in an accessible <mark> element.
 */
export function HighlightText({ text, query, className = '' }) {
  if (!query || !query.trim()) {
    return <span className={className}>{text}</span>;
  }

  const chunks = getHighlightedChunks(text, query);

  return (
    <span className={className}>
      {chunks.map((chunk, index) =>
        chunk.isMatch ? (
          <mark
            key={index}
            className="bg-yellow-500/30 text-yellow-300 px-0.5 rounded font-semibold transition-colors"
          >
            {chunk.text}
          </mark>
        ) : (
          <span key={index}>{chunk.text}</span>
        )
      )}
    </span>
  );
}

export default HighlightText;
