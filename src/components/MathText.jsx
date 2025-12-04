import { useMemo } from 'react';
import katex from 'katex';
import 'katex/dist/katex.min.css';

const MathText = ({ text, className = '' }) => {
  const renderedContent = useMemo(() => {
    if (!text) return null;

    // Split text by LaTeX delimiters
    // $$...$$ for block math, $...$ for inline math
    const parts = [];
    let remaining = text;
    let key = 0;

    // Process block math first ($$...$$)
    while (remaining.length > 0) {
      const blockStart = remaining.indexOf('$$');

      if (blockStart === -1) {
        // No more block math, process inline math in remaining text
        parts.push(...processInlineMath(remaining, key));
        break;
      }

      // Add text before block math
      if (blockStart > 0) {
        parts.push(...processInlineMath(remaining.slice(0, blockStart), key));
        key += 100;
      }

      const blockEnd = remaining.indexOf('$$', blockStart + 2);
      if (blockEnd === -1) {
        // Unclosed block math, treat as regular text
        parts.push(...processInlineMath(remaining, key));
        break;
      }

      // Render block math
      const latex = remaining.slice(blockStart + 2, blockEnd);
      try {
        const html = katex.renderToString(latex, {
          displayMode: true,
          throwOnError: false,
          strict: false
        });
        parts.push(
          <div
            key={`block-${key++}`}
            className="math-block my-3 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        );
      } catch (e) {
        parts.push(<span key={`error-${key++}`} className="text-red-500">{latex}</span>);
      }

      remaining = remaining.slice(blockEnd + 2);
    }

    return parts;
  }, [text]);

  return <span className={className}>{renderedContent}</span>;
};

// Process inline math ($...$) within text
function processInlineMath(text, startKey) {
  const parts = [];
  let remaining = text;
  let key = startKey;

  while (remaining.length > 0) {
    const inlineStart = remaining.indexOf('$');

    if (inlineStart === -1) {
      // No more inline math
      if (remaining) {
        parts.push(<span key={`text-${key++}`}>{remaining}</span>);
      }
      break;
    }

    // Add text before inline math
    if (inlineStart > 0) {
      parts.push(<span key={`text-${key++}`}>{remaining.slice(0, inlineStart)}</span>);
    }

    const inlineEnd = remaining.indexOf('$', inlineStart + 1);
    if (inlineEnd === -1) {
      // Unclosed inline math, treat as regular text
      parts.push(<span key={`text-${key++}`}>{remaining}</span>);
      break;
    }

    // Render inline math
    const latex = remaining.slice(inlineStart + 1, inlineEnd);
    try {
      const html = katex.renderToString(latex, {
        displayMode: false,
        throwOnError: false,
        strict: false
      });
      parts.push(
        <span
          key={`inline-${key++}`}
          className="math-inline"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      );
    } catch (e) {
      parts.push(<span key={`error-${key++}`} className="text-red-500">{latex}</span>);
    }

    remaining = remaining.slice(inlineEnd + 1);
  }

  return parts;
}

export default MathText;
